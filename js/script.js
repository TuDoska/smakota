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



function resetLink() {
    showingAll = false;
    popularLink.textContent = linkDefaultText;
}

function renderRecipes(list, emptyText) {
    if (list.length === 0) {
        popularList.innerHTML = '<li class="popular__empty">' + (emptyText || 'Нічого не знайдено. Спробуйте інше слово.') + '</li>';
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
                         <h3 class="recipe-card__title">
                                <a class="recipe-card__link" href="recipe.html?id=${recipe.id}">${escapeHtml(recipe.name)}</a>
                            </h3>
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
        alt: '',
        id: 'u' + Date.now(),
        ingredients: [],
        steps: [],
        ingredients: linesToList(formData.get('ingredients')),
        steps: linesToList(formData.get('steps'))
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


const savedButton = document.querySelector('#saved-button');

savedButton.addEventListener('click', function () {
    const favorites = getFavorites();

    const found = recipes.filter(function (recipe) {
        return favorites.includes(recipe.id);
    });

    searchInput.value = '';
    resetLink();
    popularTitle.textContent = 'Збережені рецепти';
    renderRecipes(found, 'Ви ще нічого не зберегли. Відкрийте рецепт і натисніть «Зберегти».');
    document.querySelector('.popular').scrollIntoView({ behavior: 'smooth' });
});