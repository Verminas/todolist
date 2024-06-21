import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";

// different variants for icons add
import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


type AddItemFormPropsType = {
  addItem: (value: string) => void
  placeholder?: string
  textFieldLabel?: string
}
export const AddItemForm = ({addItem, placeholder, textFieldLabel}: AddItemFormPropsType) => {
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
        <TextField label={textFieldLabel}
                   variant="outlined"
                   placeholder={placeholder ? placeholder : ''}
                   size={'small'}
                   error={!!error}
                   helperText={error}

                   value={title}
                   onChange={changeTitle}
                   onKeyUp={onKeyUpEnter}
        />
        <IconButton onClick={addItemHandler} aria-label="add item" color={error ? 'error' : 'primary'}>
          <AddBoxIcon />
        </IconButton>
      </div>
    </>
  )
}