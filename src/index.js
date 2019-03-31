
var M=require("ming_node");
var mysql  = require('mysql');
var app=M.server();
app.listen(8888);
var Db = mysql.createConnection(
    {
        "host"     : "127.0.0.1",
        "user"     : "root",
        "password" : "123456",
        "port"     : "3306",
        "database" : "ming-lie",
        "multipleStatements": true
    });
Db.doSql=function(sql){
    var promise = new Promise(function(reslove,reject){
        Db.query(sql,
            function (err, result) {
                if(err){
                    console.error(err);
                    reject(err);
                }
                reslove(result);
            });
    })
    return promise;
}
prefixSql=`
DROP PROCEDURE IF EXISTS p;
CREATE PROCEDURE p()
BEGIN
    `;
SuffixSql=`
 END;
call p
 `;
app.get("/",async function (req,res) {
    app.redirect("/index.html",req,res);
});
app.post("/doSql",async function (req,res) {
    console.log(req.params);
    try{
        var rows= await Db.doSql(prefixSql+req.params.sql+SuffixSql);
        var r=rows.slice(2);
        res.send(M.result(r));
    }catch (e){
        res.send(M.result(e,false));
    }
})
    