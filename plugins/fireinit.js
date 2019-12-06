import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCniellt7ZkxGUk6r3ISo476bkwc0ya3OA",
  authDomain: "gaonhat-1b0c8.firebaseapp.com",
  databaseURL: "https://gaonhat-1b0c8.firebaseio.com",
  projectId: "gaonhat-1b0c8",
  storageBucket: "gaonhat-1b0c8.appspot.com",
  messagingSenderId: "123013934241",
  appId: "1:123013934241:web:3055123c28ad60838f94e0",
  measurementId: "G-6XKE2PS3YR"
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}
firebase.app()
  .firestore()
  .enablePersistence()
export default firebase