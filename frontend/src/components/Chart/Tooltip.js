import React from 'react';
import { formatTooltip } from '../../utils';
const Tooltip = ({tooltipData, height}) => {
    return (
        tooltipData && (
            <g className="line-group">
                <foreignObject
                        x={tooltipData.x ? tooltipData.x + 10 : 0} 
                        y={tooltipData.y ? tooltipData.y + 10 : 0} 
                        width={100} height={50}>
                    <div>
                        <div>
                            {tooltipData.load}
                        </div>
                        <div>
                            {tooltipData.timestamp && formatTooltip(tooltipData.timestamp)}
                        </div>
                    </div>
                </foreignObject>
                <line 
                    stroke="rgba(0,0,0,0.4)" 
                    x1={tooltipData.x}
                    x2={tooltipData.x}
                    y1={0}
                    y2={height}/>
            </g>
        )
    )
};

export default Tooltip;