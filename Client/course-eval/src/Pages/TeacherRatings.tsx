import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";

interface teacherRatingsData {
  professor_name: String;
  courseBreakdown: { rating: number; description: String }[];
  termBreakdown: { term: String; Rating: number }[];
}

const initialState: teacherRatingsData = {
  professor_name: "",
  courseBreakdown: [],
  termBreakdown: [],
};

export function TeacherRatings(props: any) {
  const { professor_id, professor_name } = props;

  const [data, setData] = useState(initialState);

  const arrAvg = (arr: number[]) =>
    arr.reduce((a: number, b: number) => a + b, 0) / arr.length;

  const clickData = (description: string) => {
    console.log(description);
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
  }, [props]);

  return (
    <>
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
              rating={4.6}
              sendData={clickData}
              description={"Test"}
            />
            <p style={{ textAlign: "center", fontSize: 24 }}>Overall Rating</p>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <h2 style={{ textAlign: "center" }}>Course Breakdown:</h2>
<<<<<<< HEAD
            <RatingBreakdown
              ratings={data.courseBreakdown}
              sendData={clickData}
            />
=======
            <RatingBreakdown ratings={breakdown} sendData={clickData} />
>>>>>>> clickRatings
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
