// @flow
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import AppBar from "@mui/material/AppBar";
import LinearProgress from "@mui/material/LinearProgress";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/auth/model/authSlice";
import { linearProgressStyle } from "./AppHead.styles";
import { selectStatus } from "app/appSlice";
import { useActions } from "common/hooks";

type Props = {
  switchOnChange: () => void;
};
export const AppHead = ({ switchOnChange }: Props) => {
  const status = useSelector(selectStatus);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { logout } = useActions();

  const logOutHandler = () => {
    logout();
  };
  return (
    <AppBar position="relative" sx={{ mb: "30px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <div>
          {isLoggedIn && (
            <Button color="inherit" onClick={logOutHandler}>
              Logout
            </Button>
          )}
          {/*<Button color="inherit">Faq</Button>*/}
          <Switch color={"default"} onChange={switchOnChange} />
        </div>
      </Toolbar>
      {status === "loading" && <LinearProgress sx={linearProgressStyle} />}
    </AppBar>
  );
};
