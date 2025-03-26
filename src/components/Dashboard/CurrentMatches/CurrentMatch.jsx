import { useState, useEffect } from "react"
import { Calendar, Clock, Trophy } from "lucide-react"

export default function CricketMatchCard() {
  const [todayMatches, setTodayMatches] = useState([])
  const [yesterdayMatches, setYesterdayMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Function to fetch cricket match data
    const fetchMatchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("https://api.cricapi.com/v1/cricScore?apikey=13fc6f81-2b01-46c6-b5e8-5e1eaafbe52a")
        const data = await response.json()

        if (data.status !== "success") {
          throw new Error("Failed to fetch match data")
        }

        // Get today's and yesterday's dates
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        // Format dates to compare with match dates (YYYY-MM-DD)
        const todayStr = formatDateForComparison(today)
        const yesterdayStr = formatDateForComparison(yesterday)

        // Filter matches for today
        const matchesToday = data.data.filter((match) => {
          const matchDate = formatDateForComparison(new Date(match.dateTimeGMT))
          return matchDate === todayStr
        })

        // Filter completed matches from yesterday
        const matchesYesterday = data.data.filter((match) => {
          const matchDate = formatDateForComparison(new Date(match.dateTimeGMT))
          return matchDate === yesterdayStr && match.ms === "result"
        })

        setTodayMatches(matchesToday)
        setYesterdayMatches(matchesYesterday)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching match data:", err)
        setError("Failed to load match data. Please try again later.")
        setLoading(false)
      }
    }

    fetchMatchData()
  }, [])

  // Helper function to format date for comparison (YYYY-MM-DD)
  const formatDateForComparison = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // Function to format match time
  const formatMatchTime = (dateTimeGMT) => {
    const date = new Date(dateTimeGMT)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Cricket Match Schedule</h1>

      {/* Today's Matches */}
      <div className="mb-10">
        <div className="flex items-center mb-6">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Today's Matches</h2>
        </div>

        {todayMatches.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-lg">
            <p className="text-xl text-muted-foreground">No matches scheduled for today</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      {/* Yesterday's Completed Matches */}
      {yesterdayMatches.length > 0 && (
        <div>
          <hr className="my-8" />

          <div className="flex items-center mb-6">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Yesterday's Completed Matches</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yesterdayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Separate MatchCard component for better organization
function MatchCard({ match }) {
  // Function to get team name without the code in brackets
  const getTeamName = (teamWithCode) => {
    return teamWithCode.split("[")[0].trim()
  }

  // Function to format match time
  const formatMatchTime = (dateTimeGMT) => {
    const date = new Date(dateTimeGMT)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Function to get status badge color based on match status
  const getStatusColor = (status, ms) => {
    if (ms === "fixture") return "bg-blue-500 p-2"
    if (ms === "result") return "bg-green-500 p-2"
    return "bg-yellow-500"
  }

  return (
    <div className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white text-black p-4">
      <div className="pb-2">
        <div className="flex justify-between items-center">
          <p className={`${getStatusColor(match.status, match.ms)} text-white`}>
            {match.ms === "fixture" ? "Upcoming" : "Completed"}
          </p>
          <span className="text-sm text-muted-foreground uppercase">{match.matchType}</span>
        </div>
        <div className="text-lg mt-2 line-clamp-1">{match.series}</div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatMatchTime(match.dateTimeGMT)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center w-2/5">
            <div className="relative h-16 w-16 mb-2">
              <img
                src={match.t1img || "/placeholder.svg?height=64&width=64"}
                alt={getTeamName(match.t1)}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold text-center">{getTeamName(match.t1)}</h3>
            {match.t1s && <p className="text-sm font-bold mt-1">{match.t1s}</p>}
          </div>

          <div className="flex flex-col items-center w-1/5">
            <span className="text-xl font-bold">VS</span>
          </div>

          <div className="flex flex-col items-center w-2/5">
            <div className="relative h-16 w-16 mb-2">
              <img
                src={match.t2img || "/placeholder.svg?height=64&width=64"}
                alt={getTeamName(match.t2)}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold text-center">{getTeamName(match.t2)}</h3>
            {match.t2s && <p className="text-sm font-bold mt-1">{match.t2s}</p>}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          {match.ms === "result" ? (
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
              <p className="text-sm font-medium">{match.status}</p>
            </div>
          ) : (
            <p className="text-sm text-center font-medium">{match.status}</p>
          )}
        </div>
      </div>
    </div>
  )
}

