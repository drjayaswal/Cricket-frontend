import { useState } from 'react'
import MatchTabs from './MatchTabs'
import PlayerCard from './PlayerCard'
import Teamcard from './Teamcard'
const BettingInterface = () => {

    const [username, setUsername] = useState("Username")

    // Sample data - you can replace this with your actual data fetching logic
    const teams = [
      {
        id: 1,
        name: "Team Name",
        score: "00.0",
        percentage: "00.00%+",
        graphData: Array.from({ length: 20 }, (_, i) => i + 1),
        color: "green",
      },
      {
        id: 2,
        name: "Team Name",
        score: "00.0",
        percentage: "00.00%+",
        graphData: Array.from({ length: 20 }, (_, i) => 20 - i),
        color: "yellow",
      },
    ]
  
    const players = [
      {
        id: 1,
        name: "Name",
        team: "Team",
        teamColor: "orange",
        price: "00.0",
        currentPrice: "₹00.0",
        maxProfit: "₹00.0",
        progress: 70,
      },
      {
        id: 2,
        name: "Name",
        team: "Team",
        teamColor: "red",
        price: "00.0",
        currentPrice: "₹00.0",
        maxProfit: "₹00.0",
        progress: 70,
      },
      {
        id: 3,
        name: "Name",
        team: "Team",
        teamColor: "orange",
        price: "00.0",
        currentPrice: "₹00.0",
        maxProfit: "₹00.0",
        progress: 70,
      },
      {
        id: 3,
        name: "Name",
        team: "Team",
        teamColor: "orange",
        price: "00.0",
        currentPrice: "₹00.0",
        maxProfit: "₹00.0",
        progress: 70,
      },
      {
        id: 3,
        name: "Name",
        team: "Team",
        teamColor: "orange",
        price: "00.0",
        currentPrice: "₹00.0",
        maxProfit: "₹00.0",
        progress: 70,
      },
    ]
  
    const matches = [
      { id: 1, team1: "Team1", team2: "Team2", active: true },
      { id: 2, team1: "Team1", team2: "Team2", active: false },
      { id: 3, team1: "Team1", team2: "Team2", active: false },
    ]

  return (
<div className="max-w-md mx-auto ms:mx-0 md:max-w-full px-4 py-6">
      <div className="mb-6">
        <div className="relative mb-2">
          <span className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-md">
            LIVE
          </span>
        </div>
        <h1 className="text-center text-2xl font-bold mt-6">Hey [{username}], Ready to Bet?</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {teams.map((team) => (
          <Teamcard key={team.id} team={team} />
        ))}
      </div>

      <MatchTabs matches={matches} />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Players</h2>
        <div className="space-y-4">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BettingInterface
