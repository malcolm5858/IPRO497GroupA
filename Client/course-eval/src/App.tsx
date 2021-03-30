import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HistogramWithData } from "./Components/HistogramWithData";
import { Survey } from "./Components/Survey";
import Home from "./Pages/Home";
import { TeacherRatings } from "./Pages/TeacherRatings";
import { CourseRatings } from "./Pages/CourseRatings";

function App() {

  return (
    <Router>
      <Switch>
        <Route
          path="/Survey/:studentId/:name/:surveyId/:className"
          children={<Survey />}
        />
        <Route exact path="/" children={<Home />} />
      </Switch>
    </Router>
  );
}

export default App;
