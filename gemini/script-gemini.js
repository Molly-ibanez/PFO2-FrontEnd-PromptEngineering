document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Menú Móvil y Navegación
       ========================================= */
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    const menuIcon = menuToggle.querySelector('i');

    // Abrir/Cerrar menú
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const isActive = mainNav.classList.contains('active');
        
        // Accesibilidad
        menuToggle.setAttribute('aria-expanded', isActive);
        
        // Cambiar icono
        if (isActive) {
            menuIcon.classList.remove('ph-list');
            menuIcon.classList.add('ph-x');
        } else {
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        }
    });

    // Cerrar menú al hacer click en un enlace (Móvil)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuIcon.classList.remove('ph-x');
                menuIcon.classList.add('ph-list');
            }
        });
    });

    /* =========================================
       2. Cabecera Sticky (Cambio de fondo)
       ========================================= */
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* =========================================
       3. Animaciones de entrada al hacer scroll (Fade-in)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo animar una vez
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        // Si el usuario prefiere movimiento reducido, las clases de CSS ya lo manejan,
        // pero igual inicializamos el observer.
        observer.observe(element);
    });

    /* =========================================
       4. Validación y Envío del Formulario
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formElements = this.elements;

        // Limpiar errores previos
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('invalid');
        });

        // Validación simple de campos requeridos
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            
            if (element.hasAttribute('required')) {
                // Chequeo de inputs de texto/selects vacíos
                if ((element.type === 'text' || element.type === 'email' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') && element.value.trim() === '') {
                    isValid = false;
                    element.closest('.form-group').classList.add('invalid');
                }
                
                // Validación especial para email
                if (element.type === 'email' && element.value.trim() !== '') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(element.value)) {
                        isValid = false;
                        element.closest('.form-group').classList.add('invalid');
                    }
                }

                // Chequeo de checkbox
                if (element.type === 'checkbox' && !element.checked) {
                    isValid = false;
                    element.closest('.form-group').classList.add('invalid');
                }
            }
        }

        // Si es válido, simulamos el envío
        if (isValid) {
            // Estado de carga en el botón
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Enviando...</span> <i class="ph ph-spinner-gap ph-spin"></i>';
            submitBtn.disabled = true;

            // Simulamos retraso de red
            setTimeout(() => {
                // Ocultar inputs del formulario
                Array.from(contactForm.children).forEach(child => {
                    if (!child.classList.contains('success-message')) {
                        child.classList.add('hidden');
                    }
                });

                // Mostrar mensaje de éxito
                successMessage.classList.remove('hidden');

                // Resetear formulario (por si recargan)
                contactForm.reset();
            }, 1500);
        }
    });

    /* =========================================
       5. Año automático en el Copyright
       ========================================= */
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});