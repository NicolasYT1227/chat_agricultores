const { WebSocketServer } = require('ws');
const dotenv = require("dotenv");
const crypto = require('crypto'); // Adiciona a importação do módulo crypto

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();

function addUser(user, ws) {
    console.log(user)
    clients.set(ws, { id: user.id, userName: user.name });
}

function addMessage(messageData, ws) {
    const clientInfo = clients.get(ws);
    clientInfo.userName = messageData.userName;
    clientInfo.userColor = messageData.userColor;

    // Envia a mensagem para todos os clientes
    wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({
                userId: clientInfo.id,
                userName: clientInfo.userName,
                userColor: clientInfo.userColor,
                content: messageData.content
            }));
        }
    });
}

function handleDisconnectUser(ws){
    console.log("Usuário disconectado")

    ws.send(JSON.stringify({ type: 'disconnect', status: 'sucess' }));

    ws.close();
}

wss.on("connection", (ws, req) => {
    const { url } = req;

    const updateClientsList = () => {
        const clientsList = Array.from(clients.values());
        const message = JSON.stringify({ type: 'clientsList', clients: clientsList });
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    };

    ws.on("error", console.error);

    ws.on("message", (data) => {

        const dataObj = JSON.parse(data)

        const { type } = dataObj

        switch (type) {
            case 'addUser':
                addUser(dataObj.user, ws);
                updateClientsList()
                break
            case 'sendMessage':
                addMessage(dataObj.message, ws);
                break
            case 'logout':
                
        }
    });

    ws.on('message', (message) => {
        console.log("Mensagem recebida")
        const eventParsedUser = JSON.parse(message)

        if(eventParsedUser.type === 'disconnect'){
            handleDisconnectUser(ws);
        }
    });

    ws.on("close", () => {
        clients.delete(ws);
        updateClientsList();
    });

    // Atualiza a lista de clientes quando um novo cliente se conecta
    updateClientsList();

    console.log("Client connected");
});

console.log("O servidor foi iniciado")
