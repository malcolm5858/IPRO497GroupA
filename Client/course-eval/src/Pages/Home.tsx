import React, { Component } from "react";
import { Search } from "semantic-ui-react";
import { TestContent } from "../Components/TestContent";
import _ from "lodash";
import { TeacherRatings } from "./TeacherRatings";

var mounted = false;
interface hState {
  isLoading: boolean;
  results: [];
  value: string;
  dataFromApi: any;
}

interface Professor {
  _id: String;
  title: String;
}

const initialState: hState = {
  isLoading: false,
  results: [],
  value: "",
  dataFromApi: null,
};
export default class Home extends Component {
  state = initialState;

  async componentDidMount() {
    const response = await fetch("http://localhost:8000/teacherNames");
    const data = await response.json();
    this.setState({ dataFromApi: data });
    console.log(response);
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
      <div>
        <div>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            aligned="right"
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "20px",
              paddingRight: "20px",
            }}
          />
        </div>
        <TeacherRatings professor_id="60510944bb729c5f71c95714" professor_name="Bob" />
      </div>
    );
  }
}
