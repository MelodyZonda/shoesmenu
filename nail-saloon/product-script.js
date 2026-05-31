// ============================================================
// product-script.js — Nail design detail page
// ============================================================
// Depends on: nail-data.js
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('product-detail-container');

    const urlParams = new URLSearchParams(window.location.search);
    const nailId = urlParams.get('nail');

    if (!nailId) {
        container.innerHTML = '<p class="error">No nail design specified. <a href="index.html">Go back</a>.</p>';
        return;
    }

    const data = NAIL_DATA[nailId];

    if (!data) {
        container.innerHTML = `
            <p class="error">Nail Design #${nailId} not found.</p>
            <a href="index.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to All Designs</a>
        `;
        return;
    }

    const folderPath = `nails/${nailId}/`;
    const desc = data.desc || 'Detailed description is not available for this design.';

    // Build description HTML
    const descLines = desc.split('\n').map(l => l.trim()).filter(l => l);
    let descText = '';
    for (const line of descLines) {
        if (line.startsWith('$') || line.startsWith('Total:')) continue;
        descText += line + '<br>';
    }
    descText = descText.trim();

    // Title = first sentence
    let title = `Nail Design #${nailId}`;
    if (descText) {
        const firstSentence = descText.split(/[.:]/)[0].replace(/<br>/g, '').trim();
        if (firstSentence && firstSentence.length < 60) {
            title = firstSentence;
        }
    }

    // Build image gallery
    const imageList = data.images || [];
    let imagesHTML = '';
    imageList.forEach(imgName => {
        if (!imgName) return;
        const imgPath = folderPath + imgName;
        imagesHTML += `
            <div class="detail-image-frame">
                <img src="${imgPath}" alt="${title}" class="detail-image" loading="lazy" onerror="this.parentElement.style.display='none'">
            </div>
        `;
    });

    container.innerHTML = `
        <section class="product-detail">
            <h2>${title}</h2>
            <div class="detail-content">
                <div class="image-gallery">
                    ${imagesHTML || '<p>No images available.</p>'}
                </div>
                <div class="detail-description">
                    <h3>Design Details</h3>
                    <p>${descText || 'Detailed description is not available for this design.'}</p>
                    <div class="nail-specs">
                        <h4>Specifications</h4>
                        <ul>
                            <li><strong>Type:</strong> Full Coverage Press-On Nails</li>
                            <li><strong>Shape:</strong> Square / Coffin / Almond</li>
                            <li><strong>Material:</strong> Premium Acrylic ABS</li>
                            <li><strong>Finish:</strong> Glossy / Matte</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    `;
});
