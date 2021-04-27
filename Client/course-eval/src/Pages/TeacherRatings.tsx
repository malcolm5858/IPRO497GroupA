import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";

interface histBreakdown {
  term: String;
  Rating: number;
}

interface teacherRatingsData {
  professor_name: String;
  overall_rating: number;
  teacher_id: String;
  courseBreakdown: { rating: number; description: String; Id: String }[];
  termBreakdown: histBreakdown[];
}

const initialState: teacherRatingsData = {
  professor_name: "",
  overall_rating: 0,
  teacher_id: "",
  courseBreakdown: [],
  termBreakdown: [],
};

export function TeacherRatings(props: any) {
  const { professor_id, professor_name } = props;

  const [data, setData] = useState(initialState);
  const [value, setValue] = useState(0);

  const arrAvg = (arr: number[]) =>
    arr.reduce((a: number, b: number) => a + b, 0) / arr.length;

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

  const getRatings = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/TeacherRatings/${professor_id}`
      );
      const jsonData = await response.json();

      setData(jsonData.responses);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getRatings();
    console.log(data);
  }, [props]);

  return (
    <div style={{ backgroundColor: "lightcyan"}}>
      <Container>
        <Row>
          <Col>
            <p
              style={{ fontSize: 40, fontWeight: "bold", textAlign: "center" }}>
              {data.professor_name}
            </p>
            {/* <Rating size={200} rating={arrAvg(ratings.map((a: {professor_rating : number}) => a.professor_rating))} /> */}
            <Rating
              size={200}
              rating={data.overall_rating}
              sendData={teacherData}
              description={""}
              id={data.teacher_id}
            />
            <p style={{ textAlign: "center", fontSize: 24 }}>Overall Rating</p>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <h2 style={{ textAlign: "center" }}>Course Breakdown:</h2>
            <RatingBreakdown
              ratings={data.courseBreakdown}
              sendData={classData}
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
    </div>
  );
}
