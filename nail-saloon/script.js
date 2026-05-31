// ============================================================
// script.js — Nail index page: infinite scroll product gallery
// ============================================================
// Depends on: nail-data.js (loaded before this script in index.html)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('nail-container');
    const BATCH_SIZE = 10;

    let cursor = 0;
    let isLoading = false;
    let noMoreNails = false;

    const sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    sentinel.style.cssText = 'height:1px;grid-column:1/-1;';

    // --------------- Load a batch of nails ---------------
    function loadNailBatch() {
        if (isLoading || noMoreNails) return;
        isLoading = true;

        sentinel.remove();

        const batch = NAIL_IDS.slice(cursor, cursor + BATCH_SIZE);

        for (const id of batch) {
            const nail = buildNail(id);
            if (nail) {
                container.appendChild(createNailCard(nail));
            }
        }

        cursor += batch.length;

        if (cursor >= TOTAL_NAILS) {
            noMoreNails = true;
        } else {
            container.appendChild(sentinel);
        }

        isLoading = false;
    }

    // --------------- Build nail object from NAIL_DATA ---------------
    function buildNail(id) {
        const data = NAIL_DATA[id];
        if (!data || data.images.length === 0) return null;

        const folder = `nails/${id}/`;

        let title = `Nail Design #${id}`;
        const desc = data.desc || '';
        if (desc) {
            const first = desc.split(/[.:]/)[0].trim();
            if (first && first.length < 60) title = first;
        }

        return {
            id,
            title,
            description: desc || 'Beautiful nail art design with premium quality materials.',
            imageUrl: `${folder}${data.images[0]}`,
            detailUrl: `product.html?nail=${id}`
        };
    }

    // --------------- Create a DOM card ---------------
    function createNailCard(nail) {
        const card = document.createElement('a');
        card.href = nail.detailUrl;
        card.className = 'nail-card';

        card.innerHTML = `
            <img src="${nail.imageUrl}" alt="${escapeHTML(nail.title)}" class="nail-image" loading="lazy" onerror="this.parentElement.classList.add('img-broken')">
            <div class="nail-info">
                <h3>${escapeHTML(nail.title)}</h3>
                <p>${escapeHTML(truncate(nail.description, 150))}</p>
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
        if (entries[0].isIntersecting && !isLoading && !noMoreNails) {
            loadNailBatch();
        }
    }, { rootMargin: '300px' });

    // --------------- Kick off ---------------
    container.innerHTML = '';
    loadNailBatch();
    if (!noMoreNails) {
        observer.observe(sentinel);
    }
});
