import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";

const Portfolio = () => {
  const { getPortfolio } = useContext(UserContext);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProfit, setTotalProfit] = useState(0);

  // Util: Update player price using match performance
  const updatePlayerPrice = (player) => {
    let newPrice = Number(player.price);
    console.log(player.price);

    if (player.wicketCode !== "") {
      return newPrice * 0.7;
    }

    newPrice += player.runs * 0.75;
    newPrice -= player.dots * 0.5;

    return newPrice;
  };

  // Util: Get live data from matchData stored in localStorage
  const getLivePlayerData = (playerId) => {
    try {
      const matchData = JSON.parse(localStorage.getItem("MatchData"));
      if (!matchData?.innings) return null;

      for (const inning of matchData.innings) {
        const found = inning.batsmen.find(
          (p) => p.id?.toString() === playerId.toString()
        );
        if (found) return found;
      }

      return null;
    } catch (err) {
      console.error("Failed to parse match data:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioData = await getPortfolio();
        const updated = [];
        let totalProfitCalc = 0;

        for (let item of portfolioData) {
          const liveData = getLivePlayerData(item.playerId);
          const hasSell = item.transactions?.some((tx) => tx.type === "sell");

          if (liveData) {
            // 🔥 Use initialPrice instead of averageBuyPrice
            const updatedPrice = updatePlayerPrice({
              ...liveData,
              price: item.initialPrice,
            });
            const currentValue = updatedPrice * item.currentHoldings;
            const profit = currentValue - item.initialInvestment;
            const profitPercent = (
              (profit / item.initialInvestment) *
              100
            ).toFixed(2);

            totalProfitCalc += profit;

            updated.push({
              ...item,
              updatedPrice: updatedPrice.toFixed(2),
              profit: profit.toFixed(2),
              profitPercent,
              hasSell,
            });
          } else {
            updated.push({
              ...item,
              hasSell,
            });
          }
        }

        setPortfolio(updated);
        setTotalProfit(totalProfitCalc.toFixed(2));
      } catch (err) {
        toast.error("Unable to load portfolio");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentHoldings = portfolio.filter((item) => item.currentHoldings > 0);
  const soldPlayers = portfolio.filter((item) => item.hasSell);

  return (
    <>
      <Navbar />
      <div className="p-4 text-white">
        <h1 className="text-2xl font-bold mb-4">Your Portfolio</h1>

        {loading ? (
          <div>Loading...</div>
        ) : portfolio.length === 0 ? (
          <div className="text-yellow-500">Create portfolio first!</div>
        ) : (
          <>
            <div
              className={`mb-4 text-xl font-semibold ${
                totalProfit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              Overall {totalProfit >= 0 ? "Profit" : "Loss"}: ₹
              {Math.abs(totalProfit)}
            </div>

            {currentHoldings.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-2 text-blue-400">
                  Current Holdings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {currentHoldings.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700"
                    >
                      <h2 className="text-xl font-semibold">
                        {item.playerName}
                      </h2>
                      <p className="text-gray-400">MatchId: {item.matchId}</p>
                      <p className="text-gray-400">Team: {item.team}</p>
                      <p className="text-green-400">
                        Quantity: {item.currentHoldings}
                      </p>
                      <p className="text-blue-400">
                        Initial Price: ₹{item.initialPrice}
                      </p>
                      <p className="text-yellow-400">
                        Buying Price: ₹{item.averageBuyPrice}
                      </p>
                      <p className="text-emerald-200">
                        Invested: ₹{item.initialInvestment}
                      </p>

                      {item.updatedPrice && (
                        <>
                          <p className="text-pink-400">
                            Live Price: ₹{item.updatedPrice}
                          </p>
                          <p
                            className={`${
                              item.profit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.profit >= 0 ? "Profit" : "Loss"}: ₹
                            {Math.abs(item.profit)}
                          </p>
                          <p className="text-sm text-gray-300">
                            Change: {item.profitPercent}%
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {soldPlayers.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-2 text-red-400">
                  Sold Players
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {soldPlayers.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700"
                    >
                      <h2 className="text-xl font-semibold">
                        {item.playerName}
                      </h2>
                      <p className="text-gray-400">Team: {item.team}</p>
                      <p className="text-green-400">
                        Current Holdings: {item.currentHoldings}
                      </p>
                      <p className="text-yellow-400">
                        Avg Buy Price: ₹{item.averageBuyPrice}
                      </p>
                      <p className="text-blue-400">
                        Initial Investment: ₹{item.initialInvestment}
                      </p>

                      {item.updatedPrice && (
                        <>
                          <p className="text-pink-400">
                            Live Price: ₹{item.updatedPrice}
                          </p>
                          <p
                            className={`${
                              item.profit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.profit >= 0 ? "Profit" : "Loss"}: ₹
                            {Math.abs(item.profit)}
                          </p>
                          <p className="text-sm text-gray-300">
                            Change: {item.profitPercent}%
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Portfolio;
