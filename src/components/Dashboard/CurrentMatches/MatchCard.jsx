import React, { useContext } from "react";
import { Calendar } from "lucide-react";
import { UserContext } from "../../../Context/UserContext";

const MatchCard = ({ match }) => {
  const { handleGetScore } = useContext(UserContext);
  const matchTime = new Date(match.startDate).getTime();
  const timeDiff = matchTime - Date.now();

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return (
    <div className="text-white overflow-hidden rounded-xl w-full mx-auto shadow-lg hover:shadow-xl transition-all box">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#003690] p-[10px] sm:p-[16px] rounded-t-[10px]">
        <p className="text-[#E2E2E4] text-[18px] font-[400] mb-1 sm:mb-0">
          {match.format} | {match.seriesName}
        </p>
        <p className="text-[#E2E2E4] text-[18px] font-[400] flex items-center gap-1">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          {hours > 24 ? new Date(match.startDate).toLocaleString() : "Today"}
        </p>
      </div>

      {/* Match Details */}
      <div className="bg-[#002865] px-2 sm:px-3 md:px-4 text-center">
        <div className="flex items-center justify-around py-[24px]">
          {/* Team 1 */}
          <div className="text-center">
            <img
              src="/assets/crciketlogo.jpg"
              alt={match.team1}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-[6px] rounded-full"
            />
            <p className="font-[400] text-sm sm:text-base md:text-lg">
              {match.team1
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">{match.team1City}</p>
          </div>

          {/* Countdown */}
          <div className="mx-1 sm:mx-2">
            {hours > 0 ? "Starts in" : ""}
            <div
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl ${timeDiff > 0
                  ? "bg-[#FF9500] text-black font-[500]"
                  : "font-[400] border-1 live"
                }`}
            >
              {timeDiff > 0 ? (
                <p className="text-lg">
                  {hours > 0 ? `${hours}h` : ``} {minutes > 0 ? `${minutes}m` : ``} {hours <= 0 ? `${seconds}s` : ''}
                </p>
              ) : match.isMatchComplete ? (
                <p className="text-lg">
                Completed
                </p>
              ) : (
                <p className="text-lg">
                Live
                </p>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="text-center">
            <img
              src="/assets/crciketlogo.jpg"
              alt={match.team2}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-[6px] rounded-full"
            />
            <p className="font-[400] text-sm sm:text-base md:text-lg">
              {match.team2
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">{match.team2City}</p>
          </div>
        </div>
      </div>

      {hours > 0 ? <></> :
        <button
          className="w-full bg-[#1671CC]/90 hover:bg-blue-700 text-white cursor-pointer font-[400] rounded-b-[10px] text-[22px] sm:text-[22px] py-1 sm:py-2"
          onClick={(e) => {
            e.stopPropagation();
            handleGetScore(match);
          }}
        >
          Create Portfolio
        </button>}
    </div>
  );
};

export default MatchCard;