import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HistogramWithData } from "./Components/HistogramWithData";
import { Survey } from "./Components/Survey";
import Home from "./Pages/Home";
import { TeacherRatings } from "./Pages/TeacherRatings";
import { CourseRatings } from "./Pages/CourseRatings";
import { Login } from "./Pages/Login";
import Launch from "./Pages/Launch";
import { SurveyResponses } from "./Pages/SurveyResponses";
import { SurveyCreation } from "./Pages/SurveyCreation";
import TeacherView from "./Pages/TeacherView";
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
        <Route
          path="/SurveyResponses/:course_id/:prof_id/:term"
          component={SurveyResponses}
        />
        <Route
          exact
          path="/CreateSurvey/:teacherId/:classId/:term"
          component={SurveyCreation}
        />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/View/:teacherId" component={TeacherView} />
        <Route path="/" component={Launch} />
      </Switch>
    </Router>
  );
}

export default App;
