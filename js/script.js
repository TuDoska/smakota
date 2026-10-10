// ---------- Випадковий рецепт ----------
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


// ---------- Елементи сторінки ----------
const popularList = document.querySelector('.popular__list');
const popularTitle = document.querySelector('.popular__title');
const popularLink = document.querySelector('.popular__link');
const searchInput = document.querySelector('.hero__search');
const searchForm = document.querySelector('.hero__form');
const timeSelect = document.querySelector('#filter-time');
const levelSelect = document.querySelector('#filter-level');
const resetButton = document.querySelector('#filter-reset');
const savedButton = document.querySelector('#saved-button');

const defaultTitle = 'Популярні рецепти';
const linkDefaultText = 'Дивитися всі →';


// ---------- Стан ----------
let showingAll = false;
let selectedCategory = '';
let onlySaved = false;


// ---------- Малювання карток ----------
function renderRecipes(list, emptyText) {
    if (list.length === 0) {
        popularList.innerHTML = '<li class="popular__empty">' + (emptyText || 'Нічого не знайдено. Спробуйте змінити пошук або фільтри.') + '</li>';
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


// ---------- Допоміжні функції ----------
function resetLink() {
    showingAll = false;
    popularLink.textContent = linkDefaultText;
}

function resetFilters() {
    searchInput.value = '';
    timeSelect.value = '0';
    levelSelect.value = '';
    selectedCategory = '';
    onlySaved = false;
    savedButton.classList.remove('popular__saved--active');
}

function scrollToRecipes() {
    document.querySelector('.popular').scrollIntoView({ behavior: 'smooth' });
}


// ---------- Головна функція: читає всі умови й малює результат ----------
function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const maxTime = Number(timeSelect.value);
    const level = levelSelect.value;
    const favorites = getFavorites();

    const hasFilters = query !== '' || selectedCategory !== '' || maxTime !== 0 || level !== '' || onlySaved;

    if (!hasFilters) {
        popularTitle.textContent = defaultTitle;
        renderRecipes(showingAll ? recipes : recipes.slice(0, 3));
        return;
    }

    resetLink();

    const found = recipes.filter(function (recipe) {
        const matchesQuery = query === ''
            || recipe.name.toLowerCase().includes(query)
            || recipe.category.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === '' || recipe.category === selectedCategory;
        const matchesTime = maxTime === 0 || recipe.time <= maxTime;
        const matchesLevel = level === '' || recipe.level === level;
        const matchesSaved = !onlySaved || favorites.includes(recipe.id);

        return matchesQuery && matchesCategory && matchesTime && matchesLevel && matchesSaved;
    });

    if (onlySaved) {
        popularTitle.textContent = 'Збережені рецепти';
    } else if (selectedCategory !== '') {
        popularTitle.textContent = selectedCategory;
    } else {
        popularTitle.textContent = 'Результати пошуку';
    }

    const emptyText = (onlySaved && favorites.length === 0)
        ? 'Ви ще нічого не зберегли. Відкрийте рецепт і натисніть «Зберегти».'
        : undefined;

    renderRecipes(found, emptyText);
}

applyFilters();


// ---------- Пошук ----------
searchInput.addEventListener('input', applyFilters);

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    applyFilters();
    scrollToRecipes();
});


// ---------- Фільтри ----------
timeSelect.addEventListener('change', applyFilters);
levelSelect.addEventListener('change', applyFilters);

resetButton.addEventListener('click', function () {
    resetFilters();
    resetLink();
    applyFilters();
});


// ---------- Категорії ----------
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(function (card) {
    card.addEventListener('click', function (event) {
        event.preventDefault();

        const categoryName = card.querySelector('.category-card__name').textContent;

        selectedCategory = (selectedCategory === categoryName) ? '' : categoryName;
        applyFilters();
        scrollToRecipes();
    });
});


// ---------- Збережені ----------
savedButton.addEventListener('click', function () {
    onlySaved = !onlySaved;
    savedButton.classList.toggle('popular__saved--active', onlySaved);
    applyFilters();
    scrollToRecipes();
});


// ---------- Дивитися всі / Показати менше ----------
popularLink.addEventListener('click', function (event) {
    event.preventDefault();

    resetFilters();
    showingAll = !showingAll;
    popularLink.textContent = showingAll ? 'Показати менше ←' : linkDefaultText;
    applyFilters();
});


// ---------- Форма додавання рецепта ----------
function linesToList(text) {
    return text
        .split('\n')
        .map(function (line) {
            return line.trim();
        })
        .filter(function (line) {
            return line !== '';
        });
}

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
        ingredients: linesToList(formData.get('ingredients')),
        steps: linesToList(formData.get('steps'))
    };

    savedRecipes.unshift(newRecipe);
    localStorage.setItem('userRecipes', JSON.stringify(savedRecipes));
    recipes.unshift(newRecipe);

    recipeForm.reset();

    resetFilters();
    resetLink();
    applyFilters();
    scrollToRecipes();
});