var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var choiceId = 0;
var choiceQuantity = 0;
var quantityTotal = 0;
var itemId = 0;
var itemPrice = 0;
var totalCost = 0;
var totalCostUnrounded = 0;

//object variable for displaying the table
var products = new Table({
	head: ['Item id', 'Product', 'Price'],
	colWidths: [50, 50, 50]
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
	displayTable();
});

function updateProductSales(idChoice, totalSales) {
	var query = connection.query("UPDATE products SET ? WHERE ?", [{
		product_sales: totalSales
	}, {
		item_id: idChoice
	}], function(err, res) {
		if (err) throw err;
	});
}

function updateProduct(idChoice, totalQuantity) {
	var query = connection.query("UPDATE products SET ? WHERE ?", [{
		stock_quantity: totalQuantity
	}, {
		item_id: idChoice
	}], function(err, res) {
		if (err) throw err;
		console.log("\nYour total cost is " + "$" + totalCost + "." + "\nThank you for your order!" + "\n");
	});
}

function userTransaction(userChoice) {
	connection.query("SELECT stock_quantity FROM products WHERE ?", {
		item_id: userChoice
	}, function(err, res) {
    if (err) throw err;
    
		if (choiceQuantity > res[0].stock_quantity) {
			products = new Table({
				head: ['Item id', 'Product', 'Price'],
				colWidths: [50, 50, 50]
			});
      console.log("\nSorry, we do not have the inventory to complete your order." + "\nPlease try buying less units or choose another product." + "\n");
      
		} else if (choiceQuantity < res[0].stock_quantity) {
			updateProduct(itemId, quantityTotal);
			updateProductSales(itemId, totalSales);
		}
		displayTable();
	});
}
//this function displays the products table
function displayTable() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			products.push(
				[res[i].item_id, res[i].product_name, res[i].price]);
		}
		console.log(products.toString());
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
          itemId = parseInt(answer.idChoice);
          //need to loop through to get the correct index of item in case the item_id is not the same as the res (index - 1)
          for (var i = 0; i < res.length; i++) {
            if (choiceId === res[i].item_id) {
              choiceId = i;
            }
          }
          quantityTotal = res[choiceId].stock_quantity - choiceQuantity;
          itemPrice = res[choiceId].price;
          totalCostUnrounded = choiceQuantity * itemPrice;
          totalCost = Math.floor(totalCostUnrounded * 100) / 100;
          totalSales = res[choiceId].product_sales + totalCost;
          userTransaction(itemId);
      });
  });
}