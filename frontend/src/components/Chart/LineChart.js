import React, { useRef, useState, useEffect, useLayoutEffect }  from 'react';
import { select, mouse } from "d3-selection";
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, area, curveMonotoneX } from 'd3-shape';
import { max, extent,bisector} from 'd3-array';
import Area from './Area';
import Line from './Line';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Tooltip from './Tooltip';

const LineChart = ({data}) => {

    const ref = useRef(null);
    const svgRef = useRef(null);
    const [ parentWidth, setParentWidth ] = useState(0);
    const [ tooltipData, updateTooltipData] = useState({});
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
  
    useLayoutEffect(()=> {
        const updateParentWidth = () => {
            setParentWidth(ref.current.offsetWidth);
        }
        window.addEventListener('resize', updateParentWidth);
        updateParentWidth();
        return () => window.removeEventListener('resize', updateParentWidth);
    },[]) 

    useEffect(() => {
        if (svgRef !== null) {
          select(svgRef.current)
            .on("mousemove", function() {
                const [x,y] = mouse(this);
                const getDataOnTimeline = (mx) => {
                    const bisectDate = bisector(d => d.timestamp).right;
                    const date = xScale.invert(mx).getTime();
                    const index = bisectDate(data, date, 1);
                    const a = data[index - 1];
                    const b = data[index];
                    return a && b && (date - a.timestamp > b.timestamp - date) ? b : a;
                }
                const timelineData = getDataOnTimeline(x);
                if(timelineData){
                    updateTooltipData({
                        x,y,
                        ...timelineData
                    })
                }
            })
            .on("mouseout", function(){
                updateTooltipData({});
            });
        }
      }, [svgRef, data, xScale]);

    return (
        <div ref={ref} style={{width:"100%"}}>
            <svg
                ref={svgRef}
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
                    <Tooltip tooltipData={tooltipData} width={width} height={height}/>
                </g>
            </svg>
        </div>
    );
};

export default LineChart;