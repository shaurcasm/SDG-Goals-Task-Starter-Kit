import React, { useState, useRef, useMemo } from 'react';
import { connect } from "react-redux";
import { changeYear } from './store/actions';
import Goal from "./components/controls/goal";
import Year from "./components/controls/year";
import Chart from "./components/chart";
import Map from "./components/map";
import { useDimensions } from './utils';
import { GOALS_LIST } from "./config";
import "./app.scss";


const headerOffset = 203;
/**
 * App: Functional Component
 * @param data - From redux
 * @param error
 * @param onYearChange - dispatch action
 */
function App({ data, error, onYearChange }) {
  const controlRef = useRef(null);
  const [goal, setGoal] = useState(GOALS_LIST[0].id);
  const { width, height } = useDimensions();

  /*
    Height compensates for the header with title and controls.
    Can improve with header's reference-based offsetHeight compensation
  */
  const dimensions = useMemo(() => ({
    width: (width / 2.0) - 130,
    height: height - (headerOffset + 30 + 30),
    margin: { top: 30, right: 30, bottom: 30, left: 100 }
  }), [width, height]);

  return (
    <div className="App">
      <div className='header'>
        <h1>Social Development Index</h1>
        <div ref={controlRef} className="control">
          <Goal goal={goal} selectGoal={setGoal} />
          <Year onYearChange={onYearChange} />
        </div>
      </div>
      {
        error ? (
          <div className='error'>
            {error}
          </div>
        ) : (
          <div className='main'>
            <Chart data={data} goal={goal} dimensions={dimensions} />
            <Map data={data} goal={goal} dimensions={dimensions} />
          </div>
        )
      }
    </div>
  );
}

const mapStateToProps = state => ({
  data: state.data,
  error: state.error
});

const mapDispatchToProps = dispatch => ({
  onYearChange: (year) => dispatch(changeYear(year))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
