const { DH_NOT_SUITABLE_GENERATOR } = require('constants');
const express= require('express');
const app= express();

const bodyParser= require('body-parser');//rquired for handling post requests
const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/foodDeliveryDB', {useNewUrlParser: true, useUnifiedTopology: true});

const path= require('path');
const port=8080; //NOTE: images will not show up if port 80 is used


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String
  });

  const Contact = mongoose.model('Contact', contactSchema);


app.use('/',function(req,res,next){
    console.log(req.url);
    next();
});

app.use(bodyParser.urlencoded({extended: false}));//very important line for handeling post request. It sends form data to req.body
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'public' ,'index.html'));
});

app.post('/', (req,res)=>{// hit when someone submits the form
    console.log(req.body);
    var myData= new Contact(req.body);
    myData.save().then(()=>{
        res.send("Thus item has been sent to database");
    }).catch(()=>{
        res.status(400).send("Iten could not be sent to datatbase. Please try again");
    })
});

app.listen(port, ()=>{
    console.log(`Server started at port ${port}`);
});