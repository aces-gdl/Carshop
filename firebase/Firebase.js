import * as firebase from 'firebase'


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCvEzjjNVh9HhsAshYKDqBB2RVR8LS93xs",
    authDomain: "carshopmanager.firebaseapp.com",
    databaseURL: "https://carshopmanager.firebaseio.com",
    projectId: "carshopmanager",
    storageBucket: "carshopmanager.appspot.com",
    messagingSenderId: "674158416989"
  };
export const FirebaseRef = firebase.initializeApp(config);
