import React, { useEffect, useRef} from 'react';
import { select } from 'd3-selection';

const Line = ({ data, lineGenerator, initialData }) => {
  const ref = useRef(null);
  
  useEffect(()=> {
    const node = ref.current;
    select(node)
        .append('path')
        .datum(initialData)
        .attr('id', 'line')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 3)
        .attr('fill', 'none')
        .attr('d', lineGenerator);

  },[])//eslint-disable-line

  useEffect(()=> {
      select('#line')
        .datum(data)
        .attr('d', lineGenerator);
  },[data, lineGenerator])

 return <g className="line-group" ref={ref} />;
 
}

export default Line;