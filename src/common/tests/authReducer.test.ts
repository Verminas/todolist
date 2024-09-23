import { authActions, authReducer, AuthReducerInitialType } from "features/auth/authSlice";

import { LoginParamsType } from "common/types";

let initialState: AuthReducerInitialType;
let loginParams: LoginParamsType;

beforeEach(() => {
  initialState = {
    isLoggedIn: false,
  };
  loginParams = { email: "jaksw@gmail.com", password: "1111", rememberMe: true };
});

test("logged in app should be correct", () => {
  expect(initialState.isLoggedIn).toBeFalsy;

  const action = authActions.login.fulfilled({ isLoggedIn: true }, "requestId", loginParams);
  const endState = authReducer(initialState, action);

  expect(endState.isLoggedIn).toBeDefined();
  expect(endState.isLoggedIn).toBeTruthy();
});

test("log out from app should be correct", () => {
  let initialState: AuthReducerInitialType = { isLoggedIn: true };
  expect(initialState.isLoggedIn).toBeTruthy();

  const action = authActions.logout.fulfilled({ isLoggedIn: false }, "requestId");
  const endState = authReducer(initialState, action);

  expect(endState.isLoggedIn).toBeDefined();
  expect(endState.isLoggedIn).toBeFalsy();
});
