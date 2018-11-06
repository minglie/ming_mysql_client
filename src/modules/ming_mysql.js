var mysql  = require('mysql');
var path=require('path');
var M=require("ming_node")

var applicationConfig;


try{
    applicationConfig=M.getObjByFile(path.join(__dirname, "../../applicationConfig.json"));
}catch (e){
    applicationConfig={
        "myDbconfig":{
            "host"     : "127.0.0.1",
            "user"     : "root",
            "password" : "123456",
            "port"     : "3306",
            "database" : "aos_agri_decision"
        }
    }
}


var myDbconfig=applicationConfig.myDbconfig;


var Db = mysql.createConnection(myDbconfig);
Db.myDbconfig=myDbconfig;
Db.display_sql_enable=true;
Db.do_sql_enable=true;
Db.connect();

Db.getAddObjectSql=function(tableName,obj){
    var fields="(";
    var values="(";
    for(let field in obj){
        fields+=field+",";
        values+=`'${obj[field]}'`+",";
    }
    fields=fields.substr(0,fields.lastIndexOf(","));
    values=values.substr(0,values.lastIndexOf(","));
    fields+=")";
    values+=")";
    let sql = "insert into "+tableName+fields+" values "+values;
    return sql;
}



/**
 *生成sql时对不合法字段过滤
 */
Db.getAddObjectSql1=function(tableName,obj){
    var fields="(";
    var values="(";
    for(let field in obj){
        fields+=field+",";
        values+=`'${obj[field].replace(/'|"/g,"")}'`+",";
    }
    fields=fields.substr(0,fields.lastIndexOf(","));
    values=values.substr(0,values.lastIndexOf(","));
    fields+=")";
    values+=")";
    let sql = "insert into "+tableName+fields+" values "+values;
    return sql;
}


Db.getDeleteObjectSql=function(tableName,obj){
    var fields=[];
    for(let field in obj){
        fields.push(field);
    }
    let sql=`delete from ${tableName} where ${fields.map(u=> u+"='"+obj[u]+"'")}`;
    sql=sql.replace(/,/g," and ")
    return sql;
}

Db.getUpdateObjectSql=function(tableName,obj,caseObj){
    var fields=[];
    for(let field in obj){
        if(field !="id")
            fields.push(field);
    }
    let sql="";
    if(!caseObj){
        sql=`update ${tableName} set ${fields.map(u =>u + "='" + obj[u]+ "'")} where id=${obj.id}`;
    }else{
        var caseObjfields=[];
        for(let caseObjfield in caseObj){
            caseObjfields.push(caseObjfield)
        }
        sql=`update ${tableName} set ${fields.map(u =>u + "='" + obj[u]+ "'")} where ${caseObjfields.map(u=> u+"='"+caseObj[u]+"'").join(" and ")}`;
    }

    return sql;
}


Db.getQueryObjectSql=function(tableName,obj){
    var fields=[];
    for(let field in obj){
        fields.push(field);
    }
    let sql = `select * from ${tableName} where ${fields.map(u=> u+"='"+obj[u]+"'")}`;
    sql=sql.replace(/,/g," and ")
    return sql;
}



function doSql(sql){
    var promise = new Promise(function(reslove,reject){
        if(Db.display_sql_enable) M.log(sql+";")
        if(Db.do_sql_enable){
            Db.query(sql,
                function (err, result) {
                    if(err)console.error(err);
                    reslove(result);
                });
        }
    })
    return promise;
}

Db.doSql=doSql;

function addObj(tableName,obj){
    var sql=Db.getAddObjectSql(tableName,obj);
    return  Db.doSql(sql);
}
function deleteObj(tableName,obj){
    var sql=Db.getDeleteObjectSql(tableName,obj);
    return  Db.doSql(sql);
}
function updateObj(tableName,obj,caseObj){
    var sql=Db.getUpdateObjectSql(tableName,obj,caseObj);
    return  Db.doSql(sql);
}
function getByObj(tableName,obj){
    var sql=Db.getQueryObjectSql(tableName,obj);
    return  Db.doSql(sql);
}

Db.addObj=addObj;
Db.deleteObj=deleteObj;
Db.updateObj=updateObj;
Db.getByObj=getByObj;
module.exports=Db;

if(0)
    +async function(){
    k= await Db.getUpdateObjectSql("aos_sys_user",{id:7,user_name:'zs',user_birth:'2015-11-02',user_salary:21},{name:"zs",age:8,kk:"dfsasf"})
    console.log(JSON.stringify(k))
}();


