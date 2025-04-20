import React from "react";

const LeaderboardPage = () => {
  const leaderboard = [
    { name: "Alice", solved: 5, rank: 1 },
    { name: "Bob", solved: 4, rank: 2 },
    { name: "Charlie", solved: 3, rank: 3 },
    // Add more users for demonstration
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Rank</th>
              <th className="py-2">User Name</th>
              <th className="py-2">Solved Problems</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 text-center">{user.rank}</td>
                <td className="py-2 text-center">{user.name}</td>
                <td className="py-2 text-center">{user.solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
