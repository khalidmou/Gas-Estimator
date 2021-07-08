const password=document.getElementById('password');
const passwordConfirm=document.getElementById('confirm-password');
const username = document.getElementById('username');
var form = document.getElementById("login-form");

var checkForm = function(event) {
  initForm()
  if (username.value.length<4){
    showError('usernameMessage','username must be at least 4 characters')  
    event.preventDefault();
  }
  if (password.value.length<10  ) {
    showError('passwordMessage','Password must contain 10 or more characters')
    event.preventDefault();
  }
  if (password.value !== passwordConfirm.value  ) {
    showError('passwordConfirmationMessage','Password not matching')
    event.preventDefault();       
  } 

}
form.addEventListener("submit", checkForm, true);

var showError = function (divName,message,event){
  document.getElementById(divName).style.color = 'red';
  document.getElementById(divName).innerHTML=message; 
}
var showSuccess = function (divName,message){
  document.getElementById(divName).style.color = 'green';
  document.getElementById(divName).innerHTML =message;
}
var initForm = function (){
username.innerHTML='';
password.innerHTML='';
passwordConfirm.innerHTML='';
}



