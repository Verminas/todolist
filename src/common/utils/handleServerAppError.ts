import { BaseResponse } from "common/types";
import { appActions } from "app/appSlice";
import { Dispatch } from "redux";

type ErrorUtilsDispatchType = Dispatch<
  ReturnType<typeof appActions.setAppError> | ReturnType<typeof appActions.setAppStatus>
>;
/**
 * Данная функция обрабатывает ошибки, которые могут возникнуть при взаимодействии с сервером.
 * @param data  - ответ от сервера в формате ResponseType<D>
 * @param dispatch - функция для отправки сообщений в store Redux
 * @param isShowGlobalError - флаг, указывающий, нужно ли отображать ошибки в пользовательском интерфейсе
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
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
