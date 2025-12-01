// main.js
const API_URL = "https://sarthak-blog-backend.onrender.com/api";

/* Escape text safely (PRESERVED) */
function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

/* Clean preview (first paragraph only) (PRESERVED) */
function renderContentPreview(content) {
    return escapeHtml(content.split("\n")[0]);
}

// Function to assign a category-based color for the banner (PRESERVED)
const getBannerColor = (category) => {
    switch (category) {
        case 'Apex': return 'var(--color-apex)';
        case 'LWC': return 'var(--color-lwc)';
        case 'SOQL': return 'var(--color-soql)';
        default: return 'var(--color-default)';
    }
}


/* =======================
    HOMEPAGE LOGIC (LOADER LOGIC RESTORED & IMPROVED)
======================= */

if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {

    const blogList = document.getElementById("blog-list");
    const loader = document.getElementById("loader");
    const headerEl = document.querySelector("header");

    // Hide header initially (using your hidden class!)
    headerEl.classList.add("hidden");

    let dataLoaded = false; // IMPORTANT FLAG (PRESERVED)

    /* ---------- TYPEWRITER LOADING TEXT (0-10 sec) (PRESERVED) ---------- */
   /* ---------- TYPEWRITER LOADING TEXT (0-10 sec) (MODIFIED FOR CONTINUOUS LOOP) ---------- */
function startTypewriter() {
    const text = "Loading blogs, please wait...";
    let index = 0;
    
    // Clear any previous typewriter content
    loader.innerHTML = ""; 

    const typeElem = document.createElement("p");
    typeElem.id = "typewriter";
    typeElem.style.fontSize = "18px";
    typeElem.style.marginTop = "10px";
    loader.appendChild(typeElem);

    const interval = setInterval(() => {
        // 1. Stop if data is loaded
        if (dataLoaded) return clearInterval(interval);

        // 2. Type the next character
        typeElem.textContent = text.slice(0, index++);
        
        // 3. Check if typing is complete
        if (index > text.length) {
            // Once complete, reset index and content to start over immediately
            index = 0; 
            typeElem.textContent = ""; 
        }
    }, 90); // 90ms speed
}

    /* ---------- SHIMMER SKELETON LOADER (ONLY IF >10 sec) (PRESERVED) ---------- */
    function showSkeleton() {
        if (dataLoaded) return; // DO NOT show if already loaded
        loader.innerHTML = `
    <div class="blog-grid">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
       
    </div>
    `;
    }

    async function loadBlogs() {

        loader.classList.remove("hidden");
        // Ensure blog list is empty before loading
        blogList.innerHTML = ""; 

        // Start typewriter immediately
        startTypewriter();

        // If slow for 10 sec → show skeleton + header (LOGIC RESTORED & IMPROVED)
        const skeletonTimer = setTimeout(() => {
            if (!dataLoaded) {
                // Clear typewriter content
                loader.innerHTML = ""; 

                headerEl.classList.remove("hidden");
                headerEl.style.display = "block";
                showSkeleton();
            }
        }, 10000);

        // After 50 sec → reload page (LOGIC RESTORED)
        const reloadTimer = setTimeout(() => {
            if (!dataLoaded) {
                console.warn("Backend took too long. Reloading...");
                location.reload();
            }
        }, 50000);
       // return ;
        try {
            const res = await fetch(`${API_URL}/blogs`);
            const blogs = await res.json();

            dataLoaded = true; // DATA FLAG TRIGGER (PRESERVED)

            clearTimeout(skeletonTimer); // CLEAR TIMERS (PRESERVED)
            clearTimeout(reloadTimer);

            // Show header immediately when data arrives early
            headerEl.classList.remove("hidden");
            headerEl.style.display = "block";

            loader.classList.add("hidden");
            loader.innerHTML = ""; // remove loader content

            const search = document.getElementById("searchInput").value.toLowerCase();
            const categoryFilter = document.getElementById("filterCategory").value;

            const filtered = blogs.filter(blog => {
                const matchesCategory = categoryFilter ? blog.category === categoryFilter : true;
                const matchesSearch =
                    blog.title.toLowerCase().includes(search) ||
                    blog.tags.join(" ").toLowerCase().includes(search);

                return matchesCategory && matchesSearch;
            });

            blogList.innerHTML = "";

            filtered.forEach(blog => {
                const card = document.createElement("div");
                card.classList.add("blog-card"); // New class for UI

                const preview = renderContentPreview(blog.content);
                // NEW: Prepare Tags as HTML Badges
                const tagsHtml = blog.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('');


                // --- UPDATED CARD HTML TEMPLATE (using new classes) ---
                card.innerHTML = `
                    <div class="card-banner" style="background-color: ${getBannerColor(blog.category)};"></div>
                    <div class="card-content">
                        <h3 class="blog-title">${blog.title}</h3>
                        <p class="blog-summary">${preview}...</p>
                        
                        <div class="card-meta">
                            ${tagsHtml}
                        </div>
                        
                        <div class="card-footer">
                            <span class="published-date"><i class="far fa-calendar-alt"></i> Published: ${new Date(blog.createdAt).toLocaleDateString()}</span>
                            <a href="blog.html?id=${blog._id}" class="read-more-btn">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                `;

                blogList.appendChild(card);
            });

        } catch (err) {
            dataLoaded = true;
            clearTimeout(skeletonTimer);
            clearTimeout(reloadTimer);

            // Show header even if error happens
            headerEl.classList.remove("hidden");
            headerEl.style.display = "block";

            loader.classList.add("hidden");
            blogList.innerHTML = "<p>Error loading blogs.</p>";
        }
    }

    loadBlogs();

    document.getElementById("filterCategory").addEventListener("change", loadBlogs);
    document.getElementById("searchInput").addEventListener("input", loadBlogs);
}

/* =======================
    THEME SWITCH (PRESERVED)
======================= */

const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const dark = document.body.classList.contains("dark-mode");
    // Ensure the icon updates correctly
    themeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i> ☀️ Light' : '<i class="fas fa-sun"></i> 🌙 Dark';
    localStorage.setItem("theme", dark ? "dark" : "light");
});

// Apply saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.innerHTML = '<i class="fas fa-moon"></i> ☀️ Light'; // Update text for saved theme
}