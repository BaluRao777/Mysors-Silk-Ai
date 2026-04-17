# Mysore Silk AI

A Flask-powered, chat-style web app that simulates a WhatsApp-like assistant for Mysore Silk use cases:

- **Customer flow** for browsing sarees, cart, checkout, and custom order requests
- **Seller flow** for login, product onboarding, AI-like price suggestion, and analytics
- **Tour flow** for booking Mysore Silk heritage tour packages

The frontend is implemented with vanilla HTML/CSS/JavaScript and uses one-page conversational UI.

---

## Project Structure

```text
mysore_silk_ai/
├── app.py
├── products.json
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   ├── script.js
│   ├── customer.js
│   ├── seller.js
│   ├── tour.js
│   └── images/
│       ├── profile.png
│       ├── upi_qr.png
│       ├── saree1.jpg ... saree12.jpg
│       └── history.mp4
└── venv/
```

---

## Tech Stack

- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Data storage:** In-memory JavaScript objects/arrays (session-level, non-persistent)

---

## Current Features

## 1) Home Chat Interface

- Mobile-like chat layout rendered from `templates/index.html`
- Message input + send button
- Microphone button with Kannada speech recognition (`webkitSpeechRecognition`, `kn-IN`)
- Chat reset action reloads the page

## 2) Customer Experience (`static/customer.js`)

- Product catalog with 12 pre-defined sarees
- Randomized product listing (6 shown at a time)
- Add-to-cart and cart summary
- Checkout data capture:
  - Name
  - Phone
  - Address
  - City
  - Pincode
  - Payment method (UPI / COD)
- UPI simulation via QR image and delayed confirmation
- Custom saree request flow:
  - Free-text custom design description
  - Generated custom order ID
  - Weaver details and estimated delivery/dispatch
- Product filter logic for:
  - Color
  - Occasion
  - Price range
  - Weight

## 3) Seller Experience (`static/seller.js`)

- Basic credential login:
  - Username: `admin`
  - Password: `1234`
- Add product workflow:
  - Local image upload (base64 preview in chat)
  - Silk content, KSI grade, length inputs
  - AI-like price prediction formula:
    - `5000 + (silk_grams * 5) + (length_meters * 200)`
  - Accept AI price or enter custom price
- Inventory view (session-only)
- Sales analytics card (derived from in-memory inventory):
  - Revenue
  - Orders
  - Avg order
  - Static quality metrics (rating, top seller, growth)

## 4) Tour Booking Experience (`static/tour.js`)

- Package selection:
  - Silver
  - Gold
  - Premium
- Booking capture:
  - Name
  - Phone
  - Visitors
  - Preferred date
- Payment choice (UPI / cash on arrival)
- Booking confirmation generated from backend API `/api/generate-booking-id`

---

## Backend APIs (`app.py`)

### `GET /`
Renders `index.html`.

### `GET /api/generate-order-id`
Returns JSON:

```json
{
  "order_id": "ORD1234"
}
```

### `GET /api/generate-booking-id`
Returns JSON:

```json
{
  "booking_id": "TOUR1234"
}
```

---

## Setup and Run

## Prerequisites

- Python 3.9+ (project currently contains a Python 3.9 virtual environment)
- `pip`

## Local Run

1. Open terminal in project root:
   ```bash
   cd /path/to/mysore_silk_ai
   ```
2. (Recommended) Create and activate virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install Flask:
   ```bash
   pip install flask
   ```
4. Start app:
   ```bash
   python app.py
   ```
5. Open in browser:
   - [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## How Conversation Routing Works

In `static/script.js`, user input is routed by priority:

1. `handleAddProduct()` if seller is currently adding a product
2. `handleSellerInput()` if seller login flow is active
3. `handleTourInput()` if tour booking is active
4. `handleCustomerInput()` if customer checkout/custom flow is active
5. Fallback to `sendToAI()` and then default greeting/menu logic

This central router allows multiple conversational modules while keeping one shared chat UI.

---

## Important Notes / Known Gaps

1. **Missing backend route for AI chat**
   - Frontend calls `POST /api/chat` in `script.js`.
   - `app.py` currently does not implement `/api/chat`.
   - Result: frontend falls back to static greeting/menu flow via error handling.

2. **Filter modal markup is missing**
   - `customer.js` expects `#filterOverlay` and `#filterModal` elements.
   - `index.html` currently does not include these elements.
   - Result: clicking "Customisation Filter" can throw runtime errors.

3. **No persistent database**
   - Cart, inventory, seller analytics, and booking state are memory-only and reset on refresh.

4. **No auth security**
   - Seller credentials are hardcoded in frontend JS, intended only for demo/prototype use.

5. **`products.json` currently unused**
   - The catalog is hardcoded in `customer.js`; `products.json` is empty.

---

## Suggested Next Improvements

- Add real `/api/chat` endpoint (LLM or rule-based assistant)
- Add missing filter modal HTML in `index.html`
- Move product catalog to backend/data file and load via API
- Persist orders, inventory, and bookings in a database
- Replace demo seller auth with secure backend authentication
- Add `requirements.txt` and basic test coverage

---

## License

No explicit license file is currently present in the repository. Add a `LICENSE` file if distribution is intended.
