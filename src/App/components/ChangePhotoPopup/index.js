import React, { useState } from "react";
import { Modal, makeStyles, Button, FormHelperText } from "@material-ui/core";
import { storage, auth, db } from "../../../firebase";
import "./ChangePhoto.scss";
import { useSelector, useDispatch } from "react-redux";
import { updateUserPhoto } from "../../store/authReducer";

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

const ChangePhotoPopup = ({ open, setOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [progressLine, setProgress] = useState(0);
  const { userData } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    if (image) {
      const uploadTask = storage.ref(`profile-photos/${image.name}`).put(image);
      let photoUrl = null;

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
            .then((url) => {
              photoUrl = url;
              return Promise.all([
                auth.currentUser.updateProfile({
                  photoURL: url,
                }),
                db.collection("users").doc(auth.currentUser.uid).update({
                  photoURL: url,
                }),
              ]);
            })
            .then(() => {
              dispatch(updateUserPhoto(photoUrl));
              setProgress(0);
              if (userData.photoURL) {
                return storage.refFromURL(userData.photoURL).delete();
              }
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
        <div className="progress-line">
          <div
            className="progress-line__line"
            style={{ width: `${progressLine}%` }}
          ></div>
        </div>
        <input type="file" onChange={handleChange} />
        <Button onClick={handleUpload}>upload</Button>
        <FormHelperText error={true}>{error}</FormHelperText>
      </div>
    </Modal>
  );
};

export default ChangePhotoPopup;
