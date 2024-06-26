const { WebSocketServer } = require('ws');
const dotenv = require("dotenv");
const crypto = require('crypto'); // Adiciona a importação do módulo crypto

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();

wss.on("connection", (ws) => {
    const userId = crypto.randomUUID();
    clients.set(ws, { id: userId });

    ws.on("error", console.error);

    ws.on("message", (data) => {
        const messageData = JSON.parse(data);
        const clientInfo = clients.get(ws);

        // Atualiza as informações do cliente
        clientInfo.name = messageData.userName;
        clientInfo.color = messageData.userColor;

        // Envia a mensagem para todos os clientes
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                    userId: clientInfo.id, // Corrige para enviar o id correto do cliente
                    userName: messageData.userName,
                    userColor: messageData.userColor,
                    content: messageData.content
                }));
            }
        });
    });

    ws.on("close", () => {
        clients.delete(ws);
        updateClientsList();
    });

    const updateClientsList = () => {
        const clientsList = Array.from(clients.values());
        const message = JSON.stringify({ type: 'clientsList', clients: clientsList });
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    };

    // Atualiza a lista de clientes quando um novo cliente se conecta
    updateClientsList();

    console.log("Client connected");
});
