let tourAddMessage;
let tourChatArea;

let bookingData = {};
let selectedPackage = null;

/* ===============================
   START TOUR FLOW
================================ */
function startTourFlow(chatArea, addMessage) {

    tourAddMessage = addMessage;
    tourChatArea = chatArea;

    setTimeout(() => {
        tourAddMessage("Welcome to Mysore Silk Tradition Tour ✨", "bot");
    }, 500);

    setTimeout(() => {
        tourAddMessage("Experience 400+ years of royal weaving heritage.", "bot");
    }, 1200);

    setTimeout(() => {
        tourAddMessage("Choose your exclusive tour package:", "bot");
        showTourPackages();
    }, 2000);
}

/* ===============================
   SHOW PACKAGES
================================ */
function showTourPackages() {

    const container = document.createElement("div");
    container.classList.add("button-group");

    container.innerHTML = `
        <button onclick="selectTourPackage('silver')">🥈 Silver Package</button>
        <button onclick="selectTourPackage('gold')">🥇 Gold Package</button>
        <button onclick="selectTourPackage('premium')">👑 Premium Package</button>
    `;

    tourChatArea.appendChild(container);
    tourChatArea.scrollTop = tourChatArea.scrollHeight;
}

/* ===============================
   PACKAGE SELECTION
================================ */
window.selectTourPackage = function(type) {

    selectedPackage = type;

    if (type === "silver") {
        tourAddMessage("🥈 Silver Package Selected", "bot");
        tourAddMessage(
            "• Live weaving experience\n" +
            "• Saree preparation explanation\n" +
            "• Guided heritage walkthrough\n" +
            "• Complimentary Mysore Silk saree",
            "bot"
        );
    }

    if (type === "gold") {
        tourAddMessage("🥇 Gold Package Selected", "bot");
        tourAddMessage(
            "• All Silver benefits\n" +
            "• Silk thread extraction\n" +
            "• Dyeing process demonstration\n" +
            "• Premium complimentary saree",
            "bot"
        );
    }

    if (type === "premium") {
        tourAddMessage("👑 Premium Package Selected", "bot");
        tourAddMessage(
            "• All Gold benefits\n" +
            "• Hands-on weaving\n" +
            "• Customized saree creation (T&C apply)",
            "bot"
        );
    }

    setTimeout(() => {
        askBookingConfirmation();
    }, 1200);
};

/* ===============================
   CONFIRM BOOKING BUTTON
================================ */
function askBookingConfirmation() {

    const container = document.createElement("div");
    container.classList.add("button-group");

    container.innerHTML = `
        <button onclick="confirmTourBooking()">Confirm Booking</button>
    `;

    tourChatArea.appendChild(container);
    tourChatArea.scrollTop = tourChatArea.scrollHeight;
}

/* ===============================
   START BOOKING PROCESS
================================ */
window.confirmTourBooking = function() {

    tourAddMessage("Please enter your Name:", "bot");
    bookingData.step = "name";
};

/* ===============================
   HANDLE BOOKING INPUT
================================ */
window.handleTourInput = function(text) {

    if (!bookingData.step) return;

    if (bookingData.step === "name") {
        bookingData.name = text;
        bookingData.step = "phone";
        tourAddMessage("Enter Phone Number:", "bot");
        return;
    }

    if (bookingData.step === "phone") {
        bookingData.phone = text;
        bookingData.step = "visitors";
        tourAddMessage("Number of Visitors:", "bot");
        return;
    }

    if (bookingData.step === "visitors") {
        bookingData.visitors = text;
        bookingData.step = "date";
        tourAddMessage("Preferred Visit Date:", "bot");
        return;
    }

    if (bookingData.step === "date") {
        bookingData.date = text;
        bookingData.step = "payment";
        askPaymentMethod();
        return;
    }
};

/* ===============================
   PAYMENT
================================ */
function askPaymentMethod() {

    tourAddMessage("Select Payment Method:", "bot");

    const container = document.createElement("div");
    container.classList.add("button-group");

    container.innerHTML = `
        <button onclick="selectPayment('upi')">UPI</button>
        <button onclick="selectPayment('cash')">Cash on Arrival</button>
    `;

    tourChatArea.appendChild(container);
}

window.selectPayment = function(method) {

    if (method === "upi") {

        tourAddMessage("Scan QR to Pay", "bot");

        const qr = document.createElement("div");
        qr.classList.add("video-card");
        qr.innerHTML = `
            <img src="/static/images/upi_qr.png" width="100%">
        `;

        tourChatArea.appendChild(qr);

        setTimeout(() => {
            completeBooking();
        }, 5000);
    }

    if (method === "cash") {
        completeBooking();
    }
};

/* ===============================
   COMPLETE BOOKING
================================ */
function completeBooking() {

    fetch("/api/generate-booking-id")
        .then(res => res.json())
        .then(data => {

            tourAddMessage("Payment Successful ✅", "bot");

            tourAddMessage(
                "Booking Confirmed 🎉\n\n" +
                "Booking ID: " + data.booking_id + "\n" +
                "Package: " + selectedPackage.toUpperCase() + "\n" +
                "Visitors: " + bookingData.visitors + "\n" +
                "Date: " + bookingData.date + "\n\n" +
                "We look forward to hosting you!",
                "bot"
            );

            bookingData = {};
        });
}