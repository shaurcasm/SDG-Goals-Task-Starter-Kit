import React from "react";
import { GOALS_LIST } from "../../config";

export default function Goal({ goal, selectGoal }) {
  return (
    <div className="goal">
      <select  defaultValue={goal} onChange={event => selectGoal(event.target.value)}>
        <option>Select Goal</option>
        {GOALS_LIST.map(goal => (
          <option key={goal.id} value={goal.id}>{goal.name}</option>
        ))}
      </select>
    </div>
  );
}
