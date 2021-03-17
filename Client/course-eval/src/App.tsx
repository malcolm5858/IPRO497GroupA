import React from "react";
import { HistogramWithData } from "./Components/HistogramWithData";
import { Survey } from "./Components/Survey";
import Home from "./Pages/Home";

function App() {
  return (
    <HistogramWithData
      title="Class Average"
      data={[
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
      ]}
    />
  );
}

export default App;
