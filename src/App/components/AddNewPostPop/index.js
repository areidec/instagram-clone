import React, { useState } from "react";
import {
  Modal,
  makeStyles,
  Button,
  FormHelperText,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";
import { storage, auth, db, arrayUnion } from "../../../firebase";
import "./AddNewPostPop.scss";
import { useSelector, useDispatch } from "react-redux";

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

const AddNewPostPop = ({ open, setOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [progressLine, setProgress] = useState(0);
  const { userData } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleSubmit = () => {
    if (image && title.trim().length && desc.trim().length) {
      const uploadTask = storage.ref(`posts-photos/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (e) => {
          setError(e.message);
        },
        () => {
          // success upload
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              return downloadURL;
            })
            .then((imgUrl) => {
              const timeStamp = +new Date();
              return db.collection("posts").add({
                title,
                desc,
                img: imgUrl,
                time: timeStamp,
                author: userData.displayName,
                author_id: userData.uid,
                author_photo: userData.photoURL,
              });
            })
            .then((post) => {
              return db
                .collection("users")
                .doc(userData.uid)
                .update({
                  user_posts: arrayUnion(post.id),
                });
            })
            .then(() => {
              setTitle("");
              setDesc("");
              setProgress(0);
              setImage(null);
              setError(null);
              setOpen(false);
            })
            .catch((e) => setError(e.message));
        }
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={`${classes.paper} ${classes.modal}`}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="title">title post</InputLabel>
          <Input
            defaultValue={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title"
            aria-describedby="title"
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="desc">describe</InputLabel>
          <Input
            defaultValue={desc}
            onChange={({ target }) => setDesc(target.value)}
            id="desc"
            aria-describedby="desc"
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <label htmlFor="file">Post image</label>
          <input id="file" type="file" onChange={handleChange} />
          <Button onClick={handleSubmit}>submit</Button>
          <div className="progress-line">
            <div
              className="progress-line__line"
              style={{ width: `${progressLine}%` }}
            ></div>
          </div>
        </FormControl>
        <FormHelperText error={true}>{error}</FormHelperText>
      </div>
    </Modal>
  );
};

export default AddNewPostPop;
