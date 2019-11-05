import firebase from 'firebase';

var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase