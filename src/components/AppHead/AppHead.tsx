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
import {AppRootStateType} from "../../state/store";

type Props = {
  switchOnChange: () => void
};
export const AppHead = ({switchOnChange}: Props) => {
  const status = useSelector<AppRootStateType, string>(state => state.app.status )
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
          <Button color="inherit">Login</Button>
          <Button color="inherit">Logout</Button>
          <Button color="inherit">Faq</Button>
          <Switch color={'default'} onChange={switchOnChange}/>
        </div>
      </Toolbar>
      {status === 'loading' && <LinearProgress />}
    </AppBar>
  );
};