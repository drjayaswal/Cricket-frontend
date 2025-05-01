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
    <div className="text-white rounded-lg w-full mx-auto shadow-lg hover:shadow-xl transition-all box">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#003690] p-[10px] sm:p-[16px] rounded-t-[10px]">
        <p className="text-[#E2E2E4] text-[14px] font-[400] mb-1 sm:mb-0">
          {match.format} | {match.seriesName}
        </p>
        <p className="text-[#E2E2E4] text-[14px] font-[400] flex items-center gap-1">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          {hours > 24 ? new Date(match.startDate).toLocaleString() : "Today"}
        </p>
      </div>

      {/* Match Details */}
      <div className="bg-[#002865] px-2 sm:px-3 md:px-4 text-center">
        <div className="flex items-center justify-between py-[24px]">
          {/* Team 1 */}
          <div className="text-center">
            <img
              src="/assets/crciketlogo.jpg"
              alt={match.team1}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-[6px] rounded-full"
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
            Match Start in
            <div
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-[3px] ${
                timeDiff > 0
                  ? "bg-[#FF9500] text-black font-[400]"
                  : "bg-[#e53935] font-[400] sm:text-[14px] text-[12px] text-white"
              }`}
            >
              {timeDiff > 0 ? (
                <p className="text-xs sm:text-sm">
                  {hours}h {minutes}m {seconds}s
                </p>
              ) : match.isMatchComplete ? (
                "match is completed"
              ) : (
                "Watch Match"
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="text-center">
            <img
              src="/assets/crciketlogo.jpg"
              alt={match.team2}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-[6px] rounded-full"
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

      <button
        className="w-full bg-[#1671CC] text-white cursor-pointer font-[400] rounded-b-[10px] text-[22px] sm:text-[22px] py-1 sm:py-2"
        onClick={(e) => {
          e.stopPropagation();
          handleGetScore(match);
        }}
      >
        Create Portfolio
      </button>
    </div>
  );
};

export default MatchCard;