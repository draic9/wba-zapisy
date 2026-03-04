(function () {
  const init = () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const trigger = item.querySelector(".faq-trigger");
      const content = item.querySelector(".faq-content");
      const icon = item.querySelector(".faq-icon");

      trigger.addEventListener("click", () => {
        const isOpen = !content.classList.contains("hidden");

        faqItems.forEach((otherItem) => {
          const otherContent =
                otherItem.querySelector(".faq-content");
          const otherIcon = otherItem.querySelector(".faq-icon");
          otherContent.classList.add("hidden");
          otherIcon.classList.remove("rotate-180");
        });

        if (!isOpen) {
          content.classList.remove("hidden");
          icon.classList.add("rotate-180");
        }
      });
    });

    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#") && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
