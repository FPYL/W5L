let express = require('express');
let bodyParser = require('body-parser');
let mongodb = require('mongodb');
//
var mongoose = require('mongoose');
mongoose.set('useNewUrlParser',true);
mongoose.connect("mongodb://localhost:27017/week7",function(err){
    if(err){
        console.log(err);
        throw err;
    }else{
        console.log("connected successfully");
    }
});
let task = require("./models/task");
let developer = require("./models/developer");
//
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

app.get("/addDeveloper",function(req,res){
    let fileName = filePath +"adddeveloper.html";
    res.sendFile(fileName);
});

app.get("/newTask",function(req,res){
    let fileName=filePath+"addtask.html";
    res.sendFile(fileName);
});

app.get("/listTasks",function(req,res){
    task.find().populate('task').exec(function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data)
            res.render("display",{data:data});
        }
    });
});

app.get("/listDeveloper",function(req,res){
    developer.find().populate('developer').exec(function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data)
            res.render("displaydeveloper",{data:data});
        }
    });

});

app.post("/addnew",function(req,res){
    console.log(req.body);
    task.create({
        taskname : req.body.taskname,
        status : req.body.taskstatus,
        description : req.body.taskdesc,
        duedate : req.body.taskdue,
        developer : new mongoose.Types.ObjectId(req.body.assignto)
    })

});

app.post("/adddeveloper",function(req,res){
    console.log(req.body);
    let developername = {
        firstname: req.body.developerfname,
        lastname: req.body.developerlname
    };
    let developeraddress = {
        state:req.body.developerstate,
        suburb:req.body.developersuburb,
        street:req.body.developerstreet,
        unit:req.body.developerunit
    }
    developer.create({
        name: developername,
        level: req.body.developerlevel,
        address: developeraddress
    },function(err){
        if(err){
            console.log(err);
        }else{
            console.log("giiiiiioood");
        }
    })

});

app.get("/updateTask",function(req,res){
    task.find().populate('task').exec(function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data)
            res.render("updatetask",{data:data});
        }
    });
});

app.post("/update",function(req,res){
    
    task.updateOne({ '_id': new mongoose.Types.ObjectId(req.body.id) }, { $set: { 'status': req.body.taskstatus } }, function (err, doc) {
        console.log(doc);
    });

})

app.get("/deleteTask",function(req,res){
    task.find().populate('task').exec(function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data)
            res.render("deletetask",{data:data});
        }
    });
});

app.post('/delete_by_id',function(req,res){
    
    task.deleteOne({ '_id': new mongoose.Types.ObjectId(req.body.id) }, function (err, doc) {
        console.log(doc);
    });

})

app.get('/deleteAll',function(req,res){
    task.deleteMany({ 'status': 'Complete' }, function (err, doc) {
        console.log(doc);
    });
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
app.get('/:oldname/:newname',function(req,res){
    let oname = req.params.oldname;
    let nname = req.params.newname;
    developer.updateOne({ 'name.firstname': oname }, { $set: { 'name.firstname': nname } }, function (err, doc) {
        console.log(doc);
    });
    let fileName = filePath +"index.html";
    res.sendFile(fileName);
});

app.listen(8080);