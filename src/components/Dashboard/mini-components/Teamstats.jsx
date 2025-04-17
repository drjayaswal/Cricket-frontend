import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';

const Teamstats = () => {
  const [matchData, setMatchData] = useState(null);
  const [teamPrice, setTeamPrice] = useState(50);

  useEffect(() => {
    const storedData = localStorage.getItem('MatchData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMatchData(parsedData);
    }
  }, []);

  useEffect(() => {
    if (!matchData || !matchData.innings || matchData.innings.length === 0) return;

    const innings = matchData.innings;
    const currentInnings = innings.length === 2 ? innings[1] : innings[0];

    let price = 50;

    // Base team price based on target score if chasing
    if (innings.length === 2 && currentInnings === innings[1]) {
      const targetScore = innings[0]?.score || 0;
      if (targetScore >= 220) price = 70;
      else if (targetScore >= 200) price = 65;
      else if (targetScore >= 180) price = 60;
      else if (targetScore >= 160) price = 55;
    }

    const batsmen = currentInnings.batsmen || [];

    // Calculate score-based price
    batsmen.forEach((player, index) => {
      const score = player.runs || 0;
      price += score * 0.1;

      const out = player.wicketCode && player.wicketCode.toLowerCase() !== '';
      if (out) {
        price *= 0.85; // apply 15% deduction if out
      }
    });

    setTeamPrice(parseFloat(price.toFixed(2)));
  }, [matchData]);

  if (!matchData) return <div className="text-white p-4">Loading Match Data...</div>;

  const innings = matchData.innings;
  const currentInnings = innings.length === 2 ? innings[1] : innings[0];

  const {
    batTeamName,
    bowlTeamName,
    score,
    overs,
    runRate,
    wickets = [],
    batsmen = [],
    bowlers = [],
    partnerships = [],
  } = currentInnings;

  const totalWickets = wickets.length;
  const currentScore = `${score}/${totalWickets}`;
  let highestPartnership = 'N/A';
  if (partnerships && partnerships.length > 0) {
    let maxRuns = 0;
    partnerships.forEach(p => {
      const runs = (p.bat1Runs || 0) + (p.bat2Runs || 0);
      if (runs > maxRuns) {
        maxRuns = runs;
        highestPartnership = `${p.bat1Name} & ${p.bat2Name} - ${runs}`;
      }
    });
  }

  const sixes = batsmen.reduce((acc, bat) => acc + (bat.sixes || 0), 0);
  const fours = batsmen.reduce((acc, bat) => acc + (bat.fours || 0), 0);

  const totalBowlerWickets = bowlers.reduce((acc, b) => acc + (b.wickets || 0), 0);
  const totalBowlerRuns = bowlers.reduce((acc, b) => acc + (b.runs || 0), 0);
  const totalBowlerOvers = bowlers.reduce((acc, b) => acc + parseFloat(b.overs || 0), 0);
  const bowlingEconomy = totalBowlerOvers > 0 ? (totalBowlerRuns / totalBowlerOvers).toFixed(2) : "0.00";

  const dotBalls = bowlers.reduce((acc, b) => acc + (b.dotBalls || 0), 0);
  const totalBalls = parseInt(currentInnings.ballNbr || 0);
  const dotBallPercentage = totalBalls > 0 ? `${((dotBalls / totalBalls) * 100).toFixed(2)}%` : '0%';

  const performanceData = [5, 8, 12, 15, 10, 18, 22, 25, 20, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52];
  const maxValue = Math.max(...performanceData);

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-full bg-gray-900 text-white">

        {/* Score Display */}
        <div className="bg-black p-4 flex justify-between items-center">
          <div>
            <div className="text-gray-400 text-xs mb-1">{batTeamName} | Team Price</div>
            <div className="text-5xl font-bold">₹{teamPrice}</div>
            <div className="text-green-500 text-sm">{matchData.isMatchComplete == true ? "Match is Completed" : "Live Score"}</div>
          </div>
          <div className="bg-gray-700 rounded-full h-16 w-16 flex items-center justify-center">
            {/* Team logo placeholder */}
            <img src="/assets/crciketlogo.jpg" className='rounded-full' alt="" />
          </div>
        </div>

        {/* Performance Graph */}
        <div className="p-4 bg-black">
          <div className="h-40 flex items-end space-x-1">
            {performanceData.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    minHeight: "4px",
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Time period tabs */}
          <div className="flex justify-between mt-2 text-xs text-blue-400">
            <button className="font-bold">Today</button>
            <button>Last -1</button>
            <button>Last -2</button>
            <button>Last -3</button>
            <button>Last -4</button>
          </div>
        </div>

        {/* Real-Time Match Statistics */}
        <div className="p-4 bg-gray-900">
          <h2 className="text-blue-400 text-lg font-bold mb-3">Real-Time Match Statistics</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-400">Current Score</span>
              <span>{currentScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">Overs</span>
              <span>{overs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">Run Rate</span>
              <span>{runRate} RPO</span>
            </div>
          </div>
        </div>

        {/* Team Performance Insights */}
        <div className="p-4 bg-gray-900">
          <h2 className="text-blue-400 text-lg font-bold mb-3">Team Performance Insights</h2>

          <div className="mb-4">
            <h3 className="text-blue-400 mb-2">Team Batting Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Runs Scored</span>
                <span>{score}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Run Rate (CRR)</span>
                <span>{runRate} RPO</span>
              </div>
              <div className="flex justify-between">
                <span>Highest Partnership</span>
                <span>{highestPartnership}</span>
              </div>
              <div className="flex justify-between">
                <span>Sixes</span>
                <span>{sixes}</span>
              </div>
              <div className="flex justify-between">
                <span>Fours</span>
                <span>{fours}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-blue-400 mb-2">Team Bowling Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Wickets Taken</span>
                <span className="text-red-500">{totalBowlerWickets}</span>
              </div>
              <div className="flex justify-between">
                <span>Bowling Economy Rate</span>
                <span>{bowlingEconomy} RPO</span>
              </div>
              <div className="flex justify-between">
                <span>Dot Ball Percentage</span>
                <span>{dotBallPercentage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-1 p-1">
          <button className="bg-red-600 text-white py-3 rounded">Sale</button>
          <button className="bg-green-600 text-white py-3 rounded flex items-center justify-center">
            Buy
          </button>
        </div>
      </div>
    </>
  );
};

export default Teamstats;
