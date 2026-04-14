document.addEventListener("DOMContentLoaded", function() {
    // 1. Load Header
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("body").insertAdjacentHTML("afterbegin", data);
            setActiveNavLink();
            initBreadcrumb();
        });

    // 2. Load Footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("body").insertAdjacentHTML("beforeend", data);
            initBackToTop();
        });

    // Set Active Link in Navbar
    function setActiveNavLink() {
        const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute("href").split("/").pop();
            if (linkPath === currentPage) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    // Initialize Breadcrumb dynamically
    function initBreadcrumb() {
        const mainContent = document.getElementById("main-content");
        if (!mainContent) return;

        const pageTitle = document.querySelector(".page-title")?.innerText || document.title;
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        if (currentPage !== "index.html") {
            const breadcrumbHTML = `
                <nav aria-label="breadcrumb" class="breadcrumb-wrapper">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/index.html"><i class="fa-solid fa-house me-1"></i>Trang chủ</a></li>
                        <li class="breadcrumb-item active" aria-current="page">${pageTitle}</li>
                    </ol>
                </nav>
            `;
            mainContent.insertAdjacentHTML("afterbegin", breadcrumbHTML);
        }
    }

    // Initialize Back to Top Logic
    function initBackToTop() {
        const backToTop = document.getElementById("back-to-top");
        if (!backToTop) return;

        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
