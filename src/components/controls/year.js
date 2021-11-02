import React from "react";
import { YEARS } from "../../config";

export default function Year({ onYearChange }) {
  return (
    <div className="year">
      <h4>Select Year</h4>
      <select defaultValue={YEARS[0]} onChange={event => onYearChange(event.target.value)}>
        {YEARS.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
