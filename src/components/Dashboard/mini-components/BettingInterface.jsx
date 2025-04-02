import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../Context/UserContext'
// import { toast } from 'react-toastify'
import Navbar from '../Navbar/Navbar'
import MatchTabs from './MatchTabs'
import PlayerCard from './PlayerCard'
import Teamcard from './Teamcard'

const BettingInterface = () => {
  const { 
    // eslint-disable-next-line no-unused-vars
    matchData: contextMatchData, 
    scoreData, 
    selectedMatch, 
    startAutoPolling 
  } = useContext(UserContext);

  // Local state to manage match data
  const [matchData, setMatchData] = useState(scoreData || 
    JSON.parse(localStorage.getItem('MatchData') || "{}"));
     // eslint-disable-next-line no-unused-vars
  const [currentMatch, setCurrentMatch] = useState(
    selectedMatch || JSON.parse(localStorage.getItem("SelectedMatch") || "{}"));

  // Auto-start polling when component mounts
  useEffect(() => {
    if (currentMatch && currentMatch.matchId) {
      startAutoPolling(currentMatch);
    }
  }, [currentMatch, startAutoPolling]);

  // Update local state when context data changes
  useEffect(() => {
    if (scoreData) {
      setMatchData(scoreData);
      localStorage.setItem('MatchData', JSON.stringify(scoreData));
    }
  }, [scoreData]);

  // Prevent rendering if no match data
  if (!currentMatch || !matchData?.matchScore) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading match data...</p>
      </div>
    );
  }

  // Get the latest innings data
  const currentInnings = matchData?.matchScore?.innings?.[matchData.matchScore.innings.length - 1];
  const previousInnings = matchData?.matchScore?.innings?.[matchData.matchScore.innings.length - 2];

  // Transform the data for teams display
  const teams = [
    {
      id: 1,
      name: currentMatch?.team1,
      score: matchData.matchScore?.innings?.find(inn => inn.batTeamName === currentMatch.team1)
        ? `${matchData.matchScore.innings.find(inn => inn.batTeamName === currentMatch.team1).score}/
           ${matchData.matchScore.innings.find(inn => inn.batTeamName === currentMatch.team1).wickets}`
        : "Yet to bat",
      percentage: matchData.matchScore?.innings?.find(inn => inn.batTeamName === currentMatch.team1)?.runRate || "0.00",
      graphData: Array.from({ length: 20 }, (_, i) => i + 1),
      color: "green",
    },
    {
      id: 2,
      name: currentMatch?.team2,
      score: matchData.matchScore?.innings?.find(inn => inn.batTeamName === currentMatch.team2)
        ? `${matchData.matchScore.innings.find(inn => inn.batTeamName === currentMatch.team2).score}/
           ${matchData.matchScore.innings.find(inn => inn.batTeamName === currentMatch.team2).wickets}`
        : "Yet to bat",
      percentage: matchData.matchScore?.innings?.find(inn => inn.batTeamName === currentMatch.team2)?.runRate || "0.00",
      graphData: Array.from({ length: 20 }, (_, i) => i + 1),
      color: "yellow",
    }
  ];

  // Transform batsmen data for player cards
  const players = currentInnings?.batsmen?.map((batsman) => ({
    id: batsman.id,
    name: batsman.name || batsman.nickName,
    team: currentInnings.batTeamName,
    teamColor: currentInnings.batTeamName === currentMatch.team1 ? "orange" : "red",
    price: batsman.runs || 0,
    score: batsman.runs || 0,
    currentPrice: `${batsman.runs || 0}/${batsman.balls || 0}`,
    maxProfit: `${batsman.fours || 0}x4 ${batsman.sixes || 0}x6`,
    Fours: batsman.fours,
    Sixes: batsman.sixes,
    balls: batsman.balls,
    progress: Math.min(100, (batsman.runs / (batsman.balls || 1)) * 100),
    strikeRate: batsman.strkRate || "0.00",
    status: batsman.outDec,
    isCaptain: batsman.isCaptain,
    isKeeper: batsman.isKeeper,
  })) || [];

  // Create match tabs data
  const matches = [
    { 
      id: 1, 
      team1: currentMatch.team1, 
      team2: currentMatch.team2, 
      active: true 
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="max-w-md mx-auto ms:mx-0 md:max-w-full px-4 py-6">
        <div className="mb-6">
          <div className="relative mb-2">
            <span className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-md">
              {matchData.matchScore?.status || "LIVE"}
            </span>
          </div>
          <h1 className="text-center text-2xl font-bold mt-6">
            {currentMatch.team1} vs {currentMatch.team2}
          </h1>
          <p className="text-center text-gray-400 mt-2">
            {currentInnings?.overs} overs | RR: {currentInnings?.runRate}
          </p>
          {previousInnings && (
            <p className="text-center text-gray-400 mt-1">
              Previous Innings: {previousInnings.batTeamName} - {previousInnings.score}/{previousInnings.wickets} 
              ({previousInnings.overs} ov, RR: {previousInnings.runRate})
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {teams.map((team) => (
            <Teamcard key={team.id} team={team} />
          ))}
        </div>

        <MatchTabs matches={matches} />

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Current Batting: {currentInnings?.batTeamName}
          </h2>
          <div className="space-y-4">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>

        {currentInnings?.partnership?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Current Partnership</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p>
                {currentInnings.partnership[currentInnings.partnership.length - 1].bat1Name} - 
                {currentInnings.partnership[currentInnings.partnership.length - 1].bat1Runs} & 
                {currentInnings.partnership[currentInnings.partnership.length - 1].bat2Name} - 
                {currentInnings.partnership[currentInnings.partnership.length - 1].bat2Runs}
                <br />
                Total: {currentInnings.partnership[currentInnings.partnership.length - 1].totalRuns} runs
                ({currentInnings.partnership[currentInnings.partnership.length - 1].totalBalls} balls)
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BettingInterface;