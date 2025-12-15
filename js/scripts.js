//Opens the About Us modal and if it's open, it keeps the focus in the modal(for accessibility)
function toggleAbout() {
    const modal = document.getElementById("about-overlay");
    modal.classList.toggle("show");
    if (modal.classList.contains("show")) {
        trapFocus("about-overlay");
        modal.querySelector("button")?.focus();
    }
}

//Closes the About Us modal
function closeAbout() {
    document.getElementById("about-overlay").classList.remove("show");
}

//Array that contains all the items in the shop, each item having and id, name, price and image
const items = [
    { id: 1, name: "Coloured pencils", price: 3, img: "img/colored pencils.jpg" },
    { id: 2, name: "Coloring Book", price: 4, img: "img/coloring book.jpg" },
    { id: 3, name: "Doll", price: 10, img: "img/doll.jpg" },
    { id: 4, name: "Car Toy", price: 12, img: "img/car toy.jpg" },
    { id: 5, name: "Puzzle", price: 10, img: "img/puzzle.jpg" },
    { id: 6, name: "Lego", price: 15, img: "img/lego.jpg" },
    { id: 7, name: "Kinetic Sand", price: 9, img: "img/kinetic sand.jpg" },
    { id: 8, name: "Bracelet Set", price: 10, img: "img/bracelet set.jpg" },
    { id: 9, name: "Doll House", price: 20, img: "img/doll house.jpg" },
    { id: 10, name: "Teddy Bear", price: 10, img: "img/teddy bear.jpg" },
    { id: 11, name: "Monopoly", price: 25, img: "img/monopoly.jpg" },
    { id: 12, name: "Toy Robot", price: 25, img: "img/toy robot.jpg" },
    { id: 13, name: "Football", price: 10, img: "img/football.jpg" },
    { id: 14, name: "Toy Train", price: 9, img: "img/toy train.jpg" },
    { id: 15, name: "Marbles", price: 2, img: "img/marbles.jpg" },
    { id: 16, name: "Play-Doh", price: 15, img: "img/playdoh.jpg" },
    { id: 17, name: "UNO Card Game", price: 9, img: "img/uno.jpg" },
    { id: 18, name: "Xylophone", price: 10, img: "img/xylophone.jpg" },
    { id: 19, name: "Kitchen Set", price: 18, img: "img/kitchen set.jpg" },
    { id: 20, name: "Basketball", price: 10, img: "img/basketball.jpg" },
];

//Function that loops through every item in the first array and displays it on the screen 
//once the page is loaded
window.onload = function () {
    const list = document.getElementById("item-list");
    let html = "";

    items.forEach(item => {
        html += `
            <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                <div class="item-card p-2 shadow-sm">
                    <img src="${item.img}" class="item-photo" alt="${item.name}">
                    <h6 class="mt-2">${item.name}</h6>
                    <p class="price">€${item.price}</p>
                    <button class="btn btn-success w-100"
                        onclick="addToCart(${item.id})"
                        aria-label="Add ${item.name} to cart">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
};

//Array that will store items added to the cart
let cart = [];

//Adds items to cart using their ID
function addToCart(id) {
    const item = items.find(i => i.id === id);
    cart.push(item);
    updateCartCount();
}

//Opens cart modal, groups same items together and calculates the end price for each type of item, based on 
//how many they are
function openCart() {
    const modal = document.getElementById("cart-overlay");
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";

    const grouped = {};
    cart.forEach(item => {
        if (!grouped[item.id]) grouped[item.id] = { ...item, qty: 1 };
        else grouped[item.id].qty++;
    });

    let total = 0;

    //generates html for each item in the cart: name, price, quantity, +/- buttons, subtotal and remove button
    Object.values(grouped).forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        cartList.innerHTML += `
            <li class="list-group-item">
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="flex-grow-1">
                        <strong>${item.name}</strong><br>
                        €${item.price} × ${item.qty}
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary"
                            onclick="decreaseQty(${item.id})"
                            aria-label="Decrease quantity of ${item.name}">−</button>

                        <span>${item.qty}</span>

                        <button class="btn btn-sm btn-outline-secondary"
                            onclick="increaseQty(${item.id})"
                            aria-label="Increase quantity of ${item.name}">+</button>

                        <button class="btn btn-sm btn-danger"
                            onclick="removeItemCompletely(${item.id})"
                            aria-label="Remove ${item.name} from cart">🗑</button>
                    </div>
                    <div class="ms-3">
                        <strong>€${subtotal.toFixed(2)}</strong>
                    </div>
                </div>
            </li>
        `;
    });

    document.getElementById("cart-total").innerText = total.toFixed(2);
    modal.classList.add("show");
    trapFocus("cart-overlay");
    modal.querySelector("button")?.focus();
}

//Finds item and adds it to the cart, to inscrease quantity
function increaseQty(id) {
    const item = items.find(i => i.id === id);
    cart.push(item);
    openCart();
    updateCartCount();
}

//Removes one instance of the item
function decreaseQty(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index !== -1) cart.splice(index, 1);
    openCart();
    updateCartCount();
}

//Removes the item completely from the cart or all items with that id
function removeItemCompletely(id) {
    cart = cart.filter(item => item.id !== id);
    openCart();
    updateCartCount();
}

//Shows how many items are in the cart, updates every time sth is added/removed
function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.length;
}

//Closes the cart modal
function closeCart() {
    document.getElementById("cart-overlay").classList.remove("show");
}

let currentStep = 1; //track the checkout steps

//Closes cart and opens the check-out step one
function goToCheckout() {
    closeCart();
    showCheckoutStep(1);
}

//Closes the checkout modal
function closeCheckout() {
    const modal = document.getElementById("checkout-overlay");
    modal.classList.remove("show");
}

//Shows the checkout steps one at a time
function showCheckoutStep(step) {
    currentStep = step;
    const modal = document.getElementById("checkout-overlay");
    modal.classList.add("show");

    document.querySelectorAll(".checkout-step").forEach((el, index) => {
        el.style.display = (index + 1 === step) ? "block" : "none";
    });

    if (step === 3) updateCheckoutTotal();
    trapFocus("checkout-overlay");
    modal.querySelector("input, button")?.focus();
}

//Checks the information introduced by the user and shows messages if invalid info is written or if 
//the information is missing
function validateInfoStep() {
    let valid = true;

    const name = document.getElementById("name").value.trim(); //value.trim() helps in validating the introduced info, especially by removing accidental whitespaces
    const surname = document.getElementById("surname").value.trim();
    const address = document.getElementById("address").value.trim();
    const zipcode = document.getElementById("zipcode").value.trim();
    const city = document.getElementById("city").value.trim();
    const country = document.getElementById("country").value.trim();

    ["name","surname","address","zipcode","city","country"].forEach(id => {
        document.getElementById("error-" + id).innerText = "";
    });

    if (!name) { document.getElementById("error-name").innerText = "Name is required"; valid = false; }
    if (!surname) { document.getElementById("error-surname").innerText = "Surname is required"; valid = false; }
    if (!address) { document.getElementById("error-address").innerText = "Address is required"; valid = false; }
    if (!zipcode || !/^\d{1,6}$/.test(zipcode)) { document.getElementById("error-zipcode").innerText = "Invalid ZIP code"; valid = false; }
    if (!city) { document.getElementById("error-city").innerText = "City is required"; valid = false; }
    if (!country) { document.getElementById("error-country").innerText = "Country is required"; valid = false; }

    return valid;
}

//Goes to checkout Step 2: Shipping, only when all the information was validated
function proceedToShipping() {
    if (validateInfoStep()) showCheckoutStep(2);
}

//Adds up all the prices for the items
function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

const DISCOUNT_RATE = 0.10; //discount constant of 10%

//Calculates final total, including the discount if total before is above 30€
function updateCheckoutTotal() {
    const delivery = Number(document.querySelector('input[name="delivery"]:checked').value);
    const subtotal = getCartSubtotal();
    const discount = subtotal > 30 ? subtotal * DISCOUNT_RATE : 0;
    const total = subtotal - discount + delivery;

    document.getElementById("checkout-subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("checkout-discount").innerText = discount.toFixed(2);
    document.getElementById("checkout-delivery").innerText = delivery.toFixed(2);
    document.getElementById("checkout-total").innerText = total.toFixed(2);
}

//Goes to the final step of the checkout process, but only after a delivery type was selected
function proceedToFinal() {
    const deliverySelected = document.querySelector('input[name="delivery"]:checked');
    if (!deliverySelected) { alert("Please select a shipping method."); return; }
    showCheckoutStep(3);
}

//Checks payment info: card number and cvv if complete the requirements, if nor an error message is shown
function validatePayment() {
    let valid = true;
    const card = document.getElementById("card").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    document.getElementById("error-card").innerText = "";
    document.getElementById("error-cvv").innerText = "";

    if (!/^\d{16}$/.test(card)) { document.getElementById("error-card").innerText = "Card number must be 16 digits"; valid = false; }
    if (!/^\d{3}$/.test(cvv)) { document.getElementById("error-cvv").innerText = "CVV must be 3 digits"; valid = false; }

    return valid;
}

//The last step, goes to the confirmation modal, only if the payment info was validated
function submitCheckout(event) {
    event.preventDefault();
    if (!validatePayment()) return;
    showConfirmation();
}

//Shows confirmation, were the list with all the items is included, their price, total price, shipping and discount
function showConfirmation() {
    const modal = document.getElementById("confirmation-overlay");
    closeCheckout();

    const delivery = Number(document.querySelector('input[name="delivery"]:checked').value);
    const subtotal = getCartSubtotal();
    const discount = subtotal > 30 ? subtotal * DISCOUNT_RATE : 0;
    const total = subtotal - discount + delivery;

    let html = "<ul class='list-group mb-3'>";
    const grouped = {};
    cart.forEach(item => {
        grouped[item.id] = grouped[item.id] ? { ...item, qty: grouped[item.id].qty + 1 } : { ...item, qty: 1 };
    });

    Object.values(grouped).forEach(item => {
        html += `<li class="list-group-item d-flex justify-content-between">
            ${item.name} × ${item.qty}
            <strong>€${(item.price * item.qty).toFixed(2)}</strong>
        </li>`;
    });
    html += `</ul>
        <p>Subtotal: €${subtotal.toFixed(2)}</p>
        <p>Discount: −€${discount.toFixed(2)}</p>
        <p>Delivery: €${delivery.toFixed(2)}</p>
        <h4>Total: €${total.toFixed(2)}</h4>`;

    document.getElementById("confirmation-details").innerHTML = html;
    modal.classList.add("show");
    trapFocus("confirmation-overlay");
    modal.querySelector("button")?.focus();

    cart = [];
    updateCartCount();
}

//Closes the confirmation pop up
function closeConfirmation() {
    document.getElementById("confirmation-overlay").classList.remove("show");
}

//Goes back to the cart
function cancelCheckout() {
    closeCheckout();
    openCart();
}

//Keeps focus in the pop up opened/ on the page, used for accesibility
function trapFocus(modalId) {
    const modal = document.getElementById(modalId);
    const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    modal.addEventListener("keydown", function(e) {
        //focus moves to the next button, text space etc, when tab key is pressed
        if (e.key === "Tab") {
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
        //closes the pop up/modal opened when esc key is pressed
        if (e.key === "Escape") {
            modal.classList.remove("show");
        }
    });
}