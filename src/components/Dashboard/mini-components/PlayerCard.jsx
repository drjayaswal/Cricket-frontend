import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";

const PlayerCard = ({ player,index ,matchId}) => {
  const [price, setPrice] = useState(player.price);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stockCount, setStockCount] = useState(1);
  const [actionType, setActionType] = useState(""); // "buy" or "sell"
  const [isLoading, setIsLoading] = useState(false);

  const { setPortfolio, sellPortfolio } = useContext(UserContext);

  useEffect(() => {
    const newPrice = updatePlayerPrice(player);
    setPrice(newPrice);
  }, [player.score, player.dots, player.status, player]);

  const handleClick = () => {
    if (player.status == "batting" || player.status == "not out") {
      setShowActionButtons(true);
    }
  };

  const handleActionSelect = (action) => {
    setActionType(action);
    setShowModal(true);
    setShowActionButtons(false);
  };

  const updatePlayerPrice = (player) => {
    let newPrice = player.price;

    if (player.wicketCode !== "") {
      newPrice = player.price * 0.7;
      return newPrice;
    }

    // Increase price by 0.75 per run
    newPrice += player.score * 0.75;

    // Decrease price by 0.5 per dot ball
    newPrice -= player.dots * 0.5;

    return newPrice;
  };

  const handleConfirm = async () => {
    const portfolioData = {
      // playerId,team,initialPrice,price,quantity,runs
      MatchId:matchId,
      playerId: player.id,
      playerName: player.name,
      team: player.team,
      initialPrice: player.price,
      price,
      quantity: stockCount,
      runs: player.score,
    };
    setIsLoading(true);

    try {
      if (actionType === "buy") {
        await setPortfolio(portfolioData);
        toast.success(
          `Successfully bought ${stockCount} stock(s) of ${player.name}!`
        );
      } else if (actionType === "sell") {
        await sellPortfolio(portfolioData);
        toast.success(
          `Successfully sold ${stockCount} stock(s) of ${player.name}!`
        );
      }

      setShowModal(false); // Close modal on success
    } catch (error) {
      toast.error(`Failed to complete transaction: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getLogo = () => {
    if (index < 4) return "/assets/batsmenlogo1.jpg";
    if (index < 7) return "/assets/batsmenlogo2.jpg";
    return "/assets/batsmenlogo3.webp";
  };

  return (
    <>
      <div
        className="bg-gray-900 rounded-lg p-4 cursor-pointer relative"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {/* logo div */}
            <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
              <img
                src={getLogo()}
                alt="Player Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center font-semibold">
                {player.name}
              </div>
              <div className="text-sm flex items-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    player.teamColor === "orange"
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                ></span>
                <span className="text-gray-400">| {player.team}</span>{" "}
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    player.status === "batting"
                      ? "bg-green-500 text-white"
                      : player.status === "not out"
                      ? "bg-yellow-500 text-black"
                      : player.status === ""
                      ? "bg-blue-500 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {player.status === "batting"
                    ? "Playing"
                    : player.status === "not out"
                    ? "not out"
                    : player.status === ""
                    ? "pending"
                    : "out"}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Price</div>
            <div className="text-2xl font-bold">₹{price}</div>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>0</span>
            <span>100</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${player.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <div>
              <span className="text-green-500 ">
                <span className="text-white">Dots:</span> {player.dots}
                &nbsp;|&nbsp;
                <span className="text-white">Fours:</span> {player.Fours}{" "}
                &nbsp;|&nbsp;
                <span className="text-white">Sixes:</span> {player.Sixes}
              </span>
            </div>
            <div>
              Runs: <span className="text-green-500">{player.score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Action Buttons Modal */}
      {showActionButtons && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {player.name}
            </h2>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => handleActionSelect("buy")}
                className="bg-green-600 text-white px-6 py-3 rounded w-full font-bold"
              >
                BUY
              </button>
              <button
                onClick={() => handleActionSelect("sell")}
                className="bg-red-600 text-white px-6 py-3 rounded w-full font-bold"
              >
                SELL
              </button>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => setShowActionButtons(false)}
                className="text-gray-600 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Count Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">
              {actionType === "buy" ? "Buy" : "Sell"} Stocks for {player.name}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setStockCount(Math.max(1, stockCount - 1))}
                className="bg-gray-300 px-4 py-1 rounded text-xl"
              >
                -
              </button>
              <span className="text-2xl font-bold">{stockCount}</span>
              <button
                onClick={() => setStockCount(stockCount + 1)}
                className="bg-gray-300 px-4 py-1 rounded text-xl"
              >
                +
              </button>
            </div>
            <div className="mb-4 text-center">
              Total Price: ₹{(price * stockCount).toFixed(2)}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowModal(false);
                  setActionType("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`${
                  actionType === "buy" ? "bg-green-600" : "bg-red-600"
                } text-white px-4 py-2 rounded ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading
                  ? "Processing..."
                  : `Confirm ${actionType === "buy" ? "Purchase" : "Sale"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerCard;
