import React, { useEffect, useMemo } from "react";
import * as d3 from "d3";
import { getXScale, getYScale, drawAxis, drawBar } from "./chart.utils";


export default function Chart({ data = [], goal, dimensions = {} }) {
  const { width, height, margin } = dimensions;
  const svgWidth = useMemo(() => width + margin.left + margin.right, [margin.left, margin.right, width]);
  const svgHeight = useMemo(() => height + margin.top + margin.bottom, [height, margin.bottom, margin.top]);
  const yScale = useMemo(() => getYScale(data, height), [data, height]);
  const xScale = useMemo(() => getXScale(width), [width]);

  useEffect(() => {
    // Create root container where we append all other chart elements.
    const chartElement = d3.select(".chart-container");
    chartElement.selectAll(".axis").remove();  // Clear svg content before adding new elements

    // Draw X axis
    drawAxis({
      xScale,
      container: chartElement,
      tickSize: -height,
      ticks: 5,
      transform: `translate(0,${height})`
    });

    // Draw Y Axis
    drawAxis({
      yScale,
      container: chartElement,
      tickSize: -width,
    });
  }, [height, margin.bottom, width, xScale, yScale])
    
  useEffect(() => {
    // Create root container where we append all other chart elements.
    const chartElement = d3.select(".chart-container");
    chartElement.selectAll("rect").remove();  // Clear svg content before adding new elements

    drawBar({
      container: chartElement,
      data,
      goal,
      xScale,
      yScale,
    })
  }, [data, goal, xScale, yScale])

  return (
    <svg className="chart" width={svgWidth} height={svgHeight}>
      <g className="chart-container" transform={`translate(${margin.left},${margin.top})`} />
    </svg>
  );
}
