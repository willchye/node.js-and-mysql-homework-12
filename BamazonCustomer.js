//===================================================================================================
//mysql inquirer connection establishment

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "Warcraft3", //Your password
    database: "Bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
})

//=====================================================================================================
//queries out all table data with select * query with no condition

connection.query('SELECT * FROM products', function(err, res, field){


  if(err)throw err;
  console.log(res);


});


//uses inquirer npm to get user answer for ID and quantity
inquirer.prompt([{
        name: "ID",
        message: "What product ID do you want to buy?"
      },{
        name: "quantity",
        message: "How many would you like to buy?"
      }]).then(function(answers) {
//then set the answers to a variable
        var productID = answers.ID;
        var productStock = answers.quantity;
//create a mysql connection with query to select stockquantity column based on ? or user's ID number input under itemID column
connection.query('SELECT stockQuantity FROM products WHERE ?', {itemID: productID}, function(err, res, field){

//since res returns the queried result, which contains in as mysql array of [rowdatapacket {stockquantity: 7000}]
//res[0] will limit down to rowdatapacket{stockquantity: 7000}, and .(columnName) will only return as the number
  var currentStock = res[0].stockQuantity;


  if(err)throw err;



//if else statement to check if the currenstock (stockQuantity value of mysql) of the user selected ID is less than buying number, if it
//is then say out of stock, or else its in stock

  if(productStock > currentStock){
    console.log("Sorry, out of stock!");
    console.log("Currently only have" + currentStock + "in stock");
  }else{
    console.log("in stock!");
    console.log("Currently we have " + currentStock + " in stock");
    var newStock = currentStock - productStock


//runs the updateStock function to update the inventory in mysql for stockQuantity value
//passes the newStock and productID values in as it doesnt have access to those variables
    updateStock(newStock, productID);
  }
})
});


//function update stock runs update mysql query to update the table using user passed in data, that is passed in from argument
//selects and prints the price
var updateStock = function(newStock, productID){

  connection.query('UPDATE products SET ? WHERE ?',[{stockQuantity: newStock},{itemID: productID}], function(err, res, field){
    connection.query('SELECT stockQuantity FROM products WHERE ?', {itemID: productID}, function(err, res){
    if(err)throw err;
    console.log("...................................")
    console.log("Purchased!");
    console.log("the stock leftover now has " + res[0].stockQuantity);
  })
  connection.query('SELECT price FROM products WHERE ?', {itemID: productID}, function(err, res){
  if(err)throw err;
  console.log("...................................")
  console.log("Your total cost is " + res[0].price);
  })
  })

}
