// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil si está abierto
            if(navLinks.classList.contains('active')) {
                menuToggle.click();
            }
        }
    });
});

// Refresh page when logo is clicked
const homeLogo = document.getElementById('homeLogo');
if(homeLogo) {
    homeLogo.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = window.location.origin + window.location.pathname;
    });
}

// Cambiar clase activa en navegación al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Efecto de header al hacer scroll
    if(window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Cambiar enlace activo según la sección visible
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if(pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Menú móvil toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if(menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        
        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
}

// Manejar el envío del formulario con Web3Forms
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar mensaje de carga
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this);
            
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                // Mostrar mensaje de éxito
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.backgroundColor = '#27ae60';
                
                // Resetear formulario después de 2 segundos
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                    
                    // Mostrar notificación de éxito
                    showNotification('Message sent successfully! I will contact you soon.', 'success');
                }, 3000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Mostrar mensaje de error
            submitBtn.textContent = 'Error - Try Again';
            submitBtn.style.backgroundColor = '#e74c3c';
            
            // Restaurar botón después de 3 segundos
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
                
                // Mostrar notificación de error
                showNotification('Failed to send message. Please try again.', 'error');
            }, 3000);
        }
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div class="notification-content" style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Animación de elementos al hacer scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .about-content, .contact-content, .skill-category, .timeline-content, .certification-card, .skill-list-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Smooth loading animation
function initPageLoader() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Social links interaction
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Project cards interaction
function initProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });
    });
}

// Skill boxes interaction
function initSkillBoxesInteractions() {
    const skillBoxes = document.querySelectorAll('.skill-list-item');
    
    skillBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Mobile menu close on link click
function initMobileMenu() {
    const mobileLinks = document.querySelectorAll('.nav-links a');
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = ''; // Restaurar scroll
            }
        });
    });
}

// Keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = ''; // Restaurar scroll
        }
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Asegurarse de que el header tenga la clase correcta al cargar
    if(window.scrollY > 50) {
        document.getElementById('header').classList.add('scrolled');
    }
    
    // Establecer el enlace activo inicial
    const navLinks = document.querySelectorAll('.nav-links a');
    if(window.location.hash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === window.location.hash) {
                link.classList.add('active');
            }
        });
    }
    
    // Inicializar todas las funcionalidades
    initPageLoader();
    initScrollAnimations();
    initSocialLinks();
    initProjectInteractions();
    initSkillBoxesInteractions();
    initMobileMenu();
    initKeyboardNavigation();
});

// Window resize handling
window.addEventListener('resize', function() {
    // Cerrar menú móvil si se cambia a desktop
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = ''; // Restaurar scroll
    }
});

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        e.target.style.display = 'none';
    }
}, true);