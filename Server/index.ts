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
interface CourseRatingsData {
  department: String;
  courseNumber: number;
  overall_rating: number;
  profBreakdown: { rating: number; description: String }[];
  termBreakdown: { term: String; Rating: number }[];
}

interface teacherRatingsData {
  professor_name: String;
  overall_rating: number;
  courseBreakdown: { rating: number; description: String }[];
  termBreakdown: { term: String; Rating: number }[];
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
      var termRatings: any[][] = [];

      courseResponse.forEach((element: any) => {
        var prof = element.professor_name;
        var term = element.semester;
        if (profNames.length == 0 || profNames.indexOf(prof) == -1) {
          profNames.push(prof);
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
      var courseRatings: any[][] = [];
      var termNames: any[] = [];
      var termRatings: any[][] = [];

      courseResponse.forEach((element: any) => {
        var course = element.course_department + " " + element.course_number;
        var term = element.semester;
        if (courseNames.length == 0 || courseNames.indexOf(course) == -1) {
          courseNames.push(course);
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

app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

function renameKey(obj: any, oldKey: any, newKey: any) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}
