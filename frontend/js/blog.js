// blog.js
const API_URL = "http://localhost:5000/api";

/* Escape HTML safely */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

/* ============================
   Render Content with Code Blocks
============================ */

function renderFullContent(content) {
  // Split content by code blocks: ```code```
  const parts = content.split(/```/g);

  let finalHTML = "";

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Normal text → escape safely + convert newlines
      finalHTML += escapeHtml(parts[i]).replace(/\n/g, "<br>");
    } else {
      // Code block → no escape, but wrap safely
      const safeCode = escapeHtml(parts[i]);

      finalHTML += `
        <div class="code-container">
          <button class="copy-btn" onclick="copyCode(\`${parts[i]
            .replace(/`/g, "\\`")
            .replace(/\$/g, "\\$")}\`)">Copy</button>
          <pre class="code-block"><code>${safeCode}</code></pre>
        </div>
      `;
    }
  }

  return finalHTML;
}

/* ============================
   Load Single Blog
============================ */

if (window.location.pathname.includes("blog.html")) {
  
  const blogContainer = document.getElementById("blog");

  function getBlogId() {
    return new URLSearchParams(window.location.search).get("id");
  }

  async function loadBlog() {
    const blogId = getBlogId();
    if (!blogId) {
      blogContainer.innerHTML = "<p>No blog ID provided</p>";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/blogs/${blogId}`);
      const blog = await res.json();

      if (!res.ok) {
        blogContainer.innerHTML = "<p>Blog not found</p>";
        return;
      }

      document.title = blog.title;

      const content = renderFullContent(blog.content);

      blogContainer.innerHTML = `
        <h2>${blog.title}</h2>
        <p><small>Published on: ${new Date(blog.createdAt).toLocaleDateString()}</small></p>
        <p><strong>Category:</strong> ${blog.category}</p>
        <p><strong>Tags:</strong> ${blog.tags.join(", ")}</p>

        <div class="blog-content">${content}</div>

        ${
          blog.demoUrl
            ? `<h3>Demo Video:</h3>
               <iframe width="100%" height="350" src="${blog.demoUrl}" frameborder="0" allowfullscreen></iframe>`
            : ""
        }
      `;

    } catch (err) {
      blogContainer.innerHTML = "<p>Error loading blog.</p>";
    }
  }

  loadBlog();
}

/* ============================
   Copy Code Button
============================ */

function copyCode(text) {
  navigator.clipboard.writeText(text);
  alert("Copied!");
}

/* ============================
   Theme Toggle
============================ */

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
