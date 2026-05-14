const mask = document.querySelector('.mask');
const body = document.querySelector('body');

window.addEventListener('load', function () {
    if (!mask) return;
    mask.classList.add('hide');
    setTimeout(function () {
        mask.remove();
    }, 600);
    if (body) {
        body.style.backgroundColor = '#07080d';
    }
});
