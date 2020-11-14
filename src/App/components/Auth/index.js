import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Link,
} from "@material-ui/core";
import { logIn, closeModal, signUp, resetError } from "../../store/authReducer";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    "&:focus": {
      outline: "none",
    },
    [theme.breakpoints.down("sm")]: {
      width: "95vw",
    },
  },
  modal: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  formControl: {
    width: "100%",
    marginBottom: "10px",
  },
  button: {
    display: "block",
    margin: "0 auto",
    marginBottom: "10px",
  },
}));

const Auth = () => {
  const classes = useStyles();
  const [formState, setFormState] = useState("loginForm");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { error, isAuthModalOpen } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState === "loginForm") {
      dispatch(logIn({ email, password }));
    } else if (formState === "registrateForm") {
      dispatch(signUp({ email, password, userName }));
    }
  };
  const toggleFormState = (e) => {
    e.preventDefault();
    if (formState === "loginForm") {
      setFormState("registrateForm");
    } else {
      setFormState("loginForm");
    }
    if (error) {
      dispatch(resetError());
    }
  };

  return (
    <Modal
      open={isAuthModalOpen}
      onClose={() => dispatch(closeModal())}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <form
        onSubmit={handleSubmit}
        className={`${classes.paper} ${classes.modal}`}
      >
        <h2 id="simple-modal-title">
          {formState === "loginForm" ? "Login" : "SignUp"}
        </h2>
        {formState === "registrateForm" && (
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="userName">User name</InputLabel>
            <Input
              defaultValue={userName}
              onChange={({ target }) => setUserName(target.value)}
              id="userName"
              aria-describedby="userName"
            />
          </FormControl>
        )}
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input
            defaultValue={email}
            onChange={({ target }) => setEmail(target.value)}
            id="email"
            aria-describedby="email adress"
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            defaultValue={password}
            onChange={({ target }) => setPassword(target.value)}
            id="password"
            aria-describedby="password"
            type="password"
            autoComplete="true"
          />
        </FormControl>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          {formState === "loginForm" ? "login" : "signup"}
        </Button>
        <FormHelperText error={true}>{error}</FormHelperText>
        <Link href="#" onClick={toggleFormState}>
          {formState === "loginForm" ? "Registrate new one" : "Log in"}
        </Link>
      </form>
    </Modal>
  );
};

export default Auth;
