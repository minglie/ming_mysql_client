# ming_mysql_client
用easyUi实现的简易mysql Client

```js
//已分类表与未分类表
a=[];
Object.keys(M_databaseJson).forEach(function(key){if(M_databaseJson[key])a.push(...M_databaseJson[key])});

M.doSql("SELECT TABLE_NAME,TABLE_COMMENT FROM information_schema.TABLES WHERE table_schema='data-factory';",
  (d)=>{
      e=d.data.filter((u)=> a.indexOf(u.TABLE_NAME)<0)
      console.log(e)
  })
```


