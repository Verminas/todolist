import { authReducer, AuthReducerInitialType, authThunks } from "features/Login/authSlice";
import { LoginParamsType } from "api/todolistsApi";

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

  const action = authThunks.login.fulfilled({ isLoggedIn: true }, "requestId", loginParams);
  const endState = authReducer(initialState, action);

  expect(endState.isLoggedIn).toBeDefined();
  expect(endState.isLoggedIn).toBeTruthy();
});

test("log out from app should be correct", () => {
  let initialState: AuthReducerInitialType = { isLoggedIn: true };
  expect(initialState.isLoggedIn).toBeTruthy();

  const action = authThunks.logout.fulfilled({ isLoggedIn: false }, "requestId");
  const endState = authReducer(initialState, action);

  expect(endState.isLoggedIn).toBeDefined();
  expect(endState.isLoggedIn).toBeFalsy();
});
