import { useState } from "react";
import { useParams } from "react-router";
import { Button, Table } from "semantic-ui-react";
import AddStudentRapper from "../Components/AddStudentRapper";
import AddSurveyRapper from "../Components/AddSurveyRapper";

interface paramType {
  teacherId: string;
}

interface tState {
  name: string;
  surveys: { className: string; surveyId: string }[];
  studentLinks: { studentName: string; studentLink: string }[][];
}

const initialState: tState = {
  name: "",
  surveys: [],
  studentLinks: [],
};

const stylesP = {
  paddingLeft: "30px",
  paddingRight: "30px",
  paddingTop: "30px",
};

export default function TeacherView() {
  const { teacherId } = useParams<paramType>();
  const [data, setData] = useState(initialState);
  const [value, setValue] = useState(0);
  const addStudent = (
    studentName: string,
    studentId: string,
    index: number
  ) => {
    var tempData = data;
    const link =
      "http://localhost:3000/survey/" +
      studentId +
      "/" +
      data.name +
      "/" +
      data.surveys[index].surveyId +
      "/" +
      data.surveys[index].className;
    tempData.studentLinks[index].push({
      studentName: studentName,
      studentLink: link,
    });
    setData(tempData);
    console.log(data);
    setValue((value) => value + 1);
  };

  return (
    <div>
      <h1 style={stylesP}>Professor: {data.name}</h1>
      <h2 style={stylesP}>Surveys:</h2>
      <div style={stylesP}>
        <Table celled padded structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="1">Surveys</Table.HeaderCell>
              <Table.HeaderCell colSpan="1">Students</Table.HeaderCell>
              <Table.HeaderCell colSpan="1">Links</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.studentLinks.map((s: any, index: number) => (
              <>
                <Table.Row>
                  <Table.Cell width={7} rowSpan={s.length + 1}>
                    <h1>{data.surveys[index].className}</h1>
                    <AddStudentRapper index={index} change={addStudent} />
                  </Table.Cell>
                </Table.Row>
                {s.map((l: { studentName: string; studentLink: string }) => (
                  <Table.Row>
                    <Table.Cell>{l.studentName}</Table.Cell>
                    <Table.Cell>
                      <a href={l.studentLink}> {l.studentLink}</a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div style={stylesP}>
        <AddSurveyRapper teacherId={teacherId} />
      </div>
    </div>
  );
}
