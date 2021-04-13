import { ResponsiveBar } from "@nivo/bar";
import React, { useEffect, useState } from "react";

/* Data goes in this form 
{ term: "Fall 2020", Rating: 4.5 },
        { term: "Spring 2020", Rating: 4.3 },
        { term: "Fall 2021", Rating: 2.2 },
        { term: "Spring 2022", Rating: 2.2 },
        { term: "Fall 2023", Rating: 5.0 },
        { term: "Spring 2023", Rating: 4.3 },
        { term: "Fall 2024", Rating: 2.2 },
        { term: "Spring 2024", Rating: 2.2 },
        { term: "Fall 2025", Rating: 5.0 },
        { term: "Spring 2025", Rating: 4.3 },
        { term: "Fall 2026", Rating: 2.2 },
        { term: "Spring 2026", Rating: 2.2 },
        { term: "Fall 2027", Rating: 5.0 },
        { term: "Spring 2027", Rating: 4.3 },
        { term: "Fall 2028", Rating: 2.2 },
        { term: "Spring 2028", Rating: 2.2 },

*/
interface histogramProps {
  title: string;
  data: any;
}

export function HistogramWithData(props: histogramProps) {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(true);
    console.log(props);
  }, [props]);

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
