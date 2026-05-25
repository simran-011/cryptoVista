async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch("https://cryptovista-1.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
        credentials: "include"
    });

    // Passport will redirect automatically, so you don’t need to handle res.json()
}
