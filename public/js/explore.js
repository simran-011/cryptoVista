async function logout() {
    await fetch("/logout", {
        method: "POST",
        credentials: "include"
    });

    // Passport route already redirects to /login,
    // but if you want to force it client-side:
    window.location.href = "/login";
}


// Fetch live crypto prices in INR from backend
async function fetchLivePrices() {
    try {
        const response = await fetch("/api/prices");
        const data = await response.json();

        const coins = [
            { id: "bitcoin", index: 0 },
            { id: "ethereum", index: 1 },
            { id: "tether", index: 2 },
            { id: "ripple", index: 3 }
        ];

        const cards = document.querySelectorAll(".coin-card");

        coins.forEach(coin => {
            const card = cards[coin.index];
            if (card && data[coin.id]) {
                const price = data[coin.id].inr;
                const change = data[coin.id].inr_24h_change;

                // Format price in INR
                const formattedPrice = "₹" + price.toLocaleString("en-IN", {
                    maximumFractionDigits: 2
                });

                const priceEl = card.querySelector(".price");

                // Flash animation if price changed
                if (priceEl.textContent !== formattedPrice) {
                    priceEl.textContent = formattedPrice;
                    priceEl.classList.remove("flash");
                    void priceEl.offsetWidth; // force reflow to restart animation
                    priceEl.classList.add("flash");
                }

                // Update 24h change
                const changeEl = card.querySelector(".green, .red");
                if (changeEl) {
                    const sign = change >= 0 ? "+" : "";
                    changeEl.textContent = sign + change.toFixed(2) + "%";
                    changeEl.className = change >= 0 ? "green" : "red";
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch live prices:", error);
    }
}

// Fetch prices on page load
fetchLivePrices();

// Auto-refresh every 5 seconds for live feel
setInterval(fetchLivePrices, 5000);