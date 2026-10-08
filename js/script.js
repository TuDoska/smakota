const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');

burger.addEventListener('click', function () {
    menu.classList.toggle('header__menu--open');
});


const recipes = [
    {
        category: 'Піца',
        name: 'Піца Маргарита як у Неаполі',
        time: 40,
        level: 'Середньо',
        rating: 4.9,
        image: 'img/pizza.jpg',
        alt: "Піца Маргарита на дерев'яній дошці з базиліком"
    },
    {
        category: 'Китайська кухня',
        name: 'Дамплінги на пару зі свининою',
        time: 60,
        level: 'Складно',
        rating: 4.8,
        image: 'img/dumplings.jpg',
        alt: 'Дамплінги в бамбуковій пароварці з соєвим соусом'
    },
    {
        category: 'Випічка',
        name: "Булочки з корицею та глазур'ю",
        time: 90,
        level: 'Легко',
        rating: 4.7,
        image: 'img/bakery.jpg',
        alt: 'Булочки з корицею та круасани на деку'
    },
    {
        category: 'Перші страви',
        name: 'Український борщ',
        time: 120,
        level: 'Середньо',
        rating: 4.8,
        image: 'img/borscht.jpg',
        alt: 'Миска борщу зі сметаною'
    },
    {
        category: 'Другі страви',
        name: 'Вареники з картоплею',
        time: 60,
        level: 'Легко',
        rating: 4.7,
        image: '',
        alt: ''
    },
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






const popularList = document.querySelector('.popular__list');

function renderRecipes(list) {
    if (list.length === 0) {
        popularList.innerHTML = '<li class="popular__empty">Нічого не знайдено. Спробуйте інше слово.</li>';
        return;
    }

    let cardsHtml = '';

    list.forEach(function (recipe) {
        const imageHtml = recipe.image
            ? `<img class="recipe-card__image" src="${recipe.image}" alt="${recipe.alt}">`
            : `<div class="recipe-card__image recipe-card__image--placeholder">🍽️</div>`;

        cardsHtml += `
            <li>
                <article class="recipe-card">
                    ${imageHtml}
                    <div class="recipe-card__body">
                        <span class="recipe-card__category">${recipe.category}</span>
                        <h3 class="recipe-card__title">${recipe.name}</h3>
                        <div class="recipe-card__meta">
                            <span>⏱ ${recipe.time} хв</span>
                            <span>👨‍🍳 ${recipe.level}</span>
                            <span>⭐ ${recipe.rating}</span>
                        </div>
                    </div>
                </article>
            </li>
        `;
    });

    popularList.innerHTML = cardsHtml;
}

renderRecipes(recipes.slice(0, 3));


const searchInput = document.querySelector('.hero__search');
const searchForm = document.querySelector('.hero__form');

function search() {
    const query = searchInput.value.trim().toLowerCase();

    if (query === '') {
        renderRecipes(recipes.slice(0, 3));
        return;
    }

    const found = recipes.filter(function (recipe) {
        return recipe.name.toLowerCase().includes(query);
    });

    renderRecipes(found);
}

searchInput.addEventListener('input', search);

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    search();
    document.querySelector('.popular').scrollIntoView({ behavior: 'smooth' });
});