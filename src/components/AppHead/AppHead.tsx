// @flow
import * as React from 'react';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import AppBar from "@mui/material/AppBar";
import LinearProgress from '@mui/material/LinearProgress';
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../state/store";
import {logoutTC} from "../../features/Login/authReducer";

type Props = {
  switchOnChange: () => void
};
export const AppHead = ({switchOnChange}: Props) => {
  const status = useSelector<AppRootStateType, string>(state => state.app.status )
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
  const dispatch = useAppDispatch();

  const logOutHandler = () => {
    dispatch(logoutTC())
  }
  return (
    <AppBar position="static" sx={{mb: '30px'}}>
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{mr: 2}}
        >
          <MenuIcon/>
        </IconButton>
        <div>
          {isLoggedIn && <Button color="inherit" onClick={logOutHandler}>Logout</Button>}
          <Button color="inherit">Faq</Button>
          <Switch color={'default'} onChange={switchOnChange}/>
        </div>
      </Toolbar>
      {status === 'loading' && <LinearProgress />}
    </AppBar>
  );
};