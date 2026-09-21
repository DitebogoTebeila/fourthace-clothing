
// ==============================
// FOURTHACE SHOPPING BAG
// ==============================

// Replace with your WhatsApp number.
// South African format: 27 followed by your number.
// Do not include +, spaces, or dashes.
const WHATSAPP_NUMBER = "27636309193";

// Product information
const products = [
    {
        id: 1,
        name: "KRYPTONITE GRAPHIC TEE",
        price: 400
    },
    {
        id: 2,
        name: "FOURTHACE LOGO TEE",
        price: 420
    },
    {
        id: 3,
        name: "VINTAGE ACE TEE",
        price: 550
    }
];

// Shopping bag data
let cart = [];

// HTML elements
const bagButton = document.getElementById("bagButton");
const closeCart = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

// Open shopping bag
function openCart() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
}

// Close shopping bag
function hideCart() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
}

bagButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);

// Add products to the bag
document.querySelectorAll(".add-button").forEach(button => {
    button.addEventListener("click", () => {
        const id = Number(button.dataset.id);

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: id,
                quantity: 1
            });
        }

        renderCart();
        openCart();
    });
});

// Change quantity or remove an item
function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    renderCart();
}

// Display shopping bag contents
function renderCart() {
    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = `R${totalPrice}`;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your bag is currently empty.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        return `
            <div class="cart-item">
                <div>
                    <h4>${product.name}</h4>
                    <p>R${product.price}</p>

                    <div class="quantity-controls">
                        <button
                            onclick="changeQuantity(${item.id}, -1)">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)">
                            +
                        </button>
                    </div>

                    <button
                        class="remove-button"
                        onclick="changeQuantity(${item.id}, -${item.quantity})">
                        REMOVE
                    </button>
                </div>

                <strong>R${product.price * item.quantity}</strong>
            </div>
        `;
    }).join("");
}

// Send order to WhatsApp
checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping bag is empty.");
        return;
    }

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        alert("Please add your WhatsApp number in script.js.");
        return;
    }

    let message = "Hi Fourthace! I would like to place an order:\n\n";

    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const subtotal = product.price * item.quantity;

        total += subtotal;

        message += `${product.name}\n`;
        message += `Quantity: ${item.quantity}\n`;
        message += `Subtotal: R${subtotal}\n\n`;
    });

    message += `Total: R${total}\n\n`;
    message += "Please confirm availability, sizes, and delivery.";

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
});

// Initial display
renderCart();