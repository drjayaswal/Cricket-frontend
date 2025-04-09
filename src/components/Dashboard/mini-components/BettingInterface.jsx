import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import Navbar from "../Navbar/Navbar";
import PlayerCard from "./PlayerCard";
import Teamcard from "./Teamcard";

const BettingInterface = () => {
  const {
    matchData: contextMatchData,
    scoreData,
    selectedMatch,
  } = useContext(UserContext);

  const [statusMessage, setStatusMessage] = useState("Loading...");

  const loadMatchData = () => {
    if (scoreData && Object.keys(scoreData).length > 0) {
      setMatchData(scoreData);
      localStorage.setItem("MatchData", JSON.stringify(scoreData));
    } else {
      const storedMatchData = localStorage.getItem("MatchData");
      if (storedMatchData) {
        setMatchData(JSON.parse(storedMatchData));
      }
    }
  };

  useEffect(() => {
    loadMatchData();
  }, [scoreData]);

  // Local state to manage match data
  const [matchData, setMatchData] = useState(
    JSON.parse(localStorage.getItem("MatchData") || "{}")
  );
  // eslint-disable-next-line no-unused-vars
  const [currentMatch, setCurrentMatch] = useState(
    selectedMatch || JSON.parse(localStorage.getItem("SelectedMatch") || "{}")
  );

  // console.log(matchData);
  // Get the latest innings data
  const innings = matchData?.innings || [];
  const currentInnings = innings.length === 2 ? innings[1] : innings[0];
  const previousInnings = innings.length === 2 ? innings[0] : null;
  const batsmenData = currentInnings?.batsmen || [];

  // console.log(currentInnings);

  // Extract team names
  const teams = [
    {
      id: 1,
      name: currentInnings?.batTeamName || "Team 1",
      score: currentInnings?.score
        ? `${currentInnings.score}/${currentInnings.wickets?.length || 0}`
        : "Yet to bat",
      percentage: currentInnings?.runRate || "0.00",
      graphData: Array.from({ length: 20 }, (_, i) => i + 1),
      color: "green",
    },
    {
      id: 2,
      name: currentInnings?.bowlTeamName || "Team 2",
      score: "Bowling",
      percentage: "N/A",
      graphData: Array.from({ length: 20 }, (_, i) => i + 1),
      color: "yellow",
    },
  ];


  // Map batsmen data
  const players = batsmenData.map((batsman, index) => {
    // Set initial price based on player index
    let initialPrice = 25; // Default price for most players
    if (index < 4) {
      initialPrice = 35; // First 4 players
    } else if (index < 7) {
      initialPrice = 30; // Next 3 players
    }

    return {
      id: batsman.id,
      name: batsman.name || batsman.nickName,
      team: currentInnings.batTeamName,
      STeamName: currentInnings.batTeamSName,
      teamColor: currentInnings.batTeamName === teams[0].name ? "orange" : "red",
      price: initialPrice,
      score: batsman.runs || 0,
      Fours: batsman.fours || 0,
      Sixes: batsman.sixes || 0,
      balls: batsman.balls || 0,
      dots: batsman.dots || 0,
      ones: batsman.ones || 0,
      twos: batsman.twos || 0,
      threes: batsman.threes || 0,
      boundaries: batsman.boundaries || 0,
      average: batsman.avg || "0.00",
      progress: Math.min(100, (batsman.runs / (batsman.balls || 1)) * 100),
      strikeRate: batsman.strikeRate || "0.00",
      status: batsman.outDesc || "Not Out",
      isCaptain: batsman.isCaptain,
      isKeeper: batsman.isKeeper,
      wicketCode:batsman.wicketCode
    };
  });


  useEffect(() => {
    if (!matchData?.status) {
      setStatusMessage("Match is not started Yet");
      return;
    }


    // Create a proper Date object from timestamp
    // Keep this as a Date object (don't convert to string)
    const matchStartTime = new Date(currentMatch.startDate);

    const currentTime = new Date();
    console.log("Current time:", currentTime);
    console.log("Match start time:", matchStartTime);

    // For display purposes only (not for comparison)
    const formattedStartTime = matchStartTime.toLocaleString();
    console.log("Formatted match start time:", formattedStartTime); // 4/7/2025, 7:30:00 PM

    const timeDiffInMinutes = (currentTime - matchStartTime) / (1000 * 60);
    console.log("Time difference in minutes:", timeDiffInMinutes);

    if (currentTime < matchStartTime) {
      setStatusMessage(`Match starts at ${formattedStartTime}`);
    } else if (
      currentTime > matchStartTime &&
      (!matchData?.innings || matchData?.innings?.length === 0) &&
      timeDiffInMinutes > 5
    ) {
      setStatusMessage("Match is Cancelled");
    } else if (
      currentTime > matchStartTime &&
      matchData?.isMatchComplete === true
    ) {
      setStatusMessage("Match is Completed");
    } else if (currentTime > matchStartTime && matchData.status=="Innings Break") {
      setStatusMessage("Innings Break");
    }else if (currentTime > matchStartTime ) {
      setStatusMessage("LIVE");
    }
  }, [matchData]);

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto ms:mx-0 md:max-w-full px-4 py-6">
        <div className="mb-6">
          <div className="relative mb-2">
            <span className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-md">
              {/* {statusMessage} */}
              {matchData.status}
            </span>
          </div>
          <h1 className="text-center text-xl md:text-2xl font-bold mt-6">
            {currentMatch.team1} vs {currentMatch.team2}
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Current Innings : {currentInnings?.batTeamName} -{" "}
            {currentInnings?.score}/{currentInnings?.wickets?.length || 0}(
            {currentInnings?.overs} ov, RR: {currentInnings?.runRate})
          </p>
          {previousInnings && (
            <p className="text-center text-gray-400 mt-1">
              Previous Innings: {previousInnings.batTeamName} -{" "}
              {previousInnings.score}/{previousInnings.wickets?.length || 0}(
              {previousInnings.overs} ov, RR: {previousInnings.runRate})
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {teams.map((team) => (
            <Teamcard key={team.id} team={team} />
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Current Batting: {currentInnings?.batTeamName}
          </h2>
          {players?.length > 0 || matchData?.matchScore ? (
            <div className="space-y-4">
              {players.map((player, index) => (
                <PlayerCard key={player.id} player={player} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((dummy) => (
                <div
                  className="bg-gray-900 rounded-lg p-4 cursor-pointer"
                  key={dummy}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full mr-3"></div>
                      <div>
                        <div className="flex items-center font-semibold">-</div>
                        <div className="text-sm flex items-center">
                          <span className="text-gray-400">| -</span>{" "}
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500 text-white`}
                          >
                            playing
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Price</div>
                      <div className="text-2xl font-bold">100</div>
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
                        style={{ width: `${dummy * 10}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <div>
                        <span className="text-green-500 ">
                          <span className="text-white">Dots: 13</span>
                          &nbsp;|&nbsp;
                          <span className="text-white">Fours: 5</span>
                          &nbsp;|&nbsp;
                          <span className="text-white">Sixes: 3</span>
                        </span>
                      </div>
                      <div>
                        Runs: <span className="text-green-500">120</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BettingInterface;
