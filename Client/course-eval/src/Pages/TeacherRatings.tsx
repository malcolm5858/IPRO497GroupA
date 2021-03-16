import React, { useState } from 'react';
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
            <h1 className="align-center" >{professor_name}</h1>
            {/* <Rating size={200} rating={arrAvg(ratings.map((a: {professor_rating : number}) => a.professor_rating))} /> */}
            <Rating size={200} rating={4.6} />
        </>
    )
}