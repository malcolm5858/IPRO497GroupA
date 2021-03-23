import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Rating from '../Components/Rating';

export function TeacherRatings(props: any) {
    const { professor_id, professor_name } = props;

    const [ratings, setRatings] = useState([]);
    const arrAvg = (arr : number[]) => arr.reduce((a : number, b : number) => a + b, 0) / arr.length

    const getRatings = async () => {
        try {
            const response = await fetch(`http://localhost:8000/teacherResults/${professor_id}`)
            const jsonData = await response.json();

            setRatings(jsonData.responses);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p style={{fontSize: 40, fontWeight: 'bold', textAlign: 'center' }}>{professor_name}</p>
                        <Rating size={200} rating={arrAvg(ratings.map((a: {professor_rating : number}) => a.professor_rating))} />
                        <p style={{textAlign: 'center', fontSize: 24}}>Overall Rating</p>
                        {/* <Rating size={200} rating={4.6} /> */}
                    </Col>
                </Row>
            </Container>
        </>
    )
}