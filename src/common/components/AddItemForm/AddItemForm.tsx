import React, { ChangeEvent, KeyboardEvent, memo, useState } from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { unwrapResult } from "@reduxjs/toolkit";

type AddItemFormPropsType = {
  addItem: (value: string) => Promise<any>;
  placeholder?: string;
  textFieldLabel?: string;
  disabled: boolean;
};
export const AddItemForm = memo(({ addItem, placeholder, textFieldLabel, disabled }: AddItemFormPropsType) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isItemAdding, setIsItemAdding] = useState(false);

  function changeTitle(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.currentTarget.value);
  }

  function onKeyUpEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (error !== null) setError(null);
    if (e.key === "Enter") {
      addItemHandler();
    }
  }

  const addItemHandler = () => {
    if (disabled) return;
    if (title.trim().length > 0) {
      if (isItemAdding) return;

      addItem(title.trim())
        .then(unwrapResult)
        .then(() => {
          setIsItemAdding(false);
          setTitle("");
        })
        .catch((err) => {
          if (err?.resultCode) {
            const errorMessage = err.messages?.length > 0 ? err.messages[0] : "Some error occurred";
            setError(errorMessage);
          }
        });

      setIsItemAdding(true);
    } else {
      setError("Title is required");
    }
  };

  return (
    <>
      <div>
        <TextField
          label={textFieldLabel}
          variant="outlined"
          placeholder={placeholder ? placeholder : ""}
          size={"small"}
          error={!!error}
          helperText={error}
          disabled={disabled}
          value={title}
          onChange={changeTitle}
          onKeyUp={onKeyUpEnter}
        />
        <IconButton
          onClick={addItemHandler}
          aria-label="add item"
          color={error ? "error" : "primary"}
          disabled={disabled}
        >
          <AddBoxIcon />
        </IconButton>
      </div>
    </>
  );
});
