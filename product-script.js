// ============================================================
// product-script.js — Product detail page
// ============================================================
// Depends on: shoe-data.js
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('product-detail-container');

    const urlParams = new URLSearchParams(window.location.search);
    const shoeId = urlParams.get('shoe');

    if (!shoeId) {
        container.innerHTML = '<p class="error">No shoe product specified. <a href="index.html">Go back</a>.</p>';
        return;
    }

    const data = SHOE_DATA[shoeId];

    if (!data) {
        container.innerHTML = `
            <p class="error">Shoe #${shoeId} not found.</p>
            <a href="index.html" class="back-button"><i class="fas fa-arrow-left"></i> Back to All Shoes</a>
        `;
        return;
    }

    const folderPath = `shoes/${shoeId}/`;
    const desc = data.desc || 'Detailed description is not available for this product.';

    // Build description HTML
    const descLines = desc.split('\n').map(l => l.trim()).filter(l => l);
    let descText = '';
    for (const line of descLines) {
        if (line.startsWith('$') || line.startsWith('Total:')) continue;
        descText += line + '<br>';
    }
    descText = descText.trim();

    // Title = first sentence
    let title = `Nike Vomero #${shoeId}`;
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
                    <h3>Product Details</h3>
                    <p>${descText || 'Detailed description is not available for this product.'}</p>
                    <div class="fake-specs">
                        <h4>Specifications</h4>
                        <ul>
                            <li><strong>Material:</strong> Premium Leather & Mesh</li>
                            <li><strong>Closure:</strong> Lace-Up</li>
                            <li><strong>Fit:</strong> True to size</li>
                            <li><strong>Best For:</strong> Casual wear, Daily use</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    `;
});
