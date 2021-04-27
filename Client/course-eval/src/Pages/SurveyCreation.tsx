import { TextAreaProps } from "formik-semantic-ui-react/dist/TextArea";
import { size } from "lodash";
import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import {
  Button,
  Form,
  Icon,
  Modal,
  ModalActions,
  Radio,
  TextArea,
} from "semantic-ui-react";
import { ModalRapper } from "../Components/ModalRapper";

interface sState {
  newField: boolean;
  newResponses: string[];
}

const initialState: sState = {
  newField: true,
  newResponses: [],
};

interface dataToSend {
  professorId: string;
  classId: string;
  newResponses: string[];
}

interface paramType {
  teacherId: string;
  classId: string;
}

export const SurveyCreation: React.FC = () => {
  const history = useHistory();
  const [state, setState] = useState<sState>(initialState);
  const [value, setValue] = useState(0);
  const [modalState, closeModal] = useState(false);
  const [question, setQuestion] = useState("");
  const { teacherId, classId } = useParams<paramType>();

  const onClickSaveSurvey = () => {
    let data: dataToSend = {
      professorId: teacherId,
      classId: classId,
      newResponses: state.newResponses,
    };
    fetch("http://localhost:8000/newSurvey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    history.push("/View/" + teacherId);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    data: any
  ) => {
    setQuestion(data.value);
    console.log(question);
  };

  const handleCreateButton = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClickAddNewField(question);
    setQuestion("");
    closeModalHandler();
  };

  const closeModalHandler = () => {
    closeModal(false);
  };

  const changeQuestion = (question: string, index: number) => {
    const tempState = state;
    console.log(tempState.newResponses[index]);
    tempState.newResponses[index] = question;
    console.log(tempState.newResponses[index]);
    setState(tempState);
    setValue((value) => value + 1);
  };

  const onClickAddNewField = (question: string) => {
    const tempState = state;
    tempState.newResponses.push(question);
    setState(tempState);
    setValue((value) => value + 1);
    //console.log(state);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "50px" }}>Create a Survey</h1>
      <br />
      <h2 style={{ textAlign: "left", paddingLeft: "20px" }}>
        Default Questions:
      </h2>
      <div style={{ paddingLeft: 20 }}>
        <Row>
          <Col md={3}>
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
      <div style={{ paddingLeft: 20 }}>
        <Row>
          <Col md={3}>
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
      <h2 style={{ textAlign: "left", paddingLeft: "20px" }}>
        Custom Questions:
      </h2>
      {state.newField ? (
        state.newResponses.map((r: string, index: number) => (
          <div>
            <div style={{ paddingLeft: 20 }}>
              <Row>
                <Col md={3}>
                  <label>{r}</label>
                </Col>
              </Row>
              <Row style={{ paddingLeft: 10 }}>
                <TextArea
                  disabled
                  placeholder="Input text here"
                  style={{ minHeight: 100, minWidth: "80%" }}
                  name="class_comments"
                />
                <ModalRapper index={index} change={changeQuestion} />
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
        <Modal
          centered={true}
          size={"small"}
          style={{
            height: 250,
            width: 800,
            position: "absolute",
            top: "50%",
            left: "50%",
            marginLeft: -400,
            marginTop: -125,
          }}
          trigger={
            <Button onClick={() => closeModal(true)}>
              <Icon name="add" />
              Add new Field
            </Button>
          }
          onClose={closeModalHandler}
          open={modalState}>
          <Modal.Header>Enter question below</Modal.Header>
          <Modal.Content>
            <Form onSubmit={handleCreateButton}>
              <Form.TextArea
                name="question"
                value={question}
                onChange={handleFormChange}
              />
              <Button id="submit">Save</Button>
            </Form>
          </Modal.Content>
        </Modal>
        <br />
        <Button onClick={onClickSaveSurvey}>
          <Icon name="save" />
          Save Survey
        </Button>
      </Row>
    </div>
  );
};
