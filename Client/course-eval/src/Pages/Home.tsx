import React, { Component } from "react";
import { Search } from "semantic-ui-react";
import { TestContent } from "../Components/TestContent";
import _ from "lodash";
import { TeacherRatings } from "./TeacherRatings";
import { CourseRatings } from "./CourseRatings";

var mounted = false;
interface hState {
  isLoading: boolean;
  results: [];
  value: string;
  dataFromApi: any;
  userToUse: any;
}

interface Professor {
  _id: String;
  title: String;
}

const initialState: hState = {
  isLoading: false,
  results: [],
  value: "",
  dataFromApi: {},
  userToUse: { _id: "0976f0a9cb65", title: "Anuj Chaos" },
};
export default class Home extends Component {
  state: hState = initialState;

  async componentDidMount() {
    const response = await fetch("http://localhost:8000/teacherNames");
    const data = await response.json();
    this.setState({ dataFromApi: data });
    console.log(response);
  }

  handleSearchSubmit(event: any) {
    event.preventDefault();
    var objForSearch: never[] = [];
    const data = _.entries(this.state.dataFromApi.responses);

    data.forEach((obj: any) => {
      if (obj[1]["title"] === this.state.value) {
        objForSearch = obj[1];
      }
      this.setState({ userToUse: objForSearch });
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
      <div>
        <div>
          <form onSubmit={this.handleSearchSubmit.bind(this)}>
            <Search
              type="search"
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
          </form>
        </div>
        <TeacherRatings
          professor_id={this.state.userToUse._id}
          professor_name={this.state.userToUse.title}
        />
      </div>
    );
  }
}
