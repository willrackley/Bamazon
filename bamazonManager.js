var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var choiceId = 0;
var itemId = 0;
var choiceQuantity = 0;
var quantityTotal = 0;
var pName = "";
var dName = "";
var price = 0;

//object variable for displaying the table
var products = new Table({
    head: ['Item id', 'Product', 'Price', 'Stock Quantity'],
    colWidths: [25, 25, 25, 25]
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

function runLogic() {
    inquirer.prompt([{
        name: "initialPrompt",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", ]
    }, ]).then(function(answer) {
        console.log("\n");
        switch (answer.initialPrompt) {
            case "View Products for Sale":
                displayTable()
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    });
}

function displayTable() {

    products = new Table({
        head: ['Item id', 'Product', 'Price', 'Stock Quantity'],
        colWidths: [25, 25, 25, 25]
    });
    
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            products.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(products.toString());
        console.log("\n");
        runLogic();
    });
}

function lowInventory() {

    products = new Table({
        head: ['Item id', 'Product', 'Price', 'Stock Quantity'],
        colWidths: [25, 25, 25, 25]
    });

    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res) {

        for (var i = 0; i < res.length; i++) {
            products.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }

        console.log(products.toString());
        console.log("\n");
        runLogic();
    });
}

function updateInventory(idChoice, totalQuantity) {
    var query = connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: totalQuantity
    }, {
        item_id: idChoice
    }], function(err, res) {
        if (err) throw err;
        console.log("\nUnits have been ADDED, there are now " + totalQuantity + " units available.");
        console.log("\n");
        runLogic();
    });
}

function addInventory() {
    products = new Table({
        head: ['Item id', 'Product', 'Price', 'Stock Quantity'],
        colWidths: [25, 25, 25, 25]
    });
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            products.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(products.toString());
        console.log('\n');
        inquirer.prompt([{
            name: "idChoice",
            type: "input",
            message: "\nWhat is the id of the product that you would like to add inventory to?"
        }, {
            name: "unitQuantity",
            type: "input",
            message: "How many units would you like to add?"
        }]).then(function(answer) {
            choiceQuantity = parseInt(answer.unitQuantity);
            choiceId = parseInt(answer.idChoice);
            itemId = parseInt(answer.idChoice);

            //need to loop through to get the correct index of item in case the item_id is not the same as the res (index - 1)
            for (var i = 0; i < res.length; i++) {
                if (choiceId === res[i].item_id) {
                    choiceId = i;
                }
            }
            quantityTotal = res[choiceId].stock_quantity + choiceQuantity;
            updateInventory(itemId, quantityTotal);
        });
    });
}

function addProductRow(pName, dName, price, quantity) {
    connection.query("INSERT INTO products SET ?", {
        product_name: pName,
        department_name: dName,
        price: price,
        stock_quantity: quantity
    }, function(err, res) {
        console.log("\n" + pName + " has been added!\n");
        console.log("\n");
        runLogic();
    });
}

function addNewProduct() {
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "\nWhat is the name of the product?"
    }, {
        name: "dName",
        type: "input",
        message: "What department does the product belong to?"
    }, {
        name: "price",
        type: "input",
        message: "\nHow much does the product cost?"
    }, {
        name: "quantity",
        type: "input",
        message: "\nHow many units would you like to add?"
    }, ]).then(function(answer) {
        choiceQuantity = parseInt(answer.quantity);
        pName = answer.name;
        dName = answer.dName
        price = parseFloat(answer.price);
        addProductRow(pName, dName, price, choiceQuantity);
    });
}