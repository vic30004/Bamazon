const faker = require('faker');
const inquirer = require('inquirer');
const mysql = require('mysql');
const fs = require('fs');
count =20;
// Starter Info for DB
let randomProd=  faker.commerce.productName();
let randomPrice = faker.commerce.price();
let dept = faker.commerce.department();
let randomNum = Math.floor(Math.random()*100)+1;
// functions
const updateFile = () =>{
    fs.appendFile("seed.sql", `\nINSERT INTO products (product_name, department_name,price,stock_quantity) VALUES ("${faker.commerce.productName()}","${faker.commerce.department()}",${faker.commerce.price()},${Math.floor(Math.random()*100)+1});\n`, function(err){
        if (err) throw err; 
        console.log("File Created/Updated!!")
    })

};
// Turning on the below function will add data into the seeds file. Only use it when you need to add files.

// const countDown= setInterval(function(){
//     count--
//     updateFile();
//     if(count<=0){
//         clearInterval(countDown);
//        return console.log("Times Up!")
//     }
// },1000)

const connection = mysql.createConnection({
    host: 'localhost',
    port:3306,
    user: 'root',
    password:'password4321',
    database:'bamazon'
});


let loadProducts = () =>{
    mysql
}


connection.connect(function(err,res){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    loadTable();
})

//Inserts data to the table
let insertDate = () =>{
    console.log("Adding products!")
    let query = connection.query(
        `INSERT INTO products SET ? `,
        {
            product_name:`${faker.commerce.productName()}`,
            department_name:`${faker.commerce.department()}`,
            price: `${faker.commerce.price()}`,
            stock_quantity: Math.floor(Math.random()*100)+1,
        },
    function (err,res){
        if (err) throw err;
        console.log(res.affectedRows + " product inserted!\n");
    
    })
};

//logs out a table
const loadTable = () =>{
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.table(res);
    })
}

// inquirer.prompt([
//     {
//     type: "input",
//     name:"choice",
//     message: "Please provide us with the ID of the item you would like to purchase",
//     val: function(answer){
//         return !isNaN(answer) || answer.toLowerCase()==="q"}
//     }
// ]).then(function(answer) {
//     let Id= parseInt(val.choice)
     
// })





