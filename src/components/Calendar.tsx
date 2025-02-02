import { useEffect, useState } from "react";
import { calendarDayStyle } from "src/styles/calendar"; // Adjust path

interface CalendarProps {
  postDates: string[]; // Array of post dates in YYYY-MM-DD format
}

const Calendar = ({ postDates }: CalendarProps) => {
  // Directly use the postDates prop instead of fetching inside useEffect
  const isPostDate = (date: string) => {
    return postDates.includes(date); // Check if the date is in the postDates array
  };

  const currentMonth = new Date(); // Get the current month and year
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(); // Get the number of days in the current month

  return (
    <div className="calendar">
      <h3>Post Calendar</h3>
      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; // Format as YYYY-MM-DD
          
          return (
            <div
              key={index}
              style={isPostDate(date) ? calendarDayStyle.hasPost : {}}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
