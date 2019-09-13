
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
var Db = mysql.createConnection(myDbconfig);
Db.myDbconfig=myDbconfig;
Db.do_sql_enable=true;
Db.display_sql_enable=false;
Db.connect();

Db.doSql=function(sql){
    var promise = new Promise(function(reslove,reject){
        if(Db.display_sql_enable) M.log(sql+";")
        if(Db.do_sql_enable){
            Db.query(sql,
                function (err, result) {
                    if(err){
                        console.error(err);
                        reject(err);
                    }
                    reslove(result);
                });
        }
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
    M.writeFile("static/js/M_database.js","M_databaseJson="+req.params.d)
    res.send(M.result("ok") )
})