import * as d3 from "d3";


/**
 * getColorScale: Function
 * Get Color Scale in relation to provided mean, constant final value and provided color range.
 * @param mean
 * @param colorGroup1,
 * @param colorGroup2,
 * @param colorGroup3
 */
export function getColorScale(mean, colorGroup1, colorGroup2, colorGroup3) {
    return d3.scaleThreshold()
        .domain([mean, 99])
        .range([colorGroup1, colorGroup2, colorGroup3]);
}

/**
 * getXScale: Function
 * Get X Scale in relation to provided mean, width and an optional breakpoint value for view defaulting to 40.
 * @param mean
 * @param width,
 * @param breakpoint,
 */
export function getXScale(mean, width, breakpoint = 40) {
    return d3.scaleLinear()
        .domain([0, mean, 99, 100])
        .rangeRound([width - (breakpoint * 2), width - breakpoint, width, width + breakpoint]);
}

/**
 * drawLegend: Function
 * draws a key/legend that changes according to mean of the data.
 * @param container
 * @param mean
 * @param xScale
 * @param colorScale
 */
export function drawLegend({ container, mean, xScale, colorScale }) {
    const axis = d3.axisBottom(xScale)
        .tickSize(12)
        .tickFormat(x => Math.round(x) + "%")
        .tickValues([0, mean, 99, 100]);

    const legend = container.append("g")
        .attr("id", "map-legend")
        .attr("transform", "translate(0,40)");

    legend.selectAll("rect")
        .data(colorScale.range().map(group => {
            group = colorScale.invertExtent(group); // Get the respective domain values of color groups in range.
            // For edge cases with undefined values
            if(!group[0]) group[0] = xScale.domain()[0]
            if(!group[1]) group[1] = xScale.domain().at(-1) // Last value of the domain.

            return group;
        }))
        .enter()
        .append("rect")
        .attr("height", 8)
        .attr("x", d => xScale(d[0]))
        .attr("width", d => xScale(d[1]) - xScale(d[0]))
        .attr("fill", d => colorScale(d[0]));

    legend.append("text")
        .attr("class", "caption")
        .attr("x", xScale.range()[0])
        .attr("y", -6)
        .attr("fill", "#111")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold");

    return legend.call(axis)
        .select(".domain").remove();
}

const makeTooltip = () => d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("display", "none");

/**
 * drawMap: function
 * Draws the map and fills appropriate colour in states.
 * @param container
 * @param geojson
 * @param width
 * @param height
 * @param data
 * @param goal
 * @param colorScale
 */
export function drawMap({ container, geojson, width, height, data, goal, colorScale }) {
    const projection = d3.geoIdentity()
        .reflectY(true)
        .fitExtent([[5,0], [width,height]], geojson);
    
    const path = d3.geoPath()
        .projection(projection);

    const tooltip = makeTooltip();

    return container.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('data-area-code', d => d.id)
        .attr('data-sdg', d => {
            let result = data.find(datum => datum.area_code === d.id)
            if(result) {
                return result.chartdata.find(datum => datum.name === goal)?.value
            }
            return 1;
        })
        .attr('fill', d => {
            let result = data.find(datum => datum.area_code === d.id)
            if(result) {
                return colorScale(result.chartdata.find(datum => datum.name === goal)?.value)
            }
            // Could not find a match for that place id
            return null;
        })
        .attr('d', path)
        .on('mouseover', (event, d) => {
            tooltip.style('opacity', 0.9)
            .html(() => {
                let result = data.find(datum => datum.area_code === d.id);
                if(result) 
                return `${result.area_name}: ${result.chartdata.find(datum => datum.name === goal)?.value}%`;
                
                return 1;
            })
            .style("display", "block")
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 20}px`);
        })
        .on('mouseout', () => {
            tooltip.style('opacity', 0);
        });
}