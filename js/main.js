// =========================================
// VARIABLES GLOBALES
// =========================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const registroForm = document.getElementById('registro-form');
const header = document.querySelector('.header');

// =========================================
// NAVEGACIÓN MÓVIL
// =========================================

/**
 * Toggle del menú de navegación móvil
 */
function toggleMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevenir scroll cuando el menú está abierto
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Cerrar menú al hacer clic en un enlace
 */
function closeMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners para navegación
if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
        closeMenu();
    }
});

// =========================================
// SCROLL EFFECTS
// =========================================

/**
 * Añadir sombra al header al hacer scroll
 */
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Añadir/quitar clase según scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
    }
    
    // Ocultar header al hacer scroll hacia abajo (opcional)
    // Descomentar si se desea este comportamiento
    /*
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    */
    
    lastScroll = currentScroll;
});

// =========================================
// SMOOTH SCROLL
// =========================================

/**
 * Smooth scroll para enlaces internos
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar enlaces que solo son "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// FORMULARIO DE REGISTRO
// =========================================

/**
 * Validación y envío del formulario
 */
if (registroForm) {
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            tipo: document.getElementById('tipo').value,
            mensaje: document.getElementById('mensaje').value.trim()
        };
        
        // Validación básica
        if (!formData.nombre || !formData.email || !formData.tipo) {
            mostrarMensaje('Por favor, completa todos los campos obligatorios', 'error');
            return;
        }
        
        // Validar email
        if (!validarEmail(formData.email)) {
            mostrarMensaje('Por favor, introduce un email válido', 'error');
            return;
        }
        
        // Simular envío del formulario
        enviarFormulario(formData);
    });
}

/**
 * Validar formato de email
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Simular envío del formulario
 * En producción, aquí se haría una petición AJAX al backend
 */
function enviarFormulario(data) {
    // Mostrar estado de carga
    const submitButton = registroForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simular petición al servidor
    setTimeout(() => {
        console.log('Datos del formulario:', data);
        
        // Guardar en localStorage para demostración
        guardarEnLocalStorage(data);
        
        // Mostrar mensaje de éxito
        mostrarMensaje('¡Gracias por tu interés! Te contactaremos pronto.', 'success');
        
        // Resetear formulario
        registroForm.reset();
        
        // Restaurar botón
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Opcional: redirigir o mostrar contenido adicional
        // window.location.href = '/gracias.html';
        
    }, 1500);
}

/**
 * Guardar datos en localStorage
 */
function guardarEnLocalStorage(data) {
    try {
        // Obtener registros existentes
        let registros = JSON.parse(localStorage.getItem('lazarus_registros')) || [];
        
        // Añadir nuevo registro con timestamp
        registros.push({
            ...data,
            fecha: new Date().toISOString()
        });
        
        // Guardar en localStorage
        localStorage.setItem('lazarus_registros', JSON.stringify(registros));
        
        console.log('Registros guardados:', registros);
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

/**
 * Mostrar mensajes de feedback al usuario
 */
function mostrarMensaje(texto, tipo = 'info') {
    // Crear elemento de mensaje
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje mensaje--${tipo}`;
    mensaje.textContent = texto;
    
    // Estilos del mensaje
    mensaje.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    // Añadir al DOM
    document.body.appendChild(mensaje);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        mensaje.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            mensaje.remove();
        }, 300);
    }, 5000);
}

// Añadir animaciones CSS para los mensajes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =========================================
// ANIMACIONES AL SCROLL (INTERSECTION OBSERVER)
// =========================================

/**
 * Observar elementos y animarlos cuando entran en viewport
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Opcional: dejar de observar después de animar
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos que queremos animar
const animatedElements = document.querySelectorAll(
    '.feature-card, .trust-card, .section__title, .section__description, .registro__content, .registro__benefits'
);

animatedElements.forEach(el => {
    observer.observe(el);
});

// =========================================
// LAZY LOADING DE IMÁGENES
// =========================================

/**
 * Cargar imágenes de forma lazy
 */
if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback para navegadores que no soportan lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// =========================================
// UTILIDADES
// =========================================

/**
 * Detectar si el usuario está en dispositivo móvil
 */
function isMobile() {
    return window.innerWidth < 768;
}

/**
 * Debounce function para optimizar eventos
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =========================================
// EVENTOS DE RESIZE
// =========================================

/**
 * Manejar cambios de tamaño de ventana
 */
const handleResize = debounce(() => {
    // Cerrar menú móvil si se cambia a desktop
    if (!isMobile() && navMenu.classList.contains('active')) {
        closeMenu();
    }
}, 250);

window.addEventListener('resize', handleResize);

// =========================================
// INICIALIZACIÓN
// =========================================

/**
 * Función que se ejecuta cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Lazarus Landing Page cargada correctamente');
    
    // Añadir año actual al footer si existe
    const yearElement = document.querySelector('.footer__year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Log de registros guardados (solo para desarrollo)
    const registros = localStorage.getItem('lazarus_registros');
    if (registros) {
        console.log('Registros guardados:', JSON.parse(registros));
    }
});

// =========================================
// MANEJO DE ERRORES GLOBAL
// =========================================

/**
 * Capturar errores no manejados
 */
window.addEventListener('error', (event) => {
    console.error('Error capturado:', event.error);
    // En producción, aquí se enviaría el error a un servicio de logging
});

/**
 * Capturar promesas rechazadas no manejadas
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no manejada:', event.reason);
    // En producción, aquí se enviaría el error a un servicio de logging
});

// =========================================
// EXPORTAR FUNCIONES (si se usa como módulo)
// =========================================

// Si se usa como módulo ES6, descomentar:
/*
export {
    toggleMenu,
    closeMenu,
    validarEmail,
    mostrarMensaje,
    isMobile,
    debounce
};
*/
