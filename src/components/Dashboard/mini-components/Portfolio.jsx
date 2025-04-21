import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";

const Portfolio = () => {
  const {
    setPortfolio,
    sellPortfolio,
    getPortfolio,
    setTeamPortfolio,
    sellTeamPortfolio,
    getTeamPortfolio,
  } = useContext(UserContext);
  
  // Player portfolio states
  const [portfolio, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Team portfolio states
  const [teamPortfolio, setTeamPortfolioData] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  
  // Shared states
  const [allMatchData, setAllMatchdata] = useState([]);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stockCount, setStockCount] = useState(1);
  const [actionType, setActionType] = useState(""); // "buy" or "sell"
  const [player, setPlayer] = useState({});
  const [team, setTeam] = useState({});
  const [isLoading, setIsLoading] = useState(false); // for stock purchase
  const [processedMatches, setProcessedMatches] = useState({}); // Track processed matches to avoid duplicates
  const [activeTab, setActiveTab] = useState("players"); // "players" or "teams"
  const [selectedEntity, setSelectedEntity] = useState("player"); // "player" or "team"

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch player portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio();
        setPortfolioData(data);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching player portfolio");
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [getPortfolio]);

  // Fetch team portfolio
  useEffect(() => {
    const fetchTeamPortfolio = async () => {
      try {
        const data = await getTeamPortfolio();
        setTeamPortfolioData(data);
        setTeamLoading(false);
      } catch (error) {
        toast.error("Error fetching team portfolio");
        setTeamLoading(false);
      }
    };

    fetchTeamPortfolio();
  }, [getTeamPortfolio]);

  // Fetch match data and handle auto-selling
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/match-scores/all-scores`);
        const data = await response.json();
        setAllMatchdata(data.matchScores);

        // Process auto-selling after fetching match data
        if (portfolio.length > 0) {
          checkAndAutoSellStocks(data.matchScores);
        }
        
        // Process auto-selling for team stocks
        if (teamPortfolio.length > 0) {
          checkAndAutoSellTeamStocks(data.matchScores);
        }
      } catch (error) {
        console.error("Error fetching match scores:", error);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 10000);

    return () => clearInterval(interval);
  }, [portfolio, teamPortfolio]);

  // Function to calculate team price based on match data
  const calculateTeamPrice = (matchData, initialPrice) => {
    if (!matchData || Object.keys(matchData).length === 0) return initialPrice;

    const innings = matchData?.innings || [];
    const currentInnings = innings.length === 2 ? innings[1] : innings[0];
    if (!currentInnings) return initialPrice;

    const batsmenData = currentInnings?.batsmen || [];

    // Calculate initial team price based on target score
    let calculatedTeamPrice = Number(initialPrice);
    if (innings.length === 2 && currentInnings === innings[1]) {
      const targetScore = innings[0]?.score;
      if (targetScore >= 220) calculatedTeamPrice = Math.max(calculatedTeamPrice, 70);
      else if (targetScore >= 200) calculatedTeamPrice = Math.max(calculatedTeamPrice, 65);
      else if (targetScore >= 180) calculatedTeamPrice = Math.max(calculatedTeamPrice, 60);
      else if (targetScore >= 160) calculatedTeamPrice = Math.max(calculatedTeamPrice, 55);
    }

    // Adjust team price based on player performance
    batsmenData.forEach((batsman) => {
      calculatedTeamPrice += (batsman.runs || 0) * 0.1;
      if (batsman.wicketCode && batsman.wicketCode.toLowerCase() !== "") {
        calculatedTeamPrice *= 0.85;
      }
    });

    return parseFloat(calculatedTeamPrice.toFixed(2));
  };

  // Function to check and auto-sell team stocks based on conditions
  const checkAndAutoSellTeamStocks = async (matchData) => {
    // Get current team holdings from portfolio
    const currentTeamHoldings = [];

    teamPortfolio.forEach((item) => {
      const buys = item.transactions
        .filter((tx) => tx.type === "buy")
        .map((tx) => ({ ...tx }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const sells = item.transactions
        .filter((tx) => tx.type === "sell")
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // FIFO Sell matching to determine remaining stocks
      for (let sell of sells) {
        let qtyToSell = sell.quantity;
        while (qtyToSell > 0 && buys.length > 0) {
          const buy = buys[0];
          const usedQty = Math.min(qtyToSell, buy.quantity);
          buy.quantity -= usedQty;
          qtyToSell -= usedQty;
          if (buy.quantity === 0) buys.shift();
        }
      }

      // Count remaining buys
      const remainingStocks = buys.reduce(
        (total, buy) => total + buy.quantity,
        0
      );

      if (remainingStocks > 0) {
        currentTeamHoldings.push({
          teamId: item.teamId,
          matchId: item.matchId,
          teamName: item.teamName,
          initialPrice: item.initialPrice,
          quantity: remainingStocks,
        });
      }
    });

    // Check each team holding against match data
    for (const holding of currentTeamHoldings) {
      const match = matchData.find(
        (m) => m.matchId.toString() === holding.matchId.toString()
      );

      if (!match) continue;

      // Check if we need to process this match-team combination
      const holdingKey = `team-${holding.matchId}-${holding.teamId}`;

      // Check match status
      const isMatchCompleted =
        match.status === "completed" || match.status === "finished";

      // Auto-sell condition for teams
      const shouldAutoSell = isMatchCompleted;

      // Only process if we should auto-sell and haven't processed this combination yet
      if (shouldAutoSell && !processedMatches[holdingKey]) {
        try {
          // Calculate current team price
          const currentPrice = calculateTeamPrice(match, holding.initialPrice);

          // Prepare sell data
          const sellData = {
            MatchId: holding.matchId,
            teamId: holding.teamId,
            teamName: holding.teamName,
            initialPrice: holding.initialPrice,
            price: currentPrice,
            quantity: holding.quantity,
            autoSold: true,
            reason: "match_completed",
          };

          // Execute sell
          await sellTeamPortfolio(sellData);

          // Show toast notification
          toast.info(
            `Auto-sold ${holding.quantity} team stock(s) of ${holding.teamName} - Reason: Match completed`
          );

          // Mark as processed
          setProcessedMatches((prev) => ({
            ...prev,
            [holdingKey]: true,
          }));

          // Refresh team portfolio
          const updatedTeamPortfolio = await getTeamPortfolio();
          setTeamPortfolioData(updatedTeamPortfolio);
        } catch (error) {
          console.error(`Auto-sell failed for team ${holding.teamName}:`, error);
          toast.error(`Failed to auto-sell ${holding.teamName}'s stocks`);
        }
      }
    }
  };

  // Function to check and auto-sell player stocks based on conditions
  const checkAndAutoSellStocks = async (matchData) => {
    // Get current holdings from portfolio
    const currentHoldings = [];

    portfolio.forEach((item) => {
      const buys = item.transactions
        .filter((tx) => tx.type === "buy")
        .map((tx) => ({ ...tx }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const sells = item.transactions
        .filter((tx) => tx.type === "sell")
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // FIFO Sell matching to determine remaining stocks
      for (let sell of sells) {
        let qtyToSell = sell.quantity;
        while (qtyToSell > 0 && buys.length > 0) {
          const buy = buys[0];
          const usedQty = Math.min(qtyToSell, buy.quantity);
          buy.quantity -= usedQty;
          qtyToSell -= usedQty;
          if (buy.quantity === 0) buys.shift();
        }
      }

      // Group remaining buys by player and match
      const remainingStocks = buys.reduce(
        (total, buy) => total + buy.quantity,
        0
      );

      if (remainingStocks > 0) {
        currentHoldings.push({
          playerId: item.playerId,
          matchId: item.matchId,
          playerName: item.playerName,
          team: item.team,
          initialPrice: item.initialPrice,
          quantity: remainingStocks,
        });
      }
    });

    // Check each holding against match data
    for (const holding of currentHoldings) {
      const match = matchData.find(
        (m) => m.matchId.toString() === holding.matchId.toString()
      );

      if (!match) continue;

      // Check if we need to process this match-player combination
      const holdingKey = `${holding.matchId}-${holding.playerId}`;

      // Check match status
      const isMatchCompleted =
        match.status === "completed" || match.status === "finished";
      const isInningsCompleted =
        match.innings &&
        match.innings.some((inn) => inn.status === "completed");

      // Check player status
      let playerOut = false;
      let playerData = null;

      if (match.innings) {
        for (const inning of match.innings) {
          const batsmanData = inning.batsmen.find(
            (p) => p.id?.toString() === holding.playerId.toString()
          );

          if (batsmanData) {
            playerData = batsmanData;
            playerOut = batsmanData.wicketCode !== "";
            break;
          }
        }
      }

      // Auto-sell conditions
      const shouldAutoSell =
        isMatchCompleted || isInningsCompleted || playerOut;

      // Only process if we should auto-sell and haven't processed this combination yet
      if (shouldAutoSell && !processedMatches[holdingKey]) {
        try {
          // Calculate current price
          const currentPrice = calculateUpdatedPrice(
            playerData,
            holding.initialPrice
          );

          // Prepare sell data
          const sellData = {
            MatchId: holding.matchId,
            playerId: holding.playerId,
            playerName: holding.playerName,
            team: holding.team,
            initialPrice: holding.initialPrice,
            price: currentPrice,
            quantity: holding.quantity,
            autoSold: true,
            reason: playerOut
              ? "player_out"
              : isInningsCompleted
              ? "innings_completed"
              : "match_completed",
          };

          // Execute sell
          await sellPortfolio(sellData);

          // Show toast notification
          toast.info(
            `Auto-sold ${holding.quantity} stock(s) of ${holding.playerName} - Reason: ${sellData.reason}`
          );

          // Mark as processed
          setProcessedMatches((prev) => ({
            ...prev,
            [holdingKey]: true,
          }));

          // Refresh portfolio
          const updatedPortfolio = await getPortfolio();
          setPortfolioData(updatedPortfolio);
        } catch (error) {
          console.error(`Auto-sell failed for ${holding.playerName}:`, error);
          toast.error(`Failed to auto-sell ${holding.playerName}'s stocks`);
        }
      }
    }
  };

  // Get live player data from match data
  const getLivePlayerData = (playerId, matchId) => {
    const match = allMatchData.find(
      (m) => m.matchId.toString() === matchId.toString()
    );
    if (!match || !match.innings) return null;

    for (const inning of match.innings) {
      const found = inning.batsmen.find(
        (p) => p.id?.toString() === playerId.toString()
      );
      if (found) return found;
    }
    return null;
  };

  // Calculate updated player price based on stats
  const calculateUpdatedPrice = (playerStats, initialPrice) => {
    let currentPrice = Number(initialPrice);
    if (!playerStats) return currentPrice;

    // Apply runs and dots effect
    currentPrice += playerStats.runs * 0.75;
    currentPrice -= playerStats.dots * 0.5;

    // Then check if player is out
    if (playerStats.wicketCode !== "") {
      currentPrice *= 0.7; // Reduce price if the player is out
    }

    return currentPrice;
  };

  // Calculate profit/loss
  const calculateProfitLoss = (currentPrice, buyPrice, quantity) => {
    const diff = currentPrice - buyPrice;
    const profit = diff * quantity;
    const percentage = ((diff / buyPrice) * 100).toFixed(2);
    return { profit: profit.toFixed(2), percentage };
  };

  // Click handlers for actions
  const handleClick = (entity, type) => {
    if (type === "player") {
      setPlayer(entity);
      setSelectedEntity("player");
    } else {
      setTeam(entity);
      setSelectedEntity("team");
    }
    setShowActionButtons(true);
  };

  const handleActionSelect = (action) => {
    setActionType(action);
    setShowModal(true);
    setShowActionButtons(false);
  };

  // Handle transaction confirmation
  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      if (selectedEntity === "player") {
        const portfolioData = {
          MatchId: player.matchId,
          playerId: player.playerId,
          playerName: player.playerName,
          team: player.team,
          initialPrice: player.initialPrice,
          price: player.currentPrice,
          quantity: stockCount,
          autosold: false,
          reason: "soldbyuser",
        };

        if (actionType === "buy") {
          await setPortfolio(portfolioData);
          toast.success(
            `Successfully bought ${stockCount} stock(s) of ${player.playerName}!`
          );
        } else if (actionType === "sell") {
          await sellPortfolio(portfolioData);
          toast.success(
            `Successfully sold ${stockCount} stock(s) of ${player.playerName}!`
          );
        }

        // Refresh portfolio after transaction
        const updatedPortfolio = await getPortfolio();
        setPortfolioData(updatedPortfolio);
      } else {
        // Team transaction
        const teamPortfolioData = {
          MatchId: team.matchId,
          teamId: team.teamId,
          teamName: team.teamName,
          initialPrice: team.initialPrice,
          price: team.currentPrice,
          quantity: stockCount,
          autosold: false,
          reason: "soldbyuser",
        };
        console.log(teamPortfolioData)

        if (actionType === "buy") {
          await setTeamPortfolio(teamPortfolioData);
          toast.success(
            `Successfully bought ${stockCount} stock(s) of ${team.teamName}!`
          );
        } else if (actionType === "sell") {
          await sellTeamPortfolio(teamPortfolioData);
          toast.success(
            `Successfully sold ${stockCount} stock(s) of ${team.teamName}!`
          );
        }

        // Refresh team portfolio after transaction
        const updatedTeamPortfolio = await getTeamPortfolio();
        setTeamPortfolioData(updatedTeamPortfolio);
      }

      setShowModal(false); // Close modal on success
    } catch (error) {
      toast.error(`Failed to complete transaction: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Render player current holdings
  const renderCurrentHoldings = () => {
    const holdings = [];

    portfolio.forEach((item) => {
      // Get all buy transactions
      const buys = item.transactions
        .filter((tx) => tx.type === "buy")
        .map((tx) => ({ ...tx }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Get all sell transactions
      const sells = item.transactions
        .filter((tx) => tx.type === "sell")
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // FIFO Sell matching
      for (let sell of sells) {
        let qtyToSell = sell.quantity;
        while (qtyToSell > 0 && buys.length > 0) {
          const buy = buys[0];
          const usedQty = Math.min(qtyToSell, buy.quantity);
          buy.quantity -= usedQty;
          qtyToSell -= usedQty;
          if (buy.quantity === 0) buys.shift();
        }
      }

      // Group remaining buys (current holdings) by price & timestamp
      const grouped = {};

      for (let buy of buys) {
        if (buy.quantity <= 0) continue;

        const key = `${buy.price}-${buy.timestamp}`;
        if (!grouped[key]) {
          grouped[key] = {
            playerName: item.playerName,
            team: item.team,
            initialPrice: item.initialPrice,
            buyPrice: buy.price,
            quantity: 0,
            timestamp: buy.timestamp,
            playerId: item.playerId,
            matchId: item.matchId,
          };
        }

        grouped[key].quantity += buy.quantity;
      }

      // Render each grouped holding
      Object.entries(grouped).forEach(([key, holding]) => {
        const liveStats = getLivePlayerData(holding.playerId, holding.matchId);
        const updatedPrice = calculateUpdatedPrice(
          liveStats,
          item.initialPrice
        );
        const { profit, percentage } = calculateProfitLoss(
          updatedPrice,
          holding.buyPrice,
          holding.quantity
        );

        holdings.push({
          key: `${holding.playerId}-${key}`,
          playerName: holding.playerName,
          playerId: holding.playerId,
          matchId: holding.matchId,
          initialPrice: holding.initialPrice,
          team: holding.team,
          buyPrice: holding.buyPrice,
          currentPrice: updatedPrice,
          quantity: holding.quantity,
          profit,
          percentage,
          latestTimestamp: new Date(holding.timestamp).getTime(),
        });
      });
    });

    if (holdings.length > 0) {
      return holdings.map((h) => (
        <div
          key={h.key}
          className="border p-4 m-2 shadow rounded-lg cursor-pointer"
          onClick={() => handleClick(h, "player")}
        >
          <h2 className="font-bold">
            {h.playerName} ({h.team})
          </h2>
          <p>PlayerId: {h.playerId}</p>
          <p>Buy Price: ₹{h.buyPrice}</p>
          <p>Current Price: ₹{h.currentPrice.toFixed(2)}</p>
          <p>Quantity Held: {h.quantity}</p>
          <p
            className={`font-semibold ${
              h.profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            P&L: ₹{h.profit} ({h.percentage}%)
          </p>

          {/* Display player status indicator */}
          {(() => {
            const playerData = getLivePlayerData(h.playerId, h.matchId);
            const match = allMatchData.find(
              (m) => m.matchId.toString() === h.matchId.toString()
            );

            if (playerData && playerData.wicketCode !== "") {
              return <p className="text-red-500 font-bold">Status: Out</p>;
            }

            if (match) {
              if (match.status === "completed" || match.status === "finished") {
                return (
                  <p className="text-red-500 font-bold">Match Completed</p>
                );
              }

              if (
                match.innings &&
                match.innings.some((inn) => inn.status === "completed")
              ) {
                return (
                  <p className="text-orange-500 font-bold">Innings Completed</p>
                );
              }
            }

            return <p className="text-green-500 font-bold">Status: Playing</p>;
          })()}
        </div>
      ));
    } else {
      return <h1>No current player holdings</h1>;
    }
  };

  // Render team current holdings
  const renderTeamCurrentHoldings = () => {
    const holdings = [];

    teamPortfolio.forEach((item) => {
      // Get all buy transactions
      const buys = item.transactions
        .filter((tx) => tx.type === "buy")
        .map((tx) => ({ ...tx }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Get all sell transactions
      const sells = item.transactions
        .filter((tx) => tx.type === "sell")
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // FIFO Sell matching
      for (let sell of sells) {
        let qtyToSell = sell.quantity;
        while (qtyToSell > 0 && buys.length > 0) {
          const buy = buys[0];
          const usedQty = Math.min(qtyToSell, buy.quantity);
          buy.quantity -= usedQty;
          qtyToSell -= usedQty;
          if (buy.quantity === 0) buys.shift();
        }
      }

      // Group remaining buys (current holdings) by price & timestamp
      const grouped = {};

      for (let buy of buys) {
        if (buy.quantity <= 0) continue;

        const key = `${buy.price}-${buy.timestamp}`;
        if (!grouped[key]) {
          grouped[key] = {
            teamName: item.teamName,
            initialPrice: item.initialPrice,
            buyPrice: buy.price,
            quantity: 0,
            timestamp: buy.timestamp,
            teamId: item.teamId,
            matchId: item.matchId,
          };
        }

        grouped[key].quantity += buy.quantity;
      }

      // Render each grouped holding
      Object.entries(grouped).forEach(([key, holding]) => {
        const match = allMatchData.find(
          (m) => m.matchId.toString() === holding.matchId.toString()
        );
        const updatedPrice = calculateTeamPrice(match, item.initialPrice);
        const { profit, percentage } = calculateProfitLoss(
          updatedPrice,
          holding.buyPrice,
          holding.quantity
        );

        holdings.push({
          key: `team-${holding.teamId}-${key}`,
          teamName: holding.teamName,
          teamId: holding.teamId,
          matchId: holding.matchId,
          initialPrice: holding.initialPrice,
          buyPrice: holding.buyPrice,
          currentPrice: updatedPrice,
          quantity: holding.quantity,
          profit,
          percentage,
          latestTimestamp: new Date(holding.timestamp).getTime(),
        });
      });
    });

    if (holdings.length > 0) {
      return holdings.map((h) => (
        <div
          key={h.key}
          className="border p-4 m-2 shadow rounded-lg cursor-pointer"
          onClick={() => handleClick(h, "team")}
        >
          <h2 className="font-bold">{h.teamName}</h2>
          <p>TeamId: {h.teamId}</p>
          <p>Buy Price: ₹{h.buyPrice}</p>
          <p>Current Price: ₹{h.currentPrice}</p>
          <p>Quantity Held: {h.quantity}</p>
          <p
            className={`font-semibold ${
              h.profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            P&L: ₹{h.profit} ({h.percentage}%)
          </p>

          {/* Display team match status indicator */}
          {(() => {
            const match = allMatchData.find(
              (m) => m.matchId.toString() === h.matchId.toString()
            );

            if (match) {
              if (match.status === "completed" || match.status === "finished") {
                return (
                  <p className="text-red-500 font-bold">Match Completed</p>
                );
              }
            }

            return <p className="text-green-500 font-bold">Match In Progress</p>;
          })()}
        </div>
      ));
    } else {
      return <h1>No current team holdings</h1>;
    }
  };

  // Render sold players
  const renderSoldPlayers = () => {
    return portfolio.map((item, index) => {
      const buys = item.transactions
        .filter((tx) => tx.type === "buy")
        .map((tx) => ({ ...tx }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const sells = item.transactions.filter((tx) => tx.type === "sell");

      if (sells.length === 0) return null;

      const sellDetails = [];

      for (let sell of sells) {
        let sellQty = sell.quantity;
        let totalSellProfit = 0;
        let totalSellBuyAmount = 0;

        while (sellQty > 0 && buys.length > 0) {
          const buy = buys[0];
          const usedQty = Math.min(sellQty, buy.quantity);

          const profit = (sell.price - buy.price) * usedQty;

          totalSellProfit += profit;
          totalSellBuyAmount += buy.price * usedQty;

          if (!sell.buyPrice) sell.buyPrice = buy.price;

          buy.quantity -= usedQty;
          sellQty -= usedQty;

          if (buy.quantity === 0) buys.shift();
        }

        const percentage = (
          (totalSellProfit / totalSellBuyAmount) *
          100
        ).toFixed(2);
        sellDetails.push({
          sellPrice: sell.price,
          buyPrice: sell.buyPrice,
          quantity: sell.quantity,
          profit: totalSellProfit.toFixed(2),
          percentage,
          autoSold: sell.autoSold,
          reason: sell.reason || "Manual sale",
          timestamp: sell.timestamp,
        });
      }

      return (
        <div
          key={item.playerId + "-sold-" + index}
          className="border p-4 m-2 shadow rounded-lg bg-gray-100 text-black"
        >
          <h2 className="font-bold">
            {item.playerName} ({item.team}) - Sold
          </h2>
          {sellDetails.map((s, i) => (
            <div key={i} className="mb-2">
              <p>Buy Price: ₹{s.buyPrice}</p>
              <p>Sell Price: ₹{s.sellPrice}</p>
              <p>Quantity Sold: {s.quantity}</p>
              <p
                className={`font-semibold ${
                  s.profit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                P&L: ₹{s.profit} ({s.percentage}%)
              </p>
              {s.autoSold && (
                <p className="italic text-gray-600">
                  Auto-sold: {formatReason(s.reason)} on{" "}
                  {new Date(s.timestamp).toLocaleString()}
                </p>
              )}
              <hr className="my-2" />
            </div>
          ))}
        </div>
      );
    });
  };

  // Render sold teams
  const renderSoldTeams = () => {
    return teamPortfolio.map((item, index) => {
      const buys = item.transactions
        .filter((tx) => tx.type === "buy")
        .map((tx) => ({ ...tx }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const sells = item.transactions.filter((tx) => tx.type === "sell");

      if (sells.length === 0) return null;

      const sellDetails = [];

      for (let sell of sells) {
        let sellQty = sell.quantity;
        let totalSellProfit = 0;
        let totalSellBuyAmount = 0;

        while (sellQty > 0 && buys.length > 0) {
          const buy = buys[0];
          const usedQty = Math.min(sellQty, buy.quantity);

          const profit = (sell.price - buy.price) * usedQty;

          totalSellProfit += profit;
          totalSellBuyAmount += buy.price * usedQty;

          if (!sell.buyPrice) sell.buyPrice = buy.price;

          buy.quantity -= usedQty;
          sellQty -= usedQty;

          if (buy.quantity === 0) buys.shift();
        }

        const percentage = (
          (totalSellProfit / totalSellBuyAmount) *
          100
        ).toFixed(2);
        sellDetails.push({
          sellPrice: sell.price,
          buyPrice: sell.buyPrice,
          quantity: sell.quantity,
          profit: totalSellProfit.toFixed(2),
          percentage,
          autoSold: sell.autoSold,
          reason: sell.reason || "Manual sale",
          timestamp: sell.timestamp,
        });
      }

      return (
        <div
          key={item.teamId + "-sold-" + index}
          className="border p-4 m-2 shadow rounded-lg bg-gray-100 text-black"
        >
          <h2 className="font-bold">{item.teamName} - Sold</h2>
          {sellDetails.map((s, i) => (
            <div key={i} className="mb-2">
              <p>Buy Price: ₹{s.buyPrice}</p>
              <p>Sell Price: ₹{s.sellPrice}</p>
              <p>Quantity Sold: {s.quantity}</p>
              <p
                className={`font-semibold ${
                  s.profit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                P&L: ₹{s.profit} ({s.percentage}%)
              </p>
              {s.autoSold && (
                <p className="italic text-gray-600">
                  Auto-sold: {formatReason(s.reason)} on{" "}
                  {new Date(s.timestamp).toLocaleString()}
                </p>
              )}
              <hr className="my-2" />
            </div>
          ))}
        </div>
      );
    });
  };

  // Helper function to format reason text
  const formatReason = (reason) => {
    if (!reason) return "Unknown reason";
    
    switch (reason.toLowerCase()) {
      case "player_out":
        return "Player Out";
      case "innings_completed":
        return "Innings Completed";
      case "match_completed":
        return "Match Completed";
      case "soldbyuser":
        return "Sold by User";
      default:
        return reason.charAt(0).toUpperCase() + reason.slice(1).replace(/_/g, " ");
    }
  };

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    let totalValue = 0;
    let totalInvestment = 0;
    
    // Calculate player portfolio value
    portfolio.forEach((item) => {
      const buys = item.transactions
        .filter((tx) => tx.type === "buy")
        .map((tx) => ({ ...tx }));
      const sells = item.transactions
        .filter((tx) => tx.type === "sell")
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // FIFO Sell matching
      for (let sell of sells) {
        let qtyToSell = sell.quantity;
        while (qtyToSell > 0 && buys.length > 0) {
          const buy = buys[0];
          const usedQty = Math.min(qtyToSell, buy.quantity);
          buy.quantity -= usedQty;
          qtyToSell -= usedQty;
          if (buy.quantity === 0) buys.shift();
        }
      }

      // Calculate current value of remaining stocks
      for (let buy of buys) {
        if (buy.quantity <= 0) continue;

        const liveStats = getLivePlayerData(item.playerId, item.matchId);
        const currentPrice = calculateUpdatedPrice(liveStats, item.initialPrice);
        
        totalValue += currentPrice * buy.quantity;
        totalInvestment += buy.price * buy.quantity;
      }
    });
    
    // Calculate team portfolio value
    teamPortfolio.forEach((item) => {
      const buys = item.transactions
        .filter((tx) => tx.type === "buy")
        .map((tx) => ({ ...tx }));
      const sells = item.transactions
        .filter((tx) => tx.type === "sell")
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // FIFO Sell matching
      for (let sell of sells) {
        let qtyToSell = sell.quantity;
        while (qtyToSell > 0 && buys.length > 0) {
          const buy = buys[0];
          const usedQty = Math.min(qtyToSell, buy.quantity);
          buy.quantity -= usedQty;
          qtyToSell -= usedQty;
          if (buy.quantity === 0) buys.shift();
        }
      }

      // Calculate current value of remaining team stocks
      for (let buy of buys) {
        if (buy.quantity <= 0) continue;

        const match = allMatchData.find(
          (m) => m.matchId.toString() === item.matchId.toString()
        );
        const currentPrice = calculateTeamPrice(match, item.initialPrice);
        
        totalValue += currentPrice * buy.quantity;
        totalInvestment += buy.price * buy.quantity;
      }
    });

    const totalProfit = totalValue - totalInvestment;
    const profitPercentage = totalInvestment > 0 
      ? ((totalProfit / totalInvestment) * 100).toFixed(2) 
      : 0;

    return {
      totalValue: totalValue.toFixed(2),
      totalInvestment: totalInvestment.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      profitPercentage
    };
  };

  // Calculate historical profit/loss from sold stocks
  const calculateHistoricalProfitLoss = () => {
    let totalProfit = 0;
    let totalSold = 0;

    // Calculate from player portfolio
    portfolio.forEach((item) => {
      item.transactions
        .filter((tx) => tx.type === "sell")
        .forEach((sell) => {
          // Find corresponding buy transactions (simplified approach)
          const buyPrice = sell.buyPrice || 
            item.transactions.find(tx => tx.type === "buy")?.price || 
            item.initialPrice;
          
          const profit = (sell.price - buyPrice) * sell.quantity;
          totalProfit += profit;
          totalSold += buyPrice * sell.quantity;
        });
    });

    // Calculate from team portfolio
    teamPortfolio.forEach((item) => {
      item.transactions
        .filter((tx) => tx.type === "sell")
        .forEach((sell) => {
          // Find corresponding buy transactions (simplified approach)
          const buyPrice = sell.buyPrice || 
            item.transactions.find(tx => tx.type === "buy")?.price || 
            item.initialPrice;
          
          const profit = (sell.price - buyPrice) * sell.quantity;
          totalProfit += profit;
          totalSold += buyPrice * sell.quantity;
        });
    });

    const percentage = totalSold > 0 ? ((totalProfit / totalSold) * 100).toFixed(2) : 0;
    
    return {
      totalProfit: totalProfit.toFixed(2),
      percentage
    };
  };

  const { totalValue, totalInvestment, totalProfit, profitPercentage } = calculateTotalValue();
  const { totalProfit: historicalProfit, percentage: historicalPercentage } = calculateHistoricalProfitLoss();

  // Main rendering
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>

        {/* Portfolio Summary */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold">Current Value</h3>
            <p className="text-2xl">₹{totalValue}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold">Total Investment</h3>
            <p className="text-2xl">₹{totalInvestment}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold">Current P&L</h3>
            <p className={`text-2xl ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{totalProfit} ({profitPercentage}%)
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold">Historical P&L</h3>
            <p className={`text-2xl ${historicalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{historicalProfit} ({historicalPercentage}%)
            </p>
          </div>
        </div> */}

        {/* Portfolio Tab Navigation */}
        <div className="flex mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "players"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("players")}
          >
            Player Portfolio
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "teams"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("teams")}
          >
            Team Portfolio
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "players" ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Current Player Holdings</h2>
            {loading ? (
              <p>Loading player portfolio...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderCurrentHoldings()}
              </div>
            )}
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Sold Players History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderSoldPlayers()}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Current Team Holdings</h2>
            {teamLoading ? (
              <p>Loading team portfolio...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderTeamCurrentHoldings()}
              </div>
            )}
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Sold Teams History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderSoldTeams()}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons Modal */}
      {showActionButtons && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">
              {selectedEntity === "player" ? player.playerName : team.teamName}
            </h2>
            <p>
              Current Price: ₹
              {selectedEntity === "player"
                ? player.currentPrice
                : team.currentPrice}
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleActionSelect("buy")}
              >
                Buy More
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleActionSelect("sell")}
              >
                Sell
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowActionButtons(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {actionType === "buy" ? "Buy" : "Sell"}{" "}
              {selectedEntity === "player" ? player.playerName : team.teamName}
            </h2>
            <p>
              Current Price: ₹
              {selectedEntity === "player"
                ? player.currentPrice
                : team.currentPrice}
            </p>
            <div className="my-4">
              <label className="block mb-2">Quantity:</label>
              <input
                type="number"
                min="1"
                max={
                  actionType === "sell"
                    ? selectedEntity === "player"
                      ? player.quantity
                      : team.quantity
                    : 100
                }
                value={stockCount}
                onChange={(e) => setStockCount(parseInt(e.target.value) || 1)}
                className="border p-2 w-full"
              />
            </div>
            <p className="font-bold">
              Total:{" "}
              {selectedEntity === "player"
                ? (player.currentPrice * stockCount).toFixed(2)
                : (team.currentPrice * stockCount).toFixed(2)}{" "}
              ₹
            </p>
            <div className="flex justify-between mt-4">
              <button
                className={`${
                  actionType === "buy"
                    ? "bg-green-500"
                    : "bg-red-500"
                } text-white px-4 py-2 rounded`}
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;