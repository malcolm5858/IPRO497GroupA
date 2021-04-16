import { size } from "lodash";
import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Button, FormGroup, Icon, Radio, TextArea } from "semantic-ui-react";

interface newField {
  label: string;
  question: string;
}

interface sState {
  newField: boolean;
  newResponses: newField[];
}

const initialState: sState = {
  newField: true,
  newResponses: [{ question: "test question", label: "Test" }],
};

export const SurveyCreation: React.FC = () => {
  const [state, setState] = useState<sState>(initialState);
  const [value, setValue] = useState(0);

  const onClickSaveSurvey = () => {};

  const onClickAddNewField = () => {
    const tempState = state;
    tempState.newResponses.push({ label: "None", question: "None" });
    setState(tempState);
    setValue((value) => value + 1);
    console.log(state);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "50px" }}>Create a Survey</h1>
      <br />
      <h2 style={{ textAlign: "left", paddingLeft: "20px" }}>
        Default Questions:
      </h2>
      <h3 style={{ paddingLeft: 20 }}>Instructor</h3>
      <div style={{ paddingLeft: 20 }}>
        <Row>
          <Col md={2}>
            <label>
              On a scale from 1 to 5, how satisfied are
              <br /> you with your instructor for this course?
            </label>
          </Col>
          <Col md={{ span: 4, offset: 0.5 }}>
            <Radio disabled name="professor_rating" value={1} label="1" />
            <Radio disabled name="professor_rating" value={2} label="2" />
            <Radio disabled name="professor_rating" value={3} label="3" />
            <Radio disabled name="professor_rating" value={4} label="4" />
            <Radio disabled name="professor_rating" value={5} label="5" />
          </Col>
        </Row>
      </div>
      <Row style={{ paddingLeft: 30 }}>
        <TextArea
          disabled
          placeholder="Input text here"
          style={{ minHeight: 100, minWidth: "80%" }}
          name="prof_comments"
        />
      </Row>

      <h3 style={{ paddingLeft: 20 }}>Course</h3>
      <div style={{ paddingLeft: 20 }}>
        <Row>
          <Col md={2}>
            <label>
              On a scale from 1 to 5, how satisfied are <br />
              you with the course material?
            </label>
          </Col>
          <Col md={{ span: 4, offset: 0.5 }}>
            <Radio disabled name="class_rating" label="1" value={1} />
            <Radio disabled name="class_rating" label="2" value={2} />
            <Radio disabled name="class_rating" label="3" value={3} />
            <Radio disabled name="class_rating" label="4" value={4} />
            <Radio disabled name="class_rating" label="5" value={5} />
          </Col>
        </Row>
      </div>
      <Row style={{ paddingLeft: 30 }}>
        <TextArea
          disabled
          placeholder="Input text here"
          style={{ minHeight: 100, minWidth: "80%" }}
          name="class_comments"
        />
      </Row>
      <br />
      {state.newField ? (
        state.newResponses.map((r: newField) => (
          <div>
            <h3 style={{ paddingLeft: 20 }}>{r.label}</h3>
            <div style={{ paddingLeft: 20 }}>
              <Row>
                <Col md={2}>
                  <label>{r.question}</label>
                </Col>
              </Row>
              <Row style={{ paddingLeft: 10 }}>
                <TextArea
                  disabled
                  placeholder="Input text here"
                  style={{ minHeight: 100, minWidth: "80%" }}
                  name="class_comments"
                />
              </Row>
            </div>
            <br />
          </div>
        ))
      ) : (
        <div />
      )}
      <br />
      <Row style={{ paddingLeft: 30 }}>
        <Button onClick={onClickAddNewField}>
          <Icon name="add" />
          Add new field
        </Button>
      </Row>

      <br />
      <Row style={{ paddingLeft: 30 }}>
        <Button onClick={onClickSaveSurvey}>
          <Icon name="save" />
          Save Survey
        </Button>
      </Row>
    </div>
  );
};
