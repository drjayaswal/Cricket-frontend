import React from "react";

const PlayerCard = ({player,onSelect}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(player.id);
    }
  };
  return(
    <div className="bg-gray-900 rounded-lg p-4 cursor-pointer" onClick={handleClick}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-400 rounded-full mr-3"></div>
        <div>
          <div className="font-semibold">{player.name}</div>
          <div className="text-sm flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-1 ${
                player.teamColor === "orange" ? "bg-orange-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-gray-400">| {player.team}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400">Price</div>
        <div className="text-2xl font-bold">{player.price}</div>
      </div>
    </div>

    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span>0</span>
        <span>70</span>
      </div>
      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: `${player.progress}%` }}></div>
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <div>
          Current Price: <span className="text-green-500">{player.currentPrice}</span>
        </div>
        <div>
          Max Profit: <span className="text-green-500">{player.maxProfit}</span>
        </div>
      </div>
    </div>
  </div>
  )
};

export default PlayerCard;
