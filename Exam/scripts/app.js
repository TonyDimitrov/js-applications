import { get, post, put, del } from './requester.js';

const userKinveyModule = 'user';
const teamKinveyModule = 'appdata';

// const partials = {
//     header: './templates/common/header.hbs',
//     footer: './templates/common/footer.hbs'
// };

const app = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('/', function (ctx) {

        ctx.loggedIn = loggedIn();

        if (ctx.loggedIn) {
            get(teamKinveyModule, 'treks', 'Kinvey')
                .then(res => {
                    ctx.names = getUsername();
                    ctx.treks = res;
                    ctx.hasTreks = [...res].length > 0 ? true : false;
                    console.log(ctx.hasTreks);

                    this.loadPartials(setCommmonPartials())
                        .partial('./templates/home.hbs');

                }).catch(console.log);
        } else {
            this.loadPartials(setCommmonPartials())
                .partial('./templates/home.hbs');
        }

        console.log('outside');
        // this.loadPartials(setCommmonPartials())
        //     .partial('./templates/home.hbs');

    });

    this.get('/register', function (ctx) {
        ctx.loggedIn = loggedIn();
        ctx.names = getUsername();

        this.loadPartials(setCommmonPartials())
            .partial('./templates/forms/register.hbs');
    });

    this.post('/register', function (ctx) {
        const { firstName, lastName, username, password, repeatPassword } = ctx.params;
        if (firstName && lastName && username && password && repeatPassword
            && (password === repeatPassword)) {

            let regieterParams = {
                firstName,
                lastName,
                username,
                password
            };
            post(userKinveyModule, '', regieterParams, 'Basic')
                .then(res => {
                    setSessionStorage(res);
                    ctx.loggedIn = loggedIn();
                    ctx.names = getUsername();
                    ctx.redirect('/');
                }).then(displaySucces('You have successfuly register!'))
                .catch(console.log);
        } else {
            displayError('Invalid input!');
        }
    });

    this.get('/login', function (ctx) {

        this.loadPartials(setCommmonPartials())
            .partial('./templates/forms/login.hbs');
    });

    this.post('/login', function (ctx) {

        const { username, password } = ctx.params;
        if (username && password) {
            post(userKinveyModule, 'login', { username, password }, 'Basic')
                .then(res => {
                    setSessionStorage(res);
                    ctx.redirect('/');
                })
                .then(displaySucces('You have successfuly logged in!'))
                .catch(console.log);
        } else {
            displayError('Invalid input!');
        }

    });

    this.get('/logout', function (ctx) {

        post(userKinveyModule, '_logout', {}, 'Kinvey')
            .then(res => {
                console.log(res);
                destroySession();
                ctx.redirect('/');
            }).then(displaySucces('You have successfuly logged in!'))
            .catch(displayError(console.log));
    });

    this.get('/create', function (ctx) {
        ctx.names = getUsername();
        ctx.loggedIn = loggedIn();
        this.loadPartials(setCommmonPartials())
        .partial('./templates/forms/create.hbs');
    });
    
    this.post('/create', function (ctx) {

        let { location, dateTime, description, imageURL } = ctx.params;
        if (location && dateTime && description && imageURL) {
            post(teamKinveyModule, 'treks', { location, dateTime, description, imageURL , organizer: getUsername(), likes:0}, 'Kinvey')
                .then(res => {
                  //  setSessionStorage(res);
                    ctx.redirect('/');
                })
                .then(displaySucces('You have successfuly create a trek!'))
                .catch(console.log);
        } else {
            displayError('Invalid input!');
        }

    });

    this.get('/details/:id', function (ctx) {
        ctx.loggedIn = loggedIn();
        ctx.names = getUsername();
        this.loadPartials(setCommmonPartials())
        .partial('../templates/trek-info.hbs');
    });

});


function setSessionStorage(res) {
    sessionStorage.setItem('authtoken', res._kmd.authtoken);
    sessionStorage.setItem('userId', res._id);
    sessionStorage.setItem('fullName', res.username);
}

function setCommmonPartials() {
    return {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }
}

function destroySession() {
    return sessionStorage.clear();
}

function loggedIn() {
    return sessionStorage.getItem('authtoken') !== null;
}

function getUsername() {
    return sessionStorage.getItem('fullName');
}

function getToken() {
    return sessionStorage.getItem('authtoken');
}

function getUserId() {
    return sessionStorage.getItem('userId');
}

function displayError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display = 'block';
    errorBox.textContent = message;
    setTimeout(() => { errorBox.style.display = 'none' }, 2000);
}

function displaySucces(message) {
    const errorBox = document.getElementById('successBox');
    errorBox.style.display = 'block';
    errorBox.textContent = message;
    setTimeout(() => { errorBox.style.display = 'none' }, 2000);
}

app.run();
