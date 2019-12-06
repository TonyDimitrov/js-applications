import { get, post, put, del } from './requester.js';

const userKinveyModule = 'user';
const collectionKinveyModule = 'appdata';

// const partials = {
//     header: './templates/common/header.hbs',
//     footer: './templates/common/footer.hbs'
// };

const app = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('/', function (ctx) {

        ctx.loggedIn = loggedIn();

        if (ctx.loggedIn) {
            get(collectionKinveyModule, 'recipes', 'Kinvey')
                .then(res => {
                    console.log(res);
                    ctx.names = getUserFullName();
                    ctx.recipes = res;
                    this.loadPartials(setCommmonPartials())
                        .partial('./templates/home.hbs');

                }).catch(console.log);
        } else {
            this.loadPartials(setCommmonPartials())
                .partial('./templates/home.hbs');
        }

    });

    this.get('/share', function (ctx) {
        ctx.loggedIn = loggedIn();
        ctx.names = getUserFullName();

        this.loadPartials(setCommmonPartials())
            .partial('./templates/forms/share.hbs');

    });

    this.post('/share', function (ctx) {
        ctx.loggedIn = loggedIn();
        ctx.names = getUserFullName();

        let { meal, ingredients, prepMethod, description, foodImageURL, category } = ctx.params;
        ingredients = ingredients.split(', ');    

        post(collectionKinveyModule, 'recipes', { meal, ingredients, prepMethod, description, foodImageURL, category, likesCounter : 0, categoryImageURL: getCetegoryImage(category) }, 'Kinvey')
            .then(res => {
                ctx.redirect('/');
            }).catch(console.log);
    });

    this.get('/register', function (ctx) {
        ctx.loggedIn = loggedIn();
        ctx.names = getUserFullName();

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
                    ctx.names = getUserFullName();
                    ctx.redirect('/');
                }).catch(console.log);
        }
        ctx.redirect('/register');
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
                }).catch(console.log);
        }
        ctx.redirect('/login');
    });

    this.get('/logout', function (ctx) {

        post(userKinveyModule, '_logout', {}, 'Kinvey')
            .then(res => {
                console.log(res);
                destroySession();
                ctx.redirect('/');
            }).catch(console.log);
    });
    //TODO
    this.get('/recipe/:id', function (ctx) {

        let recipeId = ctx.params.id.substring(1);

        get(collectionKinveyModule, `recipes/${recipeId}`)
            .then(res => {

                ctx.creator = (getUserId() === res._acl.creator);
                console.log(getUserId());
                console.log(res._acl.creator);
                ctx.loggedIn = loggedIn();
                ctx.names = getUserFullName();
                ctx.recipe = res;
                this.loadPartials(setCommmonPartials())
                    .partial('../templates/recipe.hbs');
            });
    });
});


function setSessionStorage(res) {
    sessionStorage.setItem('authtoken', res._kmd.authtoken);
    sessionStorage.setItem('userId', res._id);
    sessionStorage.setItem('fullName', `${res.firstName} ${res.lastName}`);
}

function setCommmonPartials() {
    return {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }
}

function destroySession() {
    sessionStorage.clear();
}

function loggedIn() {
    return sessionStorage.getItem('authtoken') !== null;
}

function getUserFullName() {
    return sessionStorage.getItem('fullName');
}

function getToken() {
    return sessionStorage.getItem('authtoken');
}

function getUserId() {
    return sessionStorage.getItem('userId');
}

function getCetegoryImage(categoryName) {
    let images = {
        "Grain Food": "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
        "Milk, cheese, eggs and alternatives": "https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg",
        "Vegetables and legumes/beans CATEGORY": "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg",
        "Fruits CATEGORY": "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg",
        "Lean meats and poultry, fish... CATEGORY": "https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg"
    }

    return images[categoryName];
}
app.run();
