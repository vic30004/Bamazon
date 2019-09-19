const faker = require('faker');
const inquirer = require('inquirer');
const mysql = require('mysql');
const fs = require('fs');
count =20;
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


const quit = (choice) =>{
    if(choice === "q"){
        console.log("Thank you for shopping at Bamazon");
        process.exit(0);
    }
}

const  purchase = (product, quantity) => {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantity, product.item_id], function(err, res) {
        if(err) throw err;
        console.log("Successful purchased " + quantity +"," + product.product_name);
        loadTable();
    })
}


const checkQt = (product) =>{
    inquirer.prompt([{
        type:'input',
        name: 'quantity',
        message: 'How many would you like to purchase?',
        validate: function(val){
            return val > 0 || val.toLowerCase() === 'q'
        } 
    }]).then(function(answer){
        quit(answer.quantity);
        let quantity = parseInt(answer.quantity);
        if(quantity> product.stock_quantity){
            console.log("Insufficient quantity");
            loadTable();
        }
        else{
            purchase(product,quantity);
}
    })
}

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
        superAction();
    })
};

const lowInv = () =>{
    console.log("These products are almost gone!")
    let query = connection.query(
        `SELECT * FROM products WHERE stock_quantity<10`,
        function (err,res){
            if(err) throw err;
            result="";
            res.forEach((data)=>{console.table(data)})
            return superAction();
        }
    )
}

const updateInv =(qt,Id) =>{
    console.log("Updating the Inventory!")
    let query= connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: qt
        },
        {
            item_id: Id   
        }
    ],
    function(err,res){
        if(err) throw err;
        console.log(res.affectedRows + "Products Updated!\n")
        superAction()
    }
    )
    console.log(query.sql)
}


// checks if we have sufficient inv
const checkInv = (inv,Id)=>{
    for (let i=0; i<inv.length; i++){
        if (inv[i].item_id === Id){
            return inv[i]
        }
    }
    return null
}

const tableOnly = ()=>{
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.table(res);
        superAction();
})
};

//logs out a table
const loadTable = () =>{
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.table(res);
        askCust(res)
    })
}



const superAction = () =>{
    inquirer.prompt([{
        type: "list",
        name:"choice",
        message: 'Welcome, what would you like to do today?',
        choices: ["View Products", "View low Inventor", "Update Inventory", "Add Product","quit"],
    }]).then(function(res){
        console.log(res.choice)
        switch (res.choice){
            case "View Products":
                    tableOnly();
                    break;
        }
        switch(res.choice){
             case "Update Inventory":
                 inquirer.prompt([{
                     type:"input",
                     name: "choice",
                     message: "How many will you be adding? Which item_id would you like to update? [quantity, ID]"
                 }]).then(function(res){
                     console.log(typeof(res.choice))
                    answer= res.choice.split(" ");
                    console.log(answer)
                   return updateInv(answer[0],answer[1]);

                 });
        };
           switch(res.choice){
              case "Add Product": 
            insertDate(); 
           };
        switch(res.choice){
            case "View low Inventor":
                lowInv();
                break;
            
        }; 
        switch(res.choice){
            case "quit":
               console.log("Good Bye!");
                process.exit(0);

        }
            
        })
    }



const askCust = (inv)=>{
   inquirer.prompt([
    {
    type: "input",
    name:"choice",
    message: "Please provide us with the ID of the item you would like to purchase",
    val: function(answer){
        return !isNaN(answer) || answer.toLowerCase()==="q"}
    }
]).then(function(answer) {
    if(answer.choice === "super"){
       return superAction();
    }
    quit(answer.choice);
    let Id= parseInt(answer.choice);
     let product = checkInv(inv,Id);
     console.log(product);
     if(product){
         checkQt(product);
     }else{
         console.log("\n We do not have that item");
         loadTable();
     }
}) 
}



connection.connect(function(err,res){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    loadTable();
})


