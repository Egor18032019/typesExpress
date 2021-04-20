const express = require('express');
const cors = require('cors');
const events = require('events')
const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express()

app.use(cors())
app.use(express.json())

app.get('/connect', (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive', // держать подключение
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    })
    // подписываемся на событие.
    emitter.on('newMessage', (message) => {
        console.log(message)
        res.write(`data: ${JSON.stringify(message)} \n\n`) // можем записывать только строковое значение + формат(data:)
    })
})

app.post('/new-messages', ((req, res) => {
    const message = req.body;
    console.log(message)
    emitter.emit('newMessage', message)
    res.status(200)
}))


app.listen(PORT, () => console.log(`server запущен on port ${PORT}`))