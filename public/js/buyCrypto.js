function calculateCost() {
  let select = document.getElementById("coinSelect");
  let price = select.value;
  let qty = document.getElementById("quantity").value;

  let total = price * qty;

  document.getElementById("totalCost").innerText =
    isNaN(total) ? 0 : total.toFixed(2);
}


async function buyCrypto() {
  const coinSelect = document.getElementById("coinSelect");
  const quantity = document.getElementById("quantity").value;

  const coinName = coinSelect.value;

  try {
    const res = await fetch("/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coin: coinName, quantity }),
      credentials: "include"
    });

    // ✅ HANDLE AUTH ERROR FIRST
    if (res.status === 401) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    const data = await res.json();

    if (data.message === "Purchase successful") {
      alert(`Bought ${quantity} ${coinName}! Total cost: ₹${data.totalCost}`);
      window.location.href = "/explore";
    } else {
      alert(data.error);
    }

  } catch (err) {
    console.error("Buy error:", err);
    alert("Something went wrong");
  }
}