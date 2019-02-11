var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

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
        console.log("\n");
        switch(answer.initialPrompt) {
        case "View Product Sales by Department":
            displayJoinedTable();
            break;

        case "Create New Department":
            lowInventory();
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

