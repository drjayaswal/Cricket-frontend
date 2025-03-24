import React, { useState } from 'react'

const MatchTabs = ({matches}) => {
    const [activeMatch, setActiveMatch] = useState(matches[0].id)

    const handleTabClick = (matchId) => {
      setActiveMatch(matchId)
      // You can add your function to load match data here
    }
  return (
    <div className="mt-4">
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {matches.map((match) => (
          <button
            key={match.id}
            className={`px-4 py-2 whitespace-nowrap rounded-md text-sm ${
              activeMatch === match.id ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => handleTabClick(match.id)}
          >
            {match.team1} - {match.team2}
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-2">
        <div className="flex space-x-1">
          {matches.map((match) => (
            <div
              key={match.id}
              className={`w-2 h-2 rounded-full ${activeMatch === match.id ? "bg-blue-500" : "bg-gray-600"}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MatchTabs
