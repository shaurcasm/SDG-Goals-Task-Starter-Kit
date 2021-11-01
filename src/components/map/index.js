import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import data2018 from "../../data/2018.json";
import data2019 from "../../data/2019.json";
import data2020 from "../../data/2020.json";
import indiaTopo from "../../data/india.topo.json";

const dataTable = {
  2018: data2018,
  2019: data2019,
  2020: data2020
}

export default function Map({ year, goal, dimensions }) {
  const mapRef = useRef(null);
  const { width, height, margin } = dimensions;
  const data = useMemo(() => dataTable[year], [year]);
  const svgWidth = useMemo(() => width + margin.left + margin.right, [margin.left, margin.right, width]);
  const svgHeight = useMemo(() => height + margin.top + margin.bottom, [height, margin.bottom, margin.top]);

  const mean = useMemo(() => d3.mean(data.map(datapoint => datapoint.chartdata.find(datum => datum.name === goal)?.value)), [data, goal]);

  useEffect(() => {
    // Create root container where we append all other chart elements.
    const svgEl = d3.select(mapRef.current);
    svgEl.selectAll("*").remove();  // Clear svg content before adding new elements

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    const projection = d3.geoIdentity()
      .reflectY(true)
      .fitExtent([[10, 10], [svgWidth,svgHeight]],topojson.feature(indiaTopo, indiaTopo.objects.india))

    const path = d3.geoPath().projection(projection);

    const xScale = d3.scaleLinear()
      .domain([0, mean, 99, 100])
      .rangeRound([width - 80, width - 40, width, width + 40]);
    
    const color = d3.scaleThreshold()
      .domain([mean, 99])
      .range(['red', 'green', 'blue']);

    const xAxis = d3.axisBottom(xScale)
      .tickSize(12)
      .tickFormat(x => Math.round(x) + '%')
      .tickValues([0, mean, 99, 100]);

    const g = svgEl.append('g')
      .attr('class', 'key')
      .attr('id', 'legend')
      .attr('transform', 'translate(0,40)');
    
    g.selectAll('rect')
      .data(color.range().map(d => {
        d = color.invertExtent(d);
        if(!d[0]) d[0] = xScale.domain()[0]
        if(!d[1]) d[1] = xScale.domain().at(-1)
        return d;
      }))
      .enter()
      .append('rect')
      .attr('height', 8)
      .attr('x', d => xScale(d[0]))
      .attr('width', d => xScale(d[1]) - xScale(d[0]))
      .attr('fill', d => color(d[0]));

    g.append('text')
      .attr('class', 'caption')
      .attr('x', xScale.range()[0])
      .attr('y', -6)
      .attr('fill', '#000')
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold');

    g.call(xAxis)
      .select('.domain').remove();
    
    svgEl.append('g')
      .attr('class', 'states')
      .selectAll('path')
      .data(topojson.feature(indiaTopo, indiaTopo.objects.india).features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('data-area-code', d => d.id)
      .attr('data-sdg', d => {
        let result = data.find(datum => datum.area_code === d.id)
        if(result) {
          return result.chartdata.find(datum => datum.name === goal)?.value
        }
        console.log("Could not find Data for: ", d.id);
        return 1;
      })
      .attr('fill', d => {
        let result = data.find(datum => datum.area_code === d.id)
        if(result) {
          return color(result.chartdata.find(datum => datum.name === goal)?.value)
        }
        
        // Could not find a match for that place id
        return 0;
      })
      .attr('d', path)
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 0.9);
        tooltip.html(() => {
          let result = data.find(datum => datum.area_code === d.id);
          if(result) 
            return `${result.area_name}: ${result.chartdata.find(datum => datum.name === goal)?.value}%`;
          
          return 1;
        })
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
  }, [data, goal, height, margin.left, margin.top, mean, svgHeight, svgWidth, width])

  return (
    <svg ref={mapRef} className="map" width={svgWidth} height={svgHeight} />
  );
}
