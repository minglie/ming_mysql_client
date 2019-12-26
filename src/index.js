
var M=require("ming_node");
var mysql  = require('mysql');

myDbconfig={
    "host"     : "127.0.0.1",
        "user"     : "root",
        "password" : "123456",
        "port"     : "3306",
        "database" : "guns"
}


var app=M.server();
app.listen(22223);

var Db = {};
var pool = mysql.createPool(myDbconfig);


Db.doSql=function(sql){
    var promise = new Promise(function(reslove,reject){      
        pool.getConnection(function(err, connection){
            connection.query( sql, function(err, rows){
                if(err) {
                    console.error(err);
                    reject(err);
                }else{
                    reslove(rows);
                }
            });
            
            connection.release();
          });
    })
    return promise;
}




app.get("/",async function (req,res) {
    app.redirect("/index.html",req,res);
});

app.post("/doSql",async function (req,res) {
    try{      
        var rows= await Db.doSql(req.params.sql);
        res.send(M.result(rows));
      
    }catch (e){
        res.send(M.result(e,false));
    }
})


app.get("/getDataBaseName",async function (req,res) {
    res.send(M.result(myDbconfig.database) )
})

app.post("/groupConfig",async function (req,res) {
    M.writeFile("static/js/M_database.js","M_databaseJson="+req.body)
    res.send(M.result("ok") )
})