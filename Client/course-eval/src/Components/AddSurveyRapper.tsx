import React, { useState, useEffect } from "react";
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

interface Props {
  teacherId: string;
}

export default function AddSurveyRapper(props: Props) {
  const { teacherId } = props;
  const [editState, closeEditModal] = useState(false);

  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const [options, setOptions] = useState([]);

  const getSurveys = async () => {
    try {
      const response = await fetch(`http://localhost:8000/getClasses`);
      const jsonData = await response.json();

      setOptions(jsonData.responses);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getSurveys();
    console.log(options);
  }, [props]);

  const handleSearchChange = (
    e: any,
    { searchQuery }: { searchQuery: string }
  ) => setName(searchQuery);

  const handleChange = (e: any, { searchQuery, value }: any) => {
    setName(searchQuery);
    setValue(value);
  };

  const closeEditModalHandler = () => {
    closeEditModal(false);
  };
  return (
    <Modal
      centered={true}
      size={"small"}
      style={{
        height: 400,
        width: 800,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: -400,
        marginTop: -200,
      }}
      trigger={<Button onClick={() => closeEditModal(true)}>Add Survey</Button>}
      onClose={closeEditModalHandler}
      open={editState}>
      <Modal.Header>Add Survey</Modal.Header>
      <Modal.Content>
        <h1>Pick a class</h1>
        <Dropdown
          search
          selection
          fluid
          onSearchChange={handleSearchChange}
          value={value}
          onChange={handleChange}
          options={options}
        />
        <br />
        <Link to={"/CreateSurvey/" + teacherId + "/" + value}>
          <Button>Make Survey</Button>
        </Link>
      </Modal.Content>
    </Modal>
  );
}
