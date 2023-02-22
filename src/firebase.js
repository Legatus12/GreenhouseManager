import { initializeApp } from 'firebase/app'
import { getFirestore, doc, collection, query, where, onSnapshot, addDoc, deleteDoc, updateDoc } from 'firebase/firestore'

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyAdChTp2cjnZCss2dMrv56HOol-e7ZfeD0",
    authDomain: "virtualspaces-fb.firebaseapp.com",
    projectId: "virtualspaces-fb",
    storageBucket: "virtualspaces-fb.appspot.com",
    messagingSenderId: "12888717214",
    appId: "1:12888717214:web:39c083fe310f43cad7488f",
    measurementId: "G-YQMMVLYYP4"
})

const db = getFirestore(firebaseApp)

export const getUser = (username, callback) => onSnapshot(query(collection(db, 'users'), where("username", "==", username)), callback)
export const addUser = (user) => addDoc(collection(db, 'users'), user)

export const getSpaces = (user, callback) => onSnapshot(query(collection(db, 'spaces'), where("user", "==", user)), callback)
export const addSpace = (space) => addDoc(collection(db, 'spaces'), space)
export const deleteSpace = (id) => {
    onSnapshot(query(collection(db, 'devices'), where("space", "==", id)), (docs) => {
        docs.forEach(deviceDoc => deleteDoc(doc(db, 'devices', deviceDoc.id))) // He optado por la opción de borrar todos los dispositivos de un espacio borrado
    })
    deleteDoc(doc(db, 'spaces', id))
}
export const getDevices = (user, callback) => onSnapshot(query(collection(db, 'devices'), where("user", "==", user)), callback)
export const addDevice = (device) => addDoc(collection(db, 'devices'), device)
export const deleteDevice = (id) => deleteDoc(doc(db, 'devices', id))
export const updateDevice = (id, device) => updateDoc(doc(db, "devices", id), device)

export const getUnits = (callback) => onSnapshot(collection(db, 'units'), callback)