import { sendMessageToDb,getMessagesFromDb,auth} from "../../config/firebase.js";

getRoom();
var myroomId;
function getRoom(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(id);
    myroomId = id
}

window.sendMessage = function(){
    var text = document.getElementById("message");
    if(text.value == null){
        return
    }
    else{
        sendMessageToDb(text.value,myroomId);
        text.value = ""
    }
}
getMessages()

function getMessages(){
    getMessagesFromDb(myroomId,(messages)=>{
        const messageEle = document.getElementById("messages");

        messageEle.innerHTML = ''
        for(let item of messages){
            var color;
            var time_align;
            if(item.userId === auth.currentUser.uid){
                color = "orange"
                time_align = "right"
            }
            else{
                color = "blue"
                time_align = "left"
                console.log(auth.currentUser.uid)
            }
            messageEle.innerHTML += `    <div class="message-${color}">
            <p class="message-content">${item.text}</p>
            <div class="message-timestamp-${time_align}">${new Date(item.createdAt).toLocaleTimeString()}</div>
        </div>`
        }
    })

}
