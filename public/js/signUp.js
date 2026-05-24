

async function signup() {

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();

    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    /* name validation */

    if (name === "") {
        alert("Please enter your name");
        return;
    }

    /* email validation */

    if (email === "") {
        alert("Please enter your email");
        return;
    }

    if (!email.match(emailPattern)) {
        alert("Please enter a valid email address");
        return;
    }

    /* password validation */

    if (password === "") {
        alert("Please enter a password");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    /* confirm password */

    if (confirmPassword === "") {
        alert("Please confirm your password");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const res = await fetch("http://localhost:8010/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password , confirmPassword}),
        });

        const data = await res.json();

        if(res.ok) {
            alert("Signup successfully");
            window.location.href = "/login";
        } else {
            alert(data.error || "Invalid email or password");
        }
    } catch(err) {
        console.error(err);
        alert("Server error");
    }

}


