import { ResponsiveBar } from "@nivo/bar";
import React from "react";

interface histogramProps {
  title: string;
  data: any;
}

export function HistogramWithData(props: histogramProps) {
  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>{props.title}</h1>
      <div style={{ height: 400 }}>
        <ResponsiveBar
          data={props.data}
          keys={["Rating"]}
          indexBy="term"
          maxValue={5.0}
          colors={{ scheme: "nivo" }}
          enableLabel={true}
          margin={{ top: 60, right: 80, bottom: 70, left: 80 }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
          }}
          axisLeft={null}
        />
      </div>
    </div>
  );
}
