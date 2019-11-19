function solve() {

    let busInfo = { name: null, next: "depot" };
    let btnDepart = document.getElementById("depart");
    let btnArrive = document.getElementById("arrive");
    let info = document.querySelector(".info");

    async function depart() {
        let busDepart = await infoFeatchet(busInfo);
        if (busDepart && busDepart.name && busDepart.next) {
            domInteractor(busInfo, busDepart, btnDepart, btnArrive, info)
        }
    }

    async function arrive() {
        let busDepart = await infoFeatchet(busInfo);
        if (busDepart && busDepart.name && busDepart.next) {
            domInteractor(busInfo, busDepart, btnDepart, btnArrive, info)
        }
    }

    function infoFeatchet(busInfo) {
        let uri = `https://judgetests.firebaseio.com/schedule/${busInfo.next}.json`;
        return fetch(uri)
            .then(r => {
                if (r.ok) {
                   return r.json();
                } else {
                    throw ("Error");
                }
            })
            .catch(err => console.log(err));
    }

    function domInteractor(busInfo, busDepart, btnDepart, btnArrive, info) {

        busInfo.name = busDepart.name;
        busInfo.next = busDepart.next;
        
        btnDepart.disabled = btnDepart.disabled ? false : true;
        btnArrive.disabled = btnArrive.disabled ? false : true;

        info.innerHTML = btnDepart.disabled ? `Next stop ${busInfo.name}` : `Arriving at ${busInfo.name}`;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();