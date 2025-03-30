import React, { useContext, useState } from "react";
import { Calendar } from "lucide-react";
import { UserContext } from "../../../Context/UserContext";

const MatchCard = ({ match }) => {
  const [showPortfolio, setShowPortfolio] = useState(false);

  const { handleGetScore } = useContext(UserContext)

  const togglePortfolio = () => {
    setShowPortfolio(!showPortfolio);
  };

  const matchTime = new Date(match.startDate).getTime();
const timeDiff = matchTime - Date.now(); // Difference in milliseconds

const hours = Math.floor(timeDiff / (1000 * 60 * 60)); // Convert to hours
const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div
      className="bg-gray-800 text-white rounded-lg p-4 w-full  mx-auto shadow-lg cursor-pointer hover:shadow-xl transition-all"
      onClick={togglePortfolio}
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-900 p-3 rounded-t-lg">
        <p className="text-sm font-medium">
          {match.format} | {match.seriesName}
        </p>
        <p className="text-sm flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          {new Date(match.startDate).toLocaleString()}
        </p>
      </div>

      {/* Match Details */}
      <div className="bg-black p-4 rounded-b-lg text-center">
        <div className="flex items-center justify-between">
          {/* Team 1 */}
          <div className="text-center">
            <img
              src={match.team1Logo}
              alt={match.team1}
              className="w-12 h-12 mx-auto rounded-full"
            />
            <p className="font-bold text-lg">{match.team1}</p>
            <p className="text-gray-400 text-sm">{match.team1City}</p>
          </div>

          {/* Match Countdown */}
          <div>
            
            <div className={`px-4 py-2 rounded-lg font-bold ${timeDiff > 0 ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white'}`}>
              
              {timeDiff > 0 
                ? <p className="text-sm ">Match starts in {hours}h {minutes}m </p>
                : 'LIVE'
              }
            </div>
          </div>

          {/* Team 2 */}
          <div className="text-center">
            <img
              src={match.team2Logo}
              alt={match.team2}
              className="w-12 h-12 mx-auto rounded-full"
            />
            <p className="font-bold text-lg">{match.team2}</p>
            <p className="text-gray-400 text-sm">{match.team2City}</p>
          </div>
        </div>

        {/* Create Portfolio Button */}
        {showPortfolio && (
          <button className="w-full bg-green-500 text-white font-bold py-2 mt-4 rounded-lg"
          onClick={()=>handleGetScore(match)}
          >
            Create Portfolio
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
