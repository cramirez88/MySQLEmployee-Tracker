// ---------------------------------------------------------------------------------------
// Importing the necessary packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');
// ---------------------------------------------------------------------------------------
// Creating a connection to the MySQL database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Username
    user: "root",

    // Password
    password: "Mayla1997", // root password
    database: "employeeDB" // MySQL database being referenced
});


connection.connect(function (err) {

    if (err) throw err;

   
    
    employeeManager();
});

function employeeManager() {
    
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View all employees by department",
            "View all employees by role",
            "Add department",
            "Add role",
            "Add employee",
            "Update employee role",
            "Exit"
        ]
    }).then(function (answer) {
       
        switch (answer.action) {
            case "View all employees": {
                viewAllEmployees();
                break;
            }
            case "View all employees by department": {
                viewAllByDepartment();
                break;
            }
            case "View all employees by role": {
                viewAllByRole();
                break;
            }
            case "Add department": {
                addDepartment();
                break;
            }
            case "Add role": {
                addRole();
                break;
            }
            case "Add employee": {
                addEmployee();
                break;
            }
            case "Update employee role": {
                updateEmployeeRole();
                break;
            }
            case "Exit": {
                connection.end();
                break;
            }
        }
    })
}

function viewAllEmployees() {
   
    var query = (
       
        "SELECT " +
        "e.id AS EmployeeID, " +
        "e.first_name AS FirstName, " +
        "e.last_name AS LastName, " +
        "r.title AS JobTitle, " +
        "d.department_name AS DepartmentName, " +
        "r.salary AS Salary, " +
        "CONCAT(manager.first_name, ' ', manager.last_name) AS ManagerName " +


        "FROM employees AS e " +

     
        "INNER JOIN roles AS r ON (e.role_id = r.id) " +


        "INNER JOIN departments AS d ON (r.department_id = d.id) " +

  
        "LEFT JOIN employees manager ON manager.id = e.manager_id " +

 
        "ORDER BY e.id"
    );

  
    connection.query(query, function (err, res) {
        // If there's an error, throw the error
        if (err) throw err;

        // CONSOLE TABLE DISPLAY OF THE RESPONSE
        console.table(res);

        // Running employee manager again
        employeeManager();
    });
}
// ---------------------------------------------------------------------------------------
function viewAllByDepartment() {
    // Creating the query selector to be used to get the data from MySQL
    // This query gets ALL of the department names
    var query1 = (
        "SELECT " +
        "d.department_name " +
        "FROM departments AS d"
    );

    // Making the query to the database
    connection.query(query1, function (err1, res1) {
        // If there's an error, throw the error 
        if (err1) throw err1;

        // Creating an empty array for future use
        var listOfDepartmentNames = [];

        // Looping through the response object
        for (var i = 0; i < res1.length; i++) {
            // Pushing the department name into the listOfDepartmentNames
            listOfDepartmentNames.push(res1[i].department_name);
        }

        // Running inquirer to ask the user what department they want to select
        inquirer.prompt({
            name: "deptSelect",
            type: "list",
            message: "From which department would you like to select?",
            choices: listOfDepartmentNames // Using the array – consisting of all the department names – to create the list of choices
        }).then(function (answer) {

            var query2 = (
                // Similar query to the one in viewAllEmployees()
                "SELECT " +
                "d.department_name AS DepartmentName, " +
                "e.first_name AS First_Name, " +
                "e.last_name AS Last_Name, " +
                "r.title AS RoleTitle, " +
                "r.salary AS Salary, " +
                "CONCAT(manager.first_name, ' ', manager.last_name) AS Manager " +
                "FROM employees AS e " +
                "INNER JOIN roles AS r ON (e.role_id = r.id) " +
                "INNER JOIN departments AS d ON (r.department_id = d.id) " +
                "LEFT JOIN employees manager ON manager.id = e.manager_id " +
              
                "WHERE d.department_name = (?)"
            );

        
            connection.query(query2, [answer.deptSelect], function (err2, res2) {
             
                if (err2) throw err2;

                console.table(res2);

                // Running employee manager again
                employeeManager();
            });
        });
    });
}
// ---------------------------------------------------------------------------------------
function viewAllByRole() {
    // Creating the query selector to be used to get the data from MySQL
    // This query gets ALL of the role names
    var query1 = (
        "SELECT " +
        "r.title " +
        "FROM roles AS r"
    );

    // Making the query to the database
    connection.query(query1, function (err1, res1) {
        // If there's an error, throw the error 
        if (err1) throw err1;

        // Creating an empty array for future use
        var listOfRoleTitles = [];

        // Looping through the response object
        for (var i = 0; i < res1.length; i++) {
            // Pushing the role name into the listOfRoleTitles
            listOfRoleTitles.push(res1[i].title);
        }

        // Running inquirer to ask the user what role title they want to select
        inquirer.prompt({
            name: "roleSelect",
            type: "list",
            message: "From which role would you like to select?",
            choices: listOfRoleTitles // Using the array – consisting of all the role titles – to create the list of choices
        }).then(function (answer) {

            var query2 = (
                // Similar query to the one in viewAllEmployees()
                "SELECT " +
                "r.title AS RoleTitle, " +
                "e.first_name AS First_Name, " +
                "e.last_name AS Last_Name, " +
                "r.salary AS Salary, " +
                "d.department_name AS DepartmentName, " +
                "CONCAT(manager.first_name, ' ', manager.last_name) AS Manager " +
                "FROM employees AS e " +
                "INNER JOIN roles AS r ON (e.role_id = r.id) " +
                "INNER JOIN departments AS d ON (r.department_id = d.id) " +
                "LEFT JOIN employees manager ON manager.id = e.manager_id " +
                // The one difference is this line:
                // When using the MySQL package, use ?s in place of any values to be inserted,
                // which are then swapped out with corresponding elements in the array.
                // This helps us avoid an exploit known as SQL injection
                "WHERE r.title = (?)"
            );

            // Making the query to the database
            // Using the value of answer.deptSelect in place of the (?) in query2
            connection.query(query2, [answer.roleSelect], function (err2, res2) {
                // If there's an error, throw the error
                if (err2) throw err2;

                // CONSOLE TABLE DISPLAY OF THE RESPONSE
                console.table(res2);

                // Running employee manager again
                employeeManager();
            });
        });
    });

}
// ---------------------------------------------------------------------------------------
function addDepartment() {
    // Running inquirer to ask the user what department they want to add
    inquirer.prompt({
        name: "newDept",
        type: "input",
        message: "What is the name of the department you are adding?",
        validate: Boolean
        // validate: Boolean will return false if you get null or an empty string
        // Therefore, it successfully ensures that you can't enter an empty string
    }).then(function (answer) {

        // Creating the query that will add the department
        var query = (
            "INSERT INTO departments " +
            "(id,department_name) " +
            "VALUES " +
            "(NULL, (?))"
        )

        // Making the query to the database
        connection.query(query, [answer.newDept], function (err, res) {
            // If there's an error, throw the error
            if (err) throw err;

            // Console logging a successful add to the database
            console.log(`Successfully added ${answer.newDept} to the database`)

            // Running employee manager again
            employeeManager();
        });
    });
}
// ---------------------------------------------------------------------------------------
function addRole() {
    // Creating the query selector to be used to get the data from MySQL
    // This query gets ALL of the department names
    var query1 = (
        "SELECT " +
        "d.id, " +
        "d.department_name " +
        "FROM departments AS d"
    );

    // Making the query to the database
    connection.query(query1, function (err1, res1) {
        // If there's an error, throw the error 
        if (err1) throw err1;

        // Creating an empty array for future use
        var listOfDepartmentNames = [];

        // Looping through the response object
        for (var i = 0; i < res1.length; i++) {
            // Pushing the department name into the listOfDepartmentNames
            listOfDepartmentNames.push(res1[i].department_name);
        }

        // Running inquirer to ask the user what role they want to add
        inquirer.prompt(
            [
                {
                    name: "newRole",
                    type: "input",
                    message: "What is the name of the role you are adding?",
                    validate: Boolean
                    // validate: Boolean will return false if you get null or an empty string
                    // Therefore, it successfully ensures that you can't enter an empty string
                },
                {
                    name: "whatDept",
                    type: "list",
                    message: "In which department does this role belong?",
                    choices: listOfDepartmentNames // Using the array – consisting of all the department names – to create the list of choices

                },
                {
                    name: "whatSalary",
                    type: "input",
                    message: "What is the salary of this role?",
                    validate: function (id) {
                        var valid = isNaN(id);
                        if (valid) {
                            console.log("\nPlease enter a valid number")
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                }
            ]
        ).then(function (answer) {

            // Initializing a deptID variable for future use
            var deptID = 0;
            // Going into each element of the res1 response
            // (res1 consisted of an object with department ids and department names)
            res1.forEach(element => {
                // if the department name matches that provided by the user...
                // set the department ID
                if (element.department_name === answer.whatDept) {
                    deptID = element.id;
                }
            });

            // Creating the query that will add the role
            var query2 = (
                "INSERT INTO roles " +
                "(id,title,salary,department_id) " +
                "VALUES " +
                "(NULL,(?),(?),(?))"
            )

            // Making an array of the queryInputs
            var queryInputs = [answer.newRole, answer.whatSalary, deptID];

            // Making the query to the database
            connection.query(query2, queryInputs, function (err2, res2) {
                // If there's an error, throw the error
                if (err2) throw err2;

                // Console logging a successful add to the database
                console.log(`Successfully added ${answer.newRole} to the database`)

                // Running employee manager again
                employeeManager();
            })
        });
    });
}
// ---------------------------------------------------------------------------------------
function addEmployee() {
    // Creating the query selector to be used to get the data from MySQL
    // This query gets ALL of the role names
    var query1 = (
        "SELECT " +
        "r.title, " +
        "r.id " +
        "FROM roles AS r"
    );

    // Making the query to the database
    connection.query(query1, function (err1, res1) {
        // If there's an error, throw the error 
        if (err1) throw err1;

        // Creating an empty array for future use
        var listOfRoleTitles = [];

        // Looping through the response object
        for (var i = 0; i < res1.length; i++) {
            // Pushing the role name into the listOfRoleTitles
            listOfRoleTitles.push(res1[i].title);
        }

        // Running inquirer to ask the user information about the employee they are adding
        inquirer.prompt(
            [
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the new employee's first name?",
                    validate: Boolean
                    // validate: Boolean will return false if you get null or an empty string
                    // Therefore, it successfully ensures that you can't enter an empty string
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the new employee's last name?",
                    validate: Boolean
                    // validate: Boolean will return false if you get null or an empty string
                    // Therefore, it successfully ensures that you can't enter an empty string
                },
                {
                    name: "roleSelect",
                    type: "list",
                    message: "What role are they being assigned?",
                    choices: listOfRoleTitles // Using the array – consisting of all the role titles – to create the list of choices
                },
                {
                    name: "managerYesNo",
                    type: "list",
                    message: "Are they a manager?",
                    choices: ["Yes", "No"]
                }
            ]
        ).then(function (answer) {

            // Creating the query selector to be used to get the data from MySQL
            // This gets all of the employees
            var query2 = (
                "SELECT " +
                "e.first_name, " +
                "e.last_name, " +
                "e.id, " +
                "CONCAT(e.first_name, ' ', e.last_name) AS EmployeeFullName " +
                "FROM employees AS e"
            );

            // Making the query to the database
            connection.query(query2, function (err2, res2) {
                // If there's an error, throw the error 
                if (err2) throw err2;

                // Creating an empty array for future use
                var listOfEmployees = [];

                // Looping through the response object
                for (var i = 0; i < res2.length; i++) {
                    // Pushing the role name into the listOfEmployees
                    listOfEmployees.push(res2[i].EmployeeFullName);
                }

                // Two possible outcomes will occur, depending on whether or not the new employee is a manager

                if (answer.managerYesNo === "Yes") {

                    // Creating the query that will add the employee
                    var query3 = (
                        "INSERT INTO employees " +
                        "(id,first_name,last_name,role_id,manager_id) " +
                        "VALUES " +
                        "(NULL,(?),(?),(?),NULL)"
                    )

                    // Going into res1
                    // Finding the corresopnding match of the role name/title
                    // Assigning the corresponding roleID
                    var roleID = 0;
                    res1.forEach(element => {
                        if (element.title === answer.roleSelect) {
                            roleID = element.id
                        }
                    })

                    // Making an array of the employeeQueryInputs
                    var employeeQueryInputs = [answer.firstName, answer.lastName, roleID];

                    // Making the query to the database to add the new employee
                    connection.query(query3, employeeQueryInputs, function (err3, res3) {
                        // If there's an error, throw the error 
                        if (err3) throw err3;

                        // Console logging a successful add to the database
                        console.log(`Successfully added ${answer.firstName} ${answer.lastName} to the database`);

                        // Running employee manager again
                        employeeManager();
                    })
                }

                if (answer.managerYesNo === "No") {
                    inquirer.prompt(
                        [{
                            name: "reportToName",
                            type: "list",
                            message: "Who do they report to?",
                            choices: listOfEmployees
                        }]
                    ).then(function (answer2) {

                        // For both the managerID and the roleID...
                        // Going into each element of either res1 or res2
                        // Finding the corresponding match (either role or manager name)
                        // And then assigning the corresponding ID
                        var managerID = 0;
                        res2.forEach(element => {
                            if (element.EmployeeFullName === answer2.reportToName) {
                                managerID = element.id;
                            }
                        })
                        var roleID = 0;
                        res1.forEach(element => {
                            if (element.title === answer.roleSelect) {
                                roleID = element.id;
                            }
                        })

                        // Creating the query that will add the employee
                        var query3 = (
                            "INSERT INTO employees " +
                            "(id,first_name,last_name,role_id,manager_id) " +
                            "VALUES " +
                            "(NULL,(?),(?),(?),(?))"
                        )

                        // Making an array of the employeeQueryInputs
                        var employeeQueryInputs = [answer.firstName, answer.lastName, roleID, managerID];

                        // Making the query to the database to add the new employee
                        connection.query(query3, employeeQueryInputs, function (err3, res3) {
                            // If there's an error, throw the error 
                            if (err3) throw err3;

                            // Console logging a successful add to the database
                            console.log(`Successfully added ${answer.firstName} ${answer.lastName} to the database`);

                            // Running employee manager again
                            employeeManager();
                        })
                    })
                }
            })
        })
    })
}
// ---------------------------------------------------------------------------------------
function updateEmployeeRole() {
    // Creating the query selector to be used to get the data from MySQL
    // This gets all of the employees
    var query1 = (
        "SELECT " +
        "e.first_name, " +
        "e.last_name, " +
        "e.id, " +
        "CONCAT(e.first_name, ' ', e.last_name) AS EmployeeFullName " +
        "FROM employees AS e"
    );

    // Making the query to the database
    connection.query(query1, function (err1, res1) {

        // If there's an error, throw the error 
        if (err1) throw err1;

        // Creating an empty array for future use
        var listOfEmployees = [];

        // Looping through the response object
        for (var i = 0; i < res1.length; i++) {
            // Pushing the role name into the listOfEmployees
            listOfEmployees.push(res1[i].EmployeeFullName);
        }

        // Running inquirer to ask which employee is being updated?
        inquirer.prompt(
            [{
                name: "employeeToUpdate",
                type: "list",
                message: "Which employee are you updating?",
                choices: listOfEmployees
            }]
        ).then(function (answer1) {

            // Creating the query selector to be used to get the data from MySQL
            // This query gets ALL of the role names
            var query2 = (
                "SELECT " +
                "r.title, " +
                "r.id " +
                "FROM roles AS r"
            );

            // Making the query to the database
            connection.query(query2, function (err2, res2) {
                // If there's an error, throw the error 
                if (err2) throw err2;

                // Creating an empty array for future use
                var listOfRoleTitles = [];

                // Looping through the response object
                for (var i = 0; i < res2.length; i++) {
                    // Pushing the role name into the listOfRoleTitles
                    listOfRoleTitles.push(res2[i].title);
                }

                // Running inquirer to ask which role they are receiving?
                inquirer.prompt(
                    [{
                        name: "roleToUpdate",
                        type: "list",
                        message: "What is their new role?",
                        choices: listOfRoleTitles
                    }]
                ).then(function (answer2) {

                    // For the employeeID and the roleID
                    // Going into each element of either res1 or res2
                    // Finding the corresponding match (either employee name or role title)
                    // And then assigning the corresponding ID
                    var employeeID = 0;
                    res1.forEach(element => {
                        if (element.EmployeeFullName === answer1.employeeToUpdate) {
                            employeeID = element.id;
                        }
                    })
                    var roleID = 0;
                    res2.forEach(element => {
                        if (element.title === answer2.roleToUpdate) {
                            roleID = element.id;
                        }
                    })

                    // Creating the query that will revise the employee role
                    var query3 = (
                        "UPDATE employees " +
                        "SET role_id=(?) " +
                        "WHERE id=(?)"
                    )

                    // Making the query to the database to revise the employee role
                    connection.query(query3, [roleID, employeeID], function (err3, res3) {
                        // If there's an error, throw the error 
                        if (err3) throw err3;

                        // Console logging a successful revision to the database
                        console.log(`Successfully revised ${answer1.employeeToUpdate}'s role to be ${answer2.roleToUpdate} in the database`);

                        // Running employee manager again
                        employeeManager();
                    })
                })
            })
        })
    })
}