import { initializeApp } from 'firebase/app'
import { getFirestore, collection, onSnapshot, query, where, addDoc } from 'firebase/firestore'

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyA2S2l83X8pdsg1V_WgAuy01JJyJeg39fI",
    authDomain: "greenhouse-fb.firebaseapp.com",
    projectId: "greenhouse-fb",
    storageBucket: "greenhouse-fb.appspot.com",
    messagingSenderId: "954983107239",
    appId: "1:954983107239:web:63f6cd0c3ae667ae6ea982",
    measurementId: "G-YDPE7NFG0V"
})

const db = getFirestore(firebaseApp)

export const getUser = (username, callback) => onSnapshot(query(collection(db, 'users'), where("username", "==", username)), callback)
export const addUser = (user) => addDoc(collection(db, 'users'), user)

export const getSpaces = (user, callback) => onSnapshot(query(collection(db, 'spaces'), where("user", "==", user)), callback)
export const addSpace = (space) => addDoc(collection(db, 'spaces'), space)

export const getDevices = (user, callback) => onSnapshot(query(collection(db, 'devices'), where("user", "==", user)), callback)
export const addDevice = (device) => addDoc(collection(db, 'devices'), device)