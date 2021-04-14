import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";

interface histBreakdown {
  term: String;
  Rating: number;
}
interface CourseRatingsData {
  department: String;
  courseNumber: number;
  overall_rating: number;
  course_id: String;
  profBreakdown: { rating: number; description: String; Id: String }[];
  termBreakdown: histBreakdown[];
}

const initial_state: CourseRatingsData = {
  department: "",
  courseNumber: 0,
  overall_rating: 0,
  course_id: "",
  profBreakdown: [],
  termBreakdown: [],
};

export function CourseRatings(props: any) {
  const { course_id } = props;

  const [data, setData] = useState(initial_state);
  const [value, setValue] = useState(0);

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

  const teacherData = async (description: string) => {
    console.log(description);

    try {
      const response = await fetch(
        `http://localhost:8000/ClickRatings/${description}/Teacher`
      );
      const jsonData = await response.json();
      var tempData = data;
      tempData.termBreakdown = jsonData.responses;
      tempData.termBreakdown = [];
      setData(tempData);
      tempData.termBreakdown = jsonData.responses;
      setData(tempData);
      console.log(data);
      setValue((value) => value + 1);
      console.log("no");
    } catch (err) {
      console.error(err.message);
    }
  };

  const classData = async (description: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/ClickRatings/${description}/Class`
      );
      const jsonData = await response.json();
      var tempData = data;

      tempData.termBreakdown = [];
      setData(tempData);
      tempData.termBreakdown = jsonData.responses;
      setData(tempData);
      console.log(data);
      setValue((value) => value + 1);
    } catch (err) {
      console.error(err.message);
    }
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
              sendData={classData}
              description={"Test"}
              id={data.course_id}
            />
            <p style={{ textAlign: "center", fontSize: 24 }}>Overall Rating</p>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <h2 style={{ textAlign: "center" }}>Professor Breakdown:</h2>
            <RatingBreakdown
              ratings={data.profBreakdown}
              sendData={teacherData}
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
