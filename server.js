let express = require('express');
let bodyParser = require('body-parser');
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017/'
mongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },function(err,client){
    if(err){
        console.log('err: ',err);
    }else{
        db = client.db('week6');
        col = db.collection('todo');

    }
});
let app = express();
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('img'));
app.use(express.static('css'));
var filePath = __dirname + "/views/";


app.get("/",function(req,res){
    let fileName = filePath +"index.html";
    res.sendFile(fileName);
});
app.get("/newTask",function(req,res){
    let fileName=filePath+"addtask.html";
    res.sendFile(fileName);
});

app.get("/listTasks",function(req,res){
    console.log("homepage req");
    col.find({}).toArray(function(err,result){
        if(err){
            console.log('err: ',err);
        }else{
            res.render("display",{ todo: result});
        }
    });
});

app.post("/addnew",function(req,res){
    console.log(req.body);
    let itemId = Math.round(Math.random()*1000);
    req.body["taskid"] = itemId;
    col.insertOne(req.body,function(err,result){
        if(err){
            console.log('err:',err);
        }else{
            res.redirect("/listTasks");
        }
    })
});

app.get("/updateTask",function(req,res){
    col.find({}).toArray(function(err,result){
        if(err){
            console.log('err: ',err);
        }else{
            res.render("updatetask",{ todo: result});
        }
    });
});

app.post("/update",function(req,res){
    let __id = req.body.id;
    let id = new mongodb.ObjectId(__id);
    let taskstatus = req.body.taskstatus;
    col.updateMany({_id:id},{$set:{taskstatus:taskstatus}},(err,result)=>{
        if(err){
            console.log("err:",err);
        }else{
            res.redirect('/listTasks');
        }
    })
})

app.get("/deleteTask",function(req,res){
    col.find({}).toArray(function(err,result){
        if(err){
            console.log('err: ',err);
        }else{
            res.render("deletetask",{ todo: result});
        }
    });
});

app.post('/delete_by_id',function(req,res){
    let taskid = parseInt(req.body.id);

    //let id = new mongodb.ObjectId(__id);
    col.deleteOne({taskid:taskid},function(err,result){
        if(err){
            console.log("err: ",err);
        }else{
            res.redirect('/listTasks');
        }
    })
})

app.get('/deleteAll',function(req,res){
    col.deleteMany({},function(err,result){
        if(err){
            console.log("err: ",err);
        }else{
            res.redirect('/listTasks');
        }
    })
})

app.get("/listValue",function(req,res){
    col.find({}).toArray(function(err,result){
        if(err){
            console.log('err: ',err);
        }else{
            res.render("task3",{ todo: result});
        }
    });
});

app.post("/searchvalue",function(req,res){
    let max = parseInt(req.body.max);
    let min = parseInt(req.body.min);
    col.find({ taskid : { "$gte" : min, "$lt" : max} }).toArray(function(err,result){
        if(err){
            console.log('err: ',err);
        }else{
            res.render("display",{ todo: result});
        }
    });
});

app.get('/findtasks/:min/:max',function(req,res){
    let max = parseInt(req.params.max);
    let min = parseInt(req.params.min);
    col.find({ taskid : { "$gte" : min, "$lt" : max} }).toArray(function(err,result){
        if(err){
            console.log('err: ',err);
        }else{
            res.render("display",{ todo: result});
        }
    });
});

app.listen(8080);