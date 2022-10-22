import { getUsersFromDb, userLogout,checkRoom,auth} from "../../config/firebase.js";

getUsers()
async function getUsers(){
   const users = await getUsersFromDb();
   for(let item of users){
    document.getElementById("users").innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-start text-light bg-dark">
    <img class="user-img bg-light" src='${item.imageUrl}'>
    <div class="ms-2 me-auto">
      <div class="fw-bold">${item.fullname} </div>
      ${item.email}
    </div>
    <span class="badge bg-primary rounded-pill"><button style="border:none;background:transparent;color:white" onclick="initiateChat('${item.userId}')">chat</button></span>
  </li>`
   }
}

window.initiateChat= async function(friendId){
    debugger;
    const chatRoom = await checkRoom(friendId);
    window.location.href = `../chat/index.html?id=${chatRoom.id}`
}


window.logout = function (){
    userLogout();
    window.location.replace("../../index.html")
}