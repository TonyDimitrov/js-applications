function processAction() {

    const encoded = btoa("user_toni" + ":" + "pass_toni");
    const uri = "https://baas.kinvey.com/appdata/kid_BJ0yG9m3S/books";
    let id = "";

    let btnLoad = document.getElementById("loadBooks");
    btnLoad.addEventListener('click', getBooks);

    let btnSubmit = document.querySelector("form > button");
    btnSubmit.addEventListener("click", manageBook);

    async function getBooks() {

        books = await requester("GET", uri, encoded);

        displayBooks(books);
        let btnsDelete = document.getElementsByClassName("delete");
        attachEvent(btnsDelete, deleteBook);

        let btnsEdit = document.getElementsByClassName("edit");
        attachEvent(btnsEdit, editBook);

        let h3Form = document.getElementById("form")
        h3Form.innerText = "FORM";
    }

    async function manageBook(e) {
        e.preventDefault();

        let form = getFormInput();
        let book = {};

        if (e.target.attributes.action === "add") {
            book = bindInputToObject(form, book)
            if (book) {
                requester("POST", uri, encoded, book);
            } else {
                return false;
            }
            clear(form.title, form.author, form.isbn, form.tag);
            getBooks();
        } else if (e.target.attributes.action === "edit") {

            book = bindInputToObject(form, book)
            let editUri = uri + "/" + id;
            await requester("PUT", editUri, encoded, book);

            clear(form.title, form.author, form.isbn, form.tag);
            getBooks();
            let h3Form = document.getElementById("form")
            h3Form.innerText = "FORM";
        }
    }

    async function deleteBook(e) {
        let btnDelete = e.target;
        let bookId = btnDelete.value;
        let deleteUri = uri + "/" + bookId;
        await requester("DELETE", deleteUri, encoded);
        getBooks();
    }

    async function editBook(e) {
        let btnEdit = e.target;
        id = btnEdit.value;

        let editUri = uri + "/" + id;
        let book = await requester("GET", editUri, encoded);

        let h3Form = document.getElementById("form")
        h3Form.innerText = "EDIT BOOK";

        let form = getFormInput(true);

        form.title.value = book.title;
        form.author.value = book.author;
        form.isbn.value = book.isbn;
        form.tag.value = book.tags ? book.tags.join(" ") : "";
        btnSubmit.attributes.action = "edit";
    }

    function displayBooks(books) {
        if (books && books.length == 0) {
            return;
        }
        let elTb = document.querySelector('tbody');
        let strTr = '';
        elTb.innerHTML = '';
        for (const book of books) {
            strTr += `<tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td>
                            <button class="edit" value=${book._id}>Edit</button>
                            <button class="delete" value=${book._id}>Delete</button>
                        </td>
                      <tr>`
        }
        elTb.innerHTML = strTr;
    }

    async function requester(method, uri, encoded, body) {
        return await fetch(uri, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Basic " + encoded
            },
            body: JSON.stringify(body)
        }).then(r => r.json())
            .catch(ex => console.log(ex));
    }

    function clear() {
        [...arguments].forEach(p => p.value = '');
    }

    function attachEvent(btns, callBack) {
        Array.from(btns).forEach(btn => btn.addEventListener("click", callBack));
    }

    function getFormInput(isAdd = false) {
        let form = {};
        let inpTitle = document.getElementById("title");
        let inpAuthor = document.getElementById("author");
        let inpIsbn = document.getElementById("isbn");
        let inpTag = document.getElementById("tag");

        if (inpTitle.value && inpAuthor.value && inpIsbn.value || isAdd) {
            form.title = inpTitle;
            form.author = inpAuthor;
            form.isbn = inpIsbn;
            form.tag = inpTag;
            return form;
        }
        return undefined;
    }

    function bindInputToObject(form, book) {

        if (form) {
            book.title = form.title.value;
            book.author = form.author.value;
            book.isbn = form.isbn.value;
            book.tags = form.tag.value
                .split(" ")
                .filter(x => x != " ");
            if (form.tags && form.tags.length) {
                book.tags = form.tags;
            }
            return book;
        }
        return false;
    }
}

processAction();