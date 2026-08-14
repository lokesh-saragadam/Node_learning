import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

export function Difficulty(data) {
  const difficultycounts = { Easy: data.data.easy, Medium: data.data.medium, Hard: data.data.hard };
  
  const chartData = Object.entries(difficultycounts).map(([difficulty, count]) => ({
    difficulty: difficulty,
    count: count
  }));

  const getColor = (difficulty) => {
    if (difficulty === 'Easy') return '#28A745'; 
    if (difficulty === 'Medium' || difficulty === 'Difficult') return '#FFCE56'; 
    if (difficulty === 'Hard') return '#FF6384'; 
    return '#36A2EB'; 
  };

  return (
    // Added flexbox column to center the title above the chart
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="Difficulty">
      
      {/* Centered Title */}
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Leetcode Difficulty</h3>
      
      <div style={{ width: 400, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="difficulty" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Problems Solved">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.difficulty)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function Rating(data) {
  const ratingcounts_dict = data;
  const chartData = Object.entries(ratingcounts_dict.data).map(([rating, count]) => ({ rating, count }));
  
  const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#E83E8C', '#20C997', '#007BFF', '#6610F2', '#FD7E14', '#28A745'  
  ];

  return (
    // Added flexbox column to center the title above the chart
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="Rating">
      
      {/* Centered Title - Moved OUTSIDE ResponsiveContainer */}
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Codeforces Rating</h3>
      
      <div style={{ width: 400, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="count"
              nameKey="rating"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}