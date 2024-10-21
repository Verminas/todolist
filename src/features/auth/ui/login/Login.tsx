import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import { PATH } from "common/router";
import { textFieldErrorSx } from "./Login.styles";
import { useLogin } from "../../lib/useLogin";

export const Login = () => {
  const { formik, isLoggedIn } = useLogin();
  const isErrorEmail = formik.touched.email && !!formik.errors.email;
  const isErrorPassword = formik.touched.password && !!formik.errors.password;

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
                error={isErrorEmail}
                helperText={formik.errors.email}
                sx={textFieldErrorSx}
              />

              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
                error={isErrorPassword}
                helperText={formik.errors.password}
                sx={textFieldErrorSx}
              />

              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox name="rememberMe" onChange={formik.handleChange} value={formik.values.rememberMe} />}
              />
              <Button
                type={"submit"}
                variant={"contained"}
                color={"primary"}
                disabled={isErrorEmail || isErrorPassword}
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
