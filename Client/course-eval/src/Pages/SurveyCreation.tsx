import { TextAreaProps } from "formik-semantic-ui-react/dist/TextArea";
import { size } from "lodash";
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
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
import { DeleteRapper } from "../Components/DeleteRapper";
import logo from "../images/logo.png";

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
  };

  const deleteSurvey = (index: number) => {
    const tempState = state;

    tempState.newResponses.splice(index, 1);
    console.log(index);
    setState(tempState);
    setValue((value) => value + 1);
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
    <div style={{backgroundColor: "lightcyan", height: "100vh"}}>
      <Container>
        <Row>
          <Col>
            <img src={logo} height={100}/>
          </Col>
          <Col>
            <h1 style={{ textAlign: "center", fontSize: "40px" }} className="mt-5">Create a Survey</h1>
          </Col>
          <Col></Col>
        </Row>
      
      
      
      
        <Row className="mt-5">
          <Col>
          <h2 style={{ textAlign: "left"}}>
            Default Questions:
          </h2>
          </Col>
          </Row>
          <Row className="mt-1">
          <Col>
            <label>
              On a scale from 1 to 5, how satisfied are
              <br /> you with your instructor for this course?
            </label>
          </Col>
          <Col>
            <Radio disabled name="professor_rating" value={1} label="1" />
            <Radio disabled name="professor_rating" value={2} label="2" />
            <Radio disabled name="professor_rating" value={3} label="3" />
            <Radio disabled name="professor_rating" value={4} label="4" />
            <Radio disabled name="professor_rating" value={5} label="5" />
          </Col>
          <Col></Col>
        </Row>
      <Row>
        <Col>
        <TextArea
          disabled
          placeholder="Input text here"
          style={{ minHeight: 100, minWidth: "80%" }}
          name="prof_comments"
        />
        </Col>
      </Row>
      
        <Row className="mt-5">
          <Col>
            <label>
              On a scale from 1 to 5, how satisfied are <br />
              you with the course material?
            </label>
          </Col>
          <Col>
            <Radio disabled name="class_rating" label="1" value={1} />
            <Radio disabled name="class_rating" label="2" value={2} />
            <Radio disabled name="class_rating" label="3" value={3} />
            <Radio disabled name="class_rating" label="4" value={4} />
            <Radio disabled name="class_rating" label="5" value={5} />
          </Col>
          <Col></Col>
        </Row>
      
      <Row>
        <Col>
        <TextArea
          disabled
          placeholder="Input text here"
          style={{ minHeight: 100, minWidth: "80%" }}
          name="class_comments"
        />
        </Col>
      </Row>
      <br />
      <h2 style={{ textAlign: "left"}}>
        Custom Questions:
      </h2>
      {state.newField ? (
        state.newResponses.map((r: string, index: number) => (
          <div>
            <div>
              <Row>
                <Col md={3}>
                  <label>{r}</label>
                </Col>
              </Row>
              <Row style={{paddingLeft: 15}}>
                <TextArea
                  disabled
                  placeholder="Input text here"
                  style={{ minHeight: 100, minWidth: "80%" }}
                  name="class_comments"
                />
                <ModalRapper
                  index={index}
                  change={changeQuestion}
                  initialQuestion={r}
                />
                <DeleteRapper index={index} change={deleteSurvey} />
              </Row>
            </div>
            <br />
          </div>
        ))
      ) : (
        <div />
      )}
      <br />
      <Row style={{paddingLeft: 15}}>
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
      </Container>
    </div>
  );
};
