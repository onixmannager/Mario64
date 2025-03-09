import { createApp, ref, computed, watch } from 'vue';

createApp({
    setup() {
        const menuCategories = ref([
            { id: 1, name: 'Carta' },
            { id: 2, name: 'Menús' },
            { id: 3, name: 'Bebidas' },
            { id: 4, name: 'Postres' }
        ]);

        const subCategories = ref({
            1: [  // Carta subcategories
                { id: 101, name: 'Entrantes', icon: 'fas fa-cheese' },
                { id: 102, name: 'Principales', icon: 'fas fa-utensils' },
                { id: 103, name: 'Carnes', icon: 'fas fa-drumstick-bite' },
                { id: 104, name: 'Pescados', icon: 'fas fa-fish' }
            ],
            2: [  // Menús subcategories
                { id: 201, name: 'Menú del día', icon: 'fas fa-calendar-day' },
                { id: 202, name: 'Menú degustación', icon: 'fas fa-star' },
                { id: 203, name: 'Menú festivo', icon: 'fas fa-glass-cheers' }
            ],
            3: [  // Bebidas subcategories
                { id: 301, name: 'Sin alcohol', icon: 'fas fa-tint' },
                { id: 302, name: 'Con alcohol', icon: 'fas fa-wine-glass-alt' },
                { id: 303, name: 'Vinos', icon: 'fas fa-wine-bottle' }
            ],
            4: [  // Postres subcategories
                { id: 401, name: 'Tartas', icon: 'fas fa-birthday-cake' },
                { id: 402, name: 'Helados', icon: 'fas fa-ice-cream' },
                { id: 403, name: 'Frutas', icon: 'fas fa-apple-alt' }
            ]
        });

        const products = ref([
            // Carta - Entrantes
            { 
                id: 1,
                name: 'Carpaccio de Ternera',
                description: 'Finas láminas de ternera, rúcula, parmesano y aceite de trufa',
                price: 14.50,
                categoryId: 101,
                color: '#b58857',
                svgPath: 'M30,35 C30,30 35,25 50,25 C65,25 70,30 70,35 L65,70 L35,70 Z'
            },
            { 
                id: 2,
                name: 'Tartar de Atún',
                description: 'Atún rojo, aguacate, mango y salsa ponzu',
                price: 16.95,
                categoryId: 101,
                color: '#d84c4c',
                svgPath: 'M35,35 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0 Z M35,65 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0 Z'
            },
            
            // Carta - Principales
            { 
                id: 3,
                name: 'Risotto de Setas',
                description: 'Arroz carnaroli, setas silvestres y trufa negra',
                price: 18.50,
                categoryId: 102,
                color: '#e0c088',
                svgPath: 'M25,50 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0 Z M40,40 L45,45 M60,40 L55,45'
            },
            { 
                id: 4,
                name: 'Tagliatelle al Tartufo',
                description: 'Pasta fresca con crema de trufa y láminas de trufa negra',
                price: 19.50,
                categoryId: 102,
                color: '#d8c48f',
                svgPath: 'M30,70 C30,30 50,30 50,40 C50,30 70,30 70,70 Z M40,50 L60,50'
            },
            
            // Carta - Carnes
            { 
                id: 5,
                name: 'Solomillo Wellington',
                description: 'Solomillo de ternera, duxelle de setas y hojaldre',
                price: 28.00,
                categoryId: 103,
                color: '#993333',
                svgPath: 'M30,35 L70,35 L70,65 L30,65 Z M35,40 L65,40 L65,60 L35,60 Z'
            },
            { 
                id: 6,
                name: 'Paletilla de Cordero',
                description: 'Paletilla de cordero lechal confitada con patatas',
                price: 26.50,
                categoryId: 103,
                color: '#884422',
                svgPath: 'M30,50 L40,35 L60,35 L70,50 L70,70 L30,70 Z'
            },
            
            // Carta - Pescados
            { 
                id: 7,
                name: 'Lubina al Horno',
                description: 'Lubina salvaje con verduras de temporada',
                price: 24.95,
                categoryId: 104,
                color: '#447799',
                svgPath: 'M70,50 C60,30 50,45 30,45 C20,45 25,55 30,55 C50,55 60,70 70,50 Z'
            },
            
            // Menú del día
            { 
                id: 8,
                name: 'Menú Ejecutivo',
                description: 'Entrante, plato principal, postre y bebida',
                price: 29.50,
                categoryId: 201,
                color: '#339966',
                svgPath: 'M25,30 L75,30 L75,70 L25,70 Z M25,40 L75,40 M35,50 L65,50 M35,60 L65,60'
            },
            
            // Menú degustación
            { 
                id: 9,
                name: 'Menú Degustación',
                description: '7 platos con maridaje de vinos incluido',
                price: 75.00,
                categoryId: 202,
                color: '#994499',
                svgPath: 'M30,30 L70,30 L70,70 L30,70 Z M30,40 L70,40 M30,50 L70,50 M30,60 L70,60'
            },
            
            // Menú festivo
            { 
                id: 10,
                name: 'Menú Fin de Semana',
                description: 'Selección especial de platos para el fin de semana',
                price: 45.00,
                categoryId: 203,
                color: '#cc6633',
                svgPath: 'M30,30 L70,30 L70,70 L30,70 Z M30,40 L70,40 M40,50 L60,50 M40,60 L60,60'
            },
            
            // Bebidas sin alcohol
            { 
                id: 11,
                name: 'Agua Premium',
                description: 'Agua mineral de manantial',
                price: 4.50,
                categoryId: 301,
                color: '#88ccdd',
                svgPath: 'M40,30 L60,30 L55,70 L45,70 Z'
            },
            { 
                id: 12,
                name: 'Limonada Casera',
                description: 'Limón, azúcar, menta y agua con gas',
                price: 5.50,
                categoryId: 301,
                color: '#dddd44',
                svgPath: 'M40,30 L60,30 L55,70 L45,70 Z M38,30 L62,30 L62,35 L38,35 Z'
            },
            
            // Bebidas con alcohol
            { 
                id: 13,
                name: 'Gin Tonic Premium',
                description: 'Ginebra premium, tónica artesanal y botánicos',
                price: 12.50,
                categoryId: 302,
                color: '#66aacc',
                svgPath: 'M35,30 L65,30 L60,70 L40,70 Z M35,35 L65,35'
            },
            
            // Vinos
            { 
                id: 14,
                name: 'Ribera del Duero',
                description: 'Vino tinto crianza D.O. Ribera del Duero',
                price: 24.00,
                categoryId: 303,
                color: '#882222',
                svgPath: 'M40,25 L60,25 L60,35 L55,40 L55,65 L45,65 L45,40 L40,35 Z'
            },
            { 
                id: 15,
                name: 'Albariño',
                description: 'Vino blanco D.O. Rías Baixas',
                price: 22.00,
                categoryId: 303,
                color: '#ddcc66',
                svgPath: 'M40,25 L60,25 L60,35 L55,40 L55,65 L45,65 L45,40 L40,35 Z'
            },
            
            // Postres - Tartas
            { 
                id: 16,
                name: 'Tarta de Chocolate',
                description: 'Chocolate belga 70% con base de galleta y frambuesas',
                price: 8.50,
                categoryId: 401,
                color: '#553322',
                svgPath: 'M30,50 L40,35 L60,35 L70,50 L70,70 L30,70 Z M35,50 L65,50'
            },
            
            // Postres - Helados
            { 
                id: 17,
                name: 'Sorbete de Limón',
                description: 'Refrescante sorbete de limón con cava',
                price: 7.50,
                categoryId: 402,
                color: '#eeee88',
                svgPath: 'M35,35 L65,35 L55,55 a10,10 0 1,1 -10,0 Z'
            },
            
            // Postres - Frutas
            { 
                id: 18,
                name: 'Fruta de Temporada',
                description: 'Selección de frutas frescas de temporada',
                price: 6.95,
                categoryId: 403,
                color: '#99cc66',
                svgPath: 'M50,30 a20,20 0 1,0 0,40 a20,20 0 1,0 0,-40 Z M50,30 L50,20 L55,15'
            }
        ]);

        const selectedMenuCategory = ref(menuCategories.value[0]);
        const selectedSubCategory = ref(subCategories.value[1][0]);
        const selectedProduct = ref(null);
        const quantity = ref(1);
        const cartItems = ref([]);
        const isCartOpen = ref(false);
        const showOrderConfirmation = ref(false);
        const orderNumber = ref('');

        const availableSubCategories = computed(() => {
            return subCategories.value[selectedMenuCategory.value.id] || [];
        });

        const filteredProducts = computed(() => {
            return products.value.filter(product => product.categoryId === selectedSubCategory.value.id);
        });

        const cartSubtotal = computed(() => {
            return cartItems.value.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);
        });

        const cartTax = computed(() => {
            return cartSubtotal.value * 0.1;
        });

        const cartTotal = computed(() => {
            return cartSubtotal.value + cartTax.value;
        });

        function selectMenuCategory(category) {
            selectedMenuCategory.value = category;
            selectedSubCategory.value = subCategories.value[category.id][0];
        }

        function selectSubCategory(category) {
            selectedSubCategory.value = category;
        }

        function showProductDetails(product) {
            selectedProduct.value = product;
            quantity.value = 1;
        }

        function closeModal() {
            selectedProduct.value = null;
        }

        function increaseQuantity() {
            quantity.value++;
        }

        function decreaseQuantity() {
            if (quantity.value > 1) {
                quantity.value--;
            }
        }

        function addToCart() {
            const existingItem = cartItems.value.find(
                item => item.product.id === selectedProduct.value.id
            );

            if (existingItem) {
                existingItem.quantity += quantity.value;
            } else {
                cartItems.value.push({
                    product: selectedProduct.value,
                    quantity: quantity.value
                });
            }

            closeModal();
            isCartOpen.value = true;
        }

        function removeFromCart(index) {
            cartItems.value.splice(index, 1);
        }

        function toggleCart() {
            isCartOpen.value = !isCartOpen.value;
        }

        function checkout() {
            orderNumber.value = Math.floor(Math.random() * 1000) + 1000;
            showOrderConfirmation.value = true;
            isCartOpen.value = false;
        }

        function startNewOrder() {
            cartItems.value = [];
            showOrderConfirmation.value = false;
        }

        function formatPrice(price) {
            return price.toFixed(2) + ' €';
        }

        watch(cartItems, (newValue) => {
            localStorage.setItem('cartItems', JSON.stringify(newValue));
        }, { deep: true });

        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            cartItems.value = JSON.parse(savedCart);
        }

        return {
            menuCategories,
            subCategories,
            products,
            selectedMenuCategory,
            selectedSubCategory,
            availableSubCategories,
            selectedProduct,
            filteredProducts,
            quantity,
            cartItems,
            isCartOpen,
            showOrderConfirmation,
            orderNumber,
            cartSubtotal,
            cartTax,
            cartTotal,
            selectMenuCategory,
            selectSubCategory,
            showProductDetails,
            closeModal,
            increaseQuantity,
            decreaseQuantity,
            addToCart,
            removeFromCart,
            toggleCart,
            checkout,
            startNewOrder,
            formatPrice
        };
    }
}).mount('#app');