import React, { useEffect, useRef } from 'react';
import { select } from "d3-selection";
import { axisTop } from "d3-axis";
import { timeMinute } from 'd3-time';
import { formatTick } from '../../utils';
const XAxis = ({ scale, height }) => {
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        const axis = axisTop(scale)
            .tickSize(height)
            .tickFormat(formatTick)
            .ticks(timeMinute);
        
        select(node)
            .call(axis)
            .call(g => g.selectAll(".tick line")
            .attr("stroke-opacity", 0.5)
            .attr("color", "rgba(0,0,0,0.4)"))
            .call(g => g.selectAll(".tick text").attr("y", 15))
            .call(g => g.select(".domain").remove());
            
    },[scale, height])

    return (
        <g
          ref={ref}
          transform={`translate(0, ${height})`}
          className="bottom axis"
        />
    );
};

export default XAxis;