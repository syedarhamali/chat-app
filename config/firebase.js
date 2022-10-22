// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js'
import { getFirestore, query, where, setDoc, doc, addDoc, collection, getDoc, getDocs, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVjPtxiiA7BduUW_RfwxMhaoVS4BozV8U",
    authDomain: "chat-app-arhamm.firebaseapp.com",
    projectId: "chat-app-arhamm",
    storageBucket: "chat-app-arhamm.appspot.com",
    messagingSenderId: "526667051985",
    appId: "1:526667051985:web:9ad19401b866d20c77e6f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

function signInFirebase(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

async function signUpFirebase(userInfo) {
    const { email, password } = userInfo

    return createUserWithEmailAndPassword(auth, email, password);
}

async function uploadImage(image) {
    const storageRef = ref(storage, `images/${image.name}`);
    const snapshot = await uploadBytes(storageRef, image)
    const url = await getDownloadURL(snapshot.ref)
    return url
}

function addUserToDb(userInfo) {
    const userId = auth.currentUser.uid;
    const { email, fullname,imageUrl } = userInfo
    return setDoc(doc(db, "users", userId), { email, fullname,imageUrl, userId })

}
function checkUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            window.location.replace("../chatpage/index.html")

        } else {
            return
            // User is signed out
        }
    });
}



async function getUsersFromDb() {
    const querySnapshot = await getDocs(collection(db, "users"))
    const users = []
    querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() })
    });
    return users
}

// chat config 

async function checkRoom(friendId) {
    try {
        const currentUserId = auth.currentUser.uid
        if(currentUserId == friendId){
            alert("can't chat yourself")
            return;
        }
        const users = { [friendId]: true, [currentUserId]: true }
        const q = query(collection(db, "chatrooms"), where(`users.${friendId}`, "==", true), where(`users.${currentUserId}`, "==", true));
        let room = {}
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            room = doc.data()
            room.id = doc.id
        })
        if (!room.id) {
            return addDoc(collection(db, "chatrooms"), { users, createdAt: Date.now(), lastMessage: {} })
        }
        console.log(room);
        return room;
    } catch (e) {
        console.log(e);

    }
}

async function sendMessageToDb(text, roomId) {
    var Messageid = roomId + Date.now();
    // const lastMessageRef = addDoc(collection(db, "chatrooms", `${roomId}`, "lastMessage"), { text: text, userId: auth.currentUser.uid })
    // await setDoc(lastMessageRef, { text: text, userId: auth.currentUser.uid });
    const message = { text: text, createdAt: Date.now(), userId: auth.currentUser.uid }
    const DocRef = doc(db, "chatrooms", `${roomId}`, "messages", `${Messageid}`);
    await setDoc(DocRef, message);
}

async function getMessagesFromDb(roomId, callback) {
    const q = query(collection(db, "chatrooms", `${roomId}`, "messages"))
    onSnapshot(q, (querySnapshot) => {
        const messages = []
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() })
        })
        console.log(messages);
        callback(messages)
    })
}
function userLogout() {
    auth.signOut();
}

export {
    signInFirebase,
    signUpFirebase,
    uploadImage,
    getUsersFromDb,
    checkRoom,
    addUserToDb,
    checkUser,
    userLogout,
    sendMessageToDb,
    getMessagesFromDb,
    auth
}