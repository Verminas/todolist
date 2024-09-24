import { ChangeEvent, KeyboardEvent, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";

type Props = {
  addItem: (value: string) => Promise<any>;
  disabled: boolean;
};

export const useAddItemForm = (props: Props) => {
  const { addItem, disabled } = props;

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
          setIsItemAdding(false);
        });

      setIsItemAdding(true);
    } else {
      setError("Title is required");
    }
  };

  return { title, error, changeTitle, onKeyUpEnter, addItemHandler };
};
