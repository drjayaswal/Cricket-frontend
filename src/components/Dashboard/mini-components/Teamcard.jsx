import React from 'react'

const Teamcard = ({team}) => {
  return (
    <div className={`rounded-lg p-3 border ${team.color === "green" ? "border-green-500" : "border-yellow-500"}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">{team.name}</span>
        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-xs">i</span>
        </div>
      </div>

      <div className="text-center mb-1">
        <div className="text-3xl font-bold">{team.score}</div>
        <div className="text-xs text-gray-400">{team.percentage}</div>
      </div>

      <div className="h-16 md:h-32 flex items-end justify-between">
        {team.graphData.map((value, index) => (
          <div
            key={index}
            className={`w-1 md:w-5 ${team.color === "green" ? "bg-green-500" : "bg-yellow-500"}`}
            style={{ height: `${value * 4}%` }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default Teamcard
