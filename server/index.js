import admin from "./modules/admin";
import express from "express";
import cookieparser from "cookieparser";

var rp = require('request-promise');
const fs = require('fs');
const util = require('util')
const cheerio = require('cheerio')

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
app.get("/api/get_all_primatives", async (req, res) => {
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

app.get("/api/get_random_primatives", async (req, res) => {
  // console.log(`/select: ${req.params}`);
  let db = admin.firestore();
  let desserts = []
  await db
    .collection("kanjicore")
    .where("random", ">=", Math.floor(Math.random() * 250))
    .limit(5)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        desserts.push({ id: doc.id, ...doc.data() });
      });
    });
  res.json(desserts);
});

app.get("/api/get_post_by_id", async (req, res) => {
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
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        items.push({ id: doc.id, ...doc.data() });
      });
    });
  res.json(items);
});

app.get("/api/9gag", async (req, res) => {
  // console.log(`/select: ${req.params}`);
  // console.log(util.inspect(req, {showHidden: false, depth: 1}))
  // console.log(`/select: ${req.params}`);
  let params = req.query
  res.type('json')
  return res.send(await rp(params.id)
    .then())

});
app.get("/api/dic", async (req, res) => {
  // console.log(`/select: ${req.params}`);
  // console.log(util.inspect(req, {showHidden: false, depth: 1}))
  // console.log(`/select: ${req.params}`);
  let params = req.query
  let url=`https://www.weblio.jp/content/${encodeURIComponent(params.id)}`
  try{
    let body = await rp(url)
    .then()
    const $ = cheerio.load(body)
    $('.kijiWrp .kiji .SsdSmlR').remove()
    $('a').attr("href",function( i, val ){
      return `/main/show/${val.split("/").slice(-1)[0] }`
      // item.attr("href",`/main/show/${item.text()}`)
    })
  }catch(e){
    return res.json({ html: "",message:e.message})
  }
  return res.json({ html: $('.kijiWrp .kiji').html() })
});

app.get("/api/strokes", async (req, res) => {
  // console.log(`/select: ${req.params}`);
  // console.log(util.inspect(req, {showHidden: false, depth: 1}))
  // console.log(`/select: ${req.params}`);
  let params = req.query
  let body = await rp(`https://cdn.rawgit.com/KanjiVG/kanjivg/r20160426/kanji/0${params.id}.svg`)
    .then()
  //console.log(body)
  return res.json({ svg: body })

});

app.get("/api/handwriting", async (req, res) => {
  // Imports the Google Cloud client libraries
  let params = req.query
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Bucket where the file resides, e.g. my-bucket';
  // const fileName = 'Path to file within bucket, e.g. path/to/image.png';

  // Read a remote image as a text document
  const [result] = await client.documentTextDetection(
    //`https://firebasestorage.googleapis.com/v0/b/gaonhat-1b0c8.appspot.com/o/manga%2Fduanvuminh%40gmail.com%2F80349664_455085585166328_6015180184280367104_n.jpg?alt=media&token=719d31e4-c2ab-4538-8779-62ccad175706`
    params.id
  );
  const fullTextAnnotation = result.fullTextAnnotation;
  res.json({ result: fullTextAnnotation.text });
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
          hasRequest: true,
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
export default app;
