import React, { Fragment, useEffect, useRef} from 'react';
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
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', lineGenerator);

  },[])//eslint-disable-line

  useEffect(()=> {
      select('#line')
        .datum(data)
        .attr('d', lineGenerator);
  },[data, lineGenerator])

 return(
   <Fragment>
    <g className="line-group" ref={ref} />;
   </Fragment>
 )
}

export default Line;
