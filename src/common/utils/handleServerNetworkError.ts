import axios from "axios";

/**
 * Handles errors related to server network communication in Redux.
 *
 * @param {unknown} err - The error object that occurred during the network request.
 *
 * @remarks
 * This function checks for different types of errors, including Axios errors and native errors, and updates the app state accordingly.
 */

export const handleServerNetworkError = (err: unknown): string => {
  let errorMessage = "Some error occurred";

  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err);
  }

  return errorMessage;
};
