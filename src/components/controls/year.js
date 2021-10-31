import React from "react";
import { YEARS } from "../../config";

export default function Year({ year, selectYear }) {
  return (
    <div className="year">
      <select defaultValue={year} onChange={event => selectYear(event.target.value)}>
        <option>Select Year</option>
        {YEARS.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
