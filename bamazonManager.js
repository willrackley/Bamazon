var mysql = require("mysql");
var inquirer = require("inquirer");

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
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        },
        
        ]).then(function(answer) {
            console.log("\n");
            switch(answer.initialPrompt) {
            case "View Products for Sale":
                displayTable()
                break;

            case "View Low Inventory":
                lowInventory();
                break;
            }
        }); 
      
  }

function displayTable() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        for(var i=0; i < res.length; i++){
            console.log("\n" + "Position: " + res[i].item_id + " | " + "Product: " +  res[i].product_name + " | " + "Price: " + res[i].price + " | " + "Stock Quantity: " + res[i].stock_quantity);
            console.log("____________________________________");
        }   
        console.log("\n");
        runLogic();
    });
}

function lowInventory(){
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + "Position: " + res[i].item_id + " | " + "Product: " +  res[i].product_name + " | " + "Price: " + res[i].price + " | " + "Stock Quantity: " + res[i].stock_quantity);
            console.log("____________________________________");
        }
        console.log("\n");
        runLogic();
    });
}
