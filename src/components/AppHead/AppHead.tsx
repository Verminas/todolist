// @flow
import * as React from 'react';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import AppBar from "@mui/material/AppBar";

type Props = {
  switchOnChange: () => void
};
export const AppHead = ({switchOnChange}: Props) => {
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
    </AppBar>
  );
};