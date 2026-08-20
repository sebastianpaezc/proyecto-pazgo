'use strict';

/* ══════════════════════════════════════════════
   NAVEGACIÓN SPA
══════════════════════════════════════════════ */
const PAGES = ['inicio', 'servicios', 'cotizaciones', 'agendar', 'confirmacion', 'nosotros', 'contacto'];

function showPage(id) {
    PAGES.forEach(p => {
        const el = document.getElementById('page-' + p);
        if (el) el.classList.remove('active');
    });
    const target = document.getElementById('page-' + id);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Actualizar nav-link activo
    document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.remove('active');
        const m = a.getAttribute('onclick')?.match(/showPage\('(\w+)'\)/);
        if (m && m[1] === id) a.classList.add('active');
    });
}

/* ══════════════════════════════════════════════
   MENÚ HAMBURGUESA
══════════════════════════════════════════════ */
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('open');
}
document.addEventListener('click', e => {
    const nav = document.getElementById('navLinks');
    const hamb = document.getElementById('hamburger');
    if (nav && hamb && !nav.contains(e.target) && !hamb.contains(e.target)) {
        nav.classList.remove('open');
    }
});

/* ══════════════════════════════════════════════
   ACORDEÓN SERVICIOS
══════════════════════════════════════════════ */
function toggleAcc(item) {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item').forEach(el => el.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}

/* ══════════════════════════════════════════════
   FORMULARIOS
══════════════════════════════════════════════ */

// Formulario cotización del HOME
function handleCotHome(e) {
    e.preventDefault();
    showConfirmation(
        '¡Solicitud enviada!',
        'Nos comunicaremos contigo pronto para brindarte la mejor solución.',
        [
            { label: 'Nombre', value: document.getElementById('ch-nombre').value.trim() },
            { label: 'Teléfono', value: document.getElementById('ch-telefono').value.trim() },
            { label: 'Email', value: document.getElementById('ch-email').value.trim() },
            { label: 'Servicio', value: document.getElementById('ch-servicio').value },
            { label: 'Mensaje', value: document.getElementById('ch-mensaje').value.trim() }
        ]
    );
    e.target.reset();
}

// Formulario cotización de página Cotizaciones
function handleCotizacion(e) {
    e.preventDefault();
    showConfirmation(
        '¡Solicitud enviada!',
        'Gracias por contactarnos. Te responderemos a la brevedad con la mejor propuesta.',
        [
            { label: 'Nombre', value: document.getElementById('cot-nombre').value.trim() },
            { label: 'Teléfono', value: document.getElementById('cot-telefono').value.trim() },
            { label: 'Email', value: document.getElementById('cot-email').value.trim() },
            { label: 'Servicio', value: document.getElementById('cot-servicio').value },
            { label: 'Mensaje', value: document.getElementById('cot-mensaje').value.trim() }
        ]
    );
    e.target.reset();
}

// Formulario agendar visita
function handleAgendar(e) {
    e.preventDefault();
    const fecha = document.getElementById('ag-fecha').value;
    let fechaStr = fecha;
    if (fecha) {
        const [y, m, d] = fecha.split('-');
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        fechaStr = `${d} de ${meses[parseInt(m, 10) - 1]} de ${y}`;
    }
    showConfirmation(
        '¡Visita agendada!',
        'Tu visita ha sido registrada. Nos contactaremos contigo para confirmar los detalles.',
        [
            { label: 'Nombre', value: document.getElementById('ag-nombre').value.trim() },
            { label: 'Teléfono', value: document.getElementById('ag-telefono').value.trim() },
            { label: 'Servicio', value: document.getElementById('ag-servicio').value },
            { label: 'Fecha', value: fechaStr },
            { label: 'Hora', value: document.getElementById('ag-hora').value }
        ]
    );
    e.target.reset();
}

// Formulario contacto
function handleContacto(e) {
    e.preventDefault();
    showConfirmation(
        '¡Mensaje enviado!',
        'Gracias por escribirnos. Te responderemos lo antes posible.',
        [
            { label: 'Nombre', value: document.getElementById('con-nombre').value.trim() },
            { label: 'Email', value: document.getElementById('con-email').value.trim() },
            { label: 'Teléfono', value: document.getElementById('con-telefono').value.trim() || 'No indicado' },
            { label: 'Mensaje', value: document.getElementById('con-mensaje').value.trim() }
        ]
    );
    e.target.reset();
}

/* ══════════════════════════════════════════════
   PANTALLA DE CONFIRMACIÓN
══════════════════════════════════════════════ */
function showConfirmation(title, msg, details) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-msg').textContent = msg;
    const box = document.getElementById('confirm-details');
    if (details && details.length) {
        box.innerHTML = details
            .filter(d => d.value)
            .map(d => `<p><strong>${d.label}:</strong> ${esc(d.value)}</p>`)
            .join('');
        box.classList.add('visible');
    } else {
        box.classList.remove('visible');
    }
    showPage('confirmacion');
}

function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    // Fecha mínima: hoy
    const fd = document.getElementById('ag-fecha');
    if (fd) fd.min = new Date().toISOString().split('T')[0];

    showPage('inicio');
});
