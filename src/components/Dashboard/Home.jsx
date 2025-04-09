import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import Navbar from "./Navbar/Navbar";
import { Calendar, MapPin } from "lucide-react";

const Home = () => {
  const { seriesMatchData, isLoading, error } = useContext(UserContext);

  if (isLoading)
    return (
      <p className="text-center text-lg font-semibold mt-10">
        Loading matches...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <>
      <Navbar />
      {Object.keys(seriesMatchData).length === 0 ? (
        <h1 className="text-center text-lg font-semibold mt-10 text-white">
          No Match Found
        </h1>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center text-white m-6">
            🏏 Upcoming Cricket Matches & Series
          </h1>
          <div className="min-h-screen bg-black text-white py-12">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 bg-[#071c38f3] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#071c38f3] via-black to-black"></div>
      </div>

      <div className="container mx-auto p-4 relative z-10">
        {Object.entries(seriesMatchData).map(([seriesName, matches]) => (
          <div key={seriesName} className="mb-12">
            {/* Series Name Header with Gradient */}
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-[#071c38f3] bg-clip-text text-transparent">
              {seriesName}
            </h2>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div
                  key={match.matchId}
                  className="bg-[#071c38f3]/30 backdrop-blur-sm rounded-xl p-6 border border-[#071c38f3]/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/10 group"
                >
                  {/* Teams Section */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {match.team1} 
                      <span className="text-gray-400 mx-2">vs</span> 
                      {match.team2}
                    </h3>
                  </div>

                  {/* Match Details */}
                  <div className="space-y-3">
                    <p className="text-gray-300 flex items-center gap-2 group-hover:text-blue-300 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {match.startDate
                          ? new Date(match.startDate).toLocaleString('en-US', {
                              dateStyle: 'long',
                              timeStyle: 'short'
                            })
                          : "Date Not Available"}
                      </span>
                    </p>

                    <p className="text-gray-300 flex items-center gap-2 group-hover:text-blue-300 transition-colors">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{match.venue || "Venue Not Available"}</span>
                    </p>

                    <div className="pt-3">
                      <span className="text-sm font-medium bg-blue-400/10 text-blue-400 px-4 py-1.5 rounded-full inline-block group-hover:bg-blue-400/20 transition-colors">
                        {match.format || "Format Not Available"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
        </>
      )}
    </>
  );
};

export default Home;
