import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyAIjDBxLIC-hPbKbg5V_o-Rk_3GNvgAUXY",
  authDomain: "appmgmt-191ad.firebaseapp.com",
  databaseURL: "https://appmgmt-191ad.firebaseio.com",
  projectId: "appmgmt-191ad",
  storageBucket: "appmgmt-191ad.appspot.com",
  messagingSenderId: "667870022647",
  appId: "1:667870022647:web:098e3099249d1c7aa7fcf2"
};

firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const applicantsCollection = db.collection('applicants')
const educationCollection = db.collection('education')
const experienceCollection = db.collection('experience')
const messagesCollection = db.collection('messages')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  applicantsCollection,
  educationCollection,
  experienceCollection,
  messagesCollection
}
