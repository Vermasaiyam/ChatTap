const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const colors = require('colors');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();

// middlewares
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
})

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

// -----------Deployment------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}



// -----------Deployment------------------

const server = app.listen(PORT, console.log(`App started on PORT: ${PORT}`.yellow.bold));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection', (socket) => {
    console.log('connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id);

        socket.emit('connected');
    })
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("room: ", room);
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved);
        })
    })


    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    })
    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing');
    })

    socket.off('setup', () => {
        console.log("USER Disconnected");
        socket.leave(userData._id);
    })
})
