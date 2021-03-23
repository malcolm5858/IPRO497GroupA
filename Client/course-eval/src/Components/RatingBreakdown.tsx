import React, {useEffect} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Rating from './Rating';
import GridGenerator from './GridGenerator';

const RatingBreakdown = (props: any) => {
    const { ratings } = props;

    useEffect(() => {
        console.log(ratings);
    }, []);

    return (
        <>
            <Container>
                <Row>
                    {ratings.map((r: any) => (
                        <Col>
                            <Rating size={100} rating={r.rating} />
                            <p style={{textAlign: 'center', fontSize: 24}}>{r.description}</p>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* <GridGenerator cols={6}>
                {ratings.map((r : any) => {
                    <Container>
                        <Row>
                            <Col>
                                <Rating size={100} rating={r.rating} />
                                <p style={{textAlign: 'center', fontSize: 24}}>{r.description}</p>
                            </Col>
                        </Row>
                    </Container>
                })}
            </GridGenerator> */}
        </>
    )
}

export default RatingBreakdown;