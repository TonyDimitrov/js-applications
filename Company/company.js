class Company {

    constructor() {
        this._departments;
    }

    get departments() {
        return this._departments;
    }

    addEmployee(username, salary, position, department) {
        return 5;
    }
}

function solve(a, b) {
    let newObj = Object.create(a, {
        address: {
            writable: true,
            configurable: true,
            enumerable: true,
            value: "Sofia"
        }
    });
    console.log(newObj.age);
}

let obj1 = { name: "Toni", age: 25 }


solve(obj1);