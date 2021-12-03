var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
// Regular http server, shares with both express and socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname));
// Prase body data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
const uri = "mongodb+srv://username:password@cluster0.bdaop.mongodb.net/DatabaseName?retryWrites=true&w=majority";
mongoose.Promise = Promise
var Message = mongoose.model('Message',{
    name: String,
    message: String
});
app.get('/messages',(req, res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages);
    });
});
// app.post('/messages',(req, res)=>{
//     var message = new Message(req.body);
//     message.save().then(()=>{
//         // Get data based on message
//         return Message.findOne({message:'badWord'});
//     })
//     .then((error,censord)=>{
//         if(censord){
//             // Message found and removing
//             console.log('Censored word found',censord);
//             return Message.remove({_id:censord.id},);
//         }
//         io.emit('message',req.body);
//         res.sendStatus(200);
//     })
//     .then((err)=>{
//         console.log('Removed censored word');
//     })
//     .catch((err)=>{
//         res.sendStatus(500);
//         return console.log('Error',err);
//     });
// });
app.post('/messages', async (req, res)=>{
try{ 
        var message = new Message(req.body);
        var savedMessages = await message.save();
            // Get data based on message
            var censord = await Message.findOne({message:'badWord'});
            if(censord){
                // Message found and removing
                console.log('Censored word found',censord);
                await Message.remove({_id:censord.id},);
            } else {
                io.emit('message',req.body);
            }
            res.sendStatus(200);
            //     .catch((err)=>{
    //         res.sendStatus(500);
    //         return console.log('Error',err);
    //     });
}catch(error){
            res.sendStatus(500);
            return console.log('Error',error);
} finally{
    console.log('Finished');
}
});


io.on('connection',(socket)=>{
    console.log('User Connected');
});
mongoose.connect(uri,(err)=>{
    console.log('Mongo Db Connection done', err);
})
var server = http.listen(3000,()=>{
    console.log('Server is listening on port', server.address().port);
});

app.get('/messages/:user',(req, res)=>{
    var user = req.params.user;
    Message.find({name: user},(err,messages)=>{
        res.send(messages);
    });
});

// Practice Functions

// async function myFunction() {
//     var list = await GetMessages();
//     console.log(list);
// }


// async function myFunction() {
//     try {
//         var response = await request();
//         console.log(response);
//     } catch (error) {
//         console.log(error);
//     }

// }
