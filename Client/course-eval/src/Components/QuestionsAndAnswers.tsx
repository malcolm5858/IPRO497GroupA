import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Rating from "./Rating";
import GridGenerator from "./GridGenerator";
import { findRenderedDOMComponentWithTag } from "react-dom/test-utils";

interface Props {
  questions: string[];
  answers: string[][];
  sendData: Function;
}

const QuestionsAndAnswers = (props: Props) => {
  const {questions, answers, sendData } = props;


 
   useEffect(() => {
     console.log(questions);
     console.log(answers);
   }, []);

  return (
    <>
      <Container>
       
          {answers.map((q: any, index: number) => (
            <>
            <Row className="mt-5">
              <h2 style={{ textAlign: "center" }}>Question:</h2>
              </Row>
              <Row>
              <p style={{ textAlign: "center", fontSize: 24 }}>
                { questions[index]}
                </p>
                </Row>
              <Row>
              <h2 style={{ textAlign: "center" }}>Answers:</h2>
              </Row>
            
              {q.map((a: string) => (
                <Row>
                    <p style={{ textAlign: "center", fontSize: 24 }}>
                      {a}
                    </p>
                  </Row>
                ))}
            
            </>

          ))}
       
      </Container>

      {/* <GridGenerator cols={6}>
                {ratings.map((r : any) => {
                    <Container>
                        <Row>
                            <Col>
                                <Rating size={100} rating={r.rating} />
                                <p style={{textAlign: 'center', fontSize: 24}}>{r.description}</p>
                            </Col>
                        </Row>
                    </Container>
                })}
            </GridGenerator> */}
    </>
  );
};

export default QuestionsAndAnswers;
