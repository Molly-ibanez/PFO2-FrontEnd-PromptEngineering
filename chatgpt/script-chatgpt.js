"use strict";

const header = document.querySelector("#site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const navLinks = navigation.querySelectorAll('a[href^="#"]');

const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const currentYear = document.querySelector("#current-year");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeMenu = () => {
  navigation.classList.remove("is-open");

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute(
    "aria-label",
    "Abrir menú de navegación"
  );

  document.body.classList.remove("menu-open");
};

const openMenu = () => {
  navigation.classList.add("is-open");

  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute(
    "aria-label",
    "Cerrar menú de navegación"
  );

  document.body.classList.add("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen =
    menuButton.getAttribute("aria-expanded") === "true";

  isOpen ? closeMenu() : openMenu();
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    navigation.classList.contains("is-open")
  ) {
    closeMenu();
    menuButton.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    closeMenu();
  }
});

window.addEventListener(
  "scroll",
  setHeaderState,
  { passive: true }
);

setHeaderState();

const reduceMotion = window
  .matchMedia("(prefers-reduced-motion: reduce)")
  .matches;

const revealElements = document.querySelectorAll(".reveal");

if (
  reduceMotion ||
  !("IntersectionObserver" in window)
) {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

const fieldMessages = {
  name: "Ingresá tu nombre y apellido.",
  email: "Ingresá un correo electrónico válido.",
  service: "Seleccioná el servicio que te interesa.",
  message:
    "Contanos un poco más sobre el proyecto (mínimo 20 caracteres).",
  privacy: "Necesitamos tu aceptación para continuar."
};

const setFieldError = (field, message) => {
  const errorElement = document.querySelector(
    `#${field.id}-error`
  );

  field.setAttribute("aria-invalid", "true");
  field.setAttribute(
    "aria-describedby",
    errorElement.id
  );

  errorElement.textContent = message;
};

const clearFieldError = (field) => {
  const errorElement = document.querySelector(
    `#${field.id}-error`
  );

  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");

  errorElement.textContent = "";
};

const isValidField = (field) => {
  if (!field.required && !field.value.trim()) {
    return true;
  }

  if (field.type === "checkbox") {
    return field.checked;
  }

  if (field.id === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      field.value.trim()
    );
  }

  if (field.id === "name") {
    return field.value.trim().length >= 2;
  }

  if (field.id === "message") {
    return field.value.trim().length >= 20;
  }

  return field.checkValidity();
};

const validateField = (field) => {
  if (isValidField(field)) {
    clearFieldError(field);
    return true;
  }

  setFieldError(
    field,
    fieldMessages[field.id] || "Revisá este campo."
  );

  return false;
};

const formFields = form.querySelectorAll(
  "input, select, textarea"
);

formFields.forEach((field) => {
  field.addEventListener("blur", () => {
    validateField(field);
  });

  const validationEvent =
    field.type === "checkbox" ||
    field.tagName === "SELECT"
      ? "change"
      : "input";

  field.addEventListener(validationEvent, () => {
    if (field.hasAttribute("aria-invalid")) {
      validateField(field);
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  formStatus.classList.remove("is-visible");
  formStatus.textContent = "";

  const fieldsToValidate = [
    ...form.querySelectorAll("[required]")
  ];

  const results = fieldsToValidate.map(validateField);
  const isFormValid = results.every(Boolean);

  if (!isFormValid) {
    const firstInvalidField = form.querySelector(
      '[aria-invalid="true"]'
    );

    firstInvalidField?.focus();
    return;
  }

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  submitButton.disabled = true;
  submitButton.textContent = "Consulta registrada";

  formStatus.textContent =
    "¡Gracias! Tu consulta fue validada correctamente. " +
    "En una implementación real, el equipo recibiría ahora " +
    "estos datos.";

  formStatus.classList.add("is-visible");
  formStatus.focus();

  form.reset();
  formFields.forEach(clearFieldError);

  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = "Solicitar presupuesto";
  }, 1800);
});

currentYear.textContent = new Date().getFullYear();