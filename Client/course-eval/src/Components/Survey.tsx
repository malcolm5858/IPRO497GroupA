import React from "react";
import { Formik } from "formik";
import { Button, FormGroup } from "semantic-ui-react";
import { Radio, TextArea, Form } from "formik-semantic-ui-react";

interface Values {
  professor_rating: string;
  course_comments: string;
  class_rating: string;
  class_comments: string;
}

export const Survey: React.FC = () => {
  const initialValues: Values = {
    professor_rating: "",
    course_comments: "",
    class_rating: "",
    class_comments: "",
  };
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Course name</h1>
      <h2 style={{ textAlign: "center", color: "grey" }}>instructor name</h2>

      <Formik
        initialValues={initialValues}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          // make async call

          fetch("http://localhost:8000/surveyResponse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
          });
          console.log("submit: ", data);
          setSubmitting(false);
        }}>
        {({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <h3 style={{ paddingLeft: 20 }}>Instructor</h3>
            <div style={{ paddingLeft: 20 }}>
              <FormGroup inline>
                <label>
                  On a scale from 1 to 5, how satisfied are
                  <br /> you with your instructor for this course?
                </label>
                <Radio name="professor_rating" value="1" label="1" />
                <Radio name="professor_rating" value="2" label="2" />
                <Radio name="professor_rating" value="3" label="3" />
                <Radio name="professor_rating" value="4" label="4" />
                <Radio name="professor_rating" value="5" label="5" />
              </FormGroup>
            </div>
            <TextArea
              placeholder="Input text here"
              style={{ minHeight: 100 }}
              name="course_comments"
            />
            <h3 style={{ paddingLeft: 20 }}>Course</h3>
            <div style={{ paddingLeft: 20 }}>
              <FormGroup inline>
                <label>
                  On a scale from 1 to 5, how satisfied are <br />
                  you with the course material?
                </label>
                <Radio name="class_rating" label="1" value="1" />
                <Radio name="class_rating" label="2" value="2" />
                <Radio name="class_rating" label="3" value="3" />
                <Radio name="class_rating" label="4" value="4" />
                <Radio name="class_rating" label="5" value="5" />
              </FormGroup>
            </div>
            <TextArea
              placeholder="Input text here"
              style={{ minHeight: 100 }}
              name="class_comments"
            />

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
    </div>
  );
};
