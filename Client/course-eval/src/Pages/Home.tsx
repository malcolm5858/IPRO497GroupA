import React, { Component } from "react";
import { Search } from "semantic-ui-react";
import { TestContent } from "../Components/TestContent";
import _ from "lodash";
import { TeacherRatings } from "./TeacherRatings";
import { CourseRatings } from "./CourseRatings";
import { RouteComponentProps, useParams } from "react-router";


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
  userToUse: { _id: "", title: "", type: "landing" },
};

interface RouteParams {
  id: string;
  name: string;
  type: string;
}
export default class Home extends Component<RouteComponentProps<RouteParams>> {
  state: hState = initialState;
  
  async componentDidMount() {
    const { match: { params } } = this.props;
    this.setState({ userToUse: { _id: params.id, title: params.name, type: params.type } });
    const response = await fetch("http://localhost:8000/search");
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
      console.log("Change State");
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

    const page = () => {
      switch (this.state.userToUse.type) {
        case "professor":
          return (
            <TeacherRatings
              professor_id={this.state.userToUse._id}
              professor_name={this.state.userToUse.title}
            />
          );
        case "course":
          return (
            <CourseRatings
              course_id={this.state.userToUse._id}
              department={this.state.userToUse.department}
              course_number={this.state.userToUse.course_number}
            />
          );
        // case "landing":
        //   return (
        //     <Launch />
        //   );
      }
    };

    return (
      <div>
        <div>
          <form onSubmit={this.handleSearchSubmit.bind(this)}>
            <Search
              type="search"
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              aligned="right"
              size="big"
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
        {page()}
      </div>
    );
  }
}
