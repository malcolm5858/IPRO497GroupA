import React, { useState } from "react";

import {
  Button,
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

export function ModalRapper(props: Props) {
  const { change, index } = props;
  const [editState, closeEditModal] = useState(false);

  const [question, setQuestion] = useState("");

  const handleEditButton = (
    e: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    console.log(index);
    change(question, index);
    setQuestion("");
    closeEditModalHandler();
  };

  const closeEditModalHandler = () => {
    closeEditModal(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    data: any
  ) => {
    setQuestion(data.value);
    console.log(question);
  };
  return (
    <Modal
      centered={true}
      size={"small"}
      style={{
        height: 250,
        width: 800,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: -400,
        marginTop: -125,
      }}
      trigger={
        <Button onClick={() => closeEditModal(true)}>
          <Icon name="edit" />
        </Button>
      }
      onClose={closeEditModalHandler}
      open={editState}>
      <Modal.Header>Edit question</Modal.Header>
      <Modal.Content>
        <Form onSubmit={(e) => handleEditButton(e, index)}>
          <Form.TextArea
            name="question"
            value={question}
            onChange={handleFormChange}
          />
          <Button id="submit">Save</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}
