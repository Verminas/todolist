import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../model/authSlice";
import { useActions } from "common/hooks";
import { useFormik } from "formik";
import { BaseResponse } from "common/types";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const useLogin = () => {
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
          if (err?.fieldsErrors?.length) {
            err.fieldsErrors.forEach((err) => formik.setFieldError(err.field, err.error));
          } else {
            const error = err.messages ? err.messages[0] : undefined;
            Object.keys(values).forEach((key) => formik.setFieldError(key, error));
          }
        });
    },
  });

  return { formik, isLoggedIn };
};
