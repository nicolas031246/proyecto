/* ==========================================================================
   Catálogo de Productos
   ========================================================================== */
   const products = [
    {
        id: 1,
        title: "Aceite de Oliva Virgen Extra",
        category: "Uso Culinario",
        price: 22.50,
        description: "Aceite 100% puro prensado en frío. Ideal para ensaladas, cocina y nutrición.",
        image: "img/culinary_oil.png"
    },
    {
        id: 2,
        title: "Jabón Artesanal de Avena",
        category: "Cuidado Personal",
        price: 8.00,
        description: "Exfoliación suave para calmar pieles y mantener un buen balance en el rostro.",
        image: "img/soap.png"
    },
    {
        id: 3,
        title: "Crema Especial de Karité",
        category: "Cuidado Personal",
        price: 24.00,
        description: "Regeneración cutánea profunda y suave con aroma e ingredientes naturales.",
        image: "img/cream.png"
    },
    {
        id: 4,
        title: "Sérum Capilar de Argán",
        category: "Cuidado del Cabello",
        price: 32.00,
        description: "Gotas nutritivas de oro líquido para puntas secas y revitalización del cabello.",
        image: "img/oil.png"
    },
    {
        id: 5,
        title: "Vela Ecológica de Cera",
        category: "Hogar y Ambiente",
        price: 18.00,
        description: "Vela hecha de aceites vegetales puros. Sin toxinas, aroma orgánico.",
        image: "img/candle.png"
    },
    {
        id: 6,
        title: "Aceite de Almendras",
        category: "Masajes y Spa",
        price: 19.50,
        description: "Alivia el estrés con este aceite enriquecido para masoterapia y relajación.",
        image: "img/oil.png"
    }
];

// Estado global de la aplicación
let cart = [];

/* ==========================================================================
   Elementos del DOM
   ========================================================================== */
const productsGrid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const emptyCartMsg = document.getElementById('empty-cart-message');
const checkoutBtn = document.getElementById('checkout-btn');
const toast = document.getElementById('toast');

/* ==========================================================================
   Funciones Principales
   ========================================================================== */

// 1. Renderizar los Productos en el HTML
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        // Crear elemento de tarjeta
        const card = document.createElement('article');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-img-wrapper">
                <span class="product-badge">Top Ventas</span>
                <img src="${product.image}" alt="${product.title}" class="product-img">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})" aria-label="Agregar al carrito">
                        <i class="ph ph-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// 2. Agregar Producto al Carrito
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`¡${product.title} agregado!`);
}

// 3. Eliminar o Reducir Unidad del Carrito
function changeQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1); // Remover si llega a 0
        }
        updateCartUI();
    }
}

// 4. Actualizar la Interfaz del Carrito
function updateCartUI() {
    // Calcular totales
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Actualizar badge en header
    cartCount.innerText = totalItems;
    
    // Actualizar contenedor
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.appendChild(emptyCartMsg);
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = ''; // Limpiar
        
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                        <i class="ph ph-trash remove-item" style="cursor:pointer;" onclick="changeQuantity(${item.id}, -${item.quantity})"></i>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(row);
        });
        
        checkoutBtn.disabled = false;
    }
    
    cartTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
}

// 5. Simular Compra
function simulateCheckout() {
    if(cart.length === 0) return;
    
    alert("¡Simulación de compra exitosa!\nGracias por elegir productos naturales ÓleoNatura.");
    cart = [];
    updateCartUI();
    document.getElementById('cart-overlay').classList.remove('active');
}

// 6. Mostrar Notificación Toast
function showToast(message) {
    document.getElementById('toast-message').innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ==========================================================================
   Event Listeners & Inicialización
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Grid
    renderProducts();

    // 2. Controladores del Carrito (Modal/Drawer)
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    
    openCartBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
    
    // Cerrar si se da click al fondo borroso
    cartOverlay.addEventListener('click', (e) => {
        if(e.target === cartOverlay) cartOverlay.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', simulateCheckout);

    // 3. Controladores del Menú Móvil
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileBtn = document.getElementById('close-mobile');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    mobileToggle.addEventListener('click', () => mobileMenu.classList.add('active'));
    closeMobileBtn.addEventListener('click', () => mobileMenu.classList.remove('active'));
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

    // 4. Formulario de Contacto (Conexión al Backend)
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener la información del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Botón en modo "Cargando..."
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Enviando... <i class="ph ph-spinner"></i>';
        submitBtn.disabled = true;

        try {
            // Enviar la petición POST al backend local
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Mostrar éxito visual
                formMessage.innerText = '¡Mensaje emitido con éxito hacia tu correo!';
                formMessage.style.color = '#2E7D32';
                formMessage.style.backgroundColor = '#E8F5E9';
                formMessage.classList.remove('hidden');
                contactForm.reset();
            } else {
                throw new Error(data.error || 'Fallo desconocido en el servidor');
            }
        } catch (error) {
            console.error('Error enviando el correo desde el front:', error);
            // Mostrar error visual
            formMessage.innerText = 'Error al enviar: Revise el servidor ' + error.message;
            formMessage.style.color = '#C62828';
            formMessage.style.backgroundColor = '#FFEBEE';
            formMessage.classList.remove('hidden');
        } finally {
            // Restaurar botón y ocultar el mensaje a los 6 segundos
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 6000);
        }
    });

    // 5. Encabezado dinámico al hacer scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "var(--shadow-md)";
            header.style.padding = "0.2rem 0";
        } else {
            header.style.boxShadow = "var(--shadow-sm)";
            header.style.padding = "0";
        }
    });

    // 6. Lógica del Chatbot de IA
    const chatFab = document.getElementById('chat-fab');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('pregunta');
    const chatBody = document.getElementById('chat');

    // Abrir/Cerrar Chat
    chatFab.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden-chat');
        if (!chatWindow.classList.contains('hidden-chat')) {
            chatInput.focus();
        }
    });

    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden-chat');
    });

    // Función para enviar mensaje
    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Mostrar mensaje del usuario
        chatInput.value = '';
        addMessageToUI(text, 'user-msg');

        // 2. Mostrar indicador de "Escribiendo..."
        const typingId = 'typing-' + Date.now();
        chatBody.innerHTML += `<div id="${typingId}" class="typing-indicator"><i class="ph ph-spinner ph-spin"></i> ÓleoBot está escribiendo...</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // 3. Enviar al backend
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Remover indicador
            document.getElementById(typingId)?.remove();

            if (response.ok && data.reply) {
                // 4. Mostrar respuesta de la IA
                addMessageToUI(data.reply, 'bot-msg');
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error en el chat:', error);
            document.getElementById(typingId)?.remove();
            addMessageToUI('Lo siento, tuve un problema al procesar tu solicitud. Asegúrate de que mi servidor esté encendido.', 'bot-msg');
        }
    };

    // Función auxiliar para agregar burbujas al chat
    function addMessageToUI(text, className) {
        // En un entorno real se usaría textContent u otras formas seguras contra XSS
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${className}`;
        msgDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Eventos de teclado y click
    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
