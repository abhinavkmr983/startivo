// ===== STARTIVO CONFIG — CHANGE THESE =====
const WHATSAPP_NUMBER = "919876543210"; // Replace with your WhatsApp number
const API_URL = "/api/submit";

// ===== MOBILE MENU =====
const navHamburger = document.getElementById("navHamburger");
const mobileMenu = document.getElementById("mobileMenu");

navHamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  const icon = navHamburger.querySelector("i");
  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
});

function closeMobileMenu() {
  mobileMenu.classList.add("hidden");
  const icon = navHamburger.querySelector("i");
  icon.classList.add("fa-bars");
  icon.classList.remove("fa-times");
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.style.boxShadow = "0 4px 24px rgba(108,99,255,0.12)";
    backToTop.classList.remove("hidden");
  } else {
    navbar.style.boxShadow = "none";
    backToTop.classList.add("hidden");
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== FORM ELEMENTS =====
const ideaForm = document.getElementById("ideaForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const successMsg = document.getElementById("successMsg");
const errorBanner = document.getElementById("errorBanner");
const errorBannerText = document.getElementById("errorBannerText");

// ===== FORM VALIDATION =====
function validateForm(data) {
  let valid = true;
  clearErrors();

  if (!data.fullName.trim()) {
    showError("nameError", "Full name is required.");
    valid = false;
  } else if (data.fullName.trim().length < 2) {
    showError("nameError", "Name must be at least 2 characters.");
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    showError("emailError", "Email address is required.");
    valid = false;
  } else if (!emailRegex.test(data.email)) {
    showError("emailError", "Please enter a valid email address.");
    valid = false;
  }

  const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
  if (!data.phone.trim()) {
    showError("phoneError", "Phone number is required.");
    valid = false;
  } else if (!phoneRegex.test(data.phone)) {
    showError("phoneError", "Please enter a valid phone number.");
    valid = false;
  }

  if (!data.projectType) {
    showError("typeError", "Please select a project type.");
    valid = false;
  }

  if (!data.ideaDescription.trim()) {
    showError("descError", "Please describe your idea.");
    valid = false;
  } else if (data.ideaDescription.trim().length < 20) {
    showError("descError", "Description must be at least 20 characters.");
    valid = false;
  }

  return valid;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  ["nameError", "emailError", "phoneError", "typeError", "descError"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

// ===== FORM SUBMIT =====
ideaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    projectType: document.getElementById("projectType").value,
    ideaDescription: document.getElementById("ideaDescription").value,
    budgetRange: document.getElementById("budgetRange").value,
    timeline: document.getElementById("timeline").value,
  };

  if (!validateForm(data)) return;

  setLoading(true);
  errorBanner.classList.add("hidden");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      ideaForm.classList.add("hidden");
      successMsg.classList.remove("hidden");
      // Scroll to success message
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      showBannerError(result.message || "Submission failed. Please try again.");
    }
  } catch (err) {
    showBannerError("Network error. Please make sure the Startivo server is running.");
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  if (loading) {
    submitBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
  } else {
    submitBtn.disabled = false;
    btnText.classList.remove("hidden");
    btnLoader.classList.add("hidden");
  }
}

function showBannerError(msg) {
  errorBannerText.textContent = msg;
  errorBanner.classList.remove("hidden");
  errorBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resetForm() {
  ideaForm.reset();
  ideaForm.classList.remove("hidden");
  successMsg.classList.add("hidden");
  clearErrors();
  errorBanner.classList.add("hidden");
  document.getElementById("form-section").scrollIntoView({ behavior: "smooth" });
}

// ===== REAL-TIME ERROR CLEAR =====
document.querySelectorAll("input, select, textarea").forEach(el => {
  el.addEventListener("input", () => {
    clearErrors();
    errorBanner.classList.add("hidden");
  });
});

// ===== SCROLL ANIMATION =====
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -60px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".step-card, .why-card").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(el);
});