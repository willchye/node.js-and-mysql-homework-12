//===================================================================================================
//mysql inquirer connection establishment

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "uclabootcamp", //Your password
    database: "Bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
})

//=====================================================================================================
//queries out all table data with select * query with no condition



var start = function() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Adding new product",
        choices: ["view product inventory", "view low inventory", "re-stock","add new product"]
    }).then(function(answer) {
      switch(answer.action) {
          case 'view product inventory':
              viewProducts();
          break;

          case 'view low inventory':
              viewLow();
          break;

          case 're-stock':
              reStock();
          break;

          case 'add new product':
              addNew();
          break;
      }
  })
};






var viewProducts = function(){
  connection.query('SELECT * FROM products', function(err, res, field){


  if(err)throw err;
  console.log(res);


});
}


var viewLow = function(){
  connection.query('SELECT itemID, productName FROM products GROUP BY itemID HAVING count(*) < 5', function(err, res, field){


  if(err)throw err;
  console.log(res);

});
}




var reStock = function(){
    inquirer.prompt([{
        name: "ID",
        message: "What product ID do you want to restock?"
      },{
        name: "quantity",
        message: "How many more would you like to stock up?"
      }]).then(function(answers) {
//then set the answers to a variable
        var productID = {itemID:answers.ID};
        var productRestock = {stockQuantity:answers.quantity};

connection.query('UPDATE products SET ? WHERE ?', [productRestock,productID], function(err, res, field){
  connection.query('SELECT stockQuantity FROM products WHERE ?', productID, function(err, res){
  if(err)throw err;
  console.log("re-stocked");
  console.log("the new stock for now has " + res[0].stockQuantity);
})
})
})
}


var addNew = function(){
    inquirer.prompt([{
        name: "name",
        message: "what Product are we adding?"
      },{
        name: "department",
        message: "What is the product department?"
      },{
          name: "price",
          message: "Whats the product's price?"
      },{
            name: "quantity",
            message: "How many are we adding?"
      }]).then(function(answers) {
//then set the answers to a variable
        var name = {ProductName:answers.name};
        var dept = {DepartmentName: answers.department};
        var price = {Price:answers.price};
        var quantity = {StockQuantity:answers.price};
connection.query("INSERT INTO products SET ?", {
    ProductName:answers.name,
    DepartmentName: answers.department,
    Price:answers.price,
    StockQuantity:answers.price
  },function(err, res, field){
  console.log("added successfully!");
  console.log("here are the updated item list: ")
  viewProducts();
})
})
}


start();
