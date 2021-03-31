import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";

// interface cState {
//   per_course: [];
//   prof_classes: [];
//   course_ratings: [];

// }
// const initial_state: cState ={
//   per_course = [],
//   prof_classes= [],
//   course_ratings = []
// };
export function CourseRatings(props: any) {
  const { course_id, department, course_number } = props;

  // const [breakdown, setBreakdown] = useState([]);
  const breakdown = [
    { rating: 4.5, description: "Proffessor Lee" },
    { rating: 4.3, description: "Professor Bilgic" },
    { rating: 1.5, description: "Professor Agams" },
    { rating: 4.5, description: "Professor Sasaki" },
    { rating: 2.5, description: "Professor Leung" },
    { rating: 4.8, description: "Professor Yan" },
    { rating: 4.5, description: "Professor Tannous" },
  ];

  const [ratings, setRatings] = useState([]);
  const arrAvg = (arr: number[]) =>
    arr.reduce((a: number, b: number) => a + b, 0) / arr.length;

  const getProfessorsPerCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/classResults/${course_id}`
      );
      const jsonData = await response.json();

      setRatings(jsonData.responses);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getClassHeldInfoPerProfessor = async (professor_id: any) => {
    try {
      const response = await fetch(
        `http://localhost:8000/classResults/${course_id / professor_id}`
      );
      const jsonData = await response.json();

      setRatings(jsonData.responses);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getClassProfessorRatings = async (courses_held_id: any) => {
    try {
      const response = await fetch(
        `http://localhost:8000/classResults/${courses_held_id}`
      );
      const jsonData = await response.json();

      setRatings(jsonData.responses);
    } catch (err) {
      console.error(err.message);
    }
  };

  const clickData = (description: string) => {
    console.log(description);
  };

  //useEffect(() => {
  //  var prof_per_coruse = await getProfessorsPerCourse();
  //  var course_held_per_prof = await getClassHeldInfoPerProfessor(prof_per_coruse._id);
  //  var prof_ratings = await getClassProfessorRatings(course_held_per_prof.);
  //}, []);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <p
              style={{ fontSize: 40, fontWeight: "bold", textAlign: "center" }}>
              {course_number}
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
            <h2 style={{ textAlign: "center" }}>Profesor Breakdown:</h2>
            <RatingBreakdown ratings={breakdown} sendData={clickData} />
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
