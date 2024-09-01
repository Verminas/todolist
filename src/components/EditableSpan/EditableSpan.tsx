import { ChangeEvent, useState, KeyboardEvent, memo } from "react";
import TextField from "@mui/material/TextField";

type EditableSpanPropsType = {
  title: string;
  changeTitle: (value: string) => void;
  textFieldLabel?: string;
  disabled: boolean;
};
export const EditableSpan = memo(({ title, changeTitle, textFieldLabel, disabled }: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(title);

  const activateEditMode = () => {
    if (disabled) return;
    setEditMode(true);
  };
  const deactivateEditMode = () => {
    setEditMode(false);
    changeTitle(value);
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };
  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      deactivateEditMode();
    }
  };

  return (
    <>
      {editMode ? (
        <TextField
          label={textFieldLabel ? textFieldLabel : "Edit title"}
          variant="standard"
          size={"small"}
          value={value}
          onBlur={deactivateEditMode}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
          autoFocus
          error={value.length > 100}
        />
      ) : (
        <span onDoubleClick={activateEditMode}>{title}</span>
      )}
    </>
  );
});
