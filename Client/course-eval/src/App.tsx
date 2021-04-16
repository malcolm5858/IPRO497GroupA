import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HistogramWithData } from "./Components/HistogramWithData";
import { Survey } from "./Components/Survey";
import Home from "./Pages/Home";
import { TeacherRatings } from "./Pages/TeacherRatings";
import { CourseRatings } from "./Pages/CourseRatings";
import Launch from "./Pages/Launch";
import { SurveyCreation } from "./Pages/SurveyCreation";
//import { launch } from "./Pages/launch";

function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/Survey/:studentId/:name/:surveyId/:className"
          children={<Survey />}
        />
        <Route exact path="/Home/:id/:name/:type" component={Home} />
        <Route exact path="/Test" component={SurveyCreation} />
        <Route path="/" component={Launch} />
      </Switch>
    </Router>
  );
}

export default App;
