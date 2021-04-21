import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Button, FormGroup } from "semantic-ui-react";
import { Radio, TextArea, Form } from "formik-semantic-ui-react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
import "../css/Survey.css";
import _ from "lodash";

interface Values {
  survey_id: string;
  student_id: string;
  professor_rating: number;
  prof_comments: string;
  class_rating: number;
  class_comments: string;
  professor_made_questions_responses: string[];
}

interface RouteParams {
  studentId: string;
  name: string;
  surveyId: string;
  className: string;
}

export const Survey: React.FC = () => {
  let { studentId, name, surveyId, className } = useParams<RouteParams>();
  const [questions, setQuestions] = useState([]);
  const [value, setValue] = useState(0);

  const initialValues: Values = {
    survey_id: surveyId,
    student_id: studentId,
    professor_rating: 0,
    class_rating: 0,
    prof_comments: "",
    class_comments: "",
    professor_made_questions_responses: [],
  };

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/Survey/${surveyId}`);
      const jsonData = await response.json();

      const questions = await jsonData.responses[0].professor_made_questions;
      console.log(questions);
      setQuestions(questions);
      console.log(questions);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    console.log("TEst");
    getData();
    setValue((value) => value + 1);
  }, []);

  return (
    <div style={{ backgroundColor: "lightcyan", height: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>{className}</h1>
      <h2 style={{ textAlign: "center", color: "grey" }}>{name}</h2>

      <Container>
        <Row>
          <Col>
            <Formik
              initialValues={initialValues}
              onSubmit={(data, { setSubmitting }) => {
                setSubmitting(true);
                // make async call
                let default_questions_responses = [
                  data.prof_comments,
                  data.class_comments,
                ];
                let output = {
                  survey_id: data.survey_id,
                  student_id: data.student_id,
                  professor_rating: data.professor_rating,
                  class_rating: data.class_rating,
                  default_questions_responses: default_questions_responses,
                  professor_made_questions_responses:
                    data.professor_made_questions_responses,
                };

                fetch("http://localhost:8000/surveyResponse", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(output),
                });
                console.log("submit: ", output);
                setSubmitting(false);
              }}>
              {({ values, handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <div>
                    <FormGroup inline>
                      <label>
                        On a scale from 1 to 5, how satisfied are
                        <br /> you with your instructor for this course?
                      </label>
                      <Radio name="professor_rating" value={1} label="1" />
                      <Radio name="professor_rating" value={2} label="2" />
                      <Radio name="professor_rating" value={3} label="3" />
                      <Radio name="professor_rating" value={4} label="4" />
                      <Radio name="professor_rating" value={5} label="5" />
                    </FormGroup>
                  </div>
                  <TextArea
                    placeholder="Additional Comments"
                    style={{ minHeight: 100 }}
                    name="prof_comments"
                  />

                  <div>
                    <FormGroup inline>
                      <label>
                        On a scale from 1 to 5, how satisfied are <br />
                        you with the course material?
                      </label>
                      <Radio name="class_rating" label="1" value={1} />
                      <Radio name="class_rating" label="2" value={2} />
                      <Radio name="class_rating" label="3" value={3} />
                      <Radio name="class_rating" label="4" value={4} />
                      <Radio name="class_rating" label="5" value={5} />
                    </FormGroup>
                  </div>
                  <TextArea
                    placeholder="Additional Comments"
                    style={{ minHeight: 100 }}
                    name="class_comments"
                  />

                  {questions.map((question: string, index: number) => (
                    <div>
                      <FormGroup inline>
                        <div>
                          <label style={{ fontWeight: "bold" }}>
                            {question}
                          </label>
                        </div>
                      </FormGroup>
                      <TextArea
                        placeholder="Comments"
                        style={{ minHeight: 100 }}
                        name={"professor_made_questions_responses." + index}
                      />
                    </div>
                  ))}

                  <Button
                    disabled={isSubmitting}
                    name="Submit"
                    id="button-submit"
                    type="submit">
                    Submit
                  </Button>
                  {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
