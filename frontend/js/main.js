const btnLoginAg = document.querySelector(".loginAg__button");
const myUsername = document.querySelector(".name__my");

const chat = document.querySelector(".chatAg");
const chatForm = chat.querySelector(".chatAg__form");
const chatInput = chat.querySelector(".chatAg__input");
const chatMessages = document.querySelector(".chatAgMessage"); // Corrigido
const usersListElement = document.querySelector(".chatAg__userOther"); // Corrigido

const BACK_URL = "ws://localhost:8080"

const websocket = new WebSocket(BACK_URL);

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
];

const imgUsers = [
    "https://static.vecteezy.com/system/resources/previews/000/551/599/original/user-icon-vector.jpg",
    "https://tse2.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api&P=0&h=180",
    "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
];

function getRandomImageUrl() {
    const randomIndex = Math.floor(Math.random() * imgUsers.length);
    return imgUsers[randomIndex];
}

function userMy(userNameInput) {
    if (myUsername) {
        myUsername.textContent = userNameInput;
    }
}

function userOther(userNameInput) {
    const userNameAg = document.querySelector(".name__other");
    userNameAg.innerHTML = userNameInput;
}

const user = { name: "", id: "", color: "" };

const createMessageSelfElement = (content) => {
    const div = document.createElement("div");
    div.classList.add("message-self");
    div.innerHTML = content;
    return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message-other");

    span.classList.add("message--sender");
    span.style.color = senderColor;
    span.textContent = sender;

    div.appendChild(span);
    div.innerHTML += content;

    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

const processMessage = ({ data }) => {
    const parsedData = JSON.parse(data);

    if (parsedData.type === 'clientsList') {
        updateUsersList(parsedData.clients);
    } else {
        const { userId, userName, userColor, content } = parsedData;

        const message = userId === user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor);

        if (chatMessages) {
            chatMessages.appendChild(message);
            scrollScreen();
        }
    }
};

const updateUsersList = (clients) => {
    if (usersListElement) {
        usersListElement.innerHTML = '';

        if (clients.length > 1) {
            clients.forEach(client => {
                if (client.id !== user.id) {
                    const div = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = getRandomImageUrl();
                    img.alt = 'User Image';
                    img.classList.add('img__other');

                    div.textContent = client.userName || client.id;
                    div.style.color = client.color;
                    div.classList.add('name__other');

                    div.insertBefore(img, div.firstChild);

                    usersListElement.appendChild(div);
                }
            });
        }
    }
};

const campoNav = document.querySelector(".engloba_tudo_nav");
const campoLogin = document.querySelector(".loginAg");
const campoInforme = document.querySelector(".information");
const campoChat = document.querySelector(".chatAg");
const campoUserLeft = document.querySelector(".left-section");

function funcaoDeExibicaoSobSite(event){
    const btnLogin = document.getElementById("btnLogin");

    btnLogin.addEventListener("click", (e) => {
        e.preventDefault();

        campoNav.style.display = 'none';
        //campoInforme.style.display = 'none';
        campoLogin.style.display = 'flex';
    });
}

function btnLoginHerePage(event){
    const btnLogHere = document.getElementById("btnRedPage");

    btnLogHere.addEventListener("click", (e) => {
        e.preventDefault();

        campoNav.style.display = 'none';
        campoInforme.style.display = 'none';
        campoLogin.style.display = 'flex';

    });
}

function loginAg() {
    document.querySelector('.loginAg__form').addEventListener('submit', function(event) {
        event.preventDefault();

        const userNameInput = document.querySelector('.loginAg__input').value.trim();

        user.name = userNameInput;
        
        if(userNameInput === user.name){
            userMy(userNameInput)
        } else {
            userOther(userNameInput)
        }

        document.querySelector('.loginAg').style.display = 'none';
        document.querySelector(".usersContent").style.display = "flex";
        document.querySelector('.UserScreen').style.display = 'flex';
        document.querySelector('.chatAg').style.display = 'flex';

        const userImageElement = document.querySelector('.img__other');
        if (userImageElement) {
            userImageElement.src = getRandomImageUrl();
            userImageElement.style.display = "block";
        }

        user.id = crypto.randomUUID();
        user.color = getRandomColor();

        const message = { type: "addUser", user: user }
        websocket.send(JSON.stringify(message))
        websocket.onmessage = processMessage;

        chatForm.addEventListener("submit", sendMessage);
    });
}

function sendWebsocket(requestData) {
    if (websocket.readyState !== websocket.OPEN) {
        websocket = new websocket(BACK_URL)
    }
}

function sendMessage(event) {
    event.preventDefault();

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        alert("O WebSocket não está aberto, tente novamente.");
        websocket = new websocket(BACK_URL)
        return;
    }

    const requestData = {
        type: 'sendMessage',
        message: {
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: chatInput.value.trim()
        }
    };

    if (requestData.message.content) {
        websocket.send(JSON.stringify(requestData));
        chatInput.value = "";
    }
}


function logoutPage(){
    const btnLogout = document.querySelector(".exitChat");

    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        if(BACK_URL && BACK_URL.readyState === WebSocket.OPEN){
            BACK_URL.close();
        }

        campoNav.style.display = 'flex';
        campoLogin.style.display = 'none';
        campoUserLeft.style.display = 'none';
        campoChat.style.display = 'none';
    })
}

function enviaEventoClickServer(event){
    websocket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log("Recibo do servidor")

        if(message.type === 'disconnect' && message.status === 'sucess'){
            console.log('Sucesso na disconexão do usuário')
        }
    }

    websocket.onclose = () => {
        console.log('Desconectado do servidor')
    }
}

const btnLogoutUserServer = document.querySelector(".exitChat");

btnLoginAg.addEventListener("click", loginAg);
btnLogoutUserServer.addEventListener('click', (clients) => {
    enviaEventoClickServer();
    websocket.send(JSON.stringify({ type: 'disconnect' }));
    updateUsersList(clients);
})
funcaoDeExibicaoSobSite()
//btnLoginHerePage();
logoutPage();