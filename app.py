from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# Home Route (Single Page App)
@app.route("/")
def home():
    return render_template("index.html")


# Sample API – Generate Order ID (for future checkout use)
@app.route("/api/generate-order-id")
def generate_order():
    return jsonify({
        "order_id": "ORD" + str(random.randint(1000, 9999))
    })


# Sample API – Generate Booking ID (for tour booking later)
@app.route("/api/generate-booking-id")
def generate_booking():
    return jsonify({
        "booking_id": "TOUR" + str(random.randint(1000, 9999))
    })


if __name__ == "__main__":
    app.run(debug=True)