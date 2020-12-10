--SQL QUERIES TO INITIALIZE THE DATA; INSERTS DATA IN THE DATABASE--
USE EMPLOYEE_TRACKER;


--inserts values into department table--
INSERT INTO department(name) VALUES("Accounting");
INSERT INTO department(name) VALUES("Human Resources");
INSERT INTO department(name) VALUES("Information Technology");
INSERT INTO department(name) VALUES("Legal");
INSERT INTO department(name) VALUES("Marketing");


--inserts values into role table--
INSERT INTO role(title, salary, department_id) VALUES("Lead Accountant", 100000, 1);
INSERT INTO role(title, salary, department_id) VALUES("Accountant", 75000, 1);

INSERT INTO role(title, salary, department_id) VALUES("HR Manager", 80000, 2);
INSERT INTO role(title, salary, department_id) VALUES("HR Coordinator", 60000, 2);

INSERT INTO role(title, salary, department_id) VALUES("Lead Engingeer", 90000, 3);
INSERT INTO role(title, salary, department_id) VALUES("Software Engineer", 70000, 3);

INSERT INTO role(title, salary, department_id) VALUES("Legal Team Lead", 120000, 4);
INSERT INTO role(title, salary, department_id) VALUES("Lawyer", 100000, 4);

INSERT INTO role(title, salary, department_id) VALUES("Marketing Manager", 75000, 5);
INSERT INTO role(title, salary, department_id) VALUES("Marketer", 60000, 5);


--inserts values into employee table--
INSERT INTO employee(first_name, last_name, role_id) VALUES("Mickey", "Mouse", 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Donald", "Duck", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Roger", "Rabbit", 2, 1);


INSERT INTO employee(first_name, last_name, role_id) VALUES("Minnie", "Mouse", 3);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Jessica", "Rabbit", 4, 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Daisy", "Duck", 4, 4);


INSERT INTO employee(first_name, last_name, role_id) VALUES("Bugs", "Bunny", 5);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Elmer", "Fudd", 6, 7);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Daffy", "Duck", 6, 7);


INSERT INTO employee(first_name, last_name, role_id) VALUES("Luke", "Skywalker", 7);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Han", "Solo", 8, 10);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Lando", "Calrissian", 8, 10);


INSERT INTO employee(first_name, last_name, role_id) VALUES("Hermione", "Granger", 9);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Harry", "Potter", 10, 13);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Ron", "Weasley", 10, 13);