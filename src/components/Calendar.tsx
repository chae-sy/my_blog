// src/components/Calendar.tsx
import { useEffect, useState } from "react";
import { getPostDates } from "src/apis/notion-client/getPosts"; // Adjust path
import { calendarDayStyle } from "src/styles/calendar"; // Adjust path

interface CalendarProps {
  postDates: string[]; // Array of post dates in YYYY-MM-DD format
}

const Calendar = ({ postDates }: CalendarProps) => {
  const [postDatesState, setPostDatesState] = useState<string[]>([]);

  useEffect(() => {
    const fetchPostDates = async () => {
      const dates = await getPostDates();
      setPostDatesState(dates);
    };

    fetchPostDates();
  }, []);

  const isPostDate = (date: string) => {
    return postDatesState.includes(date);
  };

  return (
    <div className="calendar">
      <h3>Post Calendar</h3>
      <div className="calendar-grid">
        {Array.from({ length: 30 }).map((_, index) => {
          const date = `2025-02-${index + 1 < 10 ? "0" + (index + 1) : index + 1}`;
          return (
            <div
              key={index}
              style={isPostDate(date) ? calendarDayStyle.hasPost : {}}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
