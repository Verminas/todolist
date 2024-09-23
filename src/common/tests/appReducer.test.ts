import { appActions, AppInitialStateType, appReducer } from "app/appSlice";

let initialState: AppInitialStateType;

beforeEach(() => {
  initialState = {
    status: "idle",
    error: null as string | null,
    isInitialized: false,
  };
});

test("changing app status should be correct", () => {
  expect(initialState.status).toBe("idle");

  const action = appActions.setAppStatus({ status: "loading" });
  const endState = appReducer(initialState, action);

  expect(endState.status).toBeDefined();
  expect(endState.status).toBe("loading");
});

test("changing app error message should be correct", () => {
  expect(initialState.error).toBe(null);

  const action = appActions.setAppError({ error: "Some error occurred..." });
  const endState = appReducer(initialState, action);

  expect(endState.error).toBeTruthy();
  expect(endState.error).toBe("Some error occurred...");
});

test("changing app initialization should be correct", () => {
  expect(initialState.isInitialized).toBeFalsy();

  const action = appActions.setAppInitialized({ isInitialized: true });
  const endState = appReducer(initialState, action);

  expect(endState.isInitialized).toBeDefined();
  expect(endState.isInitialized).toBeTruthy();
});
