import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";

interface CourseRatingsData {
  department: String;
  courseNumber: number;
  overall_rating: number;
  profBreakdown: { rating: number; description: String }[];
  termBreakdown: { term: String; Rating: number }[];
}

const initial_state: CourseRatingsData = {
  department: "",
  courseNumber: 0,
  overall_rating: 0,
  profBreakdown: [],
  termBreakdown: [],
};

export function CourseRatings(props: any) {
  const { course_id } = props;

  const [data, setData] = useState(initial_state);

  const getData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/CourseRatings/${course_id}`
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
              {data.department + " " + data.courseNumber}
            </p>
            {/* <Rating size={200} rating={arrAvg(ratings.map((a: {professor_rating : number}) => a.professor_rating))} /> */}
            <Rating
              size={200}
              rating={data.overall_rating}
              sendData={clickData}
              description={"Test"}
            />
            <p style={{ textAlign: "center", fontSize: 24 }}>Overall Rating</p>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <h2 style={{ textAlign: "center" }}>Profesor Breakdown:</h2>
            <RatingBreakdown
              ratings={data.profBreakdown}
              sendData={clickData}
            />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <HistogramWithData
              title="Breakdown by Term"
              data={data.termBreakdown}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
