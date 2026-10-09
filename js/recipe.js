const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const recipe = recipes.find(function (item){
    return item.id === id;
});

const content = document.querySelector('#recipe-content');

if (!recipe) {
    content.innerHTML = '<p class="recipe__message">Рецепт не знайдено.</p>';
} else {
    document.title - recipe.name + ' - Смакота';

    const imageHtml = recipe.image
    ? `<img class="recipe__image" src="${recipe.image}" alt="${recipe.alt}">`
      
    : `<div class="recipe__image recipe__image--placeholder">🍽️</div>`;
    
    const ingredientsHtml = recipe.ingredients.length > 0
    ? recipe.ingredients.map(function(item){
        return `<li>${escapeHtml(item)}</li>`;
        }).join('')
        : '<li>Інгредієнти ще не додані.</li>';

        const stepsHtml = recipe.steps.length > 0
        ? recipe.steps.map(function(step){
        return `<li>${escapeHtml(step)}</li>`;
        }).join('')
        :'<li>Кроки приготування ще не додані.</li>';

        content.innerHTML = `
        <article class="recipe-page">
            <span class="recipe-page__category">${escapeHtml(recipe.category)}</span>
            <h1 class="recipe-page__title">${escapeHtml(recipe.name)}</h1>
            <div class="recipe-page__meta">
                <span>⏱ ${recipe.time} хв</span>
                <span>👨‍🍳 ${escapeHtml(recipe.level)}</span>
                <span>⭐ ${recipe.rating}</span>
            </div>
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
    `;
}