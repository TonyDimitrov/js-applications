import { get, post, put, del } from './requester.js';

(() => {
    const userKinveyModule = 'user';
    const teamKinveyModule = 'appdata';

    const partials = {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    };

    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('/index.html', function (ctx) {
            ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));
            ctx.username = sessionStorage.getItem('username');

            this.loadPartials(partials)
                .then(function () {
                    this.partial('./templates/home/home.hbs')
                });
        });

        this.get('/', function (ctx) {
            ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));
            ctx.username = sessionStorage.getItem('username');

            this.loadPartials(partials)
                .then(function () {
                    this.partial('./templates/home/home.hbs')
                });
        });

        this.get('/about', function (ctx) {
            ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));
            ctx.username = sessionStorage.getItem('username');

            console.log(sessionStorage.getItem('authtoken'));
            this.loadPartials(partials)
                .then(function () {
                    this.partial('./templates/about/about.hbs')
                });
        });

        this.get('/catalog', function (ctx) {

            ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));
            ctx.username = sessionStorage.getItem('username');

            get(teamKinveyModule, 'teams', 'Kinvey')
                .then(data => {
                    ctx.hasNoTeam = true;
                    ctx.teams = data;
                    partials['team'] = './templates/catalog/team.hbs';
                    console.log(data);
                    this.loadPartials(partials)
                        .then(function () {
                            this.partial('/templates/catalog/teamCatalog.hbs')
                        });
                }).catch(er => console.log('errr ... ' + er))
        });

        this.get('/logout', function (ctx) {
            ctx.username = "";
            sessionStorage.removeItem('authtoken');
            sessionStorage.removeItem('username');
            this.loadPartials(partials)
                .then(function () {
                    this.partial('./templates/home/home.hbs');
                    ctx.loggedIn = false;
                });
        });

        this.get('/login', function (ctx) {
            ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));
            ctx.username = sessionStorage.getItem('username');

            partials['loginForm'] = './templates/login/loginForm.hbs';
            this.loadPartials(partials)
                .then(function () {
                    this.partial('./templates/login/loginPage.hbs')
                });
        });

        this.post('/login', function (ctx) {
            let passObj = { username: ctx.params.username, password: ctx.params.password }

            post(userKinveyModule, 'login', passObj, 'Basic')
                .then(res => {
                    setSessionStorage(res._kmd.authtoken, ctx.params.username, res._id);

                    ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));
                    ctx.username = ctx.params.username;

                    this.loadPartials(partials)
                        .then(function () {
                            this.partial('./templates/home/home.hbs')
                        });
                }).catch(er => {
                    ctx.error = er
                    this.loadPartials(partials)
                        .then(function () {
                            partials['loginForm'] = './templates/login/loginForm.hbs';
                            this.partial('./templates/login/loginPage.hbs')
                        });
                });
        });

        this.get('/register', function (ctx) {

            partials['registerForm'] = './templates/register/registerForm.hbs';
            this.loadPartials(partials)
                .then(function () {
                    this.partial('./templates/register/registerPage.hbs')
                });
        });

        this.post('/register', function (ctx) {
            if (ctx.params.password === ctx.params.repeatPassword) {

                let passObj = { username: ctx.params.username, password: ctx.params.password, teamId: [] }
                console.log(passObj);

                post(userKinveyModule, '', passObj, 'Basic')
                    .then(res => {
                        setSessionStorage(res._kmd.authtoken, ctx.params.username, res._id);
                        ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));
                        ctx.username = ctx.params.username;

                        this.loadPartials(partials)
                            .then(function () {
                                this.partial('./templates/home/home.hbs')
                            });
                    }).catch(er => {
                        ctx.error = er;
                        this.loadPartials(partials)
                            .then(function () {
                                partials['registerForm'] = './templates/register/registerForm.hbs';
                                this.partial('./templates/register/registerPage.hbs')
                            });
                    });
            }
        });

        this.get('/create', function (ctx) {

            ctx.username = sessionStorage.getItem('username');
            ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));

            partials['createForm'] = './templates/create/createForm.hbs';
            this.loadPartials(partials)
                .then(function () {
                    this.partial('./templates/create/createPage.hbs')
                });
        });

        this.post('/create', function (ctx) {

            ctx.username = sessionStorage.getItem('username');
            ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));

            if (ctx.params.name !== '' && ctx.params.comment !== '') {

                let passObj = { name: ctx.params.name, comment: ctx.params.comment }

                post(teamKinveyModule, 'teams', passObj, 'Kinvey')
                    .then(res => {

                        ctx.username = sessionStorage.getItem('username');
                        ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));

                        setTeamIdForUser(res._id);

                        this.loadPartials(partials)
                            .then(function () {
                                this.partial('./templates/home/home.hbs')
                            });
                    }).catch(er => {
                        ctx.error = er;
                        this.loadPartials(partials)
                            .then(function () {
                                partials['registerForm'] = './templates/register/registerForm.hbs';
                                this.partial('./templates/register/registerPage.hbs')
                            });
                    });
            }
        });

        this.get('#/catalog/:teamId', function (ctx) {

            ctx.username = sessionStorage.getItem('username');
            ctx.loggedIn = isLoggedInUser(sessionStorage.getItem('authtoken'));
            console.log(ctx);
            ctx.isAuthor = false;
            ctx.isOnTeam = false;
            ctx.members = [{username: "noo"},{username: 'roni'}];
            partials['teamMember'] = './templates/catalog/teamMember.hbs';
            partials['teamControls'] = './templates/catalog/teamControls.hbs';
            console.log(partials);

            get(teamKinveyModule, 'teams', 'Kinvey')
            .then(data => {
                ctx.teams = data;

                this.loadPartials(partials)
                .then(function () {
                    this.partial('./templates/catalog/details.hbs')
                });
            }).catch(er => console.log('errr ... ' + er))
            
           
        });

    });

    function isLoggedInUser(token) {
        if (token === undefined || token === null || token === 'undefined' || token === false) {
            return false;
        } else {
            return true;
        }
    }

    function setSessionStorage(authToken, username, userId) {
        sessionStorage.setItem('authtoken', authToken);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userId', userId);
    }

    function setTeamIdForUser(teamId) {

        let userId = sessionStorage.getItem('userId');
        let userObj = {};
        get(userKinveyModule, userId, 'Kinvey')
            .then(res => {
                console.log(res)
                userObj.username = res.username;
                userObj.teamId = res.teamId;
                userObj.teamId.push(teamId);
                put(userKinveyModule, userId, userObj, 'Kinvey')
                    .then(res => {
                        console.log(res);
                    });
            }).catch(er => console.log(er));
    }

    app.run();
})()
