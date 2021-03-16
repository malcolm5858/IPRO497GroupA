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

// ROUTES
app.post("/surveyResponse", async (req, res) => {
  try {
    console.log(req.body);

    MongoClient.connect(
      db_url,
      function (
        err: any,
        client: { db: (arg0: string) => any; close: () => void }
      ) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(db_name);
        const responses = db.collection("Responses");
        responses.insertOne(req.body, function (err: any, result: any) {
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

app.get("/teacherNames", async (req, res) => {
  try {
    var results;

    MongoClient.connect(db_url, async function (err: any, client: any) {
      assert.equal(null, err);

      const db = client.db(db_name);
      const professors = db.collection("Professors");

      results = await professors.find({}).toArray();

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

app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
