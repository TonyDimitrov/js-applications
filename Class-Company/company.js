class Company {

    constructor() {
        this._departments = [];
    }

    get departments() {
        return this._departments;
    }

    set departments(employee) {
        this._departments.push(employee);
    }


    addEmployee(username, salary, position, department) {
        if (username === "" || username === null || username === undefined
            || salary < 0
            || position === "" || position === null || position === undefined
            || department === "" || department === null || department === undefined) {
            throw new Error("Invalid input!");
        }
        let empDepartment = {
            username,
            salary,
            position,
            department
        };
        this.departments.push(empDepartment);
        return `New employee is hired. Name: ${username}. Position: ${position}`;
    }
}

let cmp = new Company();
cmp.addEmployee("Stanimir", -2000, "engineer", "Construction");
