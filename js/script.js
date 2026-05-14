const openButton = document.querySelector('#openBtn');
const closeButton = document.querySelector('#closeBtn');
const wrapper = document.querySelector('.wrapper');
const circleContainer = document.querySelector('.circle-container');
const firstMenuItem = document.querySelector('nav > ul li');
const secondMenuItem = document.querySelector('nav > ul li + li');
const thirdMenuItem = document.querySelector('nav > ul li + li + li');

if (circleContainer && document.body && circleContainer.parentElement !== document.body) {
    document.body.appendChild(circleContainer);
}

if (openButton && closeButton && wrapper && firstMenuItem && secondMenuItem && thirdMenuItem) {
    const openMenu = function () {
        document.body.classList.add('menu-open');
        wrapper.classList.add('show-nav');
        firstMenuItem.style.transform = 'translateX(0%)';
        secondMenuItem.style.transform = 'translateX(0%)';
        thirdMenuItem.style.transform = 'translateX(0%)';
    };

    const closeMenu = function () {
        document.body.classList.remove('menu-open');
        wrapper.classList.remove('show-nav');
        firstMenuItem.style.transform = 'translateX(-100%)';
        secondMenuItem.style.transform = 'translateX(-125%)';
        thirdMenuItem.style.transform = 'translateX(-150%)';
    };

    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
}
