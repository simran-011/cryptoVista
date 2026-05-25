async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch("https://cryptovista-1.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
        credentials: "include"
    });

    if (res.ok) {
        window.location.href = "https://cryptovista-1.onrender.com/explore";
    } else {
        alert("Invalid email or password");
    }
}