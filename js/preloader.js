let mask = document.querySelector('.mask');
let body = document.querySelector('body');

window.addEventListener('load', function () {
    mask.classList.add('.hide');
    setTimeout(function () {
        mask.remove();
    }, 600);
    body.style.backgroundColor = '#976995';
});