// admin.js

// Backend API URL
const API_URL = "https://sarthak-blog-backend.onrender.com/api";

// --------------------------------------------------
// ADMIN LOGIN PAGE
// --------------------------------------------------

if (window.location.pathname.includes("admin-login.html")) {

    const loginBtn = document.getElementById("loginBtn");

    // ------------------------------
    // Show / Hide Password + Auto Hide after 13 sec (UPDATED ICONS)
    // ------------------------------
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    let hideTimer;

    togglePassword.addEventListener("click", () => {

        clearTimeout(hideTimer); // Clear old timer

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            // Show icon: open eye (Font Awesome class)
            togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>'; 

            // Auto-hide in 13 seconds
            hideTimer = setTimeout(() => {
                passwordInput.type = "password";
                // Hide icon: closed eye (Font Awesome class)
                togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
            }, 13000);

        } else {
            passwordInput.type = "password";
            // Hide icon: closed eye (Font Awesome class)
            togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });

    // ------------------------------
    // Login Button (PRESERVED)
    // ------------------------------

    loginBtn.addEventListener("click", async () => {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const error = document.getElementById("error");

        if (!username || !password) {
            error.textContent = "Enter username and password";
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                error.textContent = data.message || "Login failed";
                return;
            }

            // Save token
            localStorage.setItem("token", data.token);

            // Redirect
            window.location.href = "admin-dashboard.html";

        } catch (err) {
            console.error(err);
            error.textContent = "Something went wrong!";
        }
    });
}


// --------------------------------------------------
// ADMIN DASHBOARD – CREATE BLOG (PRESERVED)
// --------------------------------------------------

if (window.location.pathname.includes("admin-dashboard.html")) {

    const createBtn = document.getElementById("createBtn");

    createBtn.addEventListener("click", async () => {

        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();
        const demoUrl = document.getElementById("demoUrl").value.trim();
        const category = document.getElementById("category").value;
        const tags = document.getElementById("tags").value.split(",").map(t => t.trim()).filter(t => t);

        const msg = document.getElementById("msg");

        if (!title || !content) {
            msg.textContent = "Title and content are required!";
            msg.style.color = "red";
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "admin-login.html";
            return;
        }

        try {
            const res = await fetch(`${API_URL}/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, demoUrl, category, tags })
            });

            const data = await res.json();

            if (!res.ok) {
                msg.textContent = data.message || "Failed to create blog";
                msg.style.color = "red";
                return;
            }

            msg.textContent = "Blog created successfully!";
            msg.style.color = "green";

            // Clear fields
            document.getElementById("title").value = "";
            document.getElementById("content").value = "";
            document.getElementById("demoUrl").value = "";
            document.getElementById("tags").value = "";

        } catch (err) {
            console.error(err);
            msg.textContent = "Server error while creating blog";
            msg.style.color = "red";
        }
    });
}