import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
const Area = ({ data, areaGenerator, initialData }) => {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    select(node)
        .append('path')
        .datum(initialData)
        .attr('id', 'area')
        .attr('fill', "rgba(70,130,180,0.4)")
        .attr('d', areaGenerator);
  },[])//eslint-disable-line
  
  useEffect(()=> {
    select('#area')
      .datum(data)
      .attr('d', areaGenerator);
  },[data, areaGenerator])

 return <g className="area-group" ref={ref} />;

}

export default Area;
