document.addEventListener('DOMContentLoaded', () => {
    // Set up category selection
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        category.addEventListener('click', () => {
            // Remove active class from all categories
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            category.classList.add('active');
            
            // In a real app, you would filter products here
            // For this demo, we'll just scroll to the products section
            document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Set up product cards to be clickable
    const productCards = document.querySelectorAll('.product-card');
    let cartCount = 0;
    let cartTotal = 0;
    
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get product details
            const productName = card.querySelector('h3').textContent;
            const productPrice = parseFloat(card.querySelector('.price').textContent);
            
            // Update cart
            cartCount++;
            cartTotal += productPrice;
            
            // Update UI
            updateCartUI(cartCount, cartTotal);
            
            // Provide visual feedback
            animateAddToCart(card);
            
            console.log(`Added ${productName} to cart. Total: ${cartTotal.toFixed(2)} €`);
        });
    });
    
    // Helper functions
    function updateCartUI(count, total) {
        const cartCountEl = document.querySelector('.cart-count');
        const cartTotalEl = document.querySelector('.cart-total');
        const cartButton = document.querySelector('.cart-button');
        
        cartCountEl.textContent = count === 1 ? '1 producto' : `${count} productos`;
        cartTotalEl.textContent = `${total.toFixed(2)} €`;
        
        // Enable/disable checkout button
        cartButton.disabled = count === 0;
    }
    
    function animateAddToCart(card) {
        // Simple animation effect
        card.style.transform = 'scale(0.95)';
        card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.boxShadow = '';
        }, 200);
    }
    
    // Enable horizontal scrolling with touch and mouse for categories
    const slider = document.querySelector('.categories-slider');
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        slider.scrollLeft = scrollLeft - walk;
    });
});

