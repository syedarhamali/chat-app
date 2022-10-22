import {checkUser,signInFirebase} from '../../config/firebase.js'

checkUser();

window.login = async function(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try{
        document.getElementsByClassName("btn-outline-dark")[0].style.display = "none"  
        document.getElementsByClassName("btn-outline-dark")[1].style.display = "inline-block"  
        await signInFirebase(email,password);
    } catch (e){
        switch (e.code){
            case 'auth/user-not-found':
            document.getElementsByClassName("btn-outline-dark")[0].style.display = "inline-block"  
            document.getElementsByClassName("btn-outline-dark")[1].style.display = "none" 
            document.getElementsByClassName("error")[0].innerText = "User Not Found"
            break;
            case 'auth/wrong-password':
                document.getElementsByClassName("btn-outline-dark")[0].style.display = "inline-block"  
                document.getElementsByClassName("btn-outline-dark")[1].style.display = "none" 
                document.getElementsByClassName("error")[0].innerText = "Invalid password"
                break;
            default:
                document.getElementsByClassName("btn-outline-dark")[0].style.display = "inline-block"  
                document.getElementsByClassName("btn-outline-dark")[1].style.display = "none" 
                document.getElementsByClassName("error")[0].innerText = "unknown error occured"
        }
    }
}

