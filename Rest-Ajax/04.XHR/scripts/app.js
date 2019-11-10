// (function loadRepos() {
   
//    let btn = document.querySelector("body > button");
//    const url = "https://api.github.com/repos/testnakov/test-nakov-repo";

//    btn.addEventListener('click', getRepoIssues);

//    function getRepoIssues(){

//       let httpRequest = new XMLHttpRequest();
    
//       httpRequest.addEventListener('readystatechange',   function(){
//          if (httpRequest.readyState == 4 && httpRequest.status == 200) {
//             document.getElementById("res").innerText = httpRequest.responseText;
//          } else{
//             // log error
//             console.log("Error " + httpRequest.readyState);
//          }
//        });
//        httpRequest.open('GET', url);
//        httpRequest.send();    
//    }
// })()

function fetchRepos(){
   let btn = document.querySelector("body > button");
   const url = "https://api.github.com/repos/testnakov/test-nakov-repo";
   btn.addEventListener('click', getRepoIssues);

   function getRepoIssues(){
      fetch(url)
        .then((response) => response.json())
        .then((data) => document.getElementById("res").innerText = JSON.stringify(data))
        .catch((error) => console.error(error))
   }
}