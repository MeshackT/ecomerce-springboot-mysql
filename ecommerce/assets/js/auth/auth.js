const authUrl = "http://localhost:8080/api/auth";
const registerUrl = "http://localhost:8080/api/auth";

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }
fetch("http://localhost:8080/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        username: username,
        password: password
    })
})
.then(res => res.json())
.then(data => {

    if (data.success) {

        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);

        window.location.href = "index.html";

    } else {
        alert(data.message);
    }

})
.catch(err => console.error("Login error:", err));
});
}

// Register
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!fullName || !email || !password || !confirmPassword) {
            alert("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        fetch("http://localhost:8080/api/admin/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: email,
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Save login session
                localStorage.setItem("loggedInUser", JSON.stringify({
                id: data.adminId,
                username: data.username,
                email: data.email,
                role: data.role || "user"
            }));

                // Redirect based on role
                if (data.role === "admin") {
                    window.location.href = "upload.html";
                } else {
                    window.location.href = "index.html";
                }
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error("Registration error:", err));
    });
}