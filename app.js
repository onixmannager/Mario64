import { createApp, ref, computed, watch } from 'vue';

createApp({
    setup() {
        const categories = ref([
            { id: 1, name: 'Hamburguesas', icon: 'fas fa-hamburger' },
            { id: 2, name: 'Pizzas', icon: 'fas fa-pizza-slice' },
            { id: 3, name: 'Ensaladas', icon: 'fas fa-leaf' },
            { id: 4, name: 'Bebidas', icon: 'fas fa-glass-cheers' },
            { id: 5, name: 'Postres', icon: 'fas fa-ice-cream' }
        ]);

        const products = ref([
            { 
                id: 1,
                name: 'Hamburguesa Clásica',
                description: 'Carne de res, queso cheddar, lechuga, tomate y mayonesa',
                price: 8.50,
                categoryId: 1,
                color: '#e67e22',
                svgPath: 'M30,35 C30,30 35,25 50,25 C65,25 70,30 70,35 L65,70 L35,70 Z M45,45 L55,45 M45,55 L55,55'
            },
            { 
                id: 2,
                name: 'Hamburguesa BBQ',
                description: 'Carne de res, bacon, cebolla crujiente, queso y salsa BBQ',
                price: 9.95,
                categoryId: 1,
                color: '#d35400',
                svgPath: 'M30,35 C30,30 35,25 50,25 C65,25 70,30 70,35 L65,70 L35,70 Z M40,45 L60,45 M40,55 L60,55'
            },
            { 
                id: 3,
                name: 'Pizza Margarita',
                description: 'Tomate, mozzarella y albahaca fresca',
                price: 12.50,
                categoryId: 2,
                color: '#c0392b',
                svgPath: 'M25,50 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0 Z M35,50 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0 Z M40,40 L45,45 M60,40 L55,45 M50,60 L50,65'
            },
            { 
                id: 4,
                name: 'Ensalada César',
                description: 'Lechuga romana, pollo, crutons, parmesano y salsa césar',
                price: 7.50,
                categoryId: 3,
                color: '#27ae60',
                svgPath: 'M30,70 C30,30 50,30 50,40 C50,30 70,30 70,70 Z M40,50 L60,50 M40,60 L60,60'
            },
            { 
                id: 5,
                name: 'Refresco Cola',
                description: 'Refresco de cola 330ml',
                price: 2.50,
                categoryId: 4,
                color: '#34495e',
                svgPath: 'M40,30 L60,30 L55,70 L45,70 Z M38,30 L62,30 L62,35 L38,35 Z'
            },
            { 
                id: 6,
                name: 'Tarta de Chocolate',
                description: 'Tarta casera de chocolate con nueces',
                price: 5.95,
                categoryId: 5,
                color: '#8e44ad',
                svgPath: 'M30,50 L40,35 L60,35 L70,50 L70,70 L30,70 Z M35,50 L65,50'
            },
            { 
                id: 7,
                name: 'Hamburguesa Vegana',
                description: 'Hamburguesa de garbanzos con aguacate y vegetales',
                price: 8.95,
                categoryId: 1,
                color: '#16a085',
                svgPath: 'M30,35 C30,30 35,25 50,25 C65,25 70,30 70,35 L65,70 L35,70 Z M40,45 L60,45 M45,55 L55,55'
            },
            { 
                id: 8,
                name: 'Pizza Pepperoni',
                description: 'Tomate, mozzarella y pepperoni',
                price: 13.50,
                categoryId: 2,
                color: '#c0392b',
                svgPath: 'M25,50 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0 Z M40,40 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 Z M55,45 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 Z M45,55 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 Z'
            }
        ]);

        const selectedCategory = ref(categories.value[0]);
        const selectedProduct = ref(null);
        const quantity = ref(1);
        const cartItems = ref([]);
        const isCartOpen = ref(false);
        const showOrderConfirmation = ref(false);
        const orderNumber = ref('');

        const filteredProducts = computed(() => {
            return products.value.filter(product => product.categoryId === selectedCategory.value.id);
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

        function selectCategory(category) {
            selectedCategory.value = category;
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
            // Generar número de orden aleatorio (en un sistema real, esto vendría del backend)
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

        // Guardar carrito en localStorage
        watch(cartItems, (newValue) => {
            localStorage.setItem('cartItems', JSON.stringify(newValue));
        }, { deep: true });

        // Cargar carrito desde localStorage al iniciar
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            cartItems.value = JSON.parse(savedCart);
        }

        return {
            categories,
            products,
            selectedCategory,
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
            selectCategory,
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

