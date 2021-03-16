import React from "react";
import { HistogramWithData } from "./Components/HistogramWithData";
import { Survey } from "./Components/Survey";
import Home from "./Pages/Home";
import { TeacherRatings } from "./Pages/TeacherRatings";

function App() {
  return (
    <TeacherRatings
      professor_id="60510944bb729c5f71c95714"
      professor_name="Bob"
    />
  );
}

export default App;
