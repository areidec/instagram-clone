import React, { useState, useEffect, useMemo } from "react";
import "./main-page.scss";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { Card, CardHeader, Avatar, CardMedia } from "@material-ui/core";
import { db } from "../../../firebase";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "60px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    backgroundSize: "contain",
  },
  avatar: {
    backgroundColor: red[500],
  },
  link: {
    color: "#000",
    textDecoration: "none",
  },
}));

const MainPage = () => {
  const classes = useStyles();
  const [lastId, setLastId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [requestNotSub, setReqNotSub] = useState(true);

  useEffect(() => {
    setReqNotSub(false);
    db.collection("posts")
      .orderBy("time", "desc")
      .limit(3)
      .get()
      .then((snapshot) => {
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        if (lastVisible) {
          let data = [];
          snapshot.forEach((doc) => {
            data.push({ post_id: doc.id, ...doc.data() });
          });
          setLastId(lastVisible);
          setPosts((posts) => [...posts, ...data]);
          setReqNotSub(true);
        }
      });
  }, []);

  useEffect(() => {
    let listener;
    if (lastId) {
      listener = function () {
        const height =
          document.getElementById("root").clientHeight - window.innerHeight;
        if (
          height - 100 <= document.documentElement.scrollTop - 100 &&
          requestNotSub
        ) {
          setReqNotSub(false);
          db.collection("posts")
            .orderBy("time", "desc")
            .startAfter(lastId)
            .limit(3)
            .get()
            .then((snapshot) => {
              const lastVisible = snapshot.docs[snapshot.docs.length - 1];
              if (lastVisible) {
                let data = [];
                snapshot.forEach((doc) => {
                  data.push({ post_id: doc.id, ...doc.data() });
                });
                setLastId(lastVisible);
                setPosts((posts) => [...posts, ...data]);
                setReqNotSub(true);
              }
            });
        }
      };
      window.addEventListener("scroll", listener);
    }
    return () => {
      if (listener) {
        window.removeEventListener("scroll", listener);
      }
    };
  }, [lastId, requestNotSub]);

  return (
    <div className="container container_fluid-sm">
      <div className="main-page">
        <main className="main-page__content">
          {posts.map((post) => (
            <Card key={post.post_id} className={classes.root}>
              <Link className={classes.link} to={post.author_id}>
                <CardHeader
                  avatar={
                    <Avatar src={post.author_photo} className={classes.avatar}>
                      {!post.author_photo && post.author[0].toUpperCase()}
                    </Avatar>
                  }
                  title={post.title}
                />
              </Link>
              <CardMedia
                className={classes.media}
                image={post.img}
                title={post.desc}
              />
            </Card>
          ))}
        </main>
        <div className="main-page__side-bar">side bar</div>
      </div>
    </div>
  );
};

export default MainPage;
