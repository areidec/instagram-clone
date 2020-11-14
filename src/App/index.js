import React, { useEffect } from "react";
import "./App.scss";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { auth } from "../firebase";

import { setUser } from "./store/authReducer";
import { updateResolution } from "./store/resolutionReducer";

import Auth from "./components/Auth";
import Header from "./components/Header";
// Pages
import DirectPage from "./pages/DirectPage";
import MainPage from "./pages/MainPage";
import UserPage from "./pages/UserPage";

const App = () => {
  const { isLogined } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const sub = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, email, photoURL, uid } = user;
        if (!displayName) {
          return dispatch(setUser({ email, photoURL, uid }));
        }
        dispatch(setUser({ displayName, email, photoURL, uid }));
      }
    });
    const resizeHandler = () => {
      dispatch(updateResolution(window.outerWidth));
    };
    dispatch(updateResolution(window.outerWidth));
    window.addEventListener("resize", resizeHandler);
    return () => {
      sub();
      window.removeEventListener("resize", resizeHandler);
    };
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <Switch>
          <Route path="/direct">
            {isLogined === false ? <Redirect to="/" /> : <DirectPage />}
          </Route>
          <Route path="/" exact component={MainPage} />
          <Route path="/:id" component={UserPage} />
        </Switch>
      </div>
      <Auth />
    </>
  );
};

export default App;
