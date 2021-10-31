import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import data2018 from "../../data/2018.json";
import data2019 from "../../data/2019.json";
import data2020 from "../../data/2020.json";

const dataTable = {
  2018: data2018,
  2019: data2019,
  2020: data2020
}

function wrap() {
  const textWidth = 90;
  var self = d3.select(this),
    textLength = self.node().getComputedTextLength(),
    text = self.text();

    while(textLength > (textWidth) && text.length > 0) {
      text = text.slice(0, -1);
      self.text(text + '...');
      textLength = self.node().getComputedTextLength();
    }
}

export default function Chart({ year, goal, dimensions }) {
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const data = useMemo(() => dataTable[year], [year]);
  const svgWidth = useMemo(() => width + margin.left + margin.right, [margin.left, margin.right, width]);
  const svgHeight = useMemo(() => height + margin.top + margin.bottom, [height, margin.bottom, margin.top]);

  useEffect(() => {
    
    const yScale = d3.scaleBand()
      .domain(data.map(datapoint => datapoint.area_name))
      .range([0, height])
      .padding(0.4);

    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    // Create root container where we append all other chart elements.
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();  // Clear svg content before adding new elements

    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Add x grid with labels
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickSize(-height);
    
    const xAxisGroup = svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    
    xAxisGroup.select(".domain").remove();
    xAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.2)");
    xAxisGroup.selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "black")
      .attr("font-size", "0.75rem");
    
    // Add Y grid lines with labels
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-width);

    const yAxisGroup = svg.append("g")
      .call(yAxis);
    
    //yAxisGroup.select(".domain").remove();
    yAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.2");
    yAxisGroup.selectAll("text")
      .attr("opacity", "0.5")
      .attr("color", "black")
      .attr("font-size", "0.75rem")
      .each(wrap);

    // Draw the bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('data-state', (d, i) => data[i].area_name)
      .attr('data-sdg-index', (d, i) => data[i].chartdata.find(datum => datum.name === goal)?.value)
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d, i) => yScale(data[i].area_name))
      .attr('width', (d, i) => xScale(data[i].chartdata.find(datum => datum.name === goal)?.value))
      .attr('height', yScale.bandwidth())
      .style('fill', '#33adff')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width, goal])

  return (
    <svg className="chart" ref={svgRef} width={svgWidth} height={svgHeight} />
  );
}
