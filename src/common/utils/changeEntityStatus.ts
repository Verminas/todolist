import { RequestStatusType } from "app/appSlice";
import { todolistsActions, TodolistType } from "features/TodolistsList/model/todolists/todolistsSlice";
import { tasksActions } from "features/TodolistsList/model/tasks/tasksSlice";

type TodolistEntity = { todoId: string };
type TodolistsEntity = { todolists: TodolistType[] };
type TaskEntity = TodolistEntity & { taskId: string };
export type Entity = TodolistEntity | TaskEntity | TodolistsEntity | null;

/**
 * Function to change the status of an entity in the Redux store.
 *
 * @param {any} dispatch - The dispatch function from the Redux store.
 * @param {Entity} entity - The entity for which the status needs to be updated.
 * @param {RequestStatusType} entityStatus - The new status to set for the entity.
 */

export function changeEntityStatus(dispatch: any, entity: Entity, entityStatus: RequestStatusType): void {
  if (entity) {
    if ("todolists" in entity) {
      entity.todolists.forEach((tl) =>
        dispatch(
          todolistsActions.changeTodolistEntityStatus({
            todoId: tl.id,
            entityStatus,
          }),
        ),
      );
    } else {
      if ("taskId" in entity) {
        dispatch(
          tasksActions.changeTaskEntityStatus({
            todoId: entity.todoId,
            taskId: entity.taskId,
            entityStatus,
          }),
        );
      } else {
        dispatch(todolistsActions.changeTodolistEntityStatus({ todoId: entity.todoId, entityStatus }));
      }
    }
  }
}
