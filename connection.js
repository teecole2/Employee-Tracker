const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

// CREATE A CONNECTION TO SQL DATABASE
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "employee_management_systemDB"
});

// START CMS IN THE TERMINAL; PROMPT USER FOR ACTION TO BE EXECUTED
function promptUser() {
    const options = [
        "View all employees",
        "View all employees by department",

        "View all employees by manager",

        "View all roles",
        "View all departments",

        "Add department",
        "Add role",
        "Add employee",

        "Update employee role",
        "Update employee manager",

        "DELETE department",
        "DELETE role",
        "DELETE employee",

        "View ALL department budgets",

        "EXIT"];
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: options,
            name: "choice"
        }
    ]).then(response => {
        if (response.choice == options[0]) {
            viewAllEmployees();
        } else if (response.choice == options[1]) {
            viewEmployeesByDepartment();
        } else if (response.choice == options[2]) {
            viewEmployeesByManager();
        } else if (response.choice == options[3]) {
            viewAllRoles();
        } else if (response.choice == options[4]) {
            viewAllDepartments();
        } else if (response.choice == options[5]) {
            addDepartment();
        } else if (response.choice == options[6]) {
            addRole();
        } else if (response.choice == options[7]) {
            addEmployee();
        } else if (response.choice == options[8]) {
            updateRole();
        } else if (response.choice == options[9]) {
            updateEmployeeManager();
        } else if (response.choice == options[10]) {
            deleteDepartment();
        } else if (response.choice == options[11]) {
            deleteRole();
        } else if (response.choice == options[12]) {
            deleteEmployee()
        } else if (response.choice == options[13]) {
            viewAllDepartmentBudgets()
        } else if (response.choice == options[14]) {
            connection.end();

        }
    })
}

// FUNCTION TO VIEW ALL EMPLOYEES
function viewAllEmployees() {
    // JOIN employee, role, AND department TABLES TO COMBINE DATA AND RETURN employee ID, first and last names, title, department, salary, and manager DATA
    // CONCAT (E2.first_name, ' ', E2.last_name) AS manager_name will display the manager ID as manager first name + manager last name
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
                        CONCAT (E2.first_name, ' ', E2.last_name) AS manager_name FROM employee	
                        INNER JOIN role ON role.id = employee.role_id 
                        INNER JOIN department ON department.id = role.department_id
                        LEFT JOIN employee AS E2 ON E2.id = employee.manager_id`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.log("\n");
            // LOG RESULTS TO THE CONSOLE
            console.table(results);
            console.log("\n");
            // RETURN TO START; PROMPT USER FOR ACTION TO BE EXECUTED
            promptUser();
        }
    });
}

// FUNCTION TO VIEW EMPLOYEES BY DEPARTMENT
function viewEmployeesByDepartment() {
    // SELECT ALL FROM department; we will need to ACCESS the results(listOfDepartments) of the callback function
    connection.query("SELECT * FROM department", (error, listOfDepartments) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // create an array to hold department names
            const departmentNames = listOfDepartments.map((department) => department.name);

            inquirer.prompt([
                // prompt user for department to view
                {
                    type: "list",
                    message: "Which department would you like to view?",
                    choices: departmentNames,
                    name: "departmentName"
                },
            ]).then((response) => {
                // JOIN employee, role, AND department TABLES TO COMBINE DATA AND RETURN employee ID, first and last names, and title DATA for the department chosen by user
                connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee 
                                    INNER JOIN role ON role.id = employee.role_id 
                                    INNER JOIN department ON department.id = role.department_id
                                  WHERE ?`, { name: response.departmentName }, (error, results) => {
                    console.log("\n");
                    // DISPLAY results for user
                    console.table(results);
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

// FUNCTION TO VIEW EMPLOYEES BY MANAGER
function viewEmployeesByManager() {
    // SELECT ALL FROM employee; we will need to ACCESS the results(listOfManagers) of the callback function
    connection.query("SELECT id, CONCAT (first_name, ' ', last_name) AS manager_name FROM employee WHERE manager_id IS NULL", (error, listOfManagers) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // create an array to hold manager names
            const managerNames = listOfManagers.map((manager) => manager.manager_name);

            inquirer.prompt([
                // prompt user for name of manager to view
                {
                    type: "list",
                    message: "Which manager's team would you like to view?",
                    choices: managerNames,
                    name: "managerName"
                },

            ]).then((response) => {
                // find manager_id for the manager that matches user's choice
                const manager = listOfManagers.find((manager) => manager.manager_name == response.managerName);

                // SELECT employee id, employee first name and last name, department name, role.title FROM employee table
                connection.query(`SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee 
                                    INNER JOIN role ON role.id = employee.role_id 
                                    INNER JOIN department ON department.id = role.department_id
                                WHERE ?`, { manager_id: manager.id }, (error, results) => {
                    console.log("\n");
                    // DISPLAY results for user
                    console.table(results);
                    console.log("\n");
                    promptUser();
                });
            });
        }
    })
}

// FUNCTION TO VIEW ALL ROLES
function viewAllRoles() {
    // JOIN role AND department TABLES TO COMBINE DATA AND RETURN role ID, title, and department name DATA for the role chosen by user
    connection.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role 
                        INNER JOIN department ON department.id = role.department_id`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.log("\n");
            // DISPLAY results for user
            console.table(results);
            console.log("\n");
            promptUser();
        }
    });
}

// FUNCTION TO VIEW ALL DEPARTMENTS
function viewAllDepartments() {
    // SELECT ALL FROM department
    connection.query(`SELECT * FROM department`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.log("\n");
            // DISPLAY results for user
            console.table(results);
            console.log("\n");
            promptUser();
        }
    });
}

// FUNCTION TO ADD new DEPARTMENT
function addDepartment() {
    // PROMPT USER FOR name OF NEW DEPARTMENT
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "newDepartmentName",
        },
    ]).then((response) => {
        // INSERT NEW department into department table
        connection.query(`INSERT INTO department SET ?`, { name: response.newDepartmentName }, (error, results) => {
            console.log("\n");
            console.log(`Added ${response.newDepartmentName} to the DEPARTMENT database`)
            console.log("\n");
            promptUser();
        });
    });
}

// FUNCTION TO ADD new ROLE
function addRole() {
    // SELECT ALL FROM department; we will need to ACCESS the results(listOfDepartments) of the callback function
    connection.query("SELECT * FROM department", (error, listOfDepartments) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // create an array of the department names
            const departmentNames = listOfDepartments.map((department) => department.name);

            inquirer.prompt([
                // prompt user for department that will house new role
                {
                    type: "list",
                    message: "To which department should the new role belong?",
                    choices: departmentNames,
                    name: "departmentName"
                },
                // prompt user for title of new role
                {
                    type: "input",
                    message: "What is the title for this role?",
                    name: "newRoleTitle",
                },
                // prompt user for salary of new role
                {
                    type: "input",
                    message: "What is the salary for this role?",
                    name: "newRoleSalary",
                },
            ]).then((response) => {
                //find department_id that matches user's department choice
                const department = listOfDepartments.find((department) => department.name == response.departmentName);

                // INSERT NEW role into role table
                connection.query(`INSERT INTO role SET ?`, { title: response.newRoleTitle, salary: response.newRoleSalary, department_id: department.id }, (error, results) => {
                    console.log("\n");
                    console.log(`Added ${response.newRoleTitle} to the ${department.name} department`)
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

// FUNCTION TO ADD new EMPLOYEE
function addEmployee() {
    // SELECT ALL FROM role; we will need to ACCESS the results(listOfRoles) of the callback function
    connection.query("SELECT * FROM role", (error, listOfRoles) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // create an array of the role titles
            const roleTitles = listOfRoles.map((role) => role.title);

            inquirer.prompt([
                // prompt user for employee first name
                {
                    type: "input",
                    message: "Enter the employee's first name",
                    name: "employeeFirst"
                },
                // prompt user for employee last name
                {
                    type: "input",
                    message: "Enter the employee's last name",
                    name: "employeeLast"
                },
                // prompt user for employee title
                {
                    type: "list",
                    message: "What is the title for this employee?",
                    choices: roleTitles,
                    name: "employeeRole",
                },
            ]).then((response) => {
                //find role that matches user's title choice
                const role = listOfRoles.find((role) => role.title == response.employeeRole);
                // INSERT NEW employee into employee table
                connection.query(`INSERT INTO employee SET ?`, { first_name: response.employeeFirst, last_name: response.employeeLast, role_id: role.id }, (error, results) => {
                    console.log("\n");
                    console.log(`Added ${response.employeeFirst} ${response.employeeLast} to the database`)
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

// FUNCTION TO UPDATE EMPLOYEE ROLE
function updateRole() {
    // JOIN employee, role, AND department TABLES TO COMBINE DATA AND RETURN employee ID, first and last names, role ID, title, and department DATA
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role_id, role.title, department.name AS department FROM employee	
                        INNER JOIN role ON role.id = employee.role_id 
                        INNER JOIN department ON department.id = role.department_id`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // DISPLAY results for user
            console.table(results);

            // prompt user for employee to be updated
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter id number for the employee you would like to update.",
                    name: "employeeID"
                },
                // prompt user for updated role
                {
                    type: "input",
                    message: "Enter role_id number for the employee's NEW role",
                    name: "roleID"
                },
            ]).then((response) => {

                // UPDATE employee table with new role ID for employee
                connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [response.roleID, response.employeeID], function (error, results) {
                    if (error) {
                        console.log(error);
                        connection.end();
                    } else {
                        console.log("\n");
                        console.log("The employee role has been updated");
                        console.log("\n");
                        promptUser();
                    }
                })
            })
        }
    });
}

function updateEmployeeManager() {
    // JOIN employee, role, AND department TABLES TO COMBINE DATA AND RETURN employee ID, first and last names, title, department, manager name and manager ID
    // CONCAT (E2.first_name, ' ', E2.last_name) AS manager_name will display the manager ID as manager first name + manager last name
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
                        CONCAT (E2.first_name, ' ', E2.last_name) AS manager_name,  employee.manager_id FROM employee	
                        INNER JOIN role ON role.id = employee.role_id 
                        INNER JOIN department ON department.id = role.department_id
                        LEFT JOIN employee AS E2 ON E2.id = employee.manager_id`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // DISPLAY results for user
            console.table(results);

            // prompt user for employee to be updated
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter id number for the employee you would like to update.",
                    name: "employeeID"
                },
                // prompt user for updated manager
                {
                    type: "input",
                    message: "Enter manager_id number for the employee's NEW manager",
                    name: "managerID"
                },
            ]).then((response) => {
                // UPDATE employee table with new manager ID for employee
                connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [response.managerID, response.employeeID], function (error, results) {
                    if (error) {
                        console.log(error);
                        connection.end();
                    } else {
                        console.log("\n");
                        console.log("The employee manager has been updated");
                        console.log("\n");
                        promptUser();
                    }
                })
            })
        }
    });
}

// FUNCTION TO DELETE DEPARTMENT
function deleteDepartment() {
    // SELECT ALL FROM department; we will need to ACCESS the results(listOfDepartments) of the callback function
    connection.query("SELECT * FROM department", (error, listOfDepartments) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // create an array of the department names
            const departmentNames = listOfDepartments.map((department) => department.name);

            inquirer.prompt([
                // prompt user for department to delete
                {
                    type: "list",
                    message: "Which department would you like to delete?",
                    choices: departmentNames,
                    name: "departmentName"
                },
            ]).then((response) => {
                // DELETE department FROM department table
                connection.query(`DELETE FROM department WHERE ?`, { name: response.departmentName }, (error, results) => {
                    console.log("\n");
                    console.log(`Deleted department from the database`);
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

// FUNCTION TO DELETE ROLE
function deleteRole() {
    // SELECT ALL FROM role; we will need to ACCESS the results(listOfRoles) of the callback function
    connection.query("SELECT * FROM role", (error, listOfRoles) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // create an array of the role titles
            const roleTitles = listOfRoles.map((role) => role.title);

            inquirer.prompt([
                // prompt user for role to delete
                {
                    type: "list",
                    message: "Which role would you like to delete?",
                    choices: roleTitles,
                    name: "roleTitle"
                },
            ]).then((response) => {
                // DELETE role FROM role table
                connection.query(`DELETE FROM role WHERE ?`, { title: response.roleTitle }, (error, results) => {
                    console.log("\n");
                    console.log(`Deleted role from the database`);
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

// FUNCTION TO DELETE EMPLOYEE
function deleteEmployee() {
    // SELECT employee ID number, first and lasdt names from employee table
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // DISPLAY results for user
            console.table(results);

            inquirer.prompt([
                // prompt user for ID number of employee to delete
                {
                    type: "input",
                    message: "Enter id number for the employee you would like to delete.",
                    name: "employeeID"
                },
            ]).then((response) => {
                // DELETE employee FROM employee table
                connection.query(`DELETE FROM employee WHERE ?`, { id: response.employeeID }, function (error, results) {
                    if (error) {
                        console.log(error);
                        connection.end();
                    } else {
                        console.log("\n");
                        console.log(`Deleted employee from the database`);
                        console.log("\n");
                        promptUser();
                    }
                })
            })
        }
    });
}

// FUNCTION TO VIEW ALL DEPARTMENT BUDGETS
function viewAllDepartmentBudgets() {
    // JOIN employee, role, AND department TABLES TO COMBINE DATA AND RETURN budget information by departments
    connection.query(`SELECT department.name AS department, SUM(role.salary) AS budget FROM role 
                        INNER JOIN department ON department.id = role.department_id
                        INNER JOIN employee ON role.id = employee.role_id
                        GROUP BY department.name`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.log("\n");
            // DISPLAY results for user
            console.table(results);
            console.log("\n");
            promptUser();
        }
    });
}

// METHOD TO ESTABLISH CONNECTION  and CALL promptUser FUNCTION TO START APP IN TERMINAL OR THROW ERROR
connection.connect(function (err) {
    if (err) throw err;

    promptUser();

});