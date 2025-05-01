import { useState } from "react";
import MatchCard from "../CurrentMatches/MatchCard";
import { ChevronDown, ChevronUp } from "lucide-react";

const SeriesCard = ({ seriesName, matches }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 bg-[#071c38f3]/30 border border-[#071c38f3]/50 rounded-xl">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 text-white text-left bg-gradient-to-r from-blue-900 to-black rounded-t-xl focus:outline-none"
      >
        <h2 className="text-xl font-semibold">{seriesName}</h2>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      {/* Collapsible Match Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {matches.map((match) => (
            <MatchCard key={match.matchId} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;