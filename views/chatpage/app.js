import { checkRoom ,sendMessageToDb} from "../../config/firebase.js";

setTimeout(getRoom,2000);

async function getRoom(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const chatRoom = await checkRoom(id);
    console.log(chatRoom.id);
    messageBox(chatRoom.id)
}
function messageBox(e){
    let roomId = e;
    document.getElementById("messageBox").innerHTML += `
    <div>
    <input id="message" type="text" placeholder="send a message" />
    </div>
    <div>
    <button onclick="sendMessage('${roomId}')">Send</button>
    </div>`
}

window.sendMessage =  function(x){
    debugger;
    const ex = x;
   var text = document.getElementById("message").value
    sendMessageToDb(text,ex)
}