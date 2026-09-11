// PASTE YOUR ACTUAL AWS API GATEWAY INVOKE URL HERE
const API_URL = "https://amazonaws.com"; 

let cart = [];

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name: name, qty: 1, price: price });
    }
    updateUI();
}

function updateUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cart-badge").innerText = totalQty;

    const summaryContainer = document.getElementById("cart-summary-list");
    summaryContainer.innerHTML = "";

    if (cart.length === 0) {
        summaryContainer.innerHTML = `<div style="color: #7f8c8d; font-size: 14px;">Your cart is empty.</div>`;
    } else {
        cart.forEach(item => {
            const div = document.createElement("div");
            div.className = "cart-summary-item";
            div.innerHTML = `<span>${item.qty}x ${item.name}</span> <span>R${item.price * item.qty}</span>`;
            summaryContainer.appendChild(div);
        });
    }

    const totalCost = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById("total-price").innerText = `R${totalCost}`;
}

async function submitOrder() {
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !phone || !address) {
        alert("Please complete all text fields before placing your order.");
        return;
    }
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalCost = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const orderPayload = { customerName: name, phone: phone, address: address, items: cart, totalPrice: totalCost };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload)
        });
        const result = await response.json();

        if (response.ok && result.success) {
            alert(`🎉 Success! Your order has been placed.\nOrder ID: ${result.orderId}`);
            cart = [];
            updateUI();
            document.getElementById("customerName").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("address").value = "";
        } else {
            alert(`⚠️ Error processing request: ${result.message || "Server error occurred."}`);
        }
    } catch (err) {
        console.error(err);
        alert("Could not reach AWS. Double check your API URL or CORS configuration!");
    }
}
updateUI();
