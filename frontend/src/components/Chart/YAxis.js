import React, { useEffect, useRef } from 'react';
import { select } from "d3-selection";
import { axisRight } from "d3-axis";
const YAxis = ({ scale, width}) => {
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        const axis = axisRight(scale).tickSize(width).ticks(7);
        select(node)
            .call(axis)
            .call(g => g.selectAll(".tick line")
                        .attr("stroke-opacity", 0.5)
                        .attr("color", "rgba(0,0,0,0.4)"))
            .call(g => g.selectAll(".tick text").attr("x", -20))
            .call(g => g.select(".domain").remove())

    },[scale, width])

    return (
        <g
          ref={ref}
          transform={`translate(0, 0)`}
          className="left axis"
        />
    );
};

export default YAxis;