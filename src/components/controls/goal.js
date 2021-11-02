import React from "react";
import { GOALS_LIST } from "../../config";

export default function Goal({ goal, selectGoal }) {
  return (
    <div className="goal">
      <h4>Select Goal</h4>
      <select  defaultValue={goal} onChange={event => selectGoal(event.target.value)}>
        {GOALS_LIST.map(goal => (
          <option key={goal.id} value={goal.id}>{goal.name}</option>
        ))}
      </select>
    </div>
  );
}
