const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10")
        }
    })
});

let currentPage = 1;
let totalPages = Math.ceil(522 / 20);
document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const nav = document.querySelector("nav[aria-label='Pagination']");

    // Render pagination dynamically
    function renderPagination() {
        // Clear old buttons except prev/next
        nav.querySelectorAll("button:not(#prev):not(#next), span").forEach(el => el.remove());

        // Decide which pages to show
        let pages = [];
        if (totalPages <= 7) {
            // Show all if small
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            // Show first, last, and range around current
            pages = [1];
            if (currentPage > 3) pages.push("...");
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }

        // Insert buttons before "next"
        const nextSibling = nextBtn;
        pages.forEach(p => {
            if (p === "...") {
                const span = document.createElement("span");
                span.textContent = "...";
                span.className =
                    "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 inset-ring inset-ring-gray-700";
                nav.insertBefore(span, nextSibling);
            } else {
                const btn = document.createElement("button");
                btn.textContent = p;
                btn.className =
                    "relative inline-flex items-center px-4 py-2 text-sm font-semibold inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0";
                if (p === currentPage) {
                    btn.classList.add("bg-indigo-500", "text-white", "z-10");
                    btn.setAttribute("aria-current", "page");
                } else {
                    btn.classList.add("text-gray-200");
                }
                btn.addEventListener("click", () => {
                    currentPage = p;
                    renderPagination();
                    init()
                    // Trigger your data fetch/render here
                });
                nav.insertBefore(btn, nextSibling);
            }
        });
    }

    // Prev/Next handlers
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPagination();
            init()
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPagination();
            init()
        }
    });

    // Initial render
    renderPagination();
});

function checkCssRegex(value) {
    const cssPropertyRegex = /^[a-zA-Z-]+:\s*[^;]+;?$/;
    if (!cssPropertyRegex.test(value)) {
        return { ok: false, value: "wrong css formating" }
    }

    let splitValue = value.split('');

    // check from space after colon
    let getColonIndex = splitValue.indexOf(':')
    if (splitValue[getColonIndex + 1] !== " ") {
        splitValue.splice(getColonIndex + 1, 0, " ");
        return { ok: true, value: splitValue.join("") }
    }

    return {
        ok: true,
        value,
    }
}
