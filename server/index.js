import admin from "./modules/admin";
import express from "express";
import cookieparser from "cookieparser";
import fulllistkanji from "./listkanji";

var rp = require('request-promise');
const fs = require('fs');
const util = require('util')
// const cheerio = require('cheerio')

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
app.get("/api/get_all_primatives", async(req, res) => {
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

//admin.auth().getUserByEmail(email)
app.get("/api/user", async(req, res) => {
    // console.log(`/select: ${req.params}`);
    try {
        let user = await admin.auth().getUserByEmail(req.query.id)
        let name = user.displayName ?
            user.displayName :
            user.providerData[0].displayName;
        let email = user.email ? user.email : user.providerData[0].email;
        if (!name) {
            name = email.split("@")[0];
        }
        let photoURL = user.photoURL ?
            user.photoURL :
            user.providerData[0].photoURL;
        res.json({ name, email, photoURL });
    } catch (ex) {
        //console.log(ex)
        res.json({ name: "", email: "", photoURL: "" })
    }
});

app.get("/api/get_random_primatives", async(req, res) => {
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

app.get("/api/get_post_by_id", async(req, res) => {
    // console.log(`/select: ${req.params}`);
    // console.log(util.inspect(req, {showHidden: false, depth: 1}))
    // console.log(`/select: ${req.params}`);
    let params = req.query
    let db = admin.firestore();
    let items = [];
    // db
    //   .collection("kanji")
    //   .get()
    //   .then(
    //     querySnapshot => {
    //       querySnapshot.forEach(doc => {
    //         // doc.data() is never undefined for query doc snapshots
    //         db
    //           .collection("kanji")
    //           .doc(doc.id)
    //           .collection("oboe")
    //           .doc("duanvuminh@gmail.com")
    //           .set(
    //             {
    //               total_likeds: 0,
    //             },
    //             { merge: true }
    //           );
    //       db
    //           .collection("kanji")
    //           .doc(doc.id)
    //           .collection("oboe")
    //           .doc("vuminhduan@yahoo.com")
    //           .set(
    //             {
    //               total_likeds: 0,
    //             },
    //             { merge: true }
    //           );
    //       });
    //     });
    try {
        await db
            .collection("kanji")
            .doc(params.id)
            .collection("oboe")
            // .where("display", "==", true)
            .orderBy("total_likeds", "desc")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data().vi) {
                        if (doc.id == "duanvuminh@gmail.com") {
                            items.unshift({ id: doc.id, ...doc.data() });
                        } else {
                            items.push({ id: doc.id, ...doc.data() });
                        }

                    }
                });
            });
    } catch (ex) {
        res.json({});
    }

    res.json(items);
});

app.get("/api/9gag", async(req, res) => {
    // console.log(`/select: ${req.params}`);
    // console.log(util.inspect(req, {showHidden: false, depth: 1}))
    // console.log(`/select: ${req.params}`);
    let params = req.query
    res.type('json')
    return res.send(await rp(params.id)
        .then())

});
// app.get("/api/dic", async(req, res) => {
//     // console.log(`/select: ${req.params}`);
//     // console.log(util.inspect(req, {showHidden: false, depth: 1}))
//     // console.log(`/select: ${req.params}`);
//     let result = ""
//     let params = req.query;
//     let url = `https://kotobank.jp/word/${encodeURIComponent(params.id)}`;
//     try {
//         let body = await rp(url).then();
//         const $ = cheerio.load(body);
//         $("a").map(function(i, el) {
//             // this === el
//             return $(this).attr("href", `/mean/${$(this).text()}`);
//         });
//         $(".pc-iframe-ad").remove();
//         $("img").remove();
//         $(".dictype.cf").map(function(i, el) {
//             // this === el
//             //return $(this).attr("href", `/show/${$(this).text()}`);
//             result += $(this).html()
//         });
//     } catch (e) {
//         // return res.json({ html: "", message: e.message });
//     }
//     url = `https://www.weblio.jp/content/${encodeURIComponent(params.id)}`;
//     try {
//         let body = await rp(url).then();
//         const $ = cheerio.load(body);
//         $("a").map(function(i, el) {
//             // this === el
//             return $(this).attr("href", `/mean/${$(this).text()}`);
//         });
//         $("img").remove();
//         $(".kijiWrp .kiji .SsdSmlR").remove();
//         let html = `
//     ${result}    
//     ${$(".kijiWrp .kiji").html() ? $(".kijiWrp .kiji").html() : ""}`;
//         html ? html : "Không có dữ liệu";
//         return res.json({
//             html: html
//         });
//     } catch (e) {}
//     return res.json({ html: "", message: "ok" });
// });

app.get("/api/strokes", async(req, res) => {
    // console.log(`/select: ${req.params}`);
    // console.log(util.inspect(req, {showHidden: false, depth: 1}))
    // console.log(`/select: ${req.params}`);
    let params = req.query
    let body = await rp(`https://cdn.rawgit.com/KanjiVG/kanjivg/r20160426/kanji/0${params.id}.svg`)
        .then()
        //console.log(body)
    return res.json({ svg: body })

});

app.get("/api/handwriting", async(req, res) => {
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

app.post("/api/post", async(req, res) => {
    // console.log(`/select: ${req.params}`);
    // console.log(util.inspect(req, {showHidden: false, depth: 1}))
    // console.log(`/select: ${req.params}`);
    const parsed = cookieparser.parse(req.headers.cookie);
    const accessTokenCookie = parsed.access_token;
    let params = req.query
        // console.log(util.inspect(accessTokenCookie, { showHidden: false, depth: 1 }))
    let db = admin.firestore();
    await admin.auth().verifyIdToken(accessTokenCookie)
        .then(function(decodedToken) {
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
                        .get()
                        .then(doc => {
                            if (!doc.exists) {
                                db
                                    .collection("kanji")
                                    .doc(params.searchkey)
                                    .collection("oboe")
                                    .doc(decodedToken.email)
                                    .set({
                                        total_likeds: 0,
                                        request: false,
                                        vi: params.vi,
                                        display: decodedToken.email == "duanvuminh@gmail.com" ? true : false
                                    }, { merge: true })
                            } else {
                                db
                                    .collection("kanji")
                                    .doc(params.searchkey)
                                    .collection("oboe")
                                    .doc(decodedToken.email)
                                    .set({
                                        request: false,
                                        vi: params.vi,
                                        display: decodedToken.email == "duanvuminh@gmail.com" ? true : false
                                    }, { merge: true })
                            }
                        })
                });
        })
    res.json({ message: "ok" });
});

app.post("/api/post1", async(req, res) => {
    // console.log(`/select: ${req.params}`);
    // console.log(util.inspect(req, {showHidden: false, depth: 1}))
    // console.log(`/select: ${req.params}`);
    const parsed = cookieparser.parse(req.headers.cookie);
    const accessTokenCookie = parsed.access_token;
    let params = req.query
    console.log(util.inspect(accessTokenCookie, { showHidden: false, depth: 1 }))
    let db = admin.firestore();
    await admin.auth().verifyIdToken(accessTokenCookie)
        .then(function(decodedToken) {
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
                        .set({
                            request: true,
                            vi: params.vi,
                            display: decodedToken.email == "duanvuminh@gmail.com" ? true : false
                        }, { merge: true })
                });
        })
    res.json({ message: "ok" });
});

// app.use((req, res, next) => {
//   res.setHeader("Cache-Control", "public, max-age=31557600, s-maxage=3000");
//   next();
// });

app.get("/api/all", async(req, res) => {
    // console.log(`/select: ${req.params}`);
    // console.log(util.inspect(req, {showHidden: false, depth: 1}))
    // console.log(`/select: ${req.params}`);
    return res.json({ html: fulllistkanji })

});

export default app;