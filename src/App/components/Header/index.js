import React from "react";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./header.scss";

import HeaderMenu from "../HeaderMenu";

const Header = () => {
  return (
    <Paper variant="outlined" square>
      <div className="container">
        <div className="header">
          <Link to="/">
            <img
              src="/static/logo.png"
              srcSet="/static/logo@2x.png 2x"
              alt="logo"
            />
          </Link>
          <HeaderMenu />
        </div>
      </div>
    </Paper>
  );
};

export default Header;
