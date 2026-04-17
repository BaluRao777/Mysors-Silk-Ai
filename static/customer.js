/* =========================================
   CUSTOMER SHOP FLOW (CLEAN VERSION)
========================================= */
let customerChatArea;
let customerAddMessage;

let cart = [];
let checkoutData = {};
let checkoutStep = null;

/* =========================================
   PRODUCT DATABASE (12 PRODUCTS)
========================================= */

const allProducts = [
    {id:1,name:"Royal Red Bridal",price:8500,color:"red",weight:650,occasion:"wedding",image:"/static/images/saree1.jpg",desc:"Premium bridal red silk saree."},
    {id:2,name:"Emerald Green Festive",price:7200,color:"green",weight:600,occasion:"festive",image:"/static/images/saree2.jpg",desc:"Festive green silk saree."},
    {id:3,name:"Classic Blue Casual",price:6500,color:"blue",weight:550,occasion:"casual",image:"/static/images/saree3.jpg",desc:"Elegant daily wear silk."},
    {id:4,name:"Golden Zari Grand",price:12000,color:"gold",weight:720,occasion:"wedding",image:"/static/images/saree4.jpg",desc:"Heavy gold zari bridal saree."},
    {id:5,name:"Pink Temple Border",price:7800,color:"pink",weight:620,occasion:"festive",image:"/static/images/saree5.jpg",desc:"Temple border silk saree."},
    {id:6,name:"Royal Black Heritage",price:9500,color:"black",weight:700,occasion:"wedding",image:"/static/images/saree6.jpg",desc:"Premium wedding black silk."},
    {id:7,name:"Peacock Blue Premium",price:8900,color:"blue",weight:670,occasion:"festive",image:"/static/images/saree7.jpg",desc:"Rich peacock silk."},
    {id:8,name:"Deep Maroon Bridal",price:10500,color:"red",weight:730,occasion:"wedding",image:"/static/images/saree8.jpg",desc:"Heavy maroon bridal saree."},
    {id:9,name:"Soft Green Casual",price:6400,color:"green",weight:520,occasion:"casual",image:"/static/images/saree9.jpg",desc:"Lightweight casual silk."},
    {id:10,name:"Ivory Gold Festive",price:9200,color:"gold",weight:680,occasion:"festive",image:"/static/images/saree10.jpg",desc:"Elegant ivory festive silk."},
    {id:11,name:"Royal Pink Wedding",price:9800,color:"pink",weight:690,occasion:"wedding",image:"/static/images/saree11.jpg",desc:"Wedding pink silk collection."},
    {id:12,name:"Midnight Blue Grand",price:11000,color:"blue",weight:750,occasion:"wedding",image:"/static/images/saree12.jpg",desc:"Grand midnight blue silk."}
];


/* =========================================
   START CUSTOMER FLOW
========================================= */

function startCustomerFlow(chatArea, addMessage) {
    customerChatArea = chatArea;
    customerAddMessage = addMessage;
    cart = [];
    showProducts();
}

/* =========================================
   SHOW PRODUCTS (6 SHUFFLED)
========================================= */

function showProducts() {

    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    const products = shuffled.slice(0, 6);

    products.forEach(product => renderProduct(product));

    showShopButtons();
}

function renderProduct(product) {

    const card = document.createElement("div");
    card.classList.add("message", "bot");

    card.innerHTML = `
        <div style="background:white;border-radius:15px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
            <img src="${product.image}" style="width:100%;height:220px;object-fit:cover;">
            <div style="padding:12px">
                <h3>${product.name}</h3>
                <p>Elegant pure silk saree with intricate zari work.</p>
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <h2 style="color:#075E54">₹${product.price}</h2>
                    <button onclick="addToCart(${product.id})"
                        style="background:#25D366;color:white;border:none;padding:8px 14px;border-radius:8px">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    customerChatArea.appendChild(card);
}

/* =========================================
   SHOP BUTTONS
========================================= */

function showShopButtons() {

    // Remove old buttons first
    const oldButtons = document.querySelectorAll(".shop-buttons");
    oldButtons.forEach(btn => btn.remove());

    const container = document.createElement("div");
    container.classList.add("button-group", "shop-buttons");

    container.innerHTML = `
    <button onclick="viewMore()">View More</button>
    <button onclick="viewCart()">View Cart 🛒 (${cart.length})</button>
    <button onclick="showProducts()">Continue Shopping</button>
    <button onclick="startCustomisation()">Customisation Saree ✨</button>
    <button onclick="startFilter()">Customisation Filter 🔍</button>
`;

    customerChatArea.appendChild(container);
}

/* =========================================
   VIEW MORE
========================================= */

window.viewMore = function() {
    showProducts();
};

/* =========================================
   ADD TO CART (NO POPUP CARD)
========================================= */

window.addToCart = function(id) {

    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    cart.push(product);

    customerAddMessage(product.name + " added to cart 🛒", "bot");

    showShopButtons();   // 🔥 refresh button count
};

/* =========================================
   VIEW CART
========================================= */

window.viewCart = function() {

    if (cart.length === 0) {
        customerAddMessage("Your cart is empty.", "bot");
        return;
    }

    let total = 0;
    let itemsHTML = "";

    cart.forEach(item => {
        total += item.price;
        itemsHTML += `<p>${item.name} × 1 &nbsp;&nbsp; ₹${item.price}</p>`;
    });

    const card = document.createElement("div");
    card.classList.add("message", "bot");

    card.innerHTML = `
        <div style="background:white;border-radius:15px;padding:15px">
            <h3>🛒 Your Cart</h3>
            <hr>
            ${itemsHTML}
            <hr>
            <h2>Total ₹${total}</h2>
            <button onclick="startCheckout()"
                style="background:#25D366;color:white;border:none;padding:10px 20px;border-radius:8px;margin-top:10px">
                Proceed to Checkout
            </button>
        </div>
    `;

    customerChatArea.appendChild(card);
};

/* =========================================
   CHECKOUT FLOW
========================================= */

window.startCheckout = function() {

    checkoutData = {};
    checkoutStep = "name";

    customerAddMessage("Enter Your Name:", "bot");
};

window.handleCustomerInput = function(text) {

    if (!checkoutStep) return;

    if (checkoutStep === "name") {
        checkoutData.name = text;
        checkoutStep = "phone";
        customerAddMessage("Enter Phone Number:", "bot");
        return;
    }

    if (checkoutStep === "phone") {
        checkoutData.phone = text;
        checkoutStep = "address";
        customerAddMessage("Enter Address:", "bot");
        return;
    }

    if (checkoutStep === "address") {
        checkoutData.address = text;
        checkoutStep = "city";
        customerAddMessage("Enter City:", "bot");
        return;
    }

    if (checkoutStep === "city") {
        checkoutData.city = text;
        checkoutStep = "pincode";
        customerAddMessage("Enter Pincode:", "bot");
        return;
    }

    if (checkoutStep === "pincode") {
        checkoutData.pincode = text;
        checkoutStep = "payment";
        askPayment();
        return;
    }
};

/* =========================================
   PAYMENT OPTIONS
========================================= */

function askPayment() {

    customerAddMessage("Select Payment Method:", "bot");

    const buttons = document.createElement("div");
    buttons.classList.add("button-group");

    const upiBtn = document.createElement("button");
    upiBtn.innerText = "UPI (Scan QR)";

    const codBtn = document.createElement("button");
    codBtn.innerText = "Cash on Delivery";

    buttons.appendChild(upiBtn);
    buttons.appendChild(codBtn);

    customerChatArea.appendChild(buttons);
    customerChatArea.scrollTop = customerChatArea.scrollHeight;

    // 🔥 Proper Event Listeners
    upiBtn.addEventListener("click", function () {
        handlePayment("upi");
    });

    codBtn.addEventListener("click", function () {
        handlePayment("cod");
    });
}

/* =========================================
   HANDLE PAYMENT (NO INLINE CLICK)
========================================= */

function handlePayment(method) {

    const orderId = "ORD" + Math.floor(Math.random() * 100000);

    let total = 0;
    cart.forEach(item => total += item.price);

    if (method === "upi") {

        customerAddMessage("Please scan the QR to complete payment:", "bot");

        const qrCard = document.createElement("div");
        qrCard.classList.add("message", "bot");

        qrCard.innerHTML = `
            <div style="background:white;padding:15px;border-radius:12px;text-align:center">
                <img src="/static/images/upi_qr.png" style="width:200px;">
                <p>Waiting for payment...</p>
            </div>
        `;

        customerChatArea.appendChild(qrCard);

        setTimeout(() => {
            completeOrder(orderId, total, "UPI");
        }, 3000);

    } else {

        completeOrder(orderId, total, "Cash on Delivery");
    }
}

/* =========================================
   COMPLETE ORDER
========================================= */

function completeOrder(orderId, total, paymentMode) {

    customerAddMessage(
        "🎉 Order Confirmed!\n\n" +
        "Order ID: " + orderId + "\n" +
        "Name: " + checkoutData.name + "\n" +
        "Phone: " + checkoutData.phone + "\n" +
        "City: " + checkoutData.city + "\n" +
        "Payment: " + paymentMode + "\n" +
        "Total: ₹" + total + "\n\n" +
        "Your saree will be delivered soon 💖",
        "bot"
    );

    checkoutStep = null;
    checkoutData = {};
    cart = [];

    showShopButtons();
}


/* =========================================
   CUSTOMISATION SAREE FLOW (PREMIUM)
========================================= */

let customOrderData = {};
let customStep = null;

/* START CUSTOM FLOW */
window.startCustomisation = function() {

    customStep = "description";

    customerAddMessage(
        "✨ Please describe your dream saree requirements.",
        "bot"
    );
};

/* HANDLE CUSTOMER INPUT FOR CUSTOM FLOW */
window.handleCustomerInput = function(text) {

    /* CUSTOM FLOW PRIORITY */
    if (customStep === "description") {

        customOrderData.description = text;

        const customId = "CUST" + Math.floor(Math.random() * 100000);

        customOrderData.orderId = customId;

        customerAddMessage(
            "🎨 Custom Design Request Received!\n\n" +
            "Estimated Price Range: ₹10,000 - ₹18,000\n" +
            "Weaver Assigned: Lakshmi Handlooms\n" +
            "Location: Mysuru, Karnataka\n" +
            "Estimated Delivery: 10 - 15 Days\n" +
            "Custom Order ID: " + customId,
            "bot"
        );

        showCustomOptions();

        customStep = null;
        return;
    }

    /* NORMAL CHECKOUT FLOW BELOW */

    if (!checkoutStep) return;

    if (checkoutStep === "name") {
        checkoutData.name = text;
        checkoutStep = "phone";
        customerAddMessage("Enter Phone Number:", "bot");
        return;
    }

    if (checkoutStep === "phone") {
        checkoutData.phone = text;
        checkoutStep = "address";
        customerAddMessage("Enter Address:", "bot");
        return;
    }

    if (checkoutStep === "address") {
        checkoutData.address = text;
        checkoutStep = "city";
        customerAddMessage("Enter City:", "bot");
        return;
    }

    if (checkoutStep === "city") {
        checkoutData.city = text;
        checkoutStep = "pincode";
        customerAddMessage("Enter Pincode:", "bot");
        return;
    }

    if (checkoutStep === "pincode") {
        checkoutData.pincode = text;
        checkoutStep = "payment";
        askPayment();
        return;
    }
};

/* =========================================
   CUSTOM OPTIONS BUTTONS
========================================= */

function showCustomOptions() {

    const container = document.createElement("div");
    container.classList.add("button-group");

    const confirmBtn = document.createElement("button");
    confirmBtn.innerText = "Confirm Custom Order";

    const contactBtn = document.createElement("button");
    contactBtn.innerText = "Contact Weaver";

    const backBtn = document.createElement("button");
    backBtn.innerText = "Back to Main Menu";

    container.appendChild(confirmBtn);
    container.appendChild(contactBtn);
    container.appendChild(backBtn);

    customerChatArea.appendChild(container);

    confirmBtn.addEventListener("click", function() {
        finalizeCustomOrder();
    });

    contactBtn.addEventListener("click", function() {
        customerAddMessage(
            "📞 Weaver Contact Details:\n" +
            "Lakshmi Handlooms\n" +
            "Phone: +91 98765 43210\n" +
            "Location: Mysuru, Karnataka",
            "bot"
        );
    });

    backBtn.addEventListener("click", function() {
        showProducts();
    });
}

/* =========================================
   FINAL CUSTOM ORDER CONFIRMATION
========================================= */

function finalizeCustomOrder() {

    const dispatchDate = new Date();
    dispatchDate.setDate(dispatchDate.getDate() + 7);

    customerAddMessage(
        "🎉 Custom Order Confirmed!\n\n" +
        "Order ID: " + customOrderData.orderId + "\n" +
        "Weaver: Lakshmi Handlooms\n" +
        "Contact: +91 98765 43210\n" +
        "Location: Mysuru\n" +
        "Estimated Dispatch Date: " +
        dispatchDate.toDateString(),
        "bot"
    );
}


/* ================= MODERN FILTER SYSTEM ================= */

window.startFilter = function() {
    document.getElementById("filterOverlay").classList.remove("hidden");
    document.getElementById("filterModal").classList.remove("hidden");
};

window.closeFilter = function() {
    document.getElementById("filterOverlay").classList.add("hidden");
    document.getElementById("filterModal").classList.add("hidden");
};

window.resetModernFilters = function() {
    document.querySelectorAll("#filterModal input").forEach(input => {
        input.checked = false;
    });
};

window.applyModernFilters = function() {

    const selectedColors = Array.from(
        document.querySelectorAll("#filterModal input[type=checkbox]:checked")
    ).map(i => i.value);

    const selectedOccasions = selectedColors.filter(val =>
        ["wedding","festive","casual"].includes(val)
    );

    const colors = selectedColors.filter(val =>
        ["red","green","blue","gold","pink","black"].includes(val)
    );

    const priceInput = document.querySelector("#filterModal input[name=price]:checked");
    const weightInput = document.querySelector("#filterModal input[name=weight]:checked");

    closeFilter();

    const filtered = allProducts.filter(product => {

        let match = true;

        if (colors.length > 0)
            match = match && colors.includes(product.color);

        if (selectedOccasions.length > 0)
            match = match && selectedOccasions.includes(product.occasion);

        if (priceInput) {
            if (priceInput.value === "under7000")
                match = match && product.price < 7000;
            if (priceInput.value === "7000to9000")
                match = match && product.price >= 7000 && product.price <= 9000;
            if (priceInput.value === "above9000")
                match = match && product.price > 9000;
        }

        if (weightInput)
            match = match && product.weight >= parseInt(weightInput.value);

        return match;
    });

    clearProductView();

    if (filtered.length === 0) {
        customerAddMessage("No products match selected filters.", "bot");
        showShopButtons();
        return;
    }

    filtered.forEach(product => renderProduct(product));
    showShopButtons();
};

function clearProductView() {
    const cards = document.querySelectorAll(".message.bot");
    cards.forEach(card => card.remove());
}