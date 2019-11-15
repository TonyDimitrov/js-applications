getInfo();

function getInfo() {

    let btn = document.getElementById("submit");
    btn.addEventListener("click", handleClick);

    async function handleClick() {
        console.log("T");
        let inputId = document.getElementById("stopId");
        let val = inputId.value
        let busInfo = await busApiCaller(val);
        displayBusInfo(busInfo)
    }
};
async function busApiCaller(busId) {
    return await fetch(`https://judgetests.firebaseio.com/businfo/${busId}.json`).then(f => f.json());
}

function displayBusInfo(busInfo) {
    if (busInfo && busInfo.buses) {
        let stopDiv = document.getElementById("stopName");
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

}