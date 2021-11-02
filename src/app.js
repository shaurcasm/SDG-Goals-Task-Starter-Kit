import React, { useState, useRef, useMemo } from 'react';
import "./app.scss";
import Goal from "./components/controls/goal";
import Year from "./components/controls/year";
import Chart from "./components/chart";
import Map from "./components/map";
import { useDimensions } from './utils';
import { GOALS_LIST, YEARS } from "./config";
import data2018 from "./data/2018.json";
import data2019 from "./data/2019.json";
import data2020 from "./data/2020.json";

// Consolidated Data in an object table indexed to respective years
const dataTable = {
  2018: data2018,
  2019: data2019,
  2020: data2020
}

function App() {
  const controlRef = useRef(null);
  const [goal, setGoal] = useState(GOALS_LIST[0].id);
  const [data, setData] = useState(dataTable[YEARS[0]]);
  const { width, height } = useDimensions();

  const dimensions = useMemo(() => ({
    width: (width / 2.0) - 140,
    height: height - 210,
    margin: { top: 30, right: 30, bottom: 30, left: 100 }
  }), [width, height]);

  return (
    <div className="App">
      <div className='header'>
        <h1>Social Development Index</h1>
        <div ref={controlRef} className="control">
          <Goal goal={goal} selectGoal={setGoal} />
          <Year onYearChange={(value) => setData(dataTable[value])} />
        </div>
      </div>
      <div className='main'>
        <Chart data={data} goal={goal} dimensions={dimensions} />
        <Map data={data} goal={goal} dimensions={dimensions} />
      </div>
    </div>
  );
}

export default App;
