// ============================================================
// script.js — Index page: infinite scroll product gallery
// ============================================================
// Depends on: shoe-data.js (loaded before this script in index.html)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('shoe-container');
    const BATCH_SIZE = 10;

    let cursor = 0;           // position in SHOE_IDS array
    let isLoading = false;
    let noMoreShoes = false;

    // Sentinel element watched by Intersection Observer
    const sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    sentinel.style.cssText = 'height:1px;grid-column:1/-1;';

    // --------------- Load a batch of shoes ---------------
    function loadShoeBatch() {
        if (isLoading || noMoreShoes) return;
        isLoading = true;

        sentinel.remove();

        const batch = SHOE_IDS.slice(cursor, cursor + BATCH_SIZE);

        for (const id of batch) {
            const shoe = buildShoe(id);
            if (shoe) {
                container.appendChild(createShoeCard(shoe));
            }
        }

        cursor += batch.length;

        if (cursor >= TOTAL_SHOES) {
            noMoreShoes = true;
        } else {
            container.appendChild(sentinel);
        }

        isLoading = false;
    }

    // --------------- Build shoe object from SHOE_DATA ---------------
    function buildShoe(id) {
        const data = SHOE_DATA[id];
        if (!data || data.images.length === 0) return null;

        const folder = `shoes/${id}/`;

        let title = `Nike Vomero #${id}`;
        const desc = data.desc || '';
        if (desc) {
            const first = desc.split(/[.:]/)[0].trim();
            if (first && first.length < 60) title = first;
        }

        return {
            id,
            title,
            description: desc || 'Premium quality sneakers with modern design and comfort.',
            imageUrl: `${folder}${data.images[0]}`,
            detailUrl: `product.html?shoe=${id}`
        };
    }

    // --------------- Create a DOM card ---------------
    function createShoeCard(shoe) {
        const card = document.createElement('a');
        card.href = shoe.detailUrl;
        card.className = 'shoe-card';

        card.innerHTML = `
            <img src="${shoe.imageUrl}" alt="${escapeHTML(shoe.title)}" class="shoe-image" loading="lazy" onerror="this.parentElement.classList.add('img-broken')">
            <div class="shoe-info">
                <h3>${escapeHTML(shoe.title)}</h3>
                <p>${escapeHTML(truncate(shoe.description, 150))}</p>
            </div>
        `;
        return card;
    }

    // --------------- Utilities ---------------
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function truncate(str, max) {
        return str.length > max ? str.substring(0, max) + '...' : str;
    }

    // --------------- Intersection Observer ---------------
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && !noMoreShoes) {
            loadShoeBatch();
        }
    }, { rootMargin: '300px' });

    // --------------- Kick off ---------------
    container.innerHTML = '';
    loadShoeBatch();
    if (!noMoreShoes) {
        observer.observe(sentinel);
    }
});
