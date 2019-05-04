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
  displayMgrMenu();  
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
function displayMgrMenu() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        choices: ["View All","View Low Inventory","Add Inventory","Add New Product"],
        message: "Choose product operation"
      }])
    .then(function(answer) {
      console.log(answer);
      switch (answer.choice) {
        case "View All": 
        case "View Low Inventory":
          displayProducts(answer.choice);
          break;
        case "Add Inventory":
          addProductInventory();
          break;
        case "Add New Product":
          addNewProduct();
          break;
        default:
          console.log("Unknown option");
          break;
      }
    });
}



function displayProducts(operation) {
  var qStr = "SELECT item_id, product_name, price, department_name, stock_quantity FROM products";
  if (operation == "View Low Inventory") {
    qStr += " WHERE stock_quantity < 5"
  }
  connection.query(qStr, 
  function(err, res) {
    if (err) throw err;
    else {
      var retRec;
      for (var i = 0; i < res.length; i++) {
        retRec = extractProductInfo(res[i]);
        console.log(retRec.item_id + " " + retRec.product_name + " " + retRec.price + " " + retRec.stock_quantity);
      }
    }
  });
}

function addProductInventory() {
  var qStr = "SELECT item_id, product_name, price, department_name, stock_quantity FROM products";
  connection.query(qStr, 
    function(err, res) {
      if (err) throw err;
      else {
        for (var i = 0; i < res.length; i++) {
          productList.push(extractProductInfo(res[i]));
        }

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
            message: "What item to add inventory to?"
          },
          {
            name: "quantity",
            type: "input",
            message: "How much to add?"
          }
          ])
        .then(function(answer) {
          console.log(" ");
          var chosenItem = productList[answer.choice-1];
          var chosenQty = parseInt(answer.quantity);
          if (chosenQty > 0) {
            updateInventoryQty(chosenItem,chosenQty);
          }
        });
    }
  });
}

function updateInventoryQty(item, quantity) {
  console.log("     Product " + item.product_name);
  console.log("Add Quantity " + quantity);
  var newQty = item.stock_quantity + quantity;
  console.log("New Quantity " + newQty);

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
        console.log("Add Error",err);
      }
      else {
        console.log("Added");
      }
    });
}    

function recordTransaction(item, quantity) {
  var query = connection.query(
    "INSERT INTO transactions  SET ?",
    {
      item_id : item.item_id,
      quantity: quantity,
      type: 'Update',
      description: 'Updated by manager.'
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

  function addNewProduct() {
    inquirer
    .prompt([
      {
        name: "product_name",
        type: "input",
        message: "What is the name of the new item?"
      },
      {
        name: "price",
        type: "input",
        message: "How much does each one cost?"
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "How many are in inventory?"
      },
      {
        name: "department_name",
        type: "input",
        message: "Which department does it belong to?"
      }
      ])
    .then(function(answer) {
      console.log(answer);
    });
  }

  function insertNewProduct(item) {
    console.log("     Product " + item.product_name);
    console.log("Add Quantity " + quantity);
    var newQty = item.stock_quantity + quantity;
    console.log("New Quantity " + newQty);
  
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
          console.log("Add Error",err);
        }
        else {
          console.log("Added");
        }
      });
  } 
} 