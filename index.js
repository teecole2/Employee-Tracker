//These are all of the dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

//This is my connection
var connection = mysql.createConnection({
  ost: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_management_systemDB",
});

function validateString(answer) {
  if (answer != "" && isNaN(parseInt(answer))) {
    return true;
  } return false;
}
function validateNumber(answer) {
  if (answer != "" && !isNaN(parseInt(answer))) {
    return true;
  } return false;
}
function main() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "mainMenu",
        message: "Select an option:",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "Add An Employee",
          "Add A Role",
          "Add A Department",
          "Update Employee Role // Assign Manager to Employee",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.mainMenu) {
        case "View All Employees":
          var query = connection.query("SELECT * FROM employee", function (
            err,
            data
          ) {
            if (err) throw err;
            console.table(data);
            continuePrompt();
          });
          break;
        
        case "View All Departments":
          var query = connection.query("SELECT * FROM department", function (
            err,
            data
          ) {
            if (err) throw err;
            console.table(data);
            continuePrompt();
          });
          break;
        
        case "View All Roles":
          var query = connection.query("SELECT * FROM role", function (
            err,
            data
          ) {
            if (err) throw err;
            console.table(data);
            continuePrompt();
          });
          break;

        case "Add A Role":
          var query = connection.query(
            "SELECT id, department FROM department",
            function (err, data) {
              if (err) throw err;
              let choices = data.map((x) => `${x.id} - ${x.department}`);
              inquirer
                .prompt([
                  {
                    type: "input",
                    name: "title",
                    message: "Enter role name:",
                    validate: validateString,
                  },
                  {
                    type: "input",
                    name: "salary",
                    message: "Enter salary:",
                    validate: validateNumber,
                  },
                  {
                    type: "list",
                    name: "department",
                    message: "Select a department:",
                    choices: [...choices],
                  },
                ])
                .then(function (data) {
                  var arr = data.department.split(" ");
                  var deptID = parseInt(arr[0]);
                  var query = connection.query(
                    `INSERT INTO role (title, salary, department_id) VALUES ('${data.title}', ${data.salary}, ${deptID})`,
                    function (err, data) {
                      if (err) throw err;
                      console.log("A role has been added to the table!!");
                      continuePrompt();
                    }
                  );
                });
            }
          );
          break;

        case "Add An Employee":
          var query = connection.query("SELECT id, title FROM role", function (
            err,
            data
          ) {
            if (err) throw err;
            let choices = data.map((x) => `${x.id} - ${x.title}`);
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "firstName",
                  message: "Enter employee's first name: ",
                  validate: validateString,
                },
                {
                  type: "input",
                  name: "lastName",
                  message: "Enter employee's last name: ",
                  validate: validateString,
                },
                {
                  type: "list",
                  name: "role",
                  message: "Select employee's role:",
                  choices: [...choices],
                },
              ])
              .then(function (data) {
                var arr = data.role.split(" ");
                var roleID = parseInt(arr[0]);
                var query = connection.query(
                  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.firstName}', '${data.lastName}', ${roleID}, 0)`,
                  function (err, data) {
                    if (err) throw err;
                    console.log("An employee has been added!!");
                    continuePrompt();
                  }
                );
              });
          });
          break;

        case "Add a Department":
          inquirer
            .prompt([
              {
                type: "input",
                name: "department",
                message: "Enter department's name:",
                validate: validateString,
              },
            ])
            .then(function (data) {
              var query = connection.query(
                `INSERT INTO department (department) VALUES ('${data.department}');`,
                function (err, data) {
                  if (err) throw err;
                  return data;
                }
              );
              console.log("Department has been added!!");
              continuePrompt();
            });
          break;

        case "Update Employee Role // Assign Manager to Employee":
          const emp = {
            first_name: "",
            last_name: "",
            role_id: 0,
            manager_id: 0,
            empID: 0,
          };
          var query = connection.query(
            "SELECT id, first_name, last_name FROM employee",
            function (err, data) {
              if (err) throw err;
              let choices = data.map(
                (x) => `${x.id} - ${x.first_name} ${x.last_name}`
              );
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "employee",
                    message: "Select an employee:",
                    choices: [...choices],
                  },
                ])
                .then(function (data) {
                  var arr = data.employee.split(" ");
                  emp.empID = parseInt(arr[0]);
                  inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "firstName",
                        message: "Enter the employee's first name:",
                        validate: validateString,
                      },
                      {
                        type: "input",
                        name: "lastName",
                        message: "Enter the employee's last name:",
                        validate: validateString,
                      },
                    ])
                    .then(function (data) {
                      emp.first_name = data.firstName;
                      emp.last_name = data.lastName;
                      var query = connection.query(
                        "SELECT id, title FROM role",
                        function (err, data) {
                          if (err) throw err;
                          let choices = data.map((x) => `${x.id} - ${x.title}`);
                          inquirer
                            .prompt([
                              {
                                type: "list",
                                name: "title",
                                message: "Select a role: ",
                                choices: [...choices],
                              },
                            ])
                            .then(function (data) {
                              var arr = data.title.split(" ");
                              emp.role_id = parseInt(arr[0]);
                              var query = connection.query(
                                "SELECT id, first_name, last_name FROM employee",
                                function (err, data) {
                                  if (err) throw err;
                                  let choices = data.map(
                                    (x) =>
                                      `${x.id} - ${x.first_name} ${x.last_name}`
                                  );
                                  choices.push(
                                    "This employee has no manager"
                                  );
                                  inquirer
                                    .prompt([
                                      {
                                        type: "list",
                                        name: "manager",
                                        message:
                                          "Select this employee's manager:",
                                        choices: [...choices],
                                      },
                                    ])
                                    .then(function (data) {
                                      if (
                                        data.manager ===
                                        "This employee has no manager"
                                      ) {
                                        emp.manager_id = null;
                                      } else {
                                        var arr = data.manager.split(" ");
                                        emp.manager_id = parseInt(arr[0]);
                                      }
                                      var query = connection.query(
                                        `UPDATE employee SET first_name = '${emp.first_name}', last_name = '${emp.last_name}', role_id = ${emp.role_id}, manager_id = ${emp.manager_id} WHERE id = ${emp.empID}`,
                                        function (err, data) {
                                          if (err) throw err;
                                          continuePrompt();
                                          return data;
                                        }
                                      );
                                    });
                                }
                              );
                            });
                        }
                      );
                    });
                });
            }
          );
          break;
      }
    });
}
main();