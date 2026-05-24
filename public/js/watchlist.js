const addCoinBtn = document.getElementById("addCoinBtn");
const addCoinPanel = document.getElementById("addCoinPanel");
const watchSearchInput = document.querySelector(".watch-search input");

if (addCoinBtn && addCoinPanel) {
    addCoinBtn.addEventListener("click", () => {
        addCoinPanel.classList.toggle("show");
    });
}

if (watchSearchInput) {
    watchSearchInput.addEventListener("input", () => {
        const searchValue = watchSearchInput.value.toLowerCase();
        const rows = document.querySelectorAll(".watchlist-row");

        rows.forEach(row => {
            const coinText = row.innerText.toLowerCase();
            row.style.display = coinText.includes(searchValue) ? "" : "none";
        });
    });
}