import React from "react";
import { Formik } from "formik";
import { FormGroup, Radio, TextArea, Form } from "semantic-ui-react";

interface Values {
  courseSelection: string;
  courseComments: string;
  materialSelection: string;
  materialComments: string;
}

interface Props<Values> {
  onSubmit: (values: Values) => void;
}

export const Survey = (props: Props<Values>) => {
  const initialValues: Values = {
    courseSelection: "1",
    courseComments: "Input text here",
    materialSelection: "1",
    materialComments: "Input text here",
  };
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Course name</h1>
      <h2 style={{ textAlign: "center", color: "grey" }}>instructor name</h2>

      <Formik initialValues={initialValues} onSubmit={props.onSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <h3>Instructor</h3>
            <div>
              <FormGroup inline>
                <label>
                  On a scale from 1 to 5, how satisfied are
                  <br /> you with your instructor for this course?
                </label>
                <Form.Field
                  control={Radio}
                  id="radio-course-1"
                  name="courseSelection"
                  label="1"
                  value="1"
                />
                <Form.Field
                  control={Radio}
                  id="radio-course-2"
                  name="courseSelection"
                  label="2"
                  value="2"
                />
                <Form.Field
                  control={Radio}
                  id="radio-course-3"
                  name="courseSelection"
                  label="3"
                  value="3"
                />
                <Form.Field
                  control={Radio}
                  id="radio-course-4"
                  name="courseSelection"
                  label="4"
                  value="4"
                />
                <Form.Field
                  control={Radio}
                  id="radio-course-5"
                  name="courseSelection"
                  label="5"
                  value="5"
                />
              </FormGroup>
            </div>
            <TextArea
              placeholder="Input text here"
              style={{ minHeight: 100 }}
            />
            <h3>Course</h3>

            <FormGroup inline>
              <label>
                On a scale from 1 to 5, how satisfied are <br />
                you with the course material?
              </label>
              <Form.Field
                control={Radio}
                id="radio-material-1"
                name="materialSelection"
                label="1"
                value="1"
              />
              <Form.Field
                control={Radio}
                id="radio-material-2"
                name="materialSelection"
                label="2"
                value="2"
              />
              <Form.Field
                control={Radio}
                id="radio-material-3"
                name="materialSelection"
                label="3"
                value="3"
              />
              <Form.Field
                control={Radio}
                id="radio-material-4"
                name="materialSelection"
                label="4"
                value="4"
              />
              <Form.Field
                control={Radio}
                id="radio-material-5"
                name="materialSelection"
                label="5"
                value="5"
              />
            </FormGroup>
            <TextArea
              placeholder="Input text here"
              style={{ minHeight: 100 }}
            />
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
};
