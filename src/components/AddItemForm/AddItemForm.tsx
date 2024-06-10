import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button} from "../Button/Button";
import styled from "styled-components";


type AddItemFormPropsType = {
  addItem: (value: string) => void
  placeholder?: string
}
export const AddItemForm = ({addItem, placeholder}: AddItemFormPropsType) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  function changeTitle(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.currentTarget.value)
  }

  function onKeyUpEnter(e: KeyboardEvent<HTMLInputElement>) {
    setError(null);
    if (e.key === 'Enter') {
      addItemHandler();
    }
  }

  const addItemHandler = () => {
    if (title.trim().length > 0) {
      addItem(title);
      setTitle('');
    } else {
      setError('Title is required')
    }
  }

  return (
    <>
      <div>
        <StyledTitle
          value={title}
          onChange={changeTitle}
          onKeyUp={onKeyUpEnter}
          placeholder={placeholder ? placeholder : 'Add new task...'}
          className={error ? 'input-error' : ''}
        />
        <Button title={'+'} onClick={addItemHandler}/>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  )
}

const StyledTitle = styled.input`
    &.input-error {
        outline: 1px solid red;
    }
`
const ErrorMessage = styled.span`
    color: red;
`