// REPLACE THIS WITH YOUR ACTUAL AWS API GATEWAY INVOKE URL
const API_URL = arn:aws:execute-api:us-east-1:362730983853:tvqrpczfp4/*/OPTIONS/submit-orders

let cart = [];

function addToCart(itemName, price) {
    cart.push({ name: itemName, qty: 1, price: price });
    document.getElementById("cart-count").innerText = cart.length;
    alert(`${itemName} added to cart!`);
}

async function submitOrder() {
    const name = document.getElementById("customerName").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;

    if (!name || !address || !phone) {
        alert("Please fill out all fields.");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    const orderPayload = {
        customerName: name,
        address: address,
        phone: phone,
        items: cart,
        totalPrice: totalPrice
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderPayload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(`🎉 Success! Order placed.\nOrder ID: ${result.orderId}`);
            
            // Reset page state
            cart = [];
            document.getElementById("cart-count").innerText = "0";
            document.getElementById("customerName").value = "";
            document.getElementById("address").value = "";
            document.getElementById("phone").value = "";
        } else {
            alert(`⚠️ Server Error: ${result.message || "Could not complete order."}`);
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Connection failed. Did you configure CORS or paste the correct API URL?");
    }
}
