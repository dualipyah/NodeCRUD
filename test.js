const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'EmployeeB',
    multipleStatements: true,
});

mysqlConnection.connect((err) => {
    if(!err)
        console.log('connected to db');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000,()=>console.log('Express server running port no 3000'));



// GET ALL EMPLOYEES
app.get('/employees',  (req,res)=>{
    mysqlConnection.query('SELECT * FROM employee',(err,rows,fields) => {
        if(!err)
            res.send(rows);
            // console.log(rows);
        else
        console.log(err);
    });
});


//GET EMPLOYEE BY ID
app.get('/employees/:id',  (req,res)=>{
    mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?',[req.params.id],(err,rows,fields) =>{
        if(!err)
            res.send(rows);
        else
            console.log(err);
    });
});


//delete EMPLOYEE BY ID
app.delete('/employees/:id',  (req,res)=>{
    mysqlConnection.query('delete from employee WHERE EmpID = ?',[req.params.id],(err,rows,fields) =>{
        if(!err)
            res.send('SALAMAT DOLE');
        else
            console.log(err);
    });
});


//insert an employee
app.post('/employees',  (req,res)=>{
    let emp = req.body;
    var sql = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?;  \
    CALL EmployeeAddOrEdit (@EmpID, @Name, @EmpCode, @Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err,rows,fields) =>{
        if(!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send("Inserted employee ID : " + element[0].EmpID);
            });
        else
            console.log(err);
    });
});

//update an employee
app.put('/employees', (req,res) => {
    let emp = req.body;
    var sql = "SET @EmpID =?; SET @Name = ?; SET @EmpCode = ?; SET @Salary=?; \
    CALL EmployeeAddOrEdit (@EmpID, @Name, @EmpCode, @Salary)";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err,rows,fields) =>{
        if(!err)
            res.send("Biatch Updated");
        else
            console.log(err);
    });

});