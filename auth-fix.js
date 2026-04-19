/* ══════════════════════════════════════════════════════════════
   app.js — Sección 11: AUTH (reemplaza handleRegister y handleLogin)
   Corrección: se elimina guardar la contraseña en localStorage
══════════════════════════════════════════════════════════════ */

async function handleRegister(e) {
    e.preventDefault();

    const nombre   = document.getElementById('regNombre').value.trim();
    const apellido = document.getElementById('regApellido').value.trim();
    const email    = document.getElementById('regEmail').value.trim().toLowerCase();
    const tel      = document.getElementById('regTel').value.trim();
    const pass     = document.getElementById('regPass').value;
    const pass2    = document.getElementById('regPass2').value;
    const wantsPromo = document.getElementById('regPromo')?.checked ?? false;
    const errEl    = document.getElementById('registerError');

    // Validación del lado cliente
    if (pass !== pass2) {
        errEl.querySelector('span').textContent = 'Las contraseñas no coinciden';
        errEl.style.display = 'flex';
        return;
    }

    errEl.style.display = 'none';

    try {
        const response = await fetch('api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, email, tel, pass, wantsPromo })
        });

        const result = await response.json();

        if (result.success) {
            // ✅ Guardar sesión SIN contraseña
            State.user = result.user;
            saveUser();
            updateAuthUI();

            showToast(`¡Bienvenido/a ${result.user.nombre}! Tu cuenta fue creada exitosamente 🎉`, 'success');
            showPage('home');
        } else {
            errEl.querySelector('span').textContent = result.message;
            errEl.style.display = 'flex';
        }
    } catch (error) {
        errEl.querySelector('span').textContent = 'Error de conexión con el servidor';
        errEl.style.display = 'flex';
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const errEl    = document.getElementById('loginError');

    errEl.style.display = 'none';

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            // ✅ Guardar sesión SIN contraseña (el server ya la omite)
            State.user = result.user;
            saveUser();
            updateAuthUI();

            showToast(`¡Hola de nuevo, ${result.user.nombre}! 👋`, 'success');
            showPage('home');
        } else {
            errEl.querySelector('span').textContent = result.message;
            errEl.style.display = 'flex';
        }
    } catch (error) {
        errEl.querySelector('span').textContent = 'Error de conexión con el servidor';
        errEl.style.display = 'flex';
    }
}