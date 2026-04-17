let sellerAddMessage;
let sellerChatArea;

let sellerData = {};
let productData = {};
let inventory = [];
let totalOrders = 0;

/* ===============================
   START SELLER FLOW
================================ */
function startSellerFlow(chatArea, addMessage) {
    sellerAddMessage = addMessage;
    sellerChatArea = chatArea;

    sellerAddMessage("Seller Login 🧵", "bot");
    sellerAddMessage("Enter Username:", "bot");
    sellerData.step = "username";
}

/* ===============================
   HANDLE SELLER LOGIN
================================ */
window.handleSellerInput = function(text) {

    if (!sellerData.step) return;

    if (sellerData.step === "username") {
        sellerData.username = text;
        sellerData.step = "password";
        sellerAddMessage("Enter Password:", "bot");
        return;
    }

    if (sellerData.step === "password") {
        sellerData.password = text;
        validateSellerLogin();
        return;
    }
};

function validateSellerLogin() {

    if (
        sellerData.username === "admin" &&
        sellerData.password === "1234"
    ) {
        sellerAddMessage("Login Successful ✅", "bot");
        sellerData = {};
        showSellerDashboard();
    } else {
        sellerAddMessage("Invalid Credentials ❌", "bot");
        sellerAddMessage("Try Again. Enter Username:", "bot");
        sellerData.step = "username";
    }
}

/* ===============================
   DASHBOARD
================================ */
function showSellerDashboard() {

    sellerAddMessage("Seller Dashboard", "bot");

    const container = document.createElement("div");
    container.classList.add("button-group");

    container.innerHTML = `
        <button onclick="addProduct()">Add Product</button>
        <button onclick="viewInventory()">View Inventory</button>
        <button onclick="viewAnalytics()">View Sales Analytics</button>
    `;

    sellerChatArea.appendChild(container);
    sellerChatArea.scrollTop = sellerChatArea.scrollHeight;
}

/* ===============================
   ADD PRODUCT
================================ */
window.addProduct = function() {

    productData = {};

    sellerAddMessage("📸 Great! Let's add a new product.", "bot");
    sellerAddMessage("Upload saree photo below:", "bot");

    const upload = document.createElement("div");
    upload.classList.add("message", "bot");

    upload.innerHTML = `
        <div style="
            border:2px dashed #25D366;
            padding:15px;
            border-radius:12px;
            text-align:center;
            cursor:pointer;">
            📎 Tap to upload photo
            <input type="file" accept="image/*" style="display:none">
        </div>
    `;

    sellerChatArea.appendChild(upload);
    sellerChatArea.scrollTop = sellerChatArea.scrollHeight;

    const fileInput = upload.querySelector("input");
    const box = upload.querySelector("div");

    box.onclick = () => fileInput.click();

    fileInput.onchange = function() {

        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {

            productData.image = e.target.result;

            const preview = document.createElement("div");
            preview.classList.add("message", "bot");
            preview.innerHTML = `
                <img src="${e.target.result}" 
                     style="width:100%;border-radius:10px;">
            `;
            sellerChatArea.appendChild(preview);

            productData.step = "silk";
            sellerAddMessage("Enter Silk Content (grams):", "bot");
        };

        reader.readAsDataURL(file);
    };
};

/* ===============================
   HANDLE PRODUCT INPUT
================================ */
window.handleAddProduct = function(text) {

    if (!productData.step) return;

    if (productData.step === "silk") {
        productData.silk = text;
        productData.step = "grade";
        sellerAddMessage("Enter KSI Grade:", "bot");
        return;
    }

    if (productData.step === "grade") {
        productData.grade = text;
        productData.step = "length";
        sellerAddMessage("Enter Length (meters):", "bot");
        return;
    }

    if (productData.step === "length") {
        productData.length = text;
        generateAI();
        return;
    }

    if (productData.step === "custom") {
        productData.finalPrice = text;
        saveProduct();
        return;
    }
};

/* ===============================
   AI PRICE
================================ */
function generateAI() {

    const price =
        5000 +
        (parseInt(productData.silk) * 5) +
        (parseInt(productData.length) * 200);

    productData.aiPrice = price;

    sellerAddMessage("AI Predicted Price: ₹" + price, "bot");

    sellerAddMessage(
        "Premium Mysore Silk Saree with " +
        productData.silk +
        "g silk, Grade " +
        productData.grade +
        ", crafted with royal heritage finishing.",
        "bot"
    );

    const btn = document.createElement("div");
    btn.classList.add("button-group");

    btn.innerHTML = `
        <button onclick="acceptAI()">Accept AI Price</button>
        <button onclick="customPrice()">Enter Custom Price</button>
    `;

    sellerChatArea.appendChild(btn);
}

/* ===============================
   PRICE ACTIONS
================================ */
window.acceptAI = function() {
    productData.finalPrice = productData.aiPrice;
    saveProduct();
};

window.customPrice = function() {
    productData.step = "custom";
    sellerAddMessage("Enter Custom Price:", "bot");
};

/* ===============================
   SAVE PRODUCT
================================ */
function saveProduct() {

    inventory.push(productData);
    totalOrders += 1;

    sellerAddMessage("Product Added to Inventory ✅", "bot");

    const btn = document.createElement("div");
    btn.classList.add("button-group");

    btn.innerHTML = `
        <button onclick="addProduct()">Add Another Product</button>
        <button onclick="viewInventory()">View Inventory</button>
        <button onclick="viewAnalytics()">View Analytics</button>
        <button onclick="showSellerDashboard()">Back to Dashboard</button>
    `;

    sellerChatArea.appendChild(btn);

    productData = {};
}

/* ===============================
   INVENTORY
================================ */
window.viewInventory = function() {

    if (inventory.length === 0) {
        sellerAddMessage("Inventory Empty.", "bot");
        return;
    }

    sellerAddMessage("Your Inventory:", "bot");

    inventory.forEach(item => {

        const card = document.createElement("div");
        card.classList.add("message", "bot");

        card.innerHTML = `
            <img src="${item.image}" style="width:100%;border-radius:10px;">
            <p><b>Silk:</b> ${item.silk}g</p>
            <p><b>Grade:</b> ${item.grade}</p>
            <p><b>Length:</b> ${item.length}m</p>
            <p><b>Price:</b> ₹${item.finalPrice}</p>
        `;

        sellerChatArea.appendChild(card);
    });
};

/* ===============================
   SALES ANALYTICS (Styled Card)
================================ */
window.viewAnalytics = function() {

    let revenue = 0;
    inventory.forEach(i => revenue += parseInt(i.finalPrice));

    const orders = totalOrders;
    const avgOrder = orders > 0 ? Math.round(revenue / orders) : 0;

    sellerAddMessage("Here are your sales stats 📊", "bot");

    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("message", "bot");

    cardWrapper.innerHTML = `
        <div class="analytics-card">

            <div class="analytics-header">
                📊 Sales Analytics
            </div>

            <div class="analytics-grid">

                <div class="analytics-item">
                    <h4>💰 Revenue</h4>
                    <p>₹${revenue.toLocaleString()}</p>
                </div>

                <div class="analytics-item">
                    <h4>📦 Orders</h4>
                    <p>${orders}</p>
                </div>

                <div class="analytics-item">
                    <h4>📊 Avg Order</h4>
                    <p>₹${avgOrder.toLocaleString()}</p>
                </div>

                <div class="analytics-item">
                    <h4>⭐ Rating</h4>
                    <p>4.8 ⭐</p>
                </div>

                <div class="analytics-item">
                    <h4>🏆 Top Seller</h4>
                    <p>Red Silk</p>
                </div>

                <div class="analytics-item">
                    <h4>📈 Growth</h4>
                    <p>+23%</p>
                </div>

            </div>
        </div>
    `;

    sellerChatArea.appendChild(cardWrapper);
    sellerChatArea.scrollTop = sellerChatArea.scrollHeight;

    const buttons = document.createElement("div");
    buttons.classList.add("button-group");

    buttons.innerHTML = `
        <button onclick="viewInventory()">View Inventory</button>
        <button onclick="addProduct()">Add Product</button>
        <button onclick="showSellerDashboard()">Back to Dashboard</button>
    `;

    sellerChatArea.appendChild(buttons);
};