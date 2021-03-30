import React from "react";
import { HistogramWithData } from "./Components/HistogramWithData";
import { Survey } from "./Components/Survey";
import Home from "./Pages/Home";
import { TeacherRatings } from "./Pages/TeacherRatings";
import { CourseRatings } from "./Pages/CourseRatings";

function App() {
  //return <Home />;
  return <CourseRatings
    course_id={"38b9bece1256"}
    department={"CS"}
    course_number={430}
  />;
}

export default App;
