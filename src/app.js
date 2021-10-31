import React, { useState, useRef, useMemo } from 'react';
import "./app.scss";
import Goal from "./components/controls/goal";
import Year from "./components/controls/year";
import Chart from "./components/chart";
import Map from "./components/map";
import useDimensions from './utils/useDimensions';
import { GOALS_LIST, YEARS } from "./config";

// Consolidated Data in an object table indexed to respective years



function App() {
  const controlRef = useRef(null);
  const [goal, setGoal] = useState(GOALS_LIST[0].id);
  const [year, setYear] = useState(YEARS[0]);
  const { width, height } = useDimensions();

  const dimensions = useMemo(() => ({
    width: (width / 2.0) - 140,
    height: height - 204,
    margin: { top: 30, right: 30, bottom: 30, left: 100 }
  }), [width, height]);

  return (
    <div className="App">
      <div className='header'>
        <h1>Social Development Index</h1>
        <div ref={controlRef} className="control">
          <Goal goal={goal} selectGoal={setGoal} />
          <Year year={year} selectYear={setYear} />
        </div>
      </div>
      <div className='main'>
        <Chart year={year} goal={goal} dimensions={dimensions} />
        <Map year={year} />
      </div>
    </div>
  );
}

export default App;
