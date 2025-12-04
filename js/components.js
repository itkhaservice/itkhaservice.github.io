document.addEventListener("DOMContentLoaded", function() {
    // Load header
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("body").insertAdjacentHTML("afterbegin", data);
            // Set active navigation link
            const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
            const currentPage = window.location.pathname;
            navLinks.forEach(link => {
                const linkPath = new URL(link.href).pathname;
                if (linkPath === currentPage || (currentPage === "/" && linkPath === "/index.html")) {
                    link.classList.add("active");
                }
            });
        });

    // Load footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("body").insertAdjacentHTML("beforeend", data);
        });
});
