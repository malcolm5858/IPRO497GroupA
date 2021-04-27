import React, { useEffect, useState, Component } from "react";
import { Search } from "semantic-ui-react";
import _ from "lodash";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";
import { RouteComponentProps } from "react-router";
import logo from "../images/logo.png";
import { cpuUsage } from "node:process";
import "../css/Survey.css";
import { Link } from "react-router-dom";
import {
  Button,
  Dropdown,
  Form,
  Icon,
  Modal,
  ModalActions,
  Radio,
  TextArea,
} from "semantic-ui-react";

interface hState {
  isLoading: boolean;
  results: [];
  value: string;
  dataFromApi: any;
  userToUse: any;
}

const initialState: hState = {
  isLoading: false,
  results: [],
  value: "",
  dataFromApi: {},
  userToUse: { _id: "", title: "", type: "landing" },
};

interface RouteParams {}

export default class Home extends Component<RouteComponentProps<RouteParams>> {
  state: hState = initialState;

  async componentDidMount() {
    const response = await fetch("http://localhost:8000/search");
    const data = await response.json();
    this.setState({ dataFromApi: data });
    console.log(response);
  }

  handleSearchSubmit(event: any) {
    event.preventDefault();
    var objForSearch: { _id: ""; title: ""; type: "landing" };
    const data = _.entries(this.state.dataFromApi.responses);

    data.forEach((obj: any) => {
      if (obj[1]["title"] === this.state.value) {
        objForSearch = obj[1];
        this.props.history.push(
          "/Home/" +
            objForSearch._id +
            "/" +
            objForSearch.title +
            "/" +
            objForSearch.type
        );
      }
      console.log("Change State");

      //this.setState({ userToUse: objForSearch });
    });
  }

  handleResultSelect = (e: any, { result }: any) =>
    this.setState({ value: result.title });

  handleSearchChange = (e: any, { value }: any) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1)
        return this.setState({ isLoading: false, results: [], value: "" });

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result: any) => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(this.state.dataFromApi.responses, isMatch),
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results, dataFromApi } = this.state;
    return (
      <div style={{ backgroundColor: "lightcyan", height: "100vh" }}>
        <Container>
          <Row style={{ paddingTop: "30px", paddingLeft: "95%" }}>
            <div style={{ alignSelf: "left" }}>
              <Link to={"/Login"}>
                <Button>Login</Button>
              </Link>
            </div>
          </Row>
          <Row>
            <Col>
              <img
                src={logo}
                height={200}
                className="d-block mx-auto img-fluid w-50 mt-5 mb-5"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <form onSubmit={this.handleSearchSubmit.bind(this)}>
                  <Search
                    type="search"
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    aligned="fluid"
                    size="massive"
                    onSearchChange={this.handleSearchChange}
                    results={results}
                    value={value}
                    placeholder="Enter a teacher or course"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "20px",
                      paddingRight: "20px",
                    }}
                  />
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
