// main.js
const API_URL = "http://localhost:5000/api";

/* Escape text safely */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

/* Clean preview (first paragraph only) */
function renderContentPreview(content) {
  return escapeHtml(content.split("\n")[0]);
}

/* =======================
   HOMEPAGE LOGIC
======================= */

if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {

  const blogList = document.getElementById("blog-list");

  async function loadBlogs() {
    try {
      const res = await fetch(`${API_URL}/blogs`);
      const blogs = await res.json();

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
        card.classList.add("blog-card");

        const preview = renderContentPreview(blog.content);

        card.innerHTML = `
          <h3>${blog.title}</h3>
          <p>${preview}...</p>
          <small><strong>Category:</strong> ${blog.category}</small><br>
          <small><strong>Tags:</strong> ${blog.tags.join(", ")}</small><br>
          <small>Published: ${new Date(blog.createdAt).toLocaleDateString()}</small>
          <br><br>
          <a href="blog.html?id=${blog._id}">Read More →</a>
        `;

        blogList.appendChild(card);
      });

    } catch (error) {
      blogList.innerHTML = "<p>Error loading blogs.</p>";
    }
  }

  loadBlogs();

  document.getElementById("filterCategory").addEventListener("change", loadBlogs);
  document.getElementById("searchInput").addEventListener("input", loadBlogs);
}

/* =======================
   THEME SWITCH
======================= */

const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const dark = document.body.classList.contains("dark-mode");
  themeBtn.innerText = dark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", dark ? "dark" : "light");
});

// Apply saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeBtn.innerText = "☀️ Light";
}
