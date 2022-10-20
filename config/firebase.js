// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js'
import { getFirestore, query, where, setDoc, doc, addDoc, collection, getDoc, getDocs,onSnapshot } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js'
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

function signInFirebase(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

async function signUpFirebase(userInfo) {
    const { email, password } = userInfo

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await addUserToDb(userInfo, userCredential.user.uid);
}

function addUserToDb(userInfo, uid) {
    const userId = uid;
    const { email, fullname } = userInfo
    return setDoc(doc(db, "users", userId), { email, fullname, userId })

}
function checkUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log(auth)

        } else {
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

async function checkRoom(friendId) {
        try{
            const currentUserId = auth.currentUser.uid
            const users = { [friendId]: true, [currentUserId]: true }
            const q = query(collection(db, "chatrooms"),where (`users.${friendId}`,"==",true),where (`users.${currentUserId}`,"==",true));
            let room = {}
            const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    room = doc.data() 
                    room.id = doc.id 
                })
                if(!room.id){
                    return addDoc(collection(db, "chatrooms"), {users,createdAt: Date.now(),lastMessage: {}  })
                }
            return room;
    }catch(e){
        console.log(e);
        
    }
}

async function sendMessageToDb(text,roomId){
    debugger;
    const message = {text: text,createdAt: Date.now(),userId: auth.currentUser.uid}
    const DocRef = collection(db,`chatrooms,${roomId},messages`);
   const result = await setDoc(DocRef, `${message}`);
   console.log(result); 
}

function userLogout() {
    auth.signOut();
}

export {
    signInFirebase,
    signUpFirebase,
    getUsersFromDb,
    checkRoom,
    checkUser,
    userLogout,
    sendMessageToDb
}