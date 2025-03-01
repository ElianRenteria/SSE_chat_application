const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;


let messages = [];


let clients = [];


app.use(cors());
app.use(express.json());  


app.get('/events', (req, res) => {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();  

    clients.push(res);

    res.write(`data: ${JSON.stringify(messages)}\n\n`);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

app.post('/messages', (req, res) => {
    const newMessage = req.body.message;
    const user = req.body.username;

    if (newMessage) {
        const message = { username: user, message: newMessage };
        messages.push(message);

        clients.forEach(client => {
            client.write(`data: ${JSON.stringify(messages)}\n\n`);
        });

        res.status(200).json({ message: 'Message received' });
    } else {
        res.status(400).json({ error: 'No message content' });
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
