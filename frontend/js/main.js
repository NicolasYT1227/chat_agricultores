const btnLoginAg = document.querySelector(".loginAg__button");
const myUsername = document.querySelector(".name__my");

const chat = document.querySelector(".chatAg");
const chatForm = chat.querySelector(".chatAg__form");
const chatInput = chat.querySelector(".chatAg__input");
const chatMessages = document.querySelector(".chatAgMessage"); // Corrigido
const usersListElement = document.querySelector(".chatAg__userOther"); // Corrigido

let websocket;

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
    "https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png"
];

function getRandomImageUrl() {
    const randomIndex = Math.floor(Math.random() * imgUsers.length);
    return imgUsers[randomIndex];
}

function userMy(userNameInput) {
    const userNameMyAg = document.querySelector(".name__my");
    if (userNameMyAg) {
        userNameMyAg.textContent = userNameInput;
    }
}

function userOther(userNameInput) {
    const userNameAg = document.querySelector(".name__other");
    if (userNameAg) {
        userNameAg.textContent = userNameInput;
    }
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
                // Verifica se o cliente é diferente de você
                if (client.id !== user.id) {
                    const div = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = getRandomImageUrl();
                    img.alt = 'User Image';
                    img.classList.add('img__other');

                    div.textContent = client.username || `User ${client.id}`; // Corrigido
                    div.style.color = client.color;
                    div.classList.add('name__other');

                    div.insertBefore(img, div.firstChild); // Adiciona a imagem antes do texto

                    usersListElement.appendChild(div);
                }
            });
        }
    }
};

function loginAg() {
    document.querySelector('.loginAg__form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get the username
        const userNameInput = document.querySelector('.loginAg__input').value;

        // Check if the username is valid
        if (!userNameInput) {
            alert("Please enter a valid username.");
            return;
        }

        // Set the username to the user object
        user.name = userNameInput;

        // Add the username to the correct section
        userMy(userNameInput);

        // Hide the login section
        document.querySelector('.loginAg').style.display = 'none';

        // Show the chat and user screen sections
        document.querySelector(".usersContent").style.display = "flex";
        document.querySelector('.UserScreen').style.display = 'flex';
        document.querySelector('.chatAg').style.display = 'flex';

        // Select a random image
        const userImageElement = document.querySelector('.img__other');
        if (userImageElement) {
            userImageElement.src = getRandomImageUrl();
            userImageElement.style.display = "block"; // Display image if username exists
        }

        // Set user id and color
        user.id = crypto.randomUUID();
        user.color = getRandomColor();

        // Initialize WebSocket connection
        websocket = new WebSocket("ws://localhost:8080");
        websocket.onmessage = processMessage;

        chatForm.addEventListener("submit", sendMessage);
    });
}

function sendMessage(event) {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    };

    websocket.send(JSON.stringify(message));
    chatInput.value = "";
}

btnLoginAg.addEventListener("click", loginAg);
