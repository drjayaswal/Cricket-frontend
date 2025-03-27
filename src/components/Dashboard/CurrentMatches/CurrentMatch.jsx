import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import BettingInterface from "../mini-components/BettingInterface";

export default function CurrentMatch() {
  const [matchData, setMatchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);
  const [pollingInterval, setPollingIntervalState] = useState(null);

  
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5001/matches/all-stored-matches");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.matches);
        
        let extractedMatches = [];

        data.matches.forEach((series) => {
          series.matchScheduleList.forEach((matchSchedule) => {
            matchSchedule.matchInfo.forEach((match) => {
              extractedMatches.push({
                matchId: match.matchId || null,
                seriesName: matchSchedule.seriesName || "Series Not Available",
                format: match.matchFormat || "Format Not Available",
                team1: match.team1?.teamName || "Team 1",
                team2: match.team2?.teamName || "Team 2",
                startDate: match.startDate ? Number(match.startDate) : null,
                venue: match.venueInfo?.ground || "Venue Not Available",
              });
            });
          });
        });

        // Filter only today's matches that are T20 or IPL
        const today = new Date();
        const todayMatches = extractedMatches.filter((match) => {
          if (!match.startDate) return false;
          const matchDate = new Date(match.startDate);
          const isToday = (
            matchDate.getDate() === today.getDate() &&
            matchDate.getMonth() === today.getMonth() &&
            matchDate.getFullYear() === today.getFullYear()
          );
          const isT20OrIPL = match.format === "T20" || match.seriesName.includes("IPL");
          return isToday && isT20OrIPL;
        });

        setMatchData(todayMatches);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchMatches();
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  const fetchScoreData = async (match) => {
    try {
      const response = await fetch(`http://localhost:5001/match-scores/${match.matchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setScoreData(data);
      
      if (data.matchScore?.isMatchComplete) {
        stopPolling();
      }
      
      return data;
    } catch (error) {
      console.error("Failed to fetch score:", error);
      setError(error.message);
      return null;
    }
  };

  const handleGetScore = async (match) => {
    setSelectedMatch(match);
    
    const data = await fetchScoreData(match);
    if (data) {
      if (!data.matchScore?.isMatchComplete) {
        startPolling(match);
      }
    }
  };
  
  const startPolling = (match) => {
    if (!pollingActive) {
      setPollingActive(true);
      
      const interval = setInterval(() => {
        fetchScoreData(match);
      }, 60000);
      
      setPollingIntervalState(interval);
    }
  };
  
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingIntervalState(null);
      setPollingActive(false);
    }
  };

  const formatDate = (timestamp) => {
    return timestamp
      ? new Date(Number(timestamp)).toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Date Not Available";
  };

  const handleBackToMatches = () => {
    stopPolling();
    setSelectedMatch(null);
    setScoreData(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading matches...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (selectedMatch && scoreData) {
    return (
      <>
        <button 
          onClick={handleBackToMatches}
          className="bg-gray-700 text-white px-4 py-2 rounded m-4 hover:bg-gray-600 transition-colors"
        >
          ← Back to Matches
        </button>
        <BettingInterface 
          matchData={scoreData} 
          selectedMatch={selectedMatch} 
          refreshData={() => fetchScoreData(selectedMatch)}
          isPollingActive={pollingActive}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Today's Matches</h1>

      {matchData.length > 0 ? (
        <div>
          {matchData.map((match, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-400">{match.seriesName}</span>
                <span className="text-sm text-gray-400 uppercase">{match.format}</span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{match.team1}</span>
                  <span>vs</span>
                  <span className="font-bold">{match.team2}</span>
                </div>
                <button 
                  onClick={() => handleGetScore(match)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Get Score
                </button>
              </div>

              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(match.startDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{match.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">No matches today</div>
      )}
    </div>
  );
}