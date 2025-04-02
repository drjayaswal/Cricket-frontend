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
            🏏 Live Cricket Matches & Series
          </h1>
          <div className="container mx-auto p-4">
            {Object.entries(seriesMatchData).map(([seriesName, matches]) => (
              <div key={seriesName} className="mb-6">
                {/* Series Name Header */}
                <h2 className="text-2xl font-bold text-blue-600 border-b-2 pb-2 mb-4">
                  {seriesName}
                </h2>

                {/* Matches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches.map((match) => (
                    <div
                      key={match.matchId}
                      className="bg-white text-black shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-all"
                    >
                      {/* Teams and Match Info */}
                      <h3 className="text-lg font-semibold text-black mb-2">
                        {match.team1} <span className="text-gray-500">vs</span>{" "}
                        {match.team2}
                      </h3>

                      <p className="text-sm text-black flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-500" />{" "}
                        {match.startDate
                          ? new Date(match.startDate).toLocaleString()
                          : "Date Not Available"}
                      </p>

                      <p className="text-sm text-black flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4 text-gray-500" />{" "}
                        {match.venue || "Venue Not Available"}
                      </p>

                      <p className="mt-2 text-sm font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full w-fit">
                        {match.format || "Format Not Available"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
