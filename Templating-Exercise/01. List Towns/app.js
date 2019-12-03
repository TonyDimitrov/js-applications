function handleInput() {

    let btnLoad = document.getElementById('btnLoadTowns');
    btnLoad.addEventListener('click', displatInput);


    async function displatInput() {
        let inpTowns = document.getElementById('towns');
        let towns = inpTowns.value.split(', ');

        let source = await fetch('http://127.0.0.1:5500/01.%20List%20Towns/list-towns.hbs')
            .then(d => d.text());

        const template = Handlebars.compile(source);
        const context = { towns };
        const html = template(context);
        let elDivRoot = document.getElementById('root');
        elDivRoot.innerHTML = html;
        inpTowns.value = "";
    }
}

handleInput();