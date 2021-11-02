import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import indiaTopo from "../../data/india.topo.json";
import { getColorScale, getXScale, drawLegend, drawMap } from "./map.utils";


const colorGroup1 = "#d20f1f";
const colorGroup2 = "#427f39";
const colorGroup3 = "#4217de";

export default function Map({ data, goal, dimensions }) {
  const mapRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = useMemo(() => width + margin.left + margin.right, [margin.left, margin.right, width]);
  const svgHeight = useMemo(() => height + margin.top + margin.bottom, [height, margin.bottom, margin.top]);

  const mean = useMemo(() => d3.mean(data.map(datapoint => datapoint.chartdata.find(datum => datum.name === goal)?.value)), [data, goal]);
  const xScale = useMemo(() => getXScale(mean, width), [mean, width]);
  const colorScale = useMemo(() => getColorScale(mean, colorGroup1, colorGroup2, colorGroup3), [mean]);

  useEffect(() => {
    // Create root container where we append all other chart elements.
    const mapElement = d3.select(mapRef.current);
    mapElement.selectAll("#map-legend").remove();  // Clear svg content before adding new elements

    drawLegend({
      container: mapElement,
      mean,
      xScale,
      colorScale
    });
  }, [colorScale, mean, xScale]);

  useEffect(() => {
    // Create root container where we append all other chart elements.
    const mapElement = d3.select(mapRef.current);
    mapElement.selectAll("path").remove();  // Clear svg content before adding new elements
    mapElement.selectAll(".tooltip").remove();

    drawMap({
      container: mapElement,
      geojson: topojson.feature(indiaTopo, indiaTopo.objects.india),
      width: svgWidth,
      height: svgHeight,
      data,
      goal,
      colorScale
    });
  }, [colorScale, data, goal, svgHeight, svgWidth])

  return (
    <svg ref={mapRef} className="map" width={svgWidth} height={svgHeight} />
  );
}
