import React, { useContext } from "react";
import { Calendar } from "lucide-react";
import { UserContext } from "../../../Context/UserContext";

const MatchCard = ({ match }) => {

  const { handleGetScore } = useContext(UserContext);


  const matchTime = new Date(match.startDate).getTime();
  const timeDiff = matchTime - Date.now(); // Difference in milliseconds

  const hours = Math.floor(timeDiff / (1000 * 60 * 60)); // Convert to hours
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);


  // console.log(match);
  

  return (
    <div
    className="bg-gray-800 text-white rounded-lg p-2 sm:p-3 md:p-4 w-full lg mx-auto shadow-lg  hover:shadow-xl transition-all">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-900 p-2 sm:p-3 rounded-t-lg">
      <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-0">
        {match.format} | {match.seriesName}
      </p>
      <p className="text-xs sm:text-sm flex items-center gap-1">
        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
        {new Date(match.startDate).toLocaleString()}
      </p>
    </div>

    {/* Match Details */}
    <div className="bg-black p-2 sm:p-3 md:p-4 rounded-b-lg text-center">
      <div className="flex items-center justify-between">
        {/* Team 1 */}
        <div className="text-center">
          <img
            src="/assets/crciketlogo.jpg"
            alt={match.team1}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto rounded-full"
          />
          <p className="font-bold text-sm sm:text-base md:text-lg">{match.team1}</p>
          <p className="text-gray-400 text-xs sm:text-sm">{match.team1City}</p>
        </div>

        {/* Match Countdown */}
        <div className="mx-1 sm:mx-2">
          <div
            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg font-bold ${
              timeDiff > 0
                ? "bg-yellow-500 text-black"
                : "bg-red-600 text-white"
            }`}
          >
            {timeDiff > 0 ? (
              <p className="text-xs sm:text-sm">
                {hours}h {minutes}m {seconds}s
              </p>
            ) : match.isMatchComplete === true ? "match is completed" : "Watch Match"}
          </div>
        </div>

        {/* Team 2 */}
        <div className="text-center">
          <img
            src="/assets/crciketlogo.jpg"
            alt={match.team2}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto rounded-full"
          />
          <p className="font-bold text-sm sm:text-base md:text-lg">{match.team2}</p>
          <p className="text-gray-400 text-xs sm:text-sm">{match.team2City}</p>
        </div>
      </div>

        <button
          className="w-full bg-green-500 text-white cursor-pointer font-bold text-xs sm:text-sm py-1 sm:py-2 mt-2 sm:mt-4 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleGetScore(match);
          }}
        >
          Create Portfolio
        </button>
    </div>
  </div>
  );
};

export default MatchCard;
