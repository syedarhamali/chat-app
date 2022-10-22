import {addUserToDb, checkUser,signUpFirebase, uploadImage} from "../../config/firebase.js"


window.signup = async function (){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullname = document.getElementById("fullname").value;
    const profile = document.getElementById("image").files[0];
    try{
        document.getElementsByClassName("btn-outline-dark")[0].style.display = "none"  
        document.getElementsByClassName("btn-outline-dark")[1].style.display = "inline-block"  
        await signUpFirebase({email,password});   
        const imageUrl = await uploadImage(profile);
        await addUserToDb({email,fullname,imageUrl})
        checkUser()
    }catch (e){
        switch (e.code){
            case 'auth/email-already-in-use':
                document.getElementsByClassName("btn-outline-dark")[0].style.display = "inline-block"  
                document.getElementsByClassName("btn-outline-dark")[1].style.display = "none" 
                document.getElementById("error").innerText = "Email already registered"
                break;
            case  'auth/weak-password':
                document.getElementsByClassName("btn-outline-dark")[0].style.display = "inline-block"  
                document.getElementsByClassName("btn-outline-dark")[1].style.display = "none" 
                document.getElementById("error").innerText = "Weak password"
                break;
            default :
            document.getElementsByClassName("btn-outline-dark")[0].style.display = "inline-block"  
            document.getElementsByClassName("btn-outline-dark")[1].style.display = "none" 
            document.getElementById("error").innerText = "unknown error occured"
            
        }
        console.log(e.code)
    }
}
