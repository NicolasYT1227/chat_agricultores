const btnMenuCell = document.querySelector(".btnMenuUserOCell");
const leftSectionUser = document.querySelector(".left-section");
const userOtherCell = document.querySelector(".chatAg__userOther");
const userMyMenu = document.querySelector(".chatAg__my");
const chatMenu = document.querySelector(".chatAg");
const chatInputMenu = chatMenu.querySelector(".chatAg__form");

let menuEstaAberto = 0;

function toggleMenuMobile() {
    if (menuEstaAberto === 0) {
        leftSectionUser.classList.add('show');
        userOtherCell.classList.add('show');
        leftSectionUser.style.width = '250px';
        userMyMenu.style.display = 'none';
        chatInputMenu.style.display = 'none';
        menuEstaAberto = 1;
    } else {
        leftSectionUser.classList.remove('show');
        userOtherCell.classList.remove('show');
        leftSectionUser.style.width = '0';
        userMyMenu.style.display = 'block';
        chatInputMenu.style.display = 'flex';
        menuEstaAberto = 0;
    }
}

btnMenuCell.addEventListener("click", (event) => {
    event.preventDefault();
    toggleMenuMobile();
});
