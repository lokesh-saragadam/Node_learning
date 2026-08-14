import react from 'react';
import { ActivityCalendar } from 'react-activity-calendar';

export default function HeatMap(data){
    const DateCount = data.data;
    const formattedData = Object.entries(DateCount).map(([date, count]) => ({
    date,
    count,
    level: Math.min(count, 4) // Maps to color levels 0-4
  }));

  // Sort chronologically (required by the library)
  formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ padding: '20px' }}>
      <ActivityCalendar 
        data={formattedData} 
        theme={{
          light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        }}
        colorScheme="light"
      />
    </div>
  );
}