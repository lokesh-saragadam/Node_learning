import react, { useMemo } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';


export default function MonthAnaly(data1){
    const groupedData = data1.data1;
    console.log("Grouped Data",groupedData);

    const chartData = useMemo(() => {
    // 1. Get all the keys (e.g., ['August 2026', 'July 2026', ...])
    const keys = Object.keys(groupedData || {});
    if (keys.length === 0) return [];

    // 2. Convert keys to Date objects so we can find the oldest and newest months
    const dates = keys.map(key => new Date(key));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const data = [];
    
    // 3. Start at the oldest month
    let currentIterDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const endIterDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    // 4. Loop forward month-by-month until we hit the newest month
    while (currentIterDate <= endIterDate) {
      // Reconstruct the exact key format (e.g., "August 2026")
      // We enforce 'en-US' so it perfectly matches the English month names in your data
      const monthName = currentIterDate.toLocaleString('en-US', { month: 'long' });
      const year = currentIterDate.getFullYear();
      const exactKey = `${monthName} ${year}`; 

      // Create a shorter label for the X-axis (e.g., "Aug 2026") so it looks cleaner
      const shortMonth = currentIterDate.toLocaleString('en-US', { month: 'short' });
      
      data.push({
        displayLabel: `${shortMonth} ${year}`, // Used for the chart X-axis
        exactKey: exactKey,                    // Used for the tooltip (optional)
        problemsSolved: groupedData[exactKey] || 0 // Lookup the value, default to 0 if missing
      });

      // Move to the next month
      currentIterDate.setMonth(currentIterDate.getMonth() + 1);
    }

    return data;
  }, [groupedData]);

  // Calculate dynamic width based on data length (60px per month)
  const minChartWidth = chartData.length * 60; 

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Problems Solved Over Time</h2>
      
      {/* Scrollable Window */}
      <div style={{ overflowX: 'auto', overflowY: 'hidden', width: '100%' }}>
        
        {/* Inner container that stretches based on data size */}
        <div style={{ minWidth: `${Math.max(minChartWidth, 600)}px`, height: '300px' }}>
          
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="displayLabel" 
                tick={{ fontSize: 12 }} 
                tickMargin={10} 
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                labelFormatter={(label, payload) => {
                  // Show the full "August 2026" in the tooltip hover
                  if (payload && payload.length > 0) {
                    return payload[0].payload.exactKey; 
                  }
                  return label;
                }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="problemsSolved" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
                name="Problems Solved" 
              />
            </LineChart>
          </ResponsiveContainer>
          
        </div>
      </div>
    </div>
  );
}