const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

//Create a express app by calling constructor
const app = express();

const http = require('http').Server(app);

const {Server} = require('socket.io');
const io = new Server(http);

app.use(express.static(__dirname));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
const dbUrl = 'mongodb+srv://vishad79:E6ExVkjRUeLmM3Nu@cluster0.zo4joh8.mongodb.net/?retryWrites=true&w=majority'

var Message = mongoose.model('Message',{
	name:String,
	message:String
});

app.get('/messages', (req,res)=>{
	Message.find({}, (err, data)=>{
		if(err){
			console.error(err);
			sendStatus(500);
		}
		res.send(data);
	});

});

app.post('/messages', (req, res)=>{

	const reqMsg = new Message(req.body);

	reqMsg.save((error)=>{
		if(error){
			console.log(error);
			sendStatus(500);
		}

		io.emit('message', reqMsg);
		res.sendStatus(200);
	});
});

io.on('connection',(socket)=>{
	console.log("Client connected");
});

mongoose.connect(dbUrl, (error)=>{
	console.log("Db connection : ", error);
});

const server = http.listen(8000,()=>{
	console.log("Server is listening on :" + server.address().port);
	//console.log(server);
});
