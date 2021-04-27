import { String } from "lodash";
import React, { useState, useEffect } from "react";

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
  change: Function;
  index: number;
}

export default function AddStudentRapper(props: Props) {
  const { change, index } = props;
  const [editState, closeEditModal] = useState(false);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");

  const handleAddButton = (e: any, data: any) => {
    console.log(name);
    change(name, value, index);
    closeEditModalHandler();
  };

  const closeEditModalHandler = () => {
    closeEditModal(false);
  };

  const [options, setOptions] = useState([]);

  const getStudents = async () => {
    try {
      const response = await fetch(`http://localhost:8000/getStudents`);
      const jsonData = await response.json();

      setOptions(jsonData.responses);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getStudents();
    console.log(options);
  }, [props]);

  const handleChange = (e: any, { value }: any) => {
    e.persist();
    setName(e.target.textContent);
    setValue(value);
  };

  const handleSearchChange = (e: any, { selectedLabel }: any) => {
    //setName(selectedLabel);
    console.log(selectedLabel);
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
      trigger={
        <Button onClick={() => closeEditModal(true)}>Add Student</Button>
      }
      onClose={closeEditModalHandler}
      open={editState}>
      <Modal.Header>Add Student</Modal.Header>
      <Modal.Content>
        <h1>Pick a Student</h1>
        <Dropdown
          search
          selection
          fluid
          value={value}
          onChange={handleChange}
          onSearchChange={handleSearchChange}
          options={options}
        />
        <br />

        <Button onClick={handleAddButton}>add Students</Button>
      </Modal.Content>
    </Modal>
  );
}
