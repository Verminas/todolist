import {ChangeEvent, useState, KeyboardEvent} from "react";
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
  title: string
  changeTitle: (value: string) => void
  textFieldLabel?: string
};
export const EditableSpan = ({title, changeTitle, textFieldLabel}: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(title);

  const activateEditMode = () => {
    setEditMode(true)
  }
  const deactivateEditMode = () => {
    setEditMode(false)
    changeTitle(value);
  }
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }
  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      deactivateEditMode();
    }
  }

  return (
    <>
      {editMode
        ? <TextField label={textFieldLabel ? textFieldLabel : 'Edit title'}
                     variant="standard"
                     size={'small'}

                     value={value}
                     onBlur={deactivateEditMode}
                     onChange={onChangeHandler}
                     onKeyDown={onKeyDownHandler}
                     autoFocus
        />
        : <span onDoubleClick={activateEditMode}>{title}</span>
      }
    </>
  )
}