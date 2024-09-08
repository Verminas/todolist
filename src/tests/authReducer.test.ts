import { authReducer, AuthReducerInitialType, setIsLoggedIn } from "features/Login/authReducer";

let initialState: AuthReducerInitialType;

beforeEach(() => {
  initialState = {
    isLoggedIn: false,
  };
});

test("logged in app should be correct", () => {
  expect(initialState.isLoggedIn).toBeFalsy;

  const action = setIsLoggedIn({ isLoggedIn: true });
  const endState = authReducer(initialState, action);

  expect(endState.isLoggedIn).toBeDefined();
  expect(endState.isLoggedIn).toBeTruthy();
});
