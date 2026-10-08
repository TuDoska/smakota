const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');

burger.addEventListener('click', function () {
    menu.classList.toggle('header__menu--open');
});


const recipes = [
    { name: 'Піца Маргарита як у Неаполі', time: 40 },
    { name: 'Дамплінги на пару зі свининою', time: 60 },
    { name: 'Булочки з корицею', time: 90 },
    { name: 'Український борщ', time: 120 },
    { name: 'Вареники з картоплею', time: 60 },
];

const randomButton = document.querySelector('.banner__button');
const bannerText = document.querySelector('.banner__subtitle');

let lastIndex = -1;

randomButton.addEventListener('click', function (event) {
    event.preventDefault();

    let index;
    do {
        index = Math.floor(Math.random() * recipes.length);
    } while (index === lastIndex);

    lastIndex = index;

    const recipe = recipes[index];
    bannerText.textContent = 'Спробуйте: ' + recipe.name + ' (' + recipe.time + ' хв)';
});