var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var overHead = 0;
var dName = "";

//object variable for displaying the table
var products = new Table({
    head: ['Department Id', 'Department Name', 'Over Head Cost', 'Product Sales', 'Total Profits']
  , colWidths: [25, 25, 25, 25, 25] 
  });

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "password",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    runLogic();
  });



function runLogic(){
    console.log("\n");
    inquirer.prompt([
        {
            name: "initialPrompt",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
            ]
        },
        ]).then(function(answer) {
            
            switch(answer.initialPrompt) {
            case "View Product Sales by Department":
                displayJoinedTable();
                break;

            case "Create New Department":
                newDepartment();
                break;

            }
        }); 
}

function displayJoinedTable(){

    var queryString = "SELECT departments.department_id, departments.department_name, SUM(departments.over_head_costs)  AS over_head_costs, SUM(products.product_sales) AS product_sales, SUM(products.stock_quantity) AS total_profit FROM departments RIGHT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id"
    connection.query(queryString, function(err, res) {
        if (err) throw err;

        for(var i=0; i < res.length; i++){
            res[i].total_profit = res[i].product_sales - res[i].over_head_costs;
            products.push(
                [res[i].department_id , res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]
            );
            
        }   
        console.log(products.toString());
        
        console.log("\n");
        runLogic();
    });
}

function addNewDept(dName, overHead){
    connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: dName,
          over_head_costs: overHead
        },
        function(err, res) {
          console.log("\nThe " + dName + " department has been added.\n");
          console.log("\n");
          runLogic();
        }
    );
}

function newDepartment(){
    inquirer.prompt([
        {
            name: "dName",
            type: "input",
            message: "\nWhat is the name of the new department?"
        },
        {
            name: "oCost",
            type: "input",
            message: "What is the over head cost for the department?"
        },
        ]).then(function(answer) {
            overHead = parseInt(answer.oCost);
            dName = answer.dName;
            addNewDept(dName, overHead);
        }); 
}

