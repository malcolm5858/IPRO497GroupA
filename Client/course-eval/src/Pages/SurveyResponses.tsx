import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Rating from "../Components/Rating";
import QandA from "../Components/QuestionsAndAnswers";

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

const initial_state: SurveyResponsesData = {
  department: "CS",
  course_number: 577, 
  prof_name: "Prof. Lan",
  term: "Spring 1215",
  prof_rating: 4,
  course_rating: 3,
  survey_questions: ["How was the professor", "How was the class", "Did you like the professors teaching style"],
  survey_answers: [["Alright", "Bad", "Not particularly"], ["Good", "Really Good", "Very much"]]
};


function transpose(matrix: any[][]) {
  const rows = matrix.length, cols = matrix[0].length;
  const grid = [];
  for (let j = 0; j < cols; j++) {
    grid[j] = Array(rows);
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[j][i] = matrix[i][j];
    }
  }
  return grid;
}

export function SurveyResponses(props: any) {
  const { course_id, prof_id, term} = props;

  const [data, setData] = useState(initial_state);

   const getData = async () => {
     try {
       const response = await fetch(
         `http://localhost:8000/SurveyResponses/${course_id}/${prof_id}/${term}`
       );
       const jsonData = await response.json();

       setData(jsonData.responses);

     } catch (err) {
       console.error(err.message);
     }
  };

  const clickData = (description: string) => {
    console.log(description);
  };

   useEffect(() => {
     getData();
  }, [props]);


  return (
    <>
      <Container>
        <Row>
          <Col>
            <p
              style={{ fontSize: 40, fontWeight: "bold", textAlign: "center" }}>
              {data.prof_name + " "}
            </p>
            <Rating
              size={200}
              rating={data.prof_rating}
              sendData={clickData}
              description={"Test"}
            />
            <p style={{ textAlign: "center", fontSize: 24 }}>Professor Rating</p>
          </Col>

          <Col>
          <p
              style={{ fontSize: 40, fontWeight: "bold", textAlign: "center" }}>
              {data.department + " " + data.course_number +  " " + data.term}
            </p>
            <Rating
              size={200}
              rating={data.course_rating}
              sendData={clickData}
              description={"Test"}
            />
            <p style={{ textAlign: "center", fontSize: 24 }}>Course Rating</p>
          </Col>

        </Row>
        <Row className="mt-5">
          <Col>
            <QandA
              questions={data.survey_questions}
              answers={transpose(data.survey_answers)}
              sendData={clickData}
            />
          </Col>
        </Row>

      </Container>
    </>
  );
}
