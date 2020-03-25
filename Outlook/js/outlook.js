const submit = document.querySelector("#accountSubmit");
console.log("fuk");


submit.addEventListener("click", ()=>{
    console.log($("#signInPassword").textContent);
    var xhr = new XMLHttpRequest();
    xhr.open("get", "http://localhost:3030/Shang?id=5e7a5c51eb77ea7b6c95fda5", true);
    
    xhr.send(null);
    
    xhr.onload = ()=>{
        console.log(xhr.requestText);
    }
})


