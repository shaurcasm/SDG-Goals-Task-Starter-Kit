import * as d3 from "d3";


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

export function getXScale(width) {
    return d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
}

export function getYScale(data, height) {
    return d3.scaleBand()
        .domain(data.map(datapoint => datapoint.area_name))
        .range([0, height])
        .padding(0.4);
}

function applyAxisStyles(container) {
    container.select(".domain").remove();
    container.selectAll("line").attr("stroke", "rgba(12, 12, 12, 0.2");
    return container.selectAll("text")
        .attr("opacity", 0.5)
        .attr("color", "black")
        .attr("font-size", "0.75rem")
        .each(wrap);
}

export function drawAxis({ container, xScale, yScale, ticks, tickSize, tickFormat, transform}) {
    const scale = xScale || yScale;
    const axisType = xScale ? d3.axisBottom : d3.axisLeft;

    const axis = axisType(scale)
        .ticks(ticks)
        .tickSize(tickSize)
        .tickFormat(tickFormat);
    
    const axisGroup = container.append("g")
        .attr("class", "axis")
        .attr("transform", transform)
        .call(axis);

    return applyAxisStyles(axisGroup);
}

export function drawBar({ container, data, goal, xScale, yScale }) {
    return container.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('data-state', (d, i) => data[i].area_name)
        .attr('data-index', (d, i) => data[i].chartdata.find(datum => datum.name === goal)?.value)
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', (d, i) => yScale(data[i].area_name))
        .attr('width', 0)
        .transition()
        .duration(750)
        .attr('width', (d, i) => xScale(data[i].chartdata.find(datum => datum.name === goal)?.value))
        .attr('height', yScale.bandwidth())
        .style('fill', '#33adff');
}