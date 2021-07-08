
document.getElementById('startDate').min = new Date().toISOString().slice(0, 10);
document.getElementById('startDate').value = new Date().toISOString().slice(0, 10);
document.getElementById('submit').disabled = true;
document.getElementById('getquote').disabled = true;

const checkGallons = function() {

    let gallonsQuantity=document.getElementById('gallonsQuantity').value;
    
    if(gallonsQuantity<1 || isNaN(gallonsQuantity)) {
          document.getElementById('submit').disabled = true;
          document.getElementById('getquote').disabled = true;
    } else {

        document.getElementById('submit').disabled = false;
        document.getElementById('getquote').disabled = false;

    }

}

const checkUsernameRegistration = function(){
    let username=document.getElementById('username');

    if (!username.value) {
          document.getElementById('submit').disabled = true;
    } else {

        document.getElementById('submit').disabled = false;

    }
}

var getquote = document.getElementById("getquote");

var checkForm = function(event) {
    $.ajax({
        url: "pricecalculator",
        data:{gallons:document.getElementById('gallonsQuantity').value}
        
      }).done(function(returnedValues) {
        document.getElementById('pricePerGallon').value=returnedValues.price
        document.getElementById('totalPrice').value=returnedValues.total
        
      });
      event.preventDefault();
      

}
getquote.addEventListener("click", checkForm, true);

const submission = function(){

    if(document.getElementById('gallonsQuantity').value){
        document.getElementById('submit').style.visibility="visible";
        document.getElementById('getquote').style.visibility="hidden";
        document.getElementById('gallonsQuantity').readOnly = true;
        document.getElementById('startDate').readOnly = true;
        document.getElementById('CancelLink').style.visibility="visible";
    }

}