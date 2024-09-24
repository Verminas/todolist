import { BaseResponse } from "common/types";
import { appActions } from "app/appSlice";
import { Dispatch } from "redux";

type ErrorUtilsDispatchType = Dispatch<ReturnType<typeof appActions.setAppError>>;

/**

 This function handles errors that may occur during interaction with the server.
 
 @param data - the server response in the format ResponseType<D>
 @param dispatch - function to dispatch messages to the Redux store
 @param isShowGlobalError - a flag indicating whether to display errors in the user interface
 */

export const handleServerAppError = <T>(
  data: BaseResponse<T>,
  dispatch: ErrorUtilsDispatchType,
  isShowGlobalError: boolean = true,
) => {
  if (isShowGlobalError) {
    const error = data.messages.length ? data.messages[0] : "Some error occurred";
    dispatch(appActions.setAppError({ error }));
  }
  // dispatch(appActions.setAppStatus({ status: "failed" }));
};
