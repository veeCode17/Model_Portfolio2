/* ========================================
   DOM ELEMENTS
======================================== */

const loader = document.getElementById("loader");
const navbar = document.getElementById("navbar");

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

const filters = document.querySelectorAll(".filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");

const modal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalNumber = document.getElementById("modalNumber");

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const toast = document.getElementById("toast");


/* ========================================
   PAGE LOADER
======================================== */

window.addEventListener("load", () => {

    setTimeout(() => {
        loader.classList.add("hide");
    }, 700);

});


/* ========================================
   NAVBAR SCROLL
======================================== */

function updateNavbar() {

    if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

}

window.addEventListener("scroll", updateNavbar);

updateNavbar();


/* ========================================
   MOBILE MENU
======================================== */

function closeMobileMenu() {

    menuToggle.classList.remove("open");
    mobileMenu.classList.remove("open");

    document.body.classList.remove("locked");

}

menuToggle.addEventListener("click", () => {

    const isOpen = mobileMenu.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);

    document.body.classList.toggle("locked", isOpen);

});


document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {
        closeMobileMenu();
    });

});


/* ========================================
   ACTIVE NAVIGATION
======================================== */

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".desktop-nav a");

function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.id;
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === `#${currentSection}`
        ) {
            link.classList.add("active");
        }

    });

}

window.addEventListener("scroll", updateActiveNavigation);


/* ========================================
   PORTFOLIO FILTER
======================================== */

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        const selectedFilter = filter.dataset.filter;

        filters.forEach(button => {
            button.classList.remove("active");
        });

        filter.classList.add("active");


        portfolioItems.forEach(item => {

            const category = item.dataset.category;

            if (
                selectedFilter === "all" ||
                category === selectedFilter
            ) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }

        });

    });

});


/* ========================================
   MODAL DATA
======================================== */

let visibleProjects = [];
let currentProject = 0;


function getVisibleProjects() {

    visibleProjects = Array.from(portfolioItems)
        .filter(item => !item.classList.contains("hidden"));

}


/* ========================================
   OPEN MODAL
======================================== */

function openProject(item) {

    getVisibleProjects();

    currentProject = visibleProjects.indexOf(item);

    if (currentProject < 0) {
        currentProject = 0;
    }

    updateModal();

    modal.classList.add("open");

    document.body.classList.add("locked");

}


/* ========================================
   UPDATE MODAL
======================================== */

function updateModal() {

    const item = visibleProjects[currentProject];

    if (!item) return;


    const image =
        item.dataset.image ||
        item.querySelector("img").src;

    const title =
        item.dataset.title ||
        "Project";

    const category =
        item.dataset.categoryName ||
        "Portfolio";

    const description =
        item.dataset.description ||
        "Selected portfolio project.";


    /*
        Reset the image before changing src.
        This prevents the previous project image
        from remaining visible during switching.
    */

    modalImage.style.opacity = "0";

    modalImage.src = image;

    modalImage.alt = title;


    modalImage.onload = () => {
        modalImage.style.opacity = "1";
    };


    modalImage.onerror = () => {

        /*
            If the high-resolution image fails,
            use the thumbnail already loaded.
        */

        const fallback =
            item.querySelector("img").src;

        if (modalImage.src !== fallback) {
            modalImage.src = fallback;
        } else {
            modalImage.style.opacity = "1";
        }

    };


    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDescription.textContent = description;


    modalNumber.textContent =
        `${String(currentProject + 1).padStart(2, "0")} / ${String(visibleProjects.length).padStart(2, "0")}`;

}


/* ========================================
   CLOSE MODAL
======================================== */

function closeModal() {

    modal.classList.remove("open");

    document.body.classList.remove("locked");

}


modalClose.addEventListener("click", closeModal);


/* ========================================
   PORTFOLIO ITEM CLICK
======================================== */

portfolioItems.forEach(item => {

    item.addEventListener("click", () => {
        openProject(item);
    });

});


/* ========================================
   MODAL NAVIGATION
======================================== */

function nextProject() {

    if (!visibleProjects.length) return;

    currentProject++;

    if (currentProject >= visibleProjects.length) {
        currentProject = 0;
    }

    updateModal();

}


function previousProject() {

    if (!visibleProjects.length) return;

    currentProject--;

    if (currentProject < 0) {
        currentProject = visibleProjects.length - 1;
    }

    updateModal();

}


modalNext.addEventListener("click", nextProject);

modalPrev.addEventListener("click", previousProject);


/* ========================================
   KEYBOARD CONTROLS
======================================== */

document.addEventListener("keydown", event => {

    if (!modal.classList.contains("open")) {
        return;
    }

    if (event.key === "Escape") {
        closeModal();
    }

    if (event.key === "ArrowRight") {
        nextProject();
    }

    if (event.key === "ArrowLeft") {
        previousProject();
    }

});


/* ========================================
   CLOSE MODAL BY BACKDROP
======================================== */

modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeModal();
    }

});


/* ========================================
   CONTACT FORM
======================================== */

contactForm.addEventListener("submit", event => {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const project =
        document.getElementById("project").value;

    const message =
        document.getElementById("message").value.trim();


    if (!name || !email || !project || !message) {

        formStatus.textContent =
            "Please complete all fields.";

        return;

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        formStatus.textContent =
            "Please enter a valid email address.";

        return;

    }


    /*
        Frontend-only form:
        creates a mailto link so the enquiry
        can actually be sent without a backend.
    */

    const subject =
        encodeURIComponent(
            `Portfolio enquiry — ${project}`
        );

    const body =
        encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Project: ${project}\n\n` +
            `Message:\n${message}`
        );


    window.location.href =
        `mailto:?subject=${subject}&body=${body}`;


    formStatus.textContent =
        "Your email application should open now.";

});


/* ========================================
   ESCAPE MOBILE MENU WITH ESC
======================================== */

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        mobileMenu.classList.contains("open")
    ) {
        closeMobileMenu();
    }

});


/* ========================================
   SMOOTH INTERNAL LINKS
======================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* ========================================
   IMAGE FALLBACK
======================================== */

document.querySelectorAll("img").forEach(img => {

    img.addEventListener("error", () => {

        /*
            Don't hide the image.
            Keep the layout intact if an external
            image temporarily fails.
        */

        img.style.background = "#ddd";

    });

});