function attachEvents() {

    let btnRefresh = document.getElementById("refresh");
    btnRefresh.addEventListener("click", getMessages);

    let btnSubmit = document.getElementById("submit");
    btnSubmit.addEventListener("click", addMessage);

    async function getMessages() {
        let messages = await fetch("https://rest-messanger.firebaseio.com/messanger.json")
            .then(r => r.json());
        displayMessage(messages);
    }

    async function addMessage() {

        let impAuthor = document.getElementById("author");
        let impContent = document.getElementById("content");

        if (impAuthor.value && impContent.value) {

            let postBody = {};
            postBody.author = impAuthor.value;
            postBody.content = impContent.value;

            let messages = await fetch("https://rest-messanger.firebaseio.com/messanger.json",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postBody)
                })
                .then(r => r.json());
            impAuthor.value = "";
            impContent.value = "";
            getMessages();
        }
    }

    function displayMessage(messages) {
        let msgContent = Object.keys(messages).map(e => { let inrMsg = messages[e]; return `${inrMsg.author}: ${inrMsg.content}` });
        let concatMsg = msgContent.join("&#13;&#10;");
        let textElement = document.getElementById("messages");
        textElement.innerHTML = concatMsg;
    }
}

attachEvents();