import { Formik } from "formik";
import { Button, Icon, Modal, ModalActions } from "semantic-ui-react";
import { Input, Form } from "formik-semantic-ui-react";
import * as yup from "yup";
import logo from "../images/logo.png";

const initialValues = {
  username: "",
  password: "",
};

const LoginValidation = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export function Login() {
  return (
    <div style={{backgroundColor: "lightcyan", height: "100vh"}}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: "-250px",
          marginLeft: "-250px",
          width: "500px",
          height: "500px",
        }}>
        <img src={logo} height={200} className="d-block mx-auto mb-5" />
        <Formik
          initialValues={initialValues}
          validationSchema={LoginValidation}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);

            setSubmitting(false);
          }}>
          {({ values, handleSubmit, isSubmitting, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Input name="username" placeholder="Username:" errorPrompt />
              <Input name="password" placeholder="Password:" errorPrompt />

              <Button
                disabled={isSubmitting}
                name="Submit"
                id="button-submit"
                type="submit">
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
