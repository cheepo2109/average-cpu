import React from 'react';
import { formatTooltip } from '../../utils';
const Tooltip = ({tooltipData, height}) => {
    return (
        tooltipData && (
            <g className="tooltip-group">
                <foreignObject
                        className="tooltip-wrapper"
                        x={tooltipData.x ? tooltipData.x + 10 : -100} 
                        y={tooltipData.y ? tooltipData.y + 10 : -100} 
                        width={200} height={70}>
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