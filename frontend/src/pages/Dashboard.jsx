// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiBook, FiClock, FiCalendar, FiAlertCircle, FiPlusCircle } from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [pendingProblems, setPendingProblems] = useState(0);
  const [contestProblems, setContestProblems] = useState(0);
  const [dauData, setDauData] = useState([]);
  const [langData, setLangData] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Core stats
    fetch(`${process.env.REACT_APP_BACKEND_URL}/totaluser`)
      .then((res) => res.json()).then(data => setTotalUsers(data.length)).catch(console.error);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/allproblems`)
      .then((res) => res.json()).then(data => setTotalProblems(data.length)).catch(console.error);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/allpendinguserproblems`)
      .then((res) => res.json()).then(data => setPendingProblems(data.length)).catch(console.error);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/allcontestproblem`)
      .then((res) => res.json()).then(data => setContestProblems(data.length)).catch(console.error);
    // Trends: daily active users
    fetch(`${process.env.REACT_APP_BACKEND_URL}/stats/dau`)  // [{date: '2025-04-01', count: 120},...]
      .then((res) => res.json()).then(setDauData).catch(console.error);
    // Language distribution
    fetch(`${process.env.REACT_APP_BACKEND_URL}/stats/lang-distribution`)  // [{name:'Python', value:34},...]
      .then((res) => res.json()).then(setLangData).catch(console.error);
    // Recent activity feed
    fetch(`${process.env.REACT_APP_BACKEND_URL}/activity/recent`)  // [{id, text, time},...]
      .then((res) => res.json()).then(setActivities).catch(console.error);
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

  return (
    <div className="p-8 space-y-8">
      {/* Quick Actions & Alerts */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex space-x-4">
          <Link to="/addproblems" className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            <FiPlusCircle /> <span>Add Problem</span>
          </Link>
          <Link to="/contestproblemform" className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <FiPlusCircle /> <span>Start Contest</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg">
          <FiAlertCircle className="h-5 w-5" />
          <span>2 pending problem approvals</span> {/* could be dynamic */}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <FiUsers/>, label: 'Total Users', value: totalUsers },
          { icon: <FiBook/>, label: 'Total Problems', value: totalProblems },
          { icon: <FiClock/>, label: 'Pending Problems', value: pendingProblems, link: '/pendingproblems', linkText: 'View Pending' },
          { icon: <FiCalendar/>, label: 'Contest Problems', value: contestProblems, link: '/contestproblemform', linkText: 'Add to Contest' },
        ].map(({ icon, label, value, link, linkText }, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                {React.cloneElement(icon, { className: 'h-6 w-6 text-indigo-500' })}
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{label}</h3>
            </div>
            <div className="mt-4 flex-1">
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
            {link && (
              <Link to={link} className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                {linkText}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Charts & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DAU Line Chart */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Daily Active Users</h4>
          <LineChart width={300} height={200} data={dauData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </div>

        {/* Language Pie Chart */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Language Usage</h4>
          <PieChart width={300} height={200}>
            <Pie
              data={langData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label
            >
              {langData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg h-full flex flex-col">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Activity</h4>
          <ul className="flex-1 overflow-y-auto space-y-2">
            {activities.map((act) => (
              <li key={act.id} className="text-gray-800 dark:text-gray-100">
                <span className="font-medium">{act.user}</span> {act.action}
                <div className="text-xs text-gray-500 dark:text-gray-400">{act.time}</div>
              </li>
            ))}
            {activities.length === 0 && <li>No recent activity</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}