DROP DATABASE IF EXISTS employee_management_systemDB;

CREATE database employee_management_systemDB;

USE employee_management_systemDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,4) NOT NULL, 
  department_id INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE employee (
 id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL, 
manager_id INT NULL,
 PRIMARY KEY (id)
);




ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';