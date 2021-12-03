var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// Regular http server, shares with both express and socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Serving static files on directory
app.use(express.static(__dirname));

// Prase body data and url decoding
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//mongodb url to connect
const uri = "mongodb+srv://username:password@cluster0.bdaop.mongodb.net/DatabaseName?retryWrites=true&w=majority";

// Mongo Db Collection 
mongoose.Promise = Promise
var Message = mongoose.model('Message', {
    name: String,
    message: String
});

// Connect to mongoDb using mongoose when server starts
mongoose.connect(uri, (err) => {
    console.log('Mongo Db Connection done', err);
})

//Socket.io connection from html to show that we have connections from different users
io.on('connection', (socket) => {
    console.log('User Connected');
});

// Activate port for the server to listen in
var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port);
});


// Get API to get all messages
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

// Get messages based on user name
app.get('/messages/:user', (req, res) => {
    var user = req.params.user;
    Message.find({ name: user }, (err, messages) => {
        res.send(messages);
    });
});

//Post API to save messages
app.post('/messages', async (req, res) => {
    try {
        var message = new Message(req.body);
        var savedMessages = await message.save();
        // Get data based on message
        var censord = await Message.findOne({ message: 'badWord' });
        if (censord) {
            // Message found and removing
            console.log('Censored word found', censord);
            await Message.remove({ _id: censord.id },);
        } else {
            io.emit('message', req.body);
        }
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        return console.log('Error', error);
    } finally {
        console.log('Finished');
    }
});

