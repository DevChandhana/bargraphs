import React from "react";
import * as d3 from "d3";
import { data } from "./utils";
import "./App.css";
const width = 950;
const height = 1000;
const margin = { top: 200, right: 20, bottom: 20, left: 20 };

const App = () => {
  const innerheight = height - margin.top - margin.bottom;
  const innerwidth = width - margin.left - margin.right;

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

  const [hoveredVal, setHoveredVal] = React.useState();
  return (
    <div>
      <svg width={width} height={height}>
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
                onMouseOver={() => setHoveredVal(item.value)}
                onMouseLeave={() => setHoveredVal("")}
              ></rect>
              {item.value === hoveredVal && (
                <text
                  x={xScale(item.value)}
                  y={yScale(item.date)}
                  fontSize={8}
                  stroke="purple"
                >
                  {hoveredVal}
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
