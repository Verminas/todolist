import {ChangeEvent, useState} from "react";

type EditableSpanPropsType = {
  title: string
  changeTitle: (value: string) => void
};
export const EditableSpan = ({title, changeTitle}: EditableSpanPropsType) => {
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

  return (
    <>
      {editMode
        ? <input value={value} onBlur={deactivateEditMode} onChange={onChangeHandler} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{title}</span>
      }
    </>
  )
}