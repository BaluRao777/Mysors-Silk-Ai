document.addEventListener("DOMContentLoaded", function () {

    const chatArea = document.getElementById("chatArea");
    const input = document.getElementById("userInput");
    const button = document.getElementById("sendBtn");

    button.addEventListener("click", sendMessage);
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    function sendMessage() {

        const text = input.value.trim();
        if (text === "") return;
    
        addMessage(text, "user");
        input.value = "";
    
        /* 🔥 PRIORITY 1 — ADD PRODUCT (Seller Flow) */
        if (typeof productData !== "undefined" && productData.step) {
            handleAddProduct(text);
            return;
        }
    
        /* 🔥 PRIORITY 2 — SELLER LOGIN */
        if (typeof sellerData !== "undefined" && sellerData.step) {
            handleSellerInput(text);
            return;
        }
    
        /* 🔥 PRIORITY 3 — TOUR BOOKING */
        if (typeof bookingData !== "undefined" && bookingData.step) {
            handleTourInput(text);
            return;
        }
    
        /* 🔥 PRIORITY 4 — CUSTOMER CHECKOUT */
        if (
            (typeof checkoutStep !== "undefined" && checkoutStep !== null) ||
            (typeof customStep !== "undefined" && customStep !== null)
        ) {
            handleCustomerInput(text);
            return;
        }
    
        /* 🔥 DEFAULT INTRO FLOW */
        handleUserInput(text);
    }

    function addMessage(text, type) {

        const msg = document.createElement("div");
        msg.classList.add("message", type);
        msg.innerText = text;

        chatArea.appendChild(msg);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function handleUserInput(text) {

        const lower = text.toLowerCase();

        if (lower.includes("hi") || lower.includes("hello")) {

            setTimeout(() => {
                addMessage("Welcome to Mysore Silk Sarees 🌸", "bot");
            }, 500);

            setTimeout(() => {
                addMessage("Discover the royal legacy of Mysore Silk.", "bot");
            }, 1200);

            setTimeout(() => {
                showIntroVideo();
            }, 2000);

            setTimeout(() => {
                showMainMenu();
            }, 3500);
        }
    }

    function showIntroVideo() {

        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");

        videoCard.innerHTML = `
            <video controls>
                <source src="/static/images/history.mp4" type="video/mp4">
            </video>
            <p>Watch the History & Origin of Mysore Silk</p>
        `;

        chatArea.appendChild(videoCard);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function showMainMenu() {

        addMessage("How would you like to continue?", "bot");

        const buttons = document.createElement("div");
        buttons.classList.add("button-group");

        buttons.innerHTML = `
            <button onclick="selectOption('customer')">🛍 Customer</button>
            <button onclick="selectOption('seller')">🧵 Seller</button>
            <button onclick="selectOption('tour')">🏛 Tour Mysore Silk Tradition</button>
        `;

        chatArea.appendChild(buttons);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    window.selectOption = function(option) {

        addMessage(option.toUpperCase() + " selected.", "user");
    
        if (option === "customer") {
            if (typeof startCustomerFlow === "function") {
                startCustomerFlow(chatArea, addMessage);
            }
        }
    
        if (option === "seller") {
            if (typeof startSellerFlow === "function") {
                startSellerFlow(chatArea, addMessage);
            }
        }
    
        if (option === "tour") {
            if (typeof startTourFlow === "function") {
                startTourFlow(chatArea, addMessage);
            }
        }
    };

});