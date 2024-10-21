import { ChangeEvent, useState, KeyboardEvent, memo } from "react";
import TextField from "@mui/material/TextField";
import styled from "styled-components";

type Props = {
  title: string;
  changeTitle: (value: string) => void;
  textFieldLabel?: string;
  disabled: boolean;
};
export const EditableSpan = memo(({ title, changeTitle, textFieldLabel, disabled }: Props) => {
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
        <StyledSpan onDoubleClick={activateEditMode}>{title}</StyledSpan>
      )}
    </>
  );
});

const StyledSpan = styled.span`
  overflow-wrap: break-word;
`;
