import React from "react";
import * as d3 from "d3";
import { data } from "./utils";
import "./App.css";
const width = 900;
const height = 1000;
const margin = { top: 200, right: 20, bottom: 20, left: 20 };

const App = () => {
  const innerheight = height - margin.top - margin.bottom;
  const innerwidth = width - margin.left - margin.right;
  // state to hold zoom cordinates
  const [currentZoomCordinates, setCurrentZoomCordinates] = React.useState();
  // ref for svg
  const svgRef = React.useRef();
  const svg = d3.select(svgRef.current);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.date))
    .range([0, innerheight])
    .padding(0.4)
    .paddingOuter(0.4);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([0, innerwidth]);

  if (currentZoomCordinates) {
    const newXScale = currentZoomCordinates.rescaleX(xScale);
    xScale.domain(newXScale.domain());
  }
  // zoom
  const zoomBehavior = d3
    .zoom()
    .scaleExtent([0.5, 5])
    .translateExtent([
      [-100, 0],
      [innerwidth + 100, innerheight],
    ])
    .on("zoom", () => {
      const zoomState = d3.zoomTransform(svg.node());
      setCurrentZoomCordinates(zoomState);
      console.log(zoomState);
    });
  svg.call(zoomBehavior);
  const [hoveredVal, setHoveredVal] = React.useState();
  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        <g transform={`translate(${margin.top}, ${margin.left})`}>
          {/* ticks */}

          {xScale.ticks().map((tickValue) => (
            <g transform={`translate(${xScale(tickValue)}, 0)`}>
              <line y2={innerheight} stroke="#C0C0BB" />
              <text
                y={innerheight + 3}
                dy=".71em"
                style={{ textAnchor: "middle", zIndex: 100 }}
              >
                {tickValue}
              </text>
            </g>
          ))}
          {yScale.domain().map((tickValue) => (
            <g
              transform={`translate(0,${
                yScale(tickValue) + yScale.bandwidth() / 2
              })`}
            >
              <text style={{ textAnchor: "end", fontSize: 8 }} dy=".32em">
                {tickValue}
              </text>
            </g>
          ))}
          {data.map((item) => (
            <>
              <rect
                x={0}
                y={yScale(item.date)}
                width={xScale(item.value)}
                height={yScale.bandwidth()}
                className="mark"
                rx={2.5}
                onMouseOver={() => setHoveredVal(item.date)}
                onMouseLeave={() => setHoveredVal("")}
              ></rect>
              {item.date === hoveredVal && (
                <text
                  x={xScale(item.value)}
                  y={yScale(item.date)}
                  fontSize={8}
                  stroke="purple"
                  className="tooltip"
                  dy={5}
                >
                  {item.value}
                </text>
              )}
            </>
          ))}
        </g>
      </svg>
    </div>
  );
};
export default App;
