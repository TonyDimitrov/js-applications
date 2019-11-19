function attachEvents() {

    let posts = {};
    let btnPosts = document.getElementById("btnLoadPosts");
    btnPosts.addEventListener("click", getPosts)

    let btnComments = document.getElementById("btnViewPost");
    btnComments.addEventListener("click", getComments);

    async function getPosts() {
        posts = await fetch("https://blog-apps-c12bf.firebaseio.com/posts.json")
            .then(r => r.json())
            .catch(r => console.log(r));

        displayOptions(posts);
    }

    async function getComments() {
        let selTitles = document.getElementById("posts");

        let id = selTitles.value;
        let postId = posts[id].id;
        let title = posts[id].title;

        let comments = await fetch("https://blog-apps-c12bf.firebaseio.com/comments.json")
            .then(r => r.json())
            .catch(r => console.log(r));

        let relatedComments = Object.keys(comments).filter(key => comments[key].postId === postId)
            .map(key => comments[key].text);

        displayPost(title, relatedComments);
    }

    function displayOptions(posts) {

        let elFragment = document.createDocumentFragment();

        Object.keys(posts).forEach(p => {
            let optEl = document.createElement("option");
            optEl.value = p;
            optEl.innerText = posts[p].title;
            elFragment.appendChild(optEl);
        });

        let selTitles = document.getElementById("posts");
        selTitles.innerHTML = "";
        clearUiComments();
        selTitles.appendChild(elFragment);
    }

    function displayPost(title, relatedComments) {

        let postTitle = document.getElementById("post-title");
        postTitle.innerText = title;

        let ulComments = document.getElementById("post-comments");
        let liElement = document.createElement("li");
        let liFragmnet = document.createDocumentFragment();

        relatedComments.forEach(c => {
            liElement = document.createElement("li");
            liElement.innerText = c;
            liFragmnet.appendChild(liElement);
        });
        clearUiComments(ulComments);
        ulComments.appendChild(liFragmnet);
    }

    function clearUiComments(ulComments) {
        if (ulComments) {
            ulComments.innerHTML = "";
        } else {
            let ulComments = document.getElementById("post-comments");
            ulComments.innerHTML = "";
        }
    }
}

attachEvents();