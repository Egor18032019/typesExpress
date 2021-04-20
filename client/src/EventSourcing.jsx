import React, { useEffect, useState } from 'react';
import axios from "axios";

const EventSourcing = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');


    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        /*
        встроенный класс EventSource используется для получения серверных событий (Server-sent events).
         Только для событий в формате text/event-stream без закрытия соединения.
         Если нам нужно получать поток данных с сервера: неважно, сообщения в чате или же цены для магазина
         – с этим легко справится EventSource. 
         К тому же, он поддерживает автоматическое переподключение при потере соединения, 
         которое, используя WebSocket, нам бы пришлось реализовывать самим. 
         Кроме того, используется старый добрый HTTP, а не новый протокол.
        */
        const eventSource = new EventSource(`http://localhost:5000/connect`)
        eventSource.onmessage = function (event) {
            console.log(event)
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        }
    }

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now()
        })
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div className="message" key={mess.id}>
                            {mess.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventSourcing;