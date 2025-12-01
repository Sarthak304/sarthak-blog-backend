// blog.js
const API_URL = "https://sarthak-blog-backend.onrender.com/api";

/* Escape HTML safely */
function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

/* ============================
    Render Content with Code Blocks (UPDATED for better text spacing)
============================ */

function renderFullContent(content) {
    const parts = content.split(/```/g);
    let finalHTML = "";

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            // Normal text -> split by double newline for paragraphs, and use <br> for single newlines
            const paragraphs = parts[i].split('\n\n').map(p => {
                if(p.trim() === '') return '';
                // Use <br> only for single line breaks within a paragraph
                return `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`; 
            }).join('');

            finalHTML += paragraphs;
            
        } else {
            // Code block -> no escape, but wrap safely
            const codeContent = parts[i].trim();
            const safeCode = escapeHtml(codeContent);

            finalHTML += `
                <div class="code-container">
                    <button class="copy-btn" onclick="copyCode(\`${codeContent.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`)">Copy</button>
                    <pre class="code-block"><code>${safeCode}</code></pre>
                </div>
            `;
        }
    }

    return finalHTML;
}

/* ============================
    Load Single Blog (UPDATED METADATA STRUCTURE)
============================ */

if (window.location.pathname.includes("blog.html")) {

    const blogContainer = document.getElementById("blog");
    const themeBtn = document.getElementById("themeToggle");

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
            
            // NEW: Render Category and Tags as pill badges for consistency
            const tagsHtml = blog.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('');
            const categoryBadge = `<span class="tag-badge category-badge">${blog.category}</span>`;


            blogContainer.innerHTML = `
                <h2 class="article-title">${blog.title}</h2>
                
                <div class="article-metadata">
                    <p class="published-date"><i class="far fa-calendar-alt"></i> Published on: ${new Date(blog.createdAt).toLocaleDateString()}</p>
                    <p class="category-info"><strong>Category:</strong> ${categoryBadge}</p>
                    <p class="tags-info"><strong>Tags:</strong> ${tagsHtml}</p>
                </div>

                <hr class="metadata-divider">

                <div class="blog-content">${content}</div>

                ${
                    blog.demoUrl
                        ? `
                        <hr class="content-divider">
                        <h3 class="video-title">Demo Video:</h3>
                        <iframe class="demo-iframe" width="100%" height="350" src="${blog.demoUrl}" frameborder="0" allowfullscreen></iframe>`
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
    Theme Toggle (MODIFIED for icon)
============================ */

const themeBtn = document.getElementById("themeToggle");

if (themeBtn) { // Check if the element exists on this page
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    
        const dark = document.body.classList.contains("dark-mode");
        // Updated innerHTML for icon consistency
        themeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i> ☀️ Light' : '<i class="fas fa-sun"></i> 🌙 Dark';
        localStorage.setItem("theme", dark ? "dark" : "light");
    });
    
    // Apply saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        // Updated innerHTML for icon consistency on load
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> ☀️ Light'; 
    }
}