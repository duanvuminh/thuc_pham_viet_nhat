import admin from "./modules/admin";
import express from "express";
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
    let desserts=[]
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

export default app;