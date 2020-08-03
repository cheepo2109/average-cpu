import React from 'react';
import { formatTooltip } from '../../utils';
const Tooltip = ({tooltipData, height, width}) => {
    const tooltipWidth = 200;
    const tooltipHeight = 70

    const xPosition = () => {
        if(!tooltipData.x) return -100;
        //if tooltip is close to the end, revert it, so it doesn't go beyond chart
        if(width - tooltipData.x <= tooltipWidth){
            return tooltipData.x - tooltipWidth - 10;
        }
        return tooltipData.x + 10;
    }

    const yPosition = () => {
        if(!tooltipData.y) return -100;
        return tooltipData.y + 10;
    }
    
    return (
        tooltipData && (
            <g className="tooltip-group">
                <foreignObject
                        className="tooltip-wrapper"
                        x={xPosition()}
                        y={yPosition()} 
                        width={tooltipWidth} height={tooltipHeight}>
                    <div className="tooltip">
                        <p className="tooltip__load">
                            {
                                tooltipData.load && 
                                `Average load: ${tooltipData.load}`
                            }
                        </p>
                        <p className="tooltip__time">
                            {
                                tooltipData.timestamp &&
                                `Time: ${formatTooltip(tooltipData.timestamp)}`
                            }
                        </p>
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