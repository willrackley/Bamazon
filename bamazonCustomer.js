var mysql = require("mysql");
var inquirer = require("inquirer");

var choiceId = 0;
var choiceQuantity = 0;


var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "password",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
  });

  function getQuantity(userChoice){
      connection.query("SELECT stock_quantity FROM products WHERE ?",
      {
          item_id: userChoice

      }, function(err, res) {
        if (err) throw err;

        if(choiceQuantity > res[0].stock_quantity){
            console.log("Sorry, we do not have the inventory to complete your order");
        } else if (choiceQuantity > res[0].stock_quantity) {
            //make the order go through and subtract that order from the table 
        }
        connection.end();
      });
  }

  //this function displays the products table
  function displayTable() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      for(var i=0; i < res.length; i++){
          console.log("\n" + res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
          console.log("____________________________________");
      }

      inquirer.prompt([
      
        {
            name: "idChoice",
            type: "input",
            message: "\nWhat is the id of the product that you would like to purchase?"
        },
        {
            name: "unitQuantity",
            type: "input",
            message: "How many units would you like to buy?"
    
        }
        ]).then(function(answer) {
            choiceQuantity = parseInt(answer.unitQuantity);
            choiceId = parseInt(answer.idChoice);
            getQuantity(choiceId);
           
        }); 
      
       
      //connection.end();
    });
  }
  
  

  displayTable();