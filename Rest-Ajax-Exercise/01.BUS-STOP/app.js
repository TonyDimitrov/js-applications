getInfo();

function getInfo() {

    let btn = document.getElementById("submit");
    btn.addEventListener("click", handleClick);

    async function handleClick() {
        console.log("T");
        let inputId = document.getElementById("stopId");
        let val = inputId.value
        busApiCaller(val);
        inputId.value = "";
    }
};
function busApiCaller(busId) {

    let uri = `https://judgetests.firebaseio.com/businfo/${busId}.json`;

    fetch(uri)
        .then(resp => {
            if (resp.ok) {
                displayBusInfo(resp.json());
            } else {
                displayBusInfo(undefined, "Error");
                throw new Error(`No bus stop with id: '${busId}' found. Server returned: `  + resp.status);
            }
        })
        .catch(err => console.log(err));

}

async function displayBusInfo(busInfo, error) {
    busInfo = await busInfo;
    let stopDiv = document.getElementById("stopName");

    if (busInfo && busInfo.buses) {
        stopDiv.innerText = busInfo.name;
        let buses = [];
        for (const busId in busInfo.buses) {
            if (busInfo.buses.hasOwnProperty(busId)) {
                let bus = document.createElement("li");
                const time = busInfo.buses[busId];
                let liValue = `Bus ${busId} arrives in ${time}`
                bus.innerText = liValue;
                buses.push(bus);
            }
        }
        var busFrag = document.createDocumentFragment();
        buses.forEach(b => busFrag.appendChild(b));
        let ulBuses = document.getElementById("buses");
        ulBuses.innerHTML = "";
        ulBuses.appendChild(busFrag);
    }
    else {
        let ulBuses = document.getElementById("buses");
        ulBuses.innerHTML = "";
        stopDiv.innerText = error;
    }

}