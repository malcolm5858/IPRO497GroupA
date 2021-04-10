import React, { useEffect, useState, Component } from "react";
import { Search } from "semantic-ui-react";
import _ from "lodash";
import { Container, Row, Col } from "react-bootstrap";
import { HistogramWithData } from "../Components/HistogramWithData";
import Rating from "../Components/Rating";
import RatingBreakdown from "../Components/RatingBreakdown";
import { RouteComponentProps } from "react-router";

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

interface RouteParams {
 
}

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
    var objForSearch: { _id: "", title: "", type: "landing" };
    const data = _.entries(this.state.dataFromApi.responses);

    data.forEach((obj: any) => {
      if (obj[1]["title"] === this.state.value) {
        objForSearch = obj[1];
        this.props.history.push("/Home/" + objForSearch._id + "/" + objForSearch.title + "/" + objForSearch.type);
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
      <>
        <Container>
          <p
            style={{ fontSize: 140, fontWeight: "bold", textAlign: "center" }}>
            {"Product Title"}
          </p>
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
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "20px",
                  paddingRight: "20px",
                }}
              />
            </form>
        </div>
        </Container>
      </>
    );
  }
}