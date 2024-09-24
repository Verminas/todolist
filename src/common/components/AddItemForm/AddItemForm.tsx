import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useAddItemForm } from "common/hooks";

type Props = {
  addItem: (value: string) => Promise<any>;
  placeholder?: string;
  textFieldLabel?: string;
  disabled: boolean;
};
export const AddItemForm = memo(({ addItem, placeholder, textFieldLabel, disabled }: Props) => {
  const { title, changeTitle, onKeyUpEnter, error, addItemHandler } = useAddItemForm({ addItem, disabled });

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
