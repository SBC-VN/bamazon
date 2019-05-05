var mysql = require("mysql");
var inquirer = require("inquirer");
var moment = require("moment");
const cTable = require('console.table');

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
  displaySupervisorMenu();
});


// Prompt the supervisor for what they want to do.  No database reads just yet.
function displaySupervisorMenu() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        choices: ["View Product Sales by Department","Create New Department","Audit Transactions"],
        message: "Choose product operation"
      }])
    .then(function(answer) {
      switch (answer.choice) {
        case "View Product Sales by Department": 
          displaySales();
          break;
        case "Create New Department":
          createDepartment();
          break;
        case "Audit Transactions":
          auditTransactions();
          break;
        default:
          console.log("Unknown option");
          break;
      }
    });
}

function displaySales() {
  var qStr = "SELECT d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) 'sales'";
  qStr += " FROM departments d";
  qStr += " LEFT JOIN products p on p.department_name = d.department_name";
  qStr += " GROUP BY d.department_id";
  qStr += " ORDER BY d.department_id";

  connection.query(qStr, 
  function(err, res) {
    if (err) throw err;
    else {
      console.table(res);
      connection.end();
    }
  });
}

function createDepartment() {
    console.log("Create new department");
    inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "What is the name of the new department?"
      },
      {
        name: "over_head_costs",
        type: "number",
        message: "How much is the overhead cost?"
      }
      ])
    .then(function(answer) {
      insertNewDepartment(answer);
    });
  }

  function insertNewDepartment(item) {
    var query = connection.query("INSERT INTO departments SET ?",
      item,
      function(err, res) {
        if (err) {
          console.log("Add Department Error",err);
        }
        else {
          console.log("Added New Department");
          connection.end();
        }
      });
  } 

  function auditTransactions() {
    var qStr = "SELECT t.transaction_id, t.date, p.product_name, t.quantity, t.description";
    qStr += " FROM transactions t";
    qStr += " LEFT JOIN products p ON p.item_id = t.item_id";
    qStr += " ORDER BY p.product_name";

    connection.query(qStr, 
    function(err, res) {
      if (err) throw err;
      else {
        for (var i = 0; i < res.length; i++) {
          res[i].date = moment(res[i].date).format('MM/DD/YYYY');
        }
        console.table(res);        
        connection.end();
      }
    });
  }