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

let savedRecipes = [];

try {
    savedRecipes = JSON.parse(localStorage.getItem('userRecipes')) || [];
} catch (error) {
    savedRecipes = [];
}

recipes.unshift(...savedRecipes);


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
const popularTitle = document.querySelector('.popular__title');
const popularLink = document.querySelector('.popular__link');
const defaultTitle = 'Популярні рецепти';
const linkDefaultText = 'Дивитися всі →';
let showingAll = false;

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function resetLink() {
    showingAll = false;
    popularLink.textContent = linkDefaultText;
}

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
                        <span class="recipe-card__category">${escapeHtml(recipe.category)}</span>
                        <h3 class="recipe-card__title">${escapeHtml(recipe.name)}</h3>
                        <div class="recipe-card__meta">
                            <span>⏱ ${recipe.time} хв</span>
                            <span>👨‍🍳 ${escapeHtml(recipe.level)}</span>
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
    resetLink();

    if (query === '') {
        popularTitle.textContent = defaultTitle;
        renderRecipes(recipes.slice(0, 3));
        return;
    }

    const found = recipes.filter(function (recipe) {
        const inName = recipe.name.toLowerCase().includes(query);
        const inCategory = recipe.category.toLowerCase().includes(query);

        return inName || inCategory;
    });

    popularTitle.textContent = 'Результати пошуку';
    renderRecipes(found);
}

searchInput.addEventListener('input', search);

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    search();
    document.querySelector('.popular').scrollIntoView({ behavior: 'smooth' });
});


const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(function (card) {
    card.addEventListener('click', function (event) {
        event.preventDefault();

        const categoryName = card.querySelector('.category-card__name').textContent;

        const found = recipes.filter(function (recipe) {
            return recipe.category === categoryName;
        });

        searchInput.value = '';
        resetLink();
        popularTitle.textContent = categoryName;
        renderRecipes(found);
        document.querySelector('.popular').scrollIntoView({ behavior: 'smooth' });
    });
});


popularLink.addEventListener('click', function (event) {
    event.preventDefault();

    searchInput.value = '';
    popularTitle.textContent = defaultTitle;

    if (showingAll) {
        renderRecipes(recipes.slice(0, 3));
        popularLink.textContent = linkDefaultText;
    } else {
        renderRecipes(recipes);
        popularLink.textContent = 'Показати менше ←';
    }

    showingAll = !showingAll;
});


const recipeForm = document.querySelector('#recipe-form');

recipeForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(recipeForm);

    const newRecipe = {
        category: formData.get('category'),
        name: formData.get('name').trim(),
        time: Number(formData.get('time')),
        level: formData.get('level'),
        rating: '–',
        image: '',
        alt: ''
    };

    savedRecipes.unshift(newRecipe);
    localStorage.setItem('userRecipes', JSON.stringify(savedRecipes));
    recipes.unshift(newRecipe);

    recipeForm.reset();

    searchInput.value = '';
    resetLink();
    popularTitle.textContent = defaultTitle;
    renderRecipes(recipes.slice(0, 3));
    document.querySelector('.popular').scrollIntoView({ behavior: 'smooth' });
});