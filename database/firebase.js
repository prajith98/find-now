
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/functions'
import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    MESSAGE_SENDER_ID,
    APP_ID
} from 'react-native-dotenv'

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: '',
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID
}

let Firebase = firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore()
export const Func = firebase.functions()
export default Firebase
