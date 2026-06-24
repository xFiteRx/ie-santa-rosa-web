document.addEventListener("DOMContentLoaded", () => {
    // 1. SEGURIDAD RESTRINGIDA (Evita copias accidentales)
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    const forbiddenKeys = ['F12', 'I', 'J', 'u', 'c', 's'];
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && (e.shiftKey ? ['I', 'J'].includes(e.key) : ['u', 'c', 's'].includes(e.key)))) {
            e.preventDefault();
        }
    });

    // 2. CARRUSEL DE IMÁGENES AUTOMÁTICO
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    if(slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // 3. REPRODUCTOR DE PLAYLIST OPTIMIZADO
    const defaultVideo = document.getElementById('default-video-item');
    const mainPlayer = document.getElementById('ucv-main-player');
    
    if (defaultVideo && mainPlayer) {
        defaultVideo.addEventListener('click', () => {
            document.querySelectorAll('.playlist-video-item').forEach(item => item.classList.remove('playing-now'));
            defaultVideo.classList.add('playing-now');
            mainPlayer.src = "https://www.youtube.com/embed/p3X_S65pGZ8?enablejsapi=1&autoplay=1";
        });
    }

    // 4. ANIMACIÓN DE CONTADORES
    const counters = document.querySelectorAll('.elementor-counter-number');
    counters.forEach(counter => {
        const toValue = parseInt(counter.getAttribute('data-to-value')) || 0;
        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
        let startTime = null;

        const animateCounter = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const currentCount = Math.min(Math.floor((progress / duration) * toValue), toValue);
            
            counter.textContent = currentCount;
            if (progress < duration) requestAnimationFrame(animateCounter);
        };
        requestAnimationFrame(animateCounter);
    });

    // 5. CONTROL DEL MODAL Y SUS PERFILES
    const modal = document.getElementById('loginModal');
    const authSection = document.getElementById('navbar-auth-section');
    const roleSelectionView = document.getElementById('roleSelectionView');
    const loginFormView = document.getElementById('loginFormView');
    const btnBack = document.getElementById('backToRoles');
    const adminFloatingPanel = document.getElementById('admin-floating-panel');

    // Mapeo de roles para evitar repetir código innecesariamente
    const rolesConfig = {
        'role-estudiante': { name: 'Estudiante', color: '#0077b6', icon: 'fa-graduation-cap' },
        'role-docente': { name: 'Docente', color: '#b7791f', icon: 'fa-chalkboard-user' },
        'role-director': { name: 'Director', color: '#252629', icon: 'fa-user-tie' },
        'link-soporte': { name: 'Soporte TI', color: '#e56b6f', icon: 'fa-screwdriver-wrench' }
    };

    // Abrir Modal
    authSection?.addEventListener('click', (e) => {
        if (e.target.closest('#btn-login-modal')) {
            resetModal();
            modal.style.display = 'flex';
        }
    });

    // Cerrar Modal
    document.getElementById('closeModal')?.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

    // Volver atrás en el modal
    btnBack?.addEventListener('click', resetModal);

    // Asignar eventos de selección de Rol dinámicamente
    Object.keys(rolesConfig).forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => {
            const role = rolesConfig[id];
            roleSelectionView.style.display = 'none';
            loginFormView.style.display = 'block';
            if (btnBack) btnBack.style.display = 'block';

            document.getElementById('selectedRole').value = role.name;
            document.getElementById('formTitle').textContent = `Acceso para ${role.name}`;
            document.getElementById('formIconContainer').innerHTML = `<i class="fa-solid ${role.icon}" style="color: ${role.color};"></i>`;
            
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.style.background = (role.name === 'Docente' || role.name === 'Director') ? 'linear-gradient(135deg, #ffcd3f, #f4b400)' : role.color;
            submitBtn.style.color = (role.name === 'Docente' || role.name === 'Director') ? '#000' : '#fff';
        });
    });

    function resetModal() {
        roleSelectionView.style.display = 'block';
        loginFormView.style.display = 'none';
        if (btnBack) btnBack.style.display = 'none';
        document.getElementById('loginForm')?.reset();
    }

    // EVENTOS DE PANEL ADMINISTRATIVO (Removidos del HTML)
    document.getElementById('btn-edit-sections')?.addEventListener('click', () => alert('Funcionalidad activada: Ahora puede arrastrar y reordenar las secciones.'));
    document.getElementById('btn-add-teacher')?.addEventListener('click', () => alert('Formulario abierto: Registrar un nuevo docente.'));
    document.getElementById('btn-delete-user')?.addEventListener('click', () => alert('Advertencia: Accediendo a la nómina para revocación de accesos.'));
});