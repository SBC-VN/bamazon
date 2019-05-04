var mysql = require("mysql");
var inquirer = require("inquirer");

var productList = [];

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "testuser",
  
    // Your password
    password: "none",
    database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayProducts();  
});

// Not a full blown constructor, but a placeholder for one if needed.
function extractProductInfo(datarow) {
  var ProductInfo = {
    item_id : datarow.item_id,
    product_name : datarow.product_name,
    price : datarow.price,
    department_name : datarow.department_name,
    stock_quantity : datarow.stock_quantity};
  return ProductInfo;
} 

// Read the database, extract the products into an array - then call the next function
//  down the line (select the product & quantity).
function displayProducts() {
  connection.query("SELECT item_id, product_name, price, department_name, stock_quantity FROM products", 
    function(err, res) {
      if (err) throw err;
      else {
        for (var i = 0; i < res.length; i++) {
          productList.push(extractProductInfo(res[i]));
        }
        selectProduct();
      }
    });
  }

function selectProduct() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
            var choiceArray = [];
            for (var i = 0; i < productList.length; i++) {
              choiceArray.push({name: productList[i].product_name,value: productList[i].item_id});
            }
            return choiceArray;
          },
        message: "What item do you want to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like?"
      }
      ])
    .then(function(answer) {
      console.log(" ");
      var chosenItem = productList[answer.choice-1];
      var chosenQty = parseInt(answer.quantity);
      if (chosenQty > chosenItem.stock_quantity) {
        console.log("No can buy!  There are only " + chosenItem.stock_quantity + " in stock.")
      }
      else {
        recordPurchase(chosenItem,chosenQty);
      }
    });
}

function recordPurchase(item, quantity) {
  console.log("Purchasing " + item.product_name);
  console.log("  Quantity " + quantity);
  console.log("Unit Price " + item.price);
  console.log("Total Cost " + quantity * item.price);

  var newQty = item.stock_quantity - quantity;

  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQty
      },
      {
        item_id: item.item_id
      }
    ],
    function(err, res) {
      if (err) {
        console.log("Purchase Error",err);
      }
      else {
        console.log("Purchased");
        recordTransaction(item, quantity);
      }
    });
}    

function recordTransaction(item, quantity) {
  var query = connection.query(
    "INSERT INTO transactions  SET ?",
    {
      item_id : item.item_id,
      quantity: quantity,
      type: 'Purchase',
      description: 'Purchased by customer.'
    },
    function(err, res) {
      if (err) {
        console.log("Transaction Error",err);
      }
      else {
        console.log("Confirmed");
      }
    }
  );
} 