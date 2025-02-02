// src/styles/calendar.ts

export const calendarDayStyle = {
  hasPost: {
    backgroundColor: "#ffd700", // Highlight color
    fontWeight: "bold",
    borderRadius: "4px",
    textAlign: "center", // Make sure this is a valid textAlign value
    padding: "5px",
    cursor: "pointer",
  } as React.CSSProperties, // Ensure it's typed as CSSProperties
};
