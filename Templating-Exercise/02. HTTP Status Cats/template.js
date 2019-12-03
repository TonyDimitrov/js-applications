(() => {
    renderCatTemplate();

    async function renderCatTemplate() {
        // TODO: Render cat template and attach events
        console.log('Toni');
        console.log(cats[0]);
        const resource = await fetch('http://127.0.0.1:5500/02.%20HTTP%20Status%20Cats/cats-template.hbs')
            .then(r => r.text());

        const template = Handlebars.compile(resource);
        const context = { cats };
        const html = template(context);

        let liCats = document.getElementById('allCats');        
        liCats.innerHTML = html;

        let btnStCode = document.getElementsByClassName('showBtn');
        [...btnStCode].forEach(btn => btn.addEventListener('click', showStCode))
    }

    function showStCode(e){
        let elDiv = e.target.nextElementSibling;
        let displayStatus = elDiv.style.display;

        if (displayStatus === 'none') {
            elDiv.style.display = 'block';
            e.target.innerText = "Hide status code"
        }
        else{
            elDiv.style.display = 'none';
            e.target.innerText = "Show status code"
        }
    }

})()
