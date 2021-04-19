const express = require('express');
const cors = require('cors');
const events = require('events') // способ управлениями событиями(регистрация, подписка и т.п.)
const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express()

app.use(cors()) // теперь добавили cors мидлвеер
app.use(express.json()) // парсер для json

app.get('/get-messages', (req, res) => {
    emitter.once('newMessage', (message) => {
        res.json(message)
    })
})

app.post('/new-messages', ((req, res) => {
    const message = req.body;
    console.log(message)
    // пользователь отправляет событие и в всем участникам чата прилетает уведомление
    // о этом событие(+сообщение)
    emitter.emit('newMessage', message)
    res.status(200)
}))


app.listen(PORT, () => console.log(`server запустился on port ${PORT}`))
// Область применения рассылки и т.п. где не нужна скорость обновления