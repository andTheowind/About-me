const openButton = document.querySelector('#openBtn');
const closeButton = document.querySelector('#closeBtn');
const wrapper = document.querySelector('.wrapper');
const firstMenuItem = document.querySelector('nav > ul li');
const secondMenuItem = document.querySelector('nav > ul li + li');
const thirdMenuItem = document.querySelector('nav > ul li + li +li');
const nav = document.querySelector('nav');

openButton.addEventListener('click', function () {
    wrapper.classList.add('show-nav');
    firstMenuItem.style.transform = 'translateX(0%)';
    secondMenuItem.style.transform = 'translateX(0%)';
    thirdMenuItem.style.transform = 'translateX(0%)';
    nav.style.display = 'none';
})

closeButton.addEventListener('click', function () {
    wrapper.classList.remove('show-nav');
    firstMenuItem.style.transform = 'translateX(-100%)';
    secondMenuItem.style.transform = 'translateX(-150%)';
    thirdMenuItem.style.transform = 'translateX(-200%)';
    nav.style.display = 'block';
})
