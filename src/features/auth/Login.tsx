import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "features/auth/authSlice";
import { PATH } from "common/router/router";
import { textFieldErrorStyle } from "features/auth/Login.styles";
import { BaseResponse } from "common/types";
import { useActions } from "common/hooks/useActions";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const Login = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { login } = useActions();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 4) {
        errors.password = "Must be 4 characters or more";
      }

      return errors;
    },
    onSubmit: (values) => {
      login(values)
        .unwrap()
        .then(() => formik.resetForm())
        .catch((err: BaseResponse) => {
          if (err.fieldsErrors.length) {
            err.fieldsErrors.forEach((err) => formik.setFieldError(err.field, err.error));
          } else {
            const error = err.messages ? err.messages[0] : undefined;
            Object.keys(values).forEach((key) => formik.setFieldError(key, error));
          }
        });
    },
  });

  if (isLoggedIn) {
    return <Navigate to={PATH.COMMON} />;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  {" "}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...formik.getFieldProps("email")}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.errors.email}
                sx={textFieldErrorStyle}
              />

              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.errors.password}
                sx={textFieldErrorStyle}
              />

              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox name="rememberMe" onChange={formik.handleChange} value={formik.values.rememberMe} />}
              />
              <Button
                type={"submit"}
                variant={"contained"}
                color={"primary"}
                disabled={
                  (formik.touched.email && !!formik.errors.email) ||
                  (formik.touched.password && !!formik.errors.password)
                }
              >
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
