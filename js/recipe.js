const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const recipe = recipes.find(function (item) {
    return item.id === id;
});

const content = document.querySelector('#recipe-content');

if (!recipe) {
    content.innerHTML = '<p class="recipe__message">Рецепт не знайдено.</p>';
} else {
    document.title = recipe.name + ' — Смакота';

    const imageHtml = recipe.image
        ? `<img class="recipe__image" src="${recipe.image}" alt="${recipe.alt}">`
        : `<div class="recipe__image recipe__image--placeholder">🍽️</div>`;

    const ingredientsHtml = recipe.ingredients.length > 0
        ? recipe.ingredients.map(function (item) {
            return `<li>${escapeHtml(item)}</li>`;
        }).join('')
        : '<li>Інгредієнти ще не додані.</li>';

    const stepsHtml = recipe.steps.length > 0
        ? recipe.steps.map(function (step) {
            return `<li>${escapeHtml(step)}</li>`;
        }).join('')
        : '<li>Кроки приготування ще не додані.</li>';

    content.innerHTML = `
        <article class="recipe-page">
            <span class="recipe-page__category">${escapeHtml(recipe.category)}</span>
            <h1 class="recipe-page__title">${escapeHtml(recipe.name)}</h1>
            <div class="recipe-page__meta">
                <span>⏱ ${recipe.time} хв</span>
                <span>👨‍🍳 ${escapeHtml(recipe.level)}</span>
                <span>⭐ ${recipe.rating}</span>
            </div>
            <button class="recipe-page__save" id="save-button" type="button"></button>
            ${imageHtml}
            <div class="recipe-page__columns">
                <section>
                    <h2 class="recipe-page__subtitle">Інгредієнти</h2>
                    <ul class="recipe-page__ingredients">${ingredientsHtml}</ul>
                </section>
                <section>
                    <h2 class="recipe-page__subtitle">Приготування</h2>
                    <ol class="recipe-page__steps">${stepsHtml}</ol>
                </section>
            </div>
        </article>

        <section class="comments">
            <h2 class="recipe-page__subtitle">Коментарі</h2>
            <form class="comments__form" id="comment-form">
                <input type="text" name="author" placeholder="Ваше ім'я" aria-label="Ваше ім'я" maxlength="40" required>
                <textarea name="text" rows="3" placeholder="Ваш коментар" aria-label="Ваш коментар" maxlength="500" required></textarea>
                <button class="comments__button" type="submit">Надіслати</button>
            </form>
            <ul class="comments__list" id="comments-list"></ul>
        </section>
    `;

    // --- Кнопка «Зберегти» ---
    const saveButton = document.querySelector('#save-button');

    function updateSaveButton() {
        if (isFavorite(recipe.id)) {
            saveButton.textContent = '★ Збережено';
            saveButton.classList.add('recipe-page__save--active');
        } else {
            saveButton.textContent = '☆ Зберегти';
            saveButton.classList.remove('recipe-page__save--active');
        }
    }

    updateSaveButton();

    saveButton.addEventListener('click', function () {
        toggleFavorite(recipe.id);
        updateSaveButton();
    });

    // --- Коментарі ---
    const commentForm = document.querySelector('#comment-form');
    const commentsList = document.querySelector('#comments-list');

    function renderComments() {
        const list = getComments(recipe.id);

        if (list.length === 0) {
            commentsList.innerHTML = '<li class="comments__empty">Поки немає коментарів. Будьте першим!</li>';
            return;
        }

        commentsList.innerHTML = list.slice().reverse().map(function (comment) {
            return `
                <li class="comment">
                    <div class="comment__head">
                        <strong>${escapeHtml(comment.author)}</strong>
                        <span class="comment__date">${escapeHtml(comment.date)}</span>
                    </div>
                    <p class="comment__text">${escapeHtml(comment.text)}</p>
                </li>
            `;
        }).join('');
    }

    renderComments();

    commentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(commentForm);
        const author = formData.get('author').trim();
        const text = formData.get('text').trim();

        if (author === '' || text === '') {
            return;
        }

        addComment(recipe.id, {
            author: author,
            text: text,
            date: new Date().toLocaleDateString('uk-UA')
        });

        commentForm.reset();
        renderComments();
    });
}