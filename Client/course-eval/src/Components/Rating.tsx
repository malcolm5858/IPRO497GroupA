import React, { Fragment } from 'react';
import '../css/Rating.css';

const Rating = (props: any) => {
    const {size, rating} = props;

    const center = size / 2;
    const radius = size * 5 / 12;
    const width = size / 6;
    const circumference = 2 * Math.PI * radius;

    
    return (
        <Fragment>
            <svg className="svg" width={size} height={size}>
                <circle className="svg-circle-bg" stroke='#666666' cx={center} cy={center} r={radius} strokeWidth={width} />
                <circle className="svg-circle" stroke='#ffc821' cx={center} cy={center} r={radius} strokeWidth={width} />
                <text className="svg-circle-text" x={center} y={center}>{rating.toFixed(1)}</text>
            </svg>
        </Fragment>
    );
}

export default Rating;