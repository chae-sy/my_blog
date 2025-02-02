import { useEffect, useState } from "react";
import { getPostDates } from "../path/to/getPosts"; // Adjust path

const Calendar = () => {
  const [postDates, setPostDates] = useState<string[]>([]);

  useEffect(() => {
    getPostDates().then(setPostDates);
  }, []);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return (
    <div className="calendar">
      <h3>📅 Post Calendar</h3>
      <div className="grid">
        {[...Array(daysInMonth)].map((_, i) => {
          const date = new Date(today.getFullYear(), today.getMonth(), i + 1)
            .toISOString()
            .split("T")[0];
          return (
            <div key={i} className={`day ${postDates.includes(date) ? "posted" : ""}`}>
              {i + 1}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .calendar {
          text-align: center;
          padding: 10px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
        }
        .day {
          padding: 5px;
          border-radius: 5px;
          text-align: center;
        }
        .posted {
          background-color: lightblue;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
