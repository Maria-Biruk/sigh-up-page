// ── Google OAuth ──
// Replace with your Google Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";


// Initialize Google Identity Services
function initGoogleAuth() {

  if (typeof google !== "undefined" && google.accounts) {

    google.accounts.id.initialize({

      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,

    });

  }

}


// Trigger Google sign-in popup
function signInWithGoogle() {

  if (typeof google === "undefined" || !google.accounts) {

    document.getElementById("msg").innerText =
      "Google sign-in not loaded yet. Please try again.";

    return;

  }


  google.accounts.id.prompt();

}



// Handle Google credential
async function handleGoogleCredential(response) {

  const msgEl = document.getElementById("msg");


  try {


    const res = await fetch("/api/auth/google", {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        credential: response.credential

      }),

    });



    const result = await res.json();



    if (result.message) {


      msgEl.style.color = "#16a34a";

      msgEl.innerText = result.message;


      sessionStorage.setItem(
        "username",
        result.name
      );


      setTimeout(() => {

        window.location.href = "landing.html";

      }, 1000);


    } else {


      msgEl.innerText = result.error;


    }



  } catch (err) {


    msgEl.innerText =
      "Google sign-in failed. Please try again.";


  }


}




// Clear inputs
function clearForm() {


  [
    "name",
    "email",
    "password",
    "confirm-password"

  ].forEach(function(id){


    const el = document.getElementById(id);


    if(el) el.value = "";


  });



  const msg = document.getElementById("msg");


  if(msg) msg.innerText = "";


}



window.addEventListener(
  "pageshow",
  clearForm
);



window.addEventListener(
  "DOMContentLoaded",
  function(){


    clearForm();


    setTimeout(clearForm,100);


    initGoogleAuth();


  }

);





// SIGNUP
async function signup() {


  const password =
    document.getElementById("password").value;


  const confirmPassword =
    document.getElementById("confirm-password").value;



  const msgEl =
    document.getElementById("msg");



  if(password !== confirmPassword){


    msgEl.innerText =
      "Passwords do not match";


    return;


  }



  const userData = {


    name:
    document.getElementById("name").value,


    email:
    document.getElementById("email").value,


    password: password,


  };




  try {



    const response = await fetch(
      "/api/auth/signup",
      {

        method:"POST",

        headers:{

          "Content-Type":"application/json"

        },

        body:JSON.stringify(userData)

      }

    );




    const result =
      await response.json();





    if(result.message){


      msgEl.style.color="#16a34a";


      msgEl.innerText =
        result.message;



      setTimeout(()=>{


        window.location.href="login.html";


      },1500);




    }else{


      msgEl.innerText =
        result.error;


    }





  } catch(error){



    msgEl.innerText =
      "Server not responding";


  }



}




// Show password
function showPassword(){


  const password =
    document.getElementById("password");



  if(password.type === "password"){


    password.type="text";


  }else{


    password.type="password";


  }


}