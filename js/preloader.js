const mask = document.querySelector('.mask');

window.addEventListener('load', function () {
    if (!mask) return;
    mask.classList.add('hide');
    setTimeout(function () {
        mask.remove();
    }, 600);
});
