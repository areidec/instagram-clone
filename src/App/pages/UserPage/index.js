import React, { useState, useEffect, useMemo } from "react";
import "./userPage.scss";
import { Avatar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import ChangePhotoPopup from "../../components/ChangePhotoPopup";
import AddNewPostPop from "../../components/AddNewPostPop";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: "150px",
    height: "150px",
    fontSize: "75px",

    [theme.breakpoints.down("sm")]: {
      width: "75px",
      height: "75px",
      fontSize: "35px",
    },
  },
}));

const UserPage = () => {
  let { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isLogined, userData } = useSelector((state) => state.auth);
  const { isMobile } = useSelector((state) => state.resolution);
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isOpenPostPop, setOpenPostPop] = useState(false);
  const [posts, setPosts] = useState([]);
  const [lastId, setLastId] = useState(null);
  let limitPage = useMemo(() => (isMobile ? 15 : 9), [isMobile]);
  const [pageData, setPageData] = useState(null);
  const [requestNotSub, setReqNotSub] = useState(true);

  useEffect(() => {
    db.collection("users")
      .doc(id)
      .get()
      .then((page) => {
        setPageData(page.data());
      });
    const sub1 = db
      .collection("posts")
      .where("author_id", "==", id)
      .orderBy("time", "desc")
      .limit(limitPage)
      .onSnapshot((snapshot) => {
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        let data = [];
        snapshot.forEach(function (doc) {
          data.push({ post_id: doc.id, ...doc.data() });
        });
        setPosts([...posts, ...data]);
        setLastId(lastVisible);
      });
    return () => {
      sub1();
      setLastId(null);
      setPosts([]);
    };
  }, [id]);

  useEffect(() => {
    const scrollListener = function () {
      const height =
        document.getElementById("root").clientHeight - window.innerHeight;
      if (
        height - 100 <= document.documentElement.scrollTop - 100 &&
        requestNotSub
      ) {
        getNextPage();
      }
    };
    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [lastId, requestNotSub]);

  useEffect(() => {
    // check if u're login, and this is u'rs page
    if (userData) {
      if (userData.uid === id) {
        setPageData({ ...pageData, photoURL: userData.photoURL });
      }
    }
  }, [userData]);

  const changeAva = () => {
    if (userData && isLogined) {
      if (userData.uid === id) {
        setOpenPopup(true);
      }
    }
  };

  const getNextPage = () => {
    setReqNotSub(false);
    db.collection("posts")
      .where("author_id", "==", id)
      .orderBy("time", "desc")
      .startAfter(lastId)
      .limit(limitPage)
      .get()
      .then((snapshot) => {
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        if (lastVisible) {
          let data = [];
          snapshot.forEach((doc) => {
            data.push({ post_id: doc.id, ...doc.data() });
          });
          setLastId(lastVisible);
          setPosts([...posts, ...data]);
          setReqNotSub(true);
        }
      });
  };

  return (
    <div className="container container_fluid-sm">
      <div className="user-page">
        <div className="user-page__header">
          <div className="user-page__avatar">
            {pageData && (
              <div onClick={changeAva} className="user-page__avatar-wrapper">
                <Avatar className={classes.avatar} src={pageData.photoURL}>
                  {!pageData.photoURL &&
                    pageData.displayName &&
                    pageData.displayName[0].toUpperCase()}
                </Avatar>
              </div>
            )}
          </div>
          <div className="user-page__info">
            <div className="user-page__user-name">
              <h2>{pageData && pageData.displayName}</h2>
              {isLogined &&
                userData &&
                pageData &&
                userData.uid === pageData.user_id && (
                  <div className="add-post-btn">
                    <Button
                      onClick={() => setOpenPostPop(true)}
                      variant="outlined"
                      className="add-post-btn"
                    >
                      add new post
                    </Button>
                  </div>
                )}
            </div>
            {!isMobile && (
              <div className="user-page__bar user-page__bar_desktop">
                <ul className="user-info-bar">
                  <li className="user-info-bar__elem">
                    <p className="user-info-bar__text">
                      <b>
                        {pageData &&
                          pageData.user_posts &&
                          pageData.user_posts.length}
                      </b>
                      posts
                    </p>
                  </li>
                  <li className="user-info-bar__elem">
                    <p className="user-info-bar__text">
                      <b>3</b>subs
                    </p>
                  </li>
                  <li className="user-info-bar__elem">
                    <p className="user-info-bar__text">
                      <b>3</b>observers
                    </p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {isMobile && (
          <ul className="user-info-bar">
            <li className="user-info-bar__elem">
              <p className="user-info-bar__text">
                <b>
                  {pageData &&
                    pageData.user_posts &&
                    pageData.user_posts.length}
                </b>
                posts
              </p>
            </li>
            <li className="user-info-bar__elem">
              <p className="user-info-bar__text">
                <b>3</b>подписчиков
              </p>
            </li>
            <li className="user-info-bar__elem">
              <p className="user-info-bar__text">
                <b>3</b>подписок
              </p>
            </li>
          </ul>
        )}
        <main className="user-page__body">
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.post_id} className="post-list__element">
                <div className="post-list__element-wrapper">
                  <img
                    className="post-list__element-img"
                    src={post.img}
                    alt={post.desc}
                  />
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
      <ChangePhotoPopup open={isOpenPopup} setOpen={setOpenPopup} />
      <AddNewPostPop open={isOpenPostPop} setOpen={setOpenPostPop} />
    </div>
  );
};

export default UserPage;
