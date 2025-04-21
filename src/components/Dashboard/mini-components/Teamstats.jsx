import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { UserContext } from "../../../Context/UserContext";

const Teamstats = () => {
  const [matchData, setMatchData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [userTeamPortfolio, setUserTeamPortfolio] = useState([]);
  const [currentTeamHoldings, setCurrentTeamHoldings] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialTeamPrice, setInitialTeamPrice] = useState(50);
  const [teamPrice, setTeamPrice] = useState(50);

  const { scoreData, setTeamPortfolio, sellTeamPortfolio, getTeamPortfolio } = useContext(UserContext);

  // Fetch user's team portfolio on component mount
  useEffect(() => {
    const fetchTeamPortfolio = async () => {
      try {
        const portfolio = await getTeamPortfolio();
        setUserTeamPortfolio(portfolio || []);
      } catch (error) {
        console.error("Failed to fetch team portfolio:", error);
      }
    };

    fetchTeamPortfolio();
  }, [getTeamPortfolio]);

  useEffect(() => {
    if (scoreData && Object.keys(scoreData).length > 0) {
      setMatchData(scoreData);
      localStorage.setItem("scoreData", JSON.stringify(scoreData));
    } else {
      const cachedData = localStorage.getItem("scoreData");
      if (cachedData) {
        setMatchData(JSON.parse(cachedData));
      }
    }
  }, [scoreData]);

  useEffect(() => {
    const storedData = localStorage.getItem("MatchData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMatchData(parsedData);
    }
  }, []);

  // Calculate team price based on match data
  useEffect(() => {
    if (!matchData || !matchData.innings || matchData.innings.length === 0)
      return;

    const innings = matchData.innings;
    const currentInnings = innings.length === 2 ? innings[1] : innings[0];
    const inningsIndex = innings.indexOf(currentInnings);

    // Set initial price based on innings
    let basePrice = 50; // Default initial price for first innings
    
    // Set base price for second innings based on first innings score
    if (inningsIndex === 1) {
      const targetScore = innings[0]?.score || 0;
      if (targetScore >= 220) basePrice = 70;
      else if (targetScore >= 200) basePrice = 65;
      else if (targetScore >= 180) basePrice = 60;
      else if (targetScore >= 160) basePrice = 55;
      else basePrice = 50;
    }
    
    setInitialTeamPrice(basePrice);
    
    // Calculate current price based on performance
    let price = basePrice;
    const batsmen = currentInnings.batsmen || [];

    // Calculate score-based price
    batsmen.forEach((player) => {
      const score = player.runs || 0;
      price += score * 0.1;

      const out = player.wicketCode && player.wicketCode.toLowerCase() !== "";
      if (out) {
        price *= 0.85; // apply 15% deduction if out
      }
    });

    setTeamPrice(parseFloat(price.toFixed(2)));
  }, [matchData]);

  // Update current holdings when matchData or userTeamPortfolio changes
  useEffect(() => {
    if (!matchData || !userTeamPortfolio.length) return;

    // console.log(userTeamPortfolio)

    const inningsIndex = matchData.innings.length === 2 ? 1 : 0;
    
    // Assign teamId based on innings (1 for first innings, 2 for second innings)
    const teamId = inningsIndex === 0 ? 1 : 2;
    // console.log(teamId)

    // Find current team holdings
    const teamHolding = userTeamPortfolio.find(
      item => Number(item.teamId) === Number(teamId)
    );
    // console.log(teamHolding)

    setCurrentTeamHoldings(teamHolding ? teamHolding.currentHoldings : 0);
  }, [matchData, userTeamPortfolio]);

  // Handle Buy Team Stock
  const handleBuyTeam = async () => {
    if (quantity <= 0) {
      setTransactionStatus({
        success: false,
        message: "Quantity must be greater than 0"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const inningsIndex = matchData.innings.length === 2 ? 1 : 0;
      const currentInnings = matchData.innings[inningsIndex];
      // Assign teamId based on innings (1 for first innings, 2 for second innings)
      const teamId = inningsIndex === 0 ? 1 : 2;
      
      await setTeamPortfolio({
        MatchId: matchData.matchId || "default-match-id",
        teamId: teamId,
        teamName: currentInnings.batTeamName,
        initialPrice: initialTeamPrice,  // Use initial price for purchase recording
        price: teamPrice,                // Current price for transaction
        quantity: quantity
      });
      
      // Refresh portfolio data
      const updatedPortfolio = await getTeamPortfolio();
      setUserTeamPortfolio(updatedPortfolio || []);
      
      setTransactionStatus({
        success: true,
        message: `Successfully bought ${quantity} share(s) of ${currentInnings.batTeamName}`
      });
      
      // Close modal after successful transaction
      setTimeout(() => {
        setShowBuyModal(false);
        setTransactionStatus(null);
        setQuantity(1);
      }, 2000);
      
    } catch (error) {
      setTransactionStatus({
        success: false,
        message: error.message || "Failed to buy team stocks"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Sell Team Stock
  const handleSellTeam = async () => {
    if (quantity <= 0) {
      setTransactionStatus({
        success: false,
        message: "Quantity must be greater than 0"
      });
      return;
    }

    if (quantity > currentTeamHoldings) {
      setTransactionStatus({
        success: false,
        message: `You only have ${currentTeamHoldings} share(s) to sell`
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const inningsIndex = matchData.innings.length === 2 ? 1 : 0;
      const currentInnings = matchData.innings[inningsIndex];
      // Assign teamId based on innings (1 for first innings, 2 for second innings)
      const teamId = inningsIndex === 0 ? 1 : 2;
      
      // Make sure we're using the correct function and parameters for selling
      await sellTeamPortfolio({
        MatchId: matchData.matchId || "default-match-id",
        teamId: teamId,
        price: teamPrice,  // Use current price for the sell transaction
        quantity: quantity
      });
      
      // Refresh portfolio data
      const updatedPortfolio = await getTeamPortfolio();
      setUserTeamPortfolio(updatedPortfolio || []);
      
      setTransactionStatus({
        success: true,
        message: `Successfully sold ${quantity} share(s) of ${currentInnings.batTeamName}`
      });
      
      // Close modal after successful transaction
      setTimeout(() => {
        setShowSellModal(false);
        setTransactionStatus(null);
        setQuantity(1);
      }, 2000);
      
    } catch (error) {
      console.error("Sell error:", error);
      setTransactionStatus({
        success: false,
        message: error.message || "Failed to sell team stocks"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!matchData)
    return <div className="text-white p-4">Loading Match Data...</div>;

  const innings = matchData.innings;
  const currentInnings = innings.length === 2 ? innings[1] : innings[0];
  const inningsIndex = innings.indexOf(currentInnings);
  
  // Assign teamId based on innings (1 for first innings, 2 for second innings)
  const currentTeamId = inningsIndex === 0 ? 1 : 2;

  const {
    batTeamName,
    bowlTeamName,
    score,
    overs,
    runRate,
    wickets = [],
    batsmen = [],
    bowlers = [],
    partnerships = [],
  } = currentInnings;

  const totalWickets = wickets.length;
  const currentScore = `${score}/${totalWickets}`;
  let highestPartnership = "N/A";
  if (partnerships && partnerships.length > 0) {
    let maxRuns = 0;
    partnerships.forEach((p) => {
      const runs = (p.bat1Runs || 0) + (p.bat2Runs || 0);
      if (runs > maxRuns) {
        maxRuns = runs;
        highestPartnership = `${p.bat1Name} & ${p.bat2Name} - ${runs}`;
      }
    });
  }

  const sixes = batsmen.reduce((acc, bat) => acc + (bat.sixes || 0), 0);
  const fours = batsmen.reduce((acc, bat) => acc + (bat.fours || 0), 0);

  const totalBowlerWickets = bowlers.reduce(
    (acc, b) => acc + (b.wickets || 0),
    0
  );
  const totalBowlerRuns = bowlers.reduce((acc, b) => acc + (b.runs || 0), 0);
  const totalBowlerOvers = bowlers.reduce(
    (acc, b) => acc + parseFloat(b.overs || 0),
    0
  );
  const bowlingEconomy =
    totalBowlerOvers > 0
      ? (totalBowlerRuns / totalBowlerOvers).toFixed(2)
      : "0.00";

  const dotBalls = bowlers.reduce((acc, b) => acc + (b.dotBalls || 0), 0);
  const totalBalls = parseInt(currentInnings.ballNbr || 0);
  const dotBallPercentage =
    totalBalls > 0 ? `${((dotBalls / totalBalls) * 100).toFixed(2)}%` : "0%";

  const performanceData = [
    5, 8, 12, 15, 10, 18, 22, 25, 20, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50,
    52,
  ];
  const maxValue = Math.max(...performanceData);

  // Calculate price change percentage for display
  const priceChangePercent = initialTeamPrice > 0 
    ? (((teamPrice - initialTeamPrice) / initialTeamPrice) * 100).toFixed(2)
    : "0.00";
  
  const isPriceUp = teamPrice > initialTeamPrice;

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-full bg-gray-900 text-white">
        {/* Score Display */}
        <div className="bg-black p-4 flex justify-between items-center">
          <div>
            <div className="text-gray-400 text-xs mb-1">
              {batTeamName} | Team Price
            </div>
            <div className="text-5xl font-bold">₹{teamPrice}</div>
            <div className={`text-sm ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
              {isPriceUp ? '↑' : '↓'} {priceChangePercent}% from ₹{initialTeamPrice}
            </div>
            <div className="text-gray-400 text-sm mt-1">
              {matchData.isMatchComplete === true
                ? "Match is Completed"
                : "Live Score"}
            </div>
            <div className="text-blue-400 text-sm mt-1">
              Your holdings: {currentTeamHoldings} shares
            </div>
          </div>
          <div className="bg-gray-700 rounded-full h-16 w-16 flex items-center justify-center">
            {/* Team logo placeholder */}
            <img
              src="/assets/crciketlogo.jpg"
              className="rounded-full"
              alt=""
            />
          </div>
        </div>

        {/* Performance Graph */}
        <div className="p-4 bg-black">
          <div className="h-40 flex items-end space-x-1">
            {performanceData.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    minHeight: "4px",
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Time period tabs */}
          <div className="flex justify-between mt-2 text-xs text-blue-400">
            <button className="font-bold">Today</button>
            <button>Last -1</button>
            <button>Last -2</button>
            <button>Last -3</button>
            <button>Last -4</button>
          </div>
        </div>

        {/* Real-Time Match Statistics */}
        <div className="p-4 bg-gray-900">
          <h2 className="text-blue-400 text-lg font-bold mb-3">
            Real-Time Match Statistics
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-400">Current Score</span>
              <span>{currentScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">Overs</span>
              <span>{overs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">Run Rate</span>
              <span>{runRate} RPO</span>
            </div>
          </div>
        </div>

        {/* Team Performance Insights */}
        <div className="p-4 bg-gray-900">
          <h2 className="text-blue-400 text-lg font-bold mb-3">
            Team Performance Insights
          </h2>

          <div className="mb-4">
            <h3 className="text-blue-400 mb-2">Team Batting Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Runs Scored</span>
                <span>{score}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Run Rate (CRR)</span>
                <span>{runRate} RPO</span>
              </div>
              <div className="flex justify-between">
                <span>Highest Partnership</span>
                <span>{highestPartnership}</span>
              </div>
              <div className="flex justify-between">
                <span>Sixes</span>
                <span>{sixes}</span>
              </div>
              <div className="flex justify-between">
                <span>Fours</span>
                <span>{fours}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-blue-400 mb-2">Team Bowling Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Wickets Taken</span>
                <span className="text-red-500">{totalBowlerWickets}</span>
              </div>
              <div className="flex justify-between">
                <span>Bowling Economy Rate</span>
                <span>{bowlingEconomy} RPO</span>
              </div>
              <div className="flex justify-between">
                <span>Dot Ball Percentage</span>
                <span>{dotBallPercentage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-1 p-1">
          <button 
            className={`bg-red-600 text-white py-3 rounded ${currentTeamHoldings <= 0 ? 'opacity-50' : ''}`}
            onClick={() => currentTeamHoldings > 0 && setShowSellModal(true)}
            disabled={currentTeamHoldings <= 0}
          >
            Sell
          </button>
          <button 
            className="bg-green-600 text-white py-3 rounded flex items-center justify-center"
            onClick={() => setShowBuyModal(true)}
          >
            Buy
          </button>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-5/6 max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Buy Team Stock</h2>
            <div className="mb-4">
              <p className="text-white mb-2">Team: {batTeamName}</p>
              <p className="text-white mb-1">Initial Price: ₹{initialTeamPrice}</p>
              <p className="text-white mb-4">Current Price: ₹{teamPrice}</p>
              
              <label className="block text-gray-300 mb-2">Quantity:</label>
              <div className="flex items-center mb-4">
                <button 
                  className="bg-gray-700 text-white px-3 py-1 rounded-l"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="bg-gray-700 text-white text-center w-full py-1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button 
                  className="bg-gray-700 text-white px-3 py-1 rounded-r"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <div className="bg-gray-700 p-3 rounded mb-4">
                <p className="text-white">Total Cost: ₹{(teamPrice * quantity).toFixed(2)}</p>
              </div>
            </div>
            
            {transactionStatus && (
              <div className={`p-3 rounded mb-4 ${transactionStatus.success ? 'bg-green-600' : 'bg-red-600'}`}>
                <p className="text-white">{transactionStatus.message}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <button 
                className="bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowBuyModal(false);
                  setTransactionStatus(null);
                  setQuantity(1);
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center"
                onClick={handleBuyTeam}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Buy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-5/6 max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Sell Team Stock</h2>
            <div className="mb-4">
              <p className="text-white mb-2">Team: {batTeamName}</p>
              <p className="text-white mb-1">Initial Price: ₹{initialTeamPrice}</p>
              <p className="text-white mb-2">Current Price: ₹{teamPrice}</p>
              <p className="text-blue-400 mb-4">Your holdings: {currentTeamHoldings} shares</p>
              
              <label className="block text-gray-300 mb-2">Quantity to Sell:</label>
              <div className="flex items-center mb-4">
                <button 
                  className="bg-gray-700 text-white px-3 py-1 rounded-l"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="bg-gray-700 text-white text-center w-full py-1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(currentTeamHoldings, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={currentTeamHoldings}
                />
                <button 
                  className="bg-gray-700 text-white px-3 py-1 rounded-r"
                  onClick={() => setQuantity(Math.min(currentTeamHoldings, quantity + 1))}
                >
                  +
                </button>
              </div>
              
              <div className="bg-gray-700 p-3 rounded mb-4">
                <p className="text-white">Total Return: ₹{(teamPrice * quantity).toFixed(2)}</p>
              </div>
            </div>
            
            {transactionStatus && (
              <div className={`p-3 rounded mb-4 ${transactionStatus.success ? 'bg-green-600' : 'bg-red-600'}`}>
                <p className="text-white">{transactionStatus.message}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <button 
                className="bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowSellModal(false);
                  setTransactionStatus(null);
                  setQuantity(1);
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleSellTeam}
                disabled={isProcessing || currentTeamHoldings < quantity}
              >
                {isProcessing ? 'Processing...' : 'Confirm Sell'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Teamstats;