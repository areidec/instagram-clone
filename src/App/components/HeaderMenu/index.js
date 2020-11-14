import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Avatar } from "@material-ui/core";
import "./headerMenu.scss";
import { NavLink } from "react-router-dom";
import SvgIcon from "@material-ui/core/SvgIcon";
import { makeStyles } from "@material-ui/core/styles";

import { openModal, logOut } from "../../store/authReducer";

function HomeIcon(props) {
  return (
    <SvgIcon {...props} height="22" width="22" viewBox="0 0 48 48" fill="none">
      <path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z" />
    </SvgIcon>
  );
}

function DirectIcon(props) {
  return (
    <SvgIcon {...props} height="22" width="22" viewBox="0 0 48 48" fill="none">
      <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z" />
    </SvgIcon>
  );
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: "25px",
    width: "25px",
    fontSize: "13px",
  },
}));

const HeaderMenu = () => {
  const dispatch = useDispatch();
  const { isLogined, userData } = useSelector((state) => state.auth);
  const classes = useStyles();

  return (
    <div className="header-menu">
      {!isLogined ? (
        <Button onClick={() => dispatch(openModal())}>login</Button>
      ) : (
        <ul className="header-menu__list menu-list">
          <li className="menu-list__item">
            <NavLink to="/" activeClassName="active" exact>
              <HomeIcon />
            </NavLink>
          </li>
          {/* <li className="menu-list__item">
            <NavLink to="/direct" activeClassName="active">
              <DirectIcon />
            </NavLink>
          </li> */}
          <li className="menu-list__item">
            <NavLink
              className="no-link link-ava"
              activeClassName="active"
              to={`/${userData.uid}`}
              exact
            >
              <Avatar className={classes.avatar} src={userData.photoURL}>
                {!userData.photoURL && userData.displayName[0].toUpperCase()}
              </Avatar>
            </NavLink>
          </li>
          <li className="menu-list__item">
            <Button onClick={() => dispatch(logOut())}>logOut</Button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default HeaderMenu;
