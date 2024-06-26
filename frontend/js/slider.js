let currentIndex = 0;
const images = document.querySelectorAll(".img-slider");
const btnNext = document.querySelector(".next");
const btnPrev = document.querySelector(".prev");

const CampoNavS = document.querySelector(".engloba_tudo_nav");
const campoLoginS = document.querySelector(".loginAg");
const campoInformeS = document.querySelector(".information");
const btnReturnPageI = document.querySelector(".returnPageI");
const sliderI = document.querySelector('.slider');

function showImage(index) {
    images.forEach((img, i) => {
        if (i === index) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    });
}

function btnReturnI() {
    btnReturnPageI.addEventListener("click", (e) => {
        e.preventDefault();

        campoLoginS.style.display = 'none';
        //campoInformeS.style.display = 'flex';
        CampoNavS.style.display = 'flex';
        campoNav.classList.add('navigation');

        currentIndex = 0;
        showImage(currentIndex);

        sliderI.style.display = 'flex';
        sliderI.classList.add('slider-content');

    });
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

setInterval(nextImage, 3000);
btnReturnI(); // Certifique-se de chamar a função para adicionar o evento ao botão
