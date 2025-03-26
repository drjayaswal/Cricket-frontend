import React from 'react'
import { Calendar, MapPin, Clock, AlertCircle } from "lucide-react"

const MatchCard = ({match}) => {
    const formatDate = (dateString) => {
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
        return new Date(dateString).toLocaleDateString(undefined, options)
      }
    
      // Format time from GMT datetime
      const formatTime = (dateTimeGMT) => {
        const options = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
        return new Date(dateTimeGMT).toLocaleTimeString(undefined, options)
      }
    
      // Determine match status type for styling
      const getStatusType = () => {
        const status = match.status.toLowerCase()
    
        if (status.includes("won") || status.includes("winner")) {
          return "completed"
        } else if (status.includes("no result") || status.includes("rain")) {
          return "rain"
        } else if (status.includes("postponed")) {
          return "postponed"
        } else if (status.includes("cancelled") || status.includes("canceled")) {
          return "cancelled"
        } else if (!match.matchStarted) {
          return "upcoming"
        } else if (match.matchStarted && !match.matchEnded) {
          return "live"
        } else {
          return "other"
        }
      }
    
      // Get appropriate badge color based on status
      const getStatusBadgeColor = () => {
        const statusType = getStatusType()
    
        switch (statusType) {
          case "completed":
            return "bg-green-600 hover:bg-green-700"
          case "rain":
            return "bg-blue-600 hover:bg-blue-700"
          case "postponed":
            return "bg-yellow-600 hover:bg-yellow-700"
          case "cancelled":
            return "bg-red-600 hover:bg-red-700"
          case "live":
            return "bg-purple-600 hover:bg-purple-700"
          case "upcoming":
            return "bg-cyan-600 hover:bg-cyan-700"
          default:
            return "bg-gray-600 hover:bg-gray-700"
        }
      }
    
      // Get match type badge color
      const getMatchTypeBadgeColor = () => {
        switch (match.matchType.toLowerCase()) {
          case "t20":
            return "bg-pink-600 hover:bg-pink-700 p-2"
          case "odi":
            return "bg-indigo-600 hover:bg-indigo-700 p-2"
          case "test":
            return "bg-red-600 hover:bg-red-700 p-2"
          default:
            return "bg-gray-600 hover:bg-gray-700 p-2"
        }
      }
    
      return (
        <div className="bg-[#0a2547] border-[#1a3c6a] shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4">
          <div className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className={getMatchTypeBadgeColor()}>{match.matchType.toUpperCase()}</p>
                <h3 className="font-bold text-lg line-clamp-2">{match.name}</h3>
              </div>
            </div>
          </div>
    
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-4 w-4" />
              <span className="text-sm line-clamp-1">{match.venue}</span>
            </div>
    
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(match.date)}</span>
              </div>
    
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formatTime(match.dateTimeGMT)}</span>
              </div>
            </div>
    
            <div className="grid grid-cols-1 gap-3">
              {match.teams.map((team, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#1a3c6a] rounded-full flex items-center justify-center">
                      {match.teamInfo ? (
                        <img
                          src={match.teamInfo[index]?.img || "/placeholder.svg?height=32&width=32"}
                          alt={team}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            ;(e.target ).src = "/placeholder.svg?height=32&width=32"
                          }}
                        />
                      ) : (
                        <span className="text-xs font-bold">{team.substring(0, 2)}</span>
                      )}
                    </div>
                    <span className="font-medium">{team}</span>
                  </div>
    
                  {match.score && match.score[index] && (
                    <div className="text-right">
                      <span className="font-bold">
                        {match.score[index].r}/{match.score[index].w}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">({match.score[index].o} ov)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
    
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="h-4 w-4 text-gray-300" />
              <p className={`${getStatusBadgeColor()} text-xs`}>{match.status}</p>
            </div>
          </div>
    
          <footer className="pt-0">
            <button className="w-full bg-[#1a4b8c] hover:bg-[#2a5b9c]">View Details</button>
          </footer>
        </div>
      )
    }
    

export default MatchCard
