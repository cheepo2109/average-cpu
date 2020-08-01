import React, { useRef, useState, useLayoutEffect }  from 'react';
import { select, mouse } from "d3-selection";
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, area, curveMonotoneX } from 'd3-shape';
import { max, extent,bisectRight } from 'd3-array';
import Area from './Area';
import Line from './Line';
import XAxis from './XAxis';
import YAxis from './YAxis';

const LineChart = ({data}) => {
    const ref = useRef(null);
    const svgRef = useRef(null);
    const [ parentWidth, setParentWidth ] = useState(0);

    useLayoutEffect(()=> {
        const updateParentWidth = () => {
            setParentWidth(ref.current.offsetWidth);
        }
        window.addEventListener('resize', updateParentWidth);
        updateParentWidth();
        return () => window.removeEventListener('resize', updateParentWidth);
    },[])

    const margins = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    };
  
    const width = parentWidth - margins.left - margins.right;
    const height = 400 - margins.top - margins.bottom;



    const xScale = scaleTime()
        .domain(extent(data, d => d.timestamp))
        .range([0, width])



    const maxLoad = max(data, d => d.load);
    const maxDomain = (maxLoad && maxLoad > 1) ? maxLoad : 1;

    const yScale = scaleLinear()
        .domain([0,maxDomain])
        .range([height, 0])
        .nice();
  
    const lineGenerator = line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(d.load))
        .curve(curveMonotoneX);
    
    const areaGenerator = area()
        .x(d => xScale(d.timestamp))
        .y0(height)
        .y1(d => yScale(d.load))
        .curve(curveMonotoneX);

    const initialData = [{
        timestamp: "",
        load: 0
        }];
    const onMouseMove = (e) => {
        const coords = [e.screenX, e.screenY ];
        const date = xScale.invert(coords[0]);
        const i = bisectRight(data, date);
        const newI = i === data.length ? data.length-1 : i;

        console.log(data[newI]);
    }
    return (
        <div ref={ref} style={{width:"100%"}}>
            <svg
                ref={svgRef}
                onMouseMove={onMouseMove}
                className="lineChartSvg"
                width={width + margins.left + margins.right}
                height={height + margins.top + margins.bottom}>
                <g transform={`translate(${margins.left}, ${margins.top})`}>
                    <XAxis scale={xScale} height={height}/>
                    <YAxis scale={yScale} width={width}/>
                    <Line 
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        initialData={initialData}
                        lineGenerator={lineGenerator} 
                        width={width} height={height} />
                    <Area 
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        initialData={initialData}
                        areaGenerator={areaGenerator}
                        width={width} height={height} />
                </g>
            </svg>
        </div>
    );
};

    // const data = [
    //     { name: '1596207778839', value: 0.35 },
    //     { name: '1596207783842', value: 0.33 },
    //     { name: '1596207788846', value: 0.44 },
    //     { name: '1596207793849', value: 0.52 },
    //     { name: '1596207798854', value: 0.61 },
    //     { name: '1596207803857', value: 0.76 },
    //     { name: '1596207808861', value: 0.42 },
    //     { name: '1596207813864', value: 0.54 },
    //     { name: '1596207818865', value: 0.42 },
    //     { name: '1596207823868', value: 0.63 },
    //     { name: '1596207828870', value: 0.74 },
    //     { name: '1596207833872', value: 0.46 },
    // ];
export default LineChart;