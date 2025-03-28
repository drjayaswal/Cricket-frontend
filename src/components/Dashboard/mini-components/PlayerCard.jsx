import React from "react";

const PlayerCard = ({ player, onSelect }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(player.id);
    }
  };
  return (
    <div
      className="bg-gray-900 rounded-lg p-4 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-400 rounded-full mr-3"></div>
          <div>
            <div className="flex items-center font-semibold">{player.name}</div>
            <div className="text-sm flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-1 ${
                  player.teamColor === "orange" ? "bg-orange-500" : "bg-red-500"
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
          <div className="text-2xl font-bold">{player.score}</div>
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
              <span className="text-white">Dots:</span>{" "}
              {player.balls -
                player.Fours * 1 -
                player.Sixes * 1 -
                (player.score - player.Fours * 4 - player.Sixes * 6)}{" "}
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
  );
};

export default PlayerCard;
