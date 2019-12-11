import admin from "./modules/admin";
import express from "express";
import cookieparser from "cookieparser";

const util = require('util')

const port = process.env.PORT || 3000
const app = express();
// admin.auth().verifyIdToken(idToken)
//   .then(function(decodedToken) {
//     let uid = decodedToken.uid;
//     // ...
//   }).catch(function(error) {
//     // Handle error
//   });
// select
app.post("/api/get_all_primatives", async (req, res) => {
  // console.log(`/select: ${req.params}`);
  let db = admin.firestore();
  let desserts = []
  await db
    .collection("kanjicore")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        desserts.push({ id: doc.id, ...doc.data() });
      });
    });
  res.json(desserts);
});

app.post("/api/get_post_by_id", async (req, res) => {
  // console.log(`/select: ${req.params}`);
  // console.log(util.inspect(req, {showHidden: false, depth: 1}))
  // console.log(`/select: ${req.params}`);
  let params = req.query
  let db = admin.firestore();
  let items = [];
  await db
    .collection("kanji")
    .doc(params.id)
    .collection("oboe")
    .where("display", "==", true)
    .limit(5)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        items.push({ id: doc.id, ...doc.data() });
      });
    });
  res.json(items);
});

app.post("/api/post", async (req, res) => {
  // console.log(`/select: ${req.params}`);
  // console.log(util.inspect(req, {showHidden: false, depth: 1}))
  // console.log(`/select: ${req.params}`);
  const parsed = cookieparser.parse(req.headers.cookie);
  const accessTokenCookie = parsed.access_token;
  let params = req.query
  console.log(util.inspect(accessTokenCookie, { showHidden: false, depth: 1 }))
  let db = admin.firestore();
  await admin.auth().verifyIdToken(accessTokenCookie)
    .then(function (decodedToken) {
      //let uid = decodedToken.uid;
      db
        .collection("kanji")
        .doc(params.searchkey)
        .set({
          name: params.searchkey
        }, { merge: true })
        .then(r => {
          db
            .collection("kanji")
            .doc(params.searchkey)
            .collection("oboe")
            .doc(decodedToken.email)
            .set(
              {
                request: false,
                vi: params.vi,
                display: decodedToken.email == "duanvuminh@gmail.com" ? true : false
              }, { merge: true }
            )
        });
    })
  res.json({ message: "ok" });
});

app.post("/api/post1", async (req, res) => {
  // console.log(`/select: ${req.params}`);
  // console.log(util.inspect(req, {showHidden: false, depth: 1}))
  // console.log(`/select: ${req.params}`);
  const parsed = cookieparser.parse(req.headers.cookie);
  const accessTokenCookie = parsed.access_token;
  let params = req.query
  console.log(util.inspect(accessTokenCookie, { showHidden: false, depth: 1 }))
  let db = admin.firestore();
  await admin.auth().verifyIdToken(accessTokenCookie)
    .then(function (decodedToken) {
      //let uid = decodedToken.uid;
      db
        .collection("kanji")
        .doc(params.searchkey)
        .set({
          name: params.searchkey
        }, { merge: true })
        .then(r => {
          db
            .collection("kanji")
            .doc(params.searchkey)
            .collection("oboe")
            .doc(decodedToken.email)
            .set(
              {
                request: true,
                vi: params.vi,
                display: decodedToken.email == "duanvuminh@gmail.com" ? true : false
              }, { merge: true }
            )
        });
    })
  res.json({ message: "ok" });
});

// firebase
//         .firestore()
//         .collection("kanji")
//         .doc(this.searchkey)
//         .get()
//         .then(docSnapshot => {
//           if (docSnapshot.exists) {
//             firebase
//               .firestore()
//               .collection("kanji")
//               .doc(this.searchkey)
//               .collection("oboe")
//               .doc(this.email)
//               .set(
//                 {
//                   couter: 0,
//                   vi: this.commentvi
//                 },
//                 { merge: true }
//               )
//               .then(r => {
//                 this.loading = false;
//               });
//           } else {
//             firebase
//               .firestore()
//               .collection("kanji")
//               .doc(this.searchkey)
//               .set({
//                 name: this.searchkey
//               })
//               .then(r => {
//                 firebase
//                   .firestore()
//                   .collection("kanji")
//                   .doc(this.searchkey)
//                   .collection("oboe")
//                   .doc(this.email)
//                   .set(
//                     {
//                       couter: 0,
//                       vi: this.commentvi
//                     },
//                     { merge: true }
//                   )
//                   .then(r => {
//                     this.loading = false;
//                   });
//               });
//           }
//         });
export default app;