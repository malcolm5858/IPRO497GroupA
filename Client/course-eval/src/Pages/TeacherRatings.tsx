import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";

export function TeacherRatings(props: any) {
  const { professor_id, professor_name } = props;

  // const [breakdown, setBreakdown] = useState([]);
  const breakdown = [
    { rating: 4.5, description: "CS 331" },
    { rating: 4.3, description: "CS 340" },
    { rating: 1.5, description: "CS 450" },
    { rating: 4.5, description: "CS 451" },
    { rating: 2.5, description: "CS 485" },
    { rating: 4.8, description: "CS 487" },
    { rating: 4.5, description: "CS 550" },
  ];

  const [ratings, setRatings] = useState([]);
  const arrAvg = (arr: number[]) =>
    arr.reduce((a: number, b: number) => a + b, 0) / arr.length;

  const getRatings = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/teacherResults/${professor_id}`
      );
      const jsonData = await response.json();

      setRatings(jsonData.responses);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getRatings();
  }, []);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <p
              style={{ fontSize: 40, fontWeight: "bold", textAlign: "center" }}>
              {professor_name}
            </p>
            {/* <Rating size={200} rating={arrAvg(ratings.map((a: {professor_rating : number}) => a.professor_rating))} /> */}
            <Rating size={200} rating={4.6} />
            <p style={{ textAlign: "center", fontSize: 24 }}>Overall Rating</p>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <h2 style={{ textAlign: "center" }}>Course Breakdown:</h2>
            <RatingBreakdown ratings={breakdown} />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <HistogramWithData
              title="Breakdown by Term"
              data={[
                { term: "Fall 2020", Rating: 4.5 },
                { term: "Spring 2020", Rating: 4.3 },
                { term: "Fall 2021", Rating: 2.2 },
                { term: "Spring 2022", Rating: 2.2 },
                { term: "Fall 2023", Rating: 5.0 },
                { term: "Spring 2023", Rating: 4.3 },
                { term: "Fall 2024", Rating: 2.2 },
                { term: "Spring 2024", Rating: 2.2 },
                { term: "Fall 2025", Rating: 5.0 },
                { term: "Spring 2025", Rating: 4.3 },
                { term: "Fall 2026", Rating: 2.2 },
                { term: "Spring 2026", Rating: 2.2 },
                { term: "Fall 2027", Rating: 5.0 },
                { term: "Spring 2027", Rating: 4.3 },
                { term: "Fall 2028", Rating: 2.2 },
                { term: "Spring 2028", Rating: 2.2 },
              ]}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
