import React from "react";
import { Search } from "semantic-ui-react";
import { TestContent } from "../Components/TestContent";
import faker from "faker";
import _ from "lodash";

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, "$"),
}));

interface hState {
  loading: boolean;
  results: [];
  value: string;
}

const initialState: hState = {
  loading: false,
  results: [],
  value: "",
};

function reducer(state: hState, action: any) {
  switch (action.type) {
    case "CLEAN_QUERY":
      return initialState;
    case "START_SEARCH":
      return { ...state, loading: true, value: action.query };
    case "FINISH_SEARCH":
      return { ...state, loading: false, results: action.results };
    case "UPDATE_SELECTION":
      return { ...state, value: action.selection };
    default:
      throw new Error();
  }
}

export function Home() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { loading, results, value } = state;

  const timeoutRef: any = React.useRef();
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type: "START_SEARCH", query: data.value });

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: "CLEAN_QUERY" });
        return;
      }

      const re = new RegExp(_.escapeRegExp(data.value), "i");
      //TODO: change this at some point
      const isMatch = (result: any) => re.test(result.title);

      dispatch({
        type: "FINISH_SEARCH",
        //source is the data is looking through
        results: _.filter(source, isMatch),
      });
    }, 300);
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div>
      <div>
        <Search
          loading={loading}
          onResultSelect={(e, data: any) =>
            dispatch({
              type: "UPDATE_SELECTION",
              selection: data.results.title,
            })
          }
          aligned="right"
          onSearchChange={handleSearchChange}
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
      <TestContent />
    </div>
  );
}
