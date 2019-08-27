let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('img'));
var filePath = __dirname + "/views/";

var db=[];

app.get("/",function(req,res){
    let fileName = filePath +"index.html";
    res.sendFile(fileName);
});
app.get("/newTask",function(req,res){
    let fileName=filePath+"addtask.html";
    res.sendFile(fileName);
});

app.get("/listTasks",function(req,res){
    res.render("display.html",{mydata: db});

});

app.post("/addnew",function(req,res){
    let data = req.body;
    db.push(data);
    console.log(db);
    res.render("display.html",{mydata: db});
});

app.listen(8080);