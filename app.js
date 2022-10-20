import {getUsersFromDb, signInFirebase, signUpFirebase,checkUser, userLogout} from './config/firebase.js'

checkUser();
showUsers()
window.signup = async function (){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullname = document.getElementById("fullname").value;
    debugger
    try{
      await signUpFirebase({email,password,fullname});
       Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Registered Successfully',
        showConfirmButton: false,
        timer: 1500,
      })
    }catch (e){
        console.log(e);
    }
}

window.login = async function(){
    const email = document.getElementById("user-email").value;
    const password =document.getElementById("user-password").value;
    try{
        await signInFirebase(email,password);
       Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Login Successfully',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (e){
        console.log("e",e.code);
    }
}

async function showUsers(){
   let users =  await getUsersFromDb();
   for(let item of users){
    const elem = document.getElementById("users").innerHTML += `<div>
    <div>${item.email} <button onclick="startChat('${item.userId}')">chat</button></div>
    </div>`
   }
}

window.logout =  function(){
    userLogout();
}

window.startChat = function(e){
    var friendId = e;
    location.href = `./views/chatpage/index.html?id=${friendId}`
}