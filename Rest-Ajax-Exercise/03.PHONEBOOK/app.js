function attachEvents() {

    let dbPhones = {};

    let btnLoad = document.getElementById("btnLoad");
    btnLoad.addEventListener("click", getPhones);

    let btnCrate = document.getElementById("btnCreate");
    btnCreate.addEventListener("click", addPhone);

    async function getPhones() {
        let phones = await fetch("https://phonebook-nakov.firebaseio.com/phonebook.json")
            .then(r => r.json());
        buildList(phones);

        let btnDelCollection = document.getElementsByClassName("btnDelete");
        [...btnDelCollection].forEach(e => e.addEventListener("click", deletePhone));
    }

    async function deletePhone(e) {
        let btn = e.target;
        let phoneKey = btn.value;

        await fetch(`https://phonebook-nakov.firebaseio.com/phonebook/${phoneKey}.json`,
            {
                method: 'DELETE'
            })
            .then(r => r.json());

        getPhones();
    }

    async function addPhone() {

        let impPerson = document.getElementById("person");
        let impPhone = document.getElementById("phone");
        let postBody = {};
        if (impPerson.value && impPhone.value) {
            postBody.person = impPerson.value;
            postBody.phone = impPhone.value;
            let postRequest = await fetch("https://phonebook-nakov.firebaseio.com/phonebook.json", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postBody)
            });
            impPerson.value = "";
            impPhone.value = "";
            getPhones();
        }
    }

    function buildList(phones) {
        let liElements = Object.keys(phones).map(e => {
            let inrObj = phones[e];
            let li = document.createElement("li");
            li.innerText = `${inrObj.person} : ${inrObj.phone}`;
            let btn = document.createElement("button");
            btn.value = e;
            btn.innerText = "Delete";
            btn.className = "btnDelete";
            li.appendChild(btn);
            return li
        });
        let liFragment = document.createDocumentFragment()
        liElements.forEach(e => liFragment.appendChild(e));
        let ulElement = document.getElementById("phonebook");
        ulElement.innerHTML = "";
        ulElement.appendChild(liFragment);
    }
}

attachEvents();