import React, { useEffect, useState, Fragment } from "react";
import "../css/Rating.css";

interface Props {
  size: number;
  rating: number;
  id: String;
  sendData: Function;
  description: string;
}

const Rating = (props: Props) => {
  const { size, rating, sendData, description, id } = props;
  const [offset, setOffset] = useState(0);

  const center = size / 2;
  const radius = (size * 5) / 12;
  const width = size / 6;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const ratingOffset = ((5 - rating) / 5) * circumference;
    setOffset(ratingOffset);
  }, [setOffset, circumference, rating, offset]);

  return (
    <div onClick={() => sendData(id)}>
      <svg className="svg" width={size} height={size}>
        <circle
          className="svg-circle-bg"
          stroke="#cccccc"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={width}
        />
        <circle
          className="svg-circle"
          stroke="#ffc821"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={width}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />

        <text
          className="svg-circle-text"
          style={{ fontSize: size / 4 }}
          x={`${center}`}
          y={`${center + size / 16}`}>
          {rating.toFixed(1)}
        </text>
      </svg>
    </div>
  );
};

export default Rating;
