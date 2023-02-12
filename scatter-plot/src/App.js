import { useState, useRef, useEffect } from "react";
import * as d3 from "d3"; // we will need d3.js
import sampleData from './sample-test.json';
import chroma from 'chroma-js';
import './App.css';
import { Tooltip } from "./Tooltip";

const colors = chroma.scale(['red', 'blue', 'green']).mode('lch').colors(14);

const data = sampleData.xumap.map((x, i) => ({
  x,
  y: sampleData.yumap[i],
  type: sampleData.celltype[i],
  name: sampleData.cellid[i]
}));

const colorMap = sampleData.celltypes.slice(0, -1).map((x,i) => ({
  key: x,
  value: colors[i],
  cellnum: sampleData.celltypenums[i],
  cellpercent: sampleData.celltypepercents[i]
}));

// Set up the dimensions of the scatter plot
const width = 700;
const height = 500;
const padding = 50;

const App = () => {
  const svgRef = useRef(null);
  const legendRef = useRef(null);

  const [hovered, setHovered] = useState({ xPos: 0, yPos: 0, type: null, name: null });

  useEffect(() => {
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.x)-1, d3.max(data, d => d.x)+1])
      .range([padding, width - padding]);
  
    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.y)-1, d3.max(data, d => d.y)+1])
      .range([height - padding, padding]);
  
    
    const svg = d3.select(svgRef.current);
    const legend = d3.select(legendRef.current);
  
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      const data = d3.select(this).data()[0];
      setHovered({ xPos: xScale(data.x), yPos: yScale(data.y), type: data.type, name: data.name });
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
    } 

    var mouseleave = function(d) {
      const data = d3.select(this).data()[0];
      d3.select(this)
        .style("stroke", d => colorMap.find((item) => item.key===data.type).value)
      setHovered({ xPos: 0, yPos: 0, type: null, name: null });
    }
  
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5)
      .style("stroke", d => colorMap.find((item) => item.key===d.type).value)
      .style("fill", d => colorMap.find((item) => item.key===d.type).value)
      .style("fill-opacity", 0.7)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);
  
    const xAxis = d3.axisBottom(xScale)
      .ticks(20);
  
    svg.append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);
    
      const yAxis = d3.axisLeft(yScale)
      .ticks(20);
  
    svg.append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);
  
    legend.selectAll(".legend")
      .data(colorMap)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(10, ${(i+1) * 20})`)
      .append("rect")
      .attr("x", 0)
      .attr("width", 15)
      .attr("height", 15)
      .style("stroke", d => d.value)
      .style("fill-opacity", 0.7)
      .style("fill", d => d.value);
      
    legend.selectAll(".legend")
      .append("text")
      .attr("x", 20)
      .attr("y", 9)
      .attr("dy", ".40em")
      .style("font-size", "10")
      .style("text-anchor", "start")
      .style("fill", d => d.value)
      .style("fill-opacity", 0.7)
      .text(d => `Cell Type:${d.key}; Number of cells :${d.cellnum}; Percent of Cell types:${d.cellpercent}%`);
      
  }, [svgRef, legendRef, hovered]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} />
      <Tooltip InteractionData={hovered} />
      <svg ref={legendRef} width={width} height={height}></svg>
    </>
  );
};

export default App;