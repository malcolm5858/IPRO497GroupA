import express from "express";

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const assert = require("assert");
const cors = require("cors");

// rest of the code remains same
const app = express();
const PORT = 8000;

const db_url = "mongodb://localhost:27017";
const db_name = "studentSurvey";

app.use(cors());
app.use(express.json());

//Types
interface histBreakdown {
  term: String;
  Rating: number;
}

interface SurveyResponsesData {
  department: String;
  course_number: number;
  prof_name: String;
  term: String;
  prof_rating: number;
  course_rating: number;
  survey_questions: string[];
  survey_answers: string[][];
}
interface CourseRatingsData {
  department: String;
  courseNumber: number;
  overall_rating: number;
  course_id: String;
  profBreakdown: { rating: number; description: String; Id: String }[];
  termBreakdown: histBreakdown[];
}

interface teacherRatingsData {
  professor_name: String;
  overall_rating: number;
  teacher_id: String;
  courseBreakdown: { rating: number; description: String; Id: String }[];
  termBreakdown: histBreakdown[];
}

interface teacherViewData {
  name: string;
  surveys: {
    className: string;
    surveyId: string;
    semester: string;
    courseId: string;
  }[];
  studentLinks: { studentName: string; studentLink: string }[][];
}
// ROUTES

app.post("/newSurvey", async (req, res) => {
  try {
    MongoClient.connect(
      db_url,
      async function (
        err: any,
        client: { db: (arg0: string) => any; close: () => void }
      ) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(db_name);
        const professors = db.collection("Professors");
        const professor = await professors.findOne({
          _id: ObjectId(req.body.professorId),
        });
        console.log(professor);
        const courses = db.collection("Courses");
        const course = await courses.findOne({
          _id: ObjectId(req.body.classId),
        });
        console.log(course);

        const data = {
          professor_id: ObjectId(req.body.professorId),
          professor_name: professor.professor_name,
          course_id: ObjectId(req.body.classId),
          course_number: course.course_number,
          course_department: course.department,
          semester: req.body.term,
          professor_made_questions: req.body.newResponses,
        };

        const Surveys = db.collection("Surveys");
        Surveys.insertOne(data, function (err: any, result: any) {
          assert.equal(err, null);
        });

        client.close();
      }
    );

    res.status(201).json({
      status: "ok",
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/surveyResponse", async (req, res) => {
  try {
    console.log(req.body.survey_id);

    MongoClient.connect(
      db_url,
      async function (
        err: any,
        client: { db: (arg0: string) => any; close: () => void }
      ) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(db_name);
        const surveys = db.collection("Surveys");
        const survey = await surveys.findOne({
          _id: ObjectId(req.body.survey_id),
        });
        console.log(survey);

        const data = {
          professor_id: survey.professor_id,
          professor_name: survey.professor_name,
          course_id: survey.course_id,
          course_department: survey.course_department,
          course_number: survey.course_number,
          semester: survey.semester,
          survey_id: survey._id,
          student_id: ObjectId(req.body.student_id),
          professor_rating: req.body.professor_rating,
          class_rating: req.body.class_rating,
          default_questions_responses: req.body.default_questions_responses,
          professor_made_questions: survey.professor_made_questions,
          professor_made_questions_responses:
            req.body.professor_made_questions_responses,
        };

        const responses = db.collection("Responses");
        responses.insertOne(data, function (err: any, result: any) {
          assert.equal(err, null);
        });

        client.close();
      }
    );

    res.status(201).json({
      status: "ok",
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/teacherResults/:prof_id", async (req, res) => {
  try {
    const { prof_id } = req.params;
    var results;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const courses_held = db.collection("Courses_held");
      const surveys = db.collection("Surveys");
      const responses = db.collection("Responses");

      const relevant_courses = (
        await courses_held
          .find({ professor_id: new ObjectId(prof_id) })
          .toArray()
      ).map((a: any) => a._id);
      console.log(relevant_courses);
      const relevant_surveys = (
        await surveys
          .find({ course_held_id: { $in: relevant_courses } })
          .toArray()
      ).map((a: any) => a._id);
      console.log(relevant_surveys);
      results = await responses
        .find({ survey_id: { $in: relevant_surveys } })
        .toArray();
      console.log(results);

      client.close();

      res.status(200).json({
        status: "ok",
        responses: results,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/classResults/:class_id", async (req, res) => {
  try {
    const { class_id } = req.params;
    var relevant_professors;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const courses_held = db.collection("Courses_held");
      const professors = db.collection("Professors");

      const relevant_courses_held = (
        await courses_held.find({ course_id: new ObjectId(class_id) }).toArray()
      ).map((a: any) => a._id);
      console.log(relevant_courses_held);

      relevant_professors = await professors
        .find({ professor_id: { $in: relevant_courses_held } })
        .toArray();
      console.log(relevant_professors);

      client.close();

      res.status(200).json({
        status: "ok",
        responses: relevant_professors,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/classResults/:class_id/:professor_id", async (req, res) => {
  try {
    const { class_id, professor_id } = req.params;
    var relevant_courses_held;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const courses_held = db.collection("Courses_held");

      relevant_courses_held = await courses_held
        .find({
          course_id: new ObjectId(class_id),
          professor_id: new ObjectId(professor_id),
        })
        .toArray();
      console.log(relevant_courses_held);

      client.close();

      res.status(200).json({
        status: "ok",
        responses: relevant_courses_held,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/classResults/:courses_held_id", async (req, res) => {
  try {
    const { courses_held_id } = req.params;
    var results;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const surveys = db.collection("Surveys");
      const responses = db.collection("Responses");

      const relevant_surveys = (
        await surveys
          .find({ course_held_id: { $in: courses_held_id } })
          .toArray()
      ).map((a: any) => a._id);
      console.log(relevant_surveys);
      results = await responses
        .find({ survey_id: { $in: relevant_surveys } })
        .toArray();
      console.log(results);

      client.close();

      res.status(200).json({
        status: "ok",
        responses: results,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/search", async (req, res) => {
  try {
    var professorResults;
    var courseResults;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const professors = db.collection("Professors");
      const courses = db.collection("Courses");

      professorResults = await professors.find({}).toArray();
      courseResults = await courses.find({}).toArray();

      const arr = professorResults;
      const arr2 = courseResults;
      arr.forEach((obj: any) => renameKey(obj, "professor_name", "title"));
      arr.forEach((obj: any) => (obj.type = "professor"));
      //arr2.forEach((obj: any) => renameKey(obj, "course_number", "title"));
      arr2.forEach(
        (obj: any) => (obj.title = obj.department + " " + obj.course_number)
      );
      arr2.forEach((obj: any) => (obj.type = "course"));

      const results = professorResults.concat(courseResults);
      console.log(results);

      client.close();

      res.status(200).json({
        status: "ok",
        responses: results,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});

//New Routes
app.get("/CourseRatings/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;
    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);
      const db = client.db(db_name);
      const responses = db.collection("Responses");
      const courses = db.collection("Courses");

      const courseResponse = await responses
        .find({ course_id: ObjectId(course_id) })
        .toArray();
      const course = await courses.find({ _id: ObjectId(course_id) }).toArray();
      client.close();

      const department = course[0].department;
      const courseNumber = course[0].course_number;
      var profBreakdown = [];
      var termBreakdown = [];
      var profNames: any[] = [];
      var profRatings: any[][] = [];
      var termNames: any[] = [];
      var teacherIds: any[] = [];
      var termRatings: any[][] = [];

      courseResponse.forEach((element: any) => {
        var prof = element.professor_name;
        var term = element.semester;
        if (profNames.length == 0 || profNames.indexOf(prof) == -1) {
          profNames.push(prof);
          teacherIds.push(element.professor_id);
          profRatings.push([element.class_rating]);
        } else {
          const index = profNames.indexOf(prof);
          profRatings[index] = profRatings[index].concat([
            element.class_rating,
          ]);
        }

        if (termNames.length == 0 || termNames.indexOf(term) == -1) {
          termNames.push(term);
          termRatings.push([element.class_rating]);
        } else {
          const index = termNames.indexOf(term);
          termRatings[index] = termRatings[index].concat([
            element.class_rating,
          ]);
        }
      });

      let average = (array: any[]) =>
        Math.round((array.reduce((a, b) => a + b) / array.length) * 100) / 100;

      var overall = average(courseResponse.map((a: any) => a.class_rating));

      for (var i = 0; i < profNames.length; i++) {
        profBreakdown[i] = {
          rating: average(profRatings[i]),
          description: profNames[i],
          Id: teacherIds[i],
        };
      }

      for (var i = 0; i < termNames.length; i++) {
        termBreakdown[i] = {
          term: termNames[i],
          Rating: average(termRatings[i]),
        };
      }

      const data: CourseRatingsData = {
        department: department,
        courseNumber: courseNumber,
        overall_rating: overall,
        course_id: course_id,
        profBreakdown: profBreakdown,
        termBreakdown: termBreakdown,
      };

      res.status(200).json({
        status: "ok",
        responses: data,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/TeacherRatings/:professor_id", async (req, res) => {
  try {
    const { professor_id } = req.params;
    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);
      const db = client.db(db_name);
      const responses = db.collection("Responses");
      const professors = db.collection("Professors");

      const courseResponse = await responses
        .find({ professor_id: ObjectId(professor_id) })
        .toArray();
      const professor = await professors
        .find({ _id: ObjectId(professor_id) })
        .toArray();

      client.close();

      const name = professor[0].professor_name;

      var courseBreakdown = [];
      var termBreakdown = [];
      var courseNames: any[] = [];
      var courseIds: any[] = [];
      var courseRatings: any[][] = [];
      var termNames: any[] = [];
      var termRatings: any[][] = [];

      courseResponse.forEach((element: any) => {
        var course = element.course_department + " " + element.course_number;
        var term = element.semester;
        if (courseNames.length == 0 || courseNames.indexOf(course) == -1) {
          courseNames.push(course);
          courseIds.push(element.course_id);
          courseRatings.push([element.professor_rating]);
        } else {
          const index = courseNames.indexOf(course);
          courseRatings[index] = courseRatings[index].concat([
            element.professor_rating,
          ]);
        }

        if (termNames.length == 0 || termNames.indexOf(term) == -1) {
          termNames.push(term);
          termRatings.push([element.professor_rating]);
        } else {
          const index = termNames.indexOf(term);
          termRatings[index] = termRatings[index].concat([
            element.professor_rating,
          ]);
        }
      });

      let average = (array: any[]) =>
        Math.round((array.reduce((a, b) => a + b) / array.length) * 100) / 100;

      var overall = average(courseResponse.map((a: any) => a.professor_rating));

      for (var i = 0; i < courseNames.length; i++) {
        courseBreakdown[i] = {
          rating: average(courseRatings[i]),
          description: courseNames[i],
          Id: courseIds[i],
        };
      }

      for (var i = 0; i < termNames.length; i++) {
        termBreakdown[i] = {
          term: termNames[i],
          Rating: average(termRatings[i]),
        };
      }

      const data: teacherRatingsData = {
        professor_name: name,
        overall_rating: overall,
        teacher_id: professor_id,
        courseBreakdown: courseBreakdown,
        termBreakdown: termBreakdown,
      };

      res.status(200).json({
        status: "ok",
        responses: data,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/ClickRatings/:id/:type", (req, res) => {
  try {
    const { id, type } = req.params;
    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);
      const db = client.db(db_name);
      const responses = db.collection("Responses");

      var courseResponse: any;
      var data: histBreakdown[] = [];

      var termNames: any[] = [];
      var termRatings: any[][] = [];

      let average = (array: any[]) =>
        Math.round((array.reduce((a, b) => a + b) / array.length) * 100) / 100;

      switch (type) {
        case "Teacher":
          courseResponse = await responses
            .find({ professor_id: ObjectId(id) })
            .toArray();

          courseResponse.forEach((element: any) => {
            var term = element.semester;
            if (termNames.length == 0 || termNames.indexOf(term) == -1) {
              termNames.push(term);
              termRatings.push([element.professor_rating]);
            } else {
              const index = termNames.indexOf(term);
              termRatings[index] = termRatings[index].concat([
                element.professor_rating,
              ]);
            }
          });
          break;
        case "Class":
          courseResponse = await responses
            .find({ course_id: ObjectId(id) })
            .toArray();

          courseResponse.forEach((element: any) => {
            var term = element.semester;
            if (termNames.length == 0 || termNames.indexOf(term) == -1) {
              termNames.push(term);
              termRatings.push([element.class_rating]);
            } else {
              const index = termNames.indexOf(term);
              termRatings[index] = termRatings[index].concat([
                element.class_rating,
              ]);
            }
          });
          break;
      }

      for (var i = 0; i < termNames.length; i++) {
        data[i] = {
          term: termNames[i],
          Rating: average(termRatings[i]),
        };
      }
      res.status(200).json({
        status: "ok",
        responses: data,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/getClasses", async (req, res) => {
  try {
    var classResults;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const classes = db.collection("Courses");

      classResults = await classes.find({}).toArray();

      var results: any[] = [];

      classResults.forEach((element: any) => {
        const className = element.department + " " + element.course_number;
        results.push({ key: className, text: className, value: element._id });
      });
      client.close();

      res.status(200).json({
        status: "ok",
        responses: results,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/getStudents", async (req, res) => {
  try {
    var studentResults;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const students = db.collection("Students");

      studentResults = await students.find({}).toArray();

      var results: any[] = [];

      studentResults.forEach((element: any) => {
        results.push({
          key: element.student_name,
          text: element.student_name,
          value: element._id,
        });
      });
      client.close();

      res.status(200).json({
        status: "ok",
        responses: results,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});
app.get("/getTeacherView/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const profs = db.collection("Professors");
      const surveys = db.collection("Surveys");

      const teacher = await profs.findOne({ _id: ObjectId(teacherId) });
      const selectedSurveys = await surveys
        .find({ professor_id: ObjectId(teacherId) })
        .toArray();
      var surveysIn: {
        className: string;
        surveyId: string;
        semester: string;
        courseId: string;
      }[] = [];
      var links: {
        studentName: string;
        studentLink: string;
      }[][] = [];

      selectedSurveys.forEach((e: any, index: any) => {
        const className = e.course_department + " " + e.course_number;
        surveysIn.push({
          className: className,
          surveyId: e._id,
          semester: e.semester,
          courseId: e.course_id,
        });
        links.push([]);
      });

      var data: teacherViewData = {
        name: teacher.professor_name,
        surveys: surveysIn,
        studentLinks: links,
      };

      res.status(200).json({
        status: "ok",
        responses: data,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/Survey/:SurveyId", async (req, res) => {
  try {
    const { SurveyId } = req.params;
    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);
      const db = client.db(db_name);
      const surveys = db.collection("Surveys");
      const survey = await surveys.find({ _id: ObjectId(SurveyId) }).toArray();

      res.status(200).json({
        status: "ok",
        responses: survey,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});
app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

//New Routes
app.get("/SurveyResponses/:course_id/:prof_id/:term", async (req, res) => {
  try {
    const { course_id, prof_id, term } = req.params;
    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);
      const db = client.db(db_name);
      const responses = db.collection("Responses");

      const courseResponse = await responses
        .find({
          course_id: ObjectId(course_id),
          professor_id: ObjectId(prof_id),
          semester: term,
        })
        .toArray();
      //const course = await courses.find({ _id: ObjectId(course_id) }).toArray();
      client.close();

      const departments = courseResponse[0].course_department;
      const course_numbers = courseResponse[0].course_number;
      const prof_names = courseResponse[0].professor_name;
      const terms = courseResponse[0].semester;
      var survey_question = [
        "On a scale from 1 to 5, how satisfied are you with your instructor for this course?",
        "On a scale from 1 to 5, how satisfied are you with the course material?",
      ];
      var survey_answer: any[][] = [];

      survey_question = survey_question.concat(
        courseResponse[0].professor_made_questions
      );
      courseResponse.forEach((element: any) => {
        var default_answers = element.default_questions_responses;
        var answers = element.professor_made_questions_responses;
        var newArr = default_answers.concat(answers);
        survey_answer.push(newArr);
      });

      let average = (array: any[]) =>
        Math.round((array.reduce((a, b) => a + b) / array.length) * 100) / 100;

      var prof_overall = average(
        courseResponse.map((a: any) => a.professor_rating)
      );
      var course_overall = average(
        courseResponse.map((a: any) => a.class_rating)
      );

      const data: SurveyResponsesData = {
        department: departments,
        course_number: course_numbers,
        prof_name: prof_names,
        term: terms,
        prof_rating: prof_overall,
        course_rating: course_overall,
        survey_questions: survey_question,
        survey_answers: survey_answer,
      };

      res.status(200).json({
        status: "ok",
        responses: data,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});

function renameKey(obj: any, oldKey: any, newKey: any) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}
