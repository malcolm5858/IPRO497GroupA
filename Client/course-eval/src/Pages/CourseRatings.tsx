import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";

<<<<<<< HEAD
interface CourseRatingsData {
  department: String;
  courseNumber: number;
  profBreakdown: { rating: number; description: String }[];
  termBreakdown: { term: String; Rating: number }[];
}

const initial_state: CourseRatingsData = {
  department: "",
  courseNumber: 0,
  profBreakdown: [],
  termBreakdown: [],
};

export function CourseRatings(props: any) {
  const { course_id } = props;
=======
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
>>>>>>> clickRatings

  const [data, setData] = useState(initial_state);

<<<<<<< HEAD
  const getData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/CourseRatings/${course_id}`
=======
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
>>>>>>> clickRatings
      );
      const jsonData = await response.json();

      setData(jsonData.responses);
    } catch (err) {
      console.error(err.message);
    }
  };

<<<<<<< HEAD
  const clickData = (description: string) => {
    console.log(description);
  };

  useEffect(() => {
    getData();
  }, [props]);
=======
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
>>>>>>> clickRatings

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
<<<<<<< HEAD
            <RatingBreakdown
              ratings={data.profBreakdown}
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
