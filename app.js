'use strict';

/* ══════════════════════════════════════════════
   CONFIGURACIÓN — WhatsApp destino
══════════════════════════════════════════════ */
const WA_NUMBER = '573115916633'; // Número con código de país (57 = Colombia)

/* ══════════════════════════════════════════════
   NAVEGACIÓN SPA
══════════════════════════════════════════════ */
const PAGES = ['inicio', 'servicios', 'cotizaciones', 'agendar', 'confirmacion', 'nosotros', 'contacto',
    'catalogo-camaras', 'catalogo-alarmas', 'catalogo-redes', 'catalogo-electricidad', 'catalogo-soporte'];

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
   ENVÍO POR WHATSAPP
══════════════════════════════════════════════ */
function enviarWhatsApp(tipo, datos) {
    const lineas = datos
        .filter(d => d.value)
        .map(d => `• *${d.label}:* ${d.value}`)
        .join('\n');
    const texto = `🔔 *Nueva ${tipo} - Pazgo Tecnología*\n\n${lineas}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank');
}

/* ══════════════════════════════════════════════
   FORMULARIOS
══════════════════════════════════════════════ */

// Formulario cotización del HOME
function handleCotHome(e) {
    e.preventDefault();
    const datos = [
        { label: 'Nombre',   value: document.getElementById('ch-nombre').value.trim() },
        { label: 'Teléfono', value: document.getElementById('ch-telefono').value.trim() },
        { label: 'Email',    value: document.getElementById('ch-email').value.trim() },
        { label: 'Servicio', value: document.getElementById('ch-servicio').value },
        { label: 'Mensaje',  value: document.getElementById('ch-mensaje').value.trim() }
    ];
    enviarWhatsApp('Cotización', datos);
    showConfirmation(
        '¡Solicitud enviada!',
        'Te hemos redirigido a WhatsApp para completar tu solicitud.',
        datos
    );
    e.target.reset();
}

// Formulario cotización de página Cotizaciones
function handleCotizacion(e) {
    e.preventDefault();
    const datos = [
        { label: 'Nombre',   value: document.getElementById('cot-nombre').value.trim() },
        { label: 'Teléfono', value: document.getElementById('cot-telefono').value.trim() },
        { label: 'Email',    value: document.getElementById('cot-email').value.trim() },
        { label: 'Servicio', value: document.getElementById('cot-servicio').value },
        { label: 'Mensaje',  value: document.getElementById('cot-mensaje').value.trim() }
    ];
    enviarWhatsApp('Cotización', datos);
    showConfirmation(
        '¡Solicitud enviada!',
        'Te hemos redirigido a WhatsApp para completar tu solicitud.',
        datos
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
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        fechaStr = `${d} de ${meses[parseInt(m, 10) - 1]} de ${y}`;
    }
    const datos = [
        { label: 'Nombre',   value: document.getElementById('ag-nombre').value.trim() },
        { label: 'Teléfono', value: document.getElementById('ag-telefono').value.trim() },
        { label: 'Servicio', value: document.getElementById('ag-servicio').value },
        { label: 'Fecha',    value: fechaStr },
        { label: 'Hora',     value: document.getElementById('ag-hora').value }
    ];
    enviarWhatsApp('Visita Agendada', datos);
    showConfirmation(
        '¡Visita agendada!',
        'Te hemos redirigido a WhatsApp para confirmar tu visita.',
        datos
    );
    e.target.reset();
}

// Formulario contacto
function handleContacto(e) {
    e.preventDefault();
    const datos = [
        { label: 'Nombre',   value: document.getElementById('con-nombre').value.trim() },
        { label: 'Email',    value: document.getElementById('con-email').value.trim() },
        { label: 'Teléfono', value: document.getElementById('con-telefono').value.trim() || 'No indicado' },
        { label: 'Mensaje',  value: document.getElementById('con-mensaje').value.trim() }
    ];
    enviarWhatsApp('Mensaje de Contacto', datos);
    showConfirmation(
        '¡Mensaje enviado!',
        'Te hemos redirigido a WhatsApp para completar tu consulta.',
        datos
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
    const fd = document.getElementById('ag-fecha');
    if (fd) fd.min = new Date().toISOString().split('T')[0];

    showPage('inicio');
});


/* ══════════════════════════════════════════════
   NAVEGACIÓN SPA
══════════════════════════════════════════════ */
const PAGES = ['inicio', 'servicios', 'cotizaciones', 'agendar', 'confirmacion', 'nosotros', 'contacto',
    'catalogo-camaras', 'catalogo-alarmas', 'catalogo-redes', 'catalogo-electricidad', 'catalogo-soporte'];

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
   ENVÍO POR WHATSAPP
   Abre WhatsApp con el mensaje pre-llenado
══════════════════════════════════════════════ */
function enviarWhatsApp(datos) {
    const lineas = datos
        .filter(d => d.value)
        .map(d => `• *${d.label}:* ${d.value}`)
        .join('\n');
    const texto = `🔔 *Nueva solicitud - Pazgo Tecnología*\n\n${lineas}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

/* ══════════════════════════════════════════════
   ENVÍO POR EMAIL (EmailJS)
   Envía el correo en segundo plano sin redirigir
══════════════════════════════════════════════ */
function enviarEmail(tipo, datos) {
    // Si EmailJS no está configurado aún, salimos silenciosamente
    if (EMAILJS_PUBLIC_KEY === 'TU_PUBLIC_KEY') return;

    const cuerpo = datos
        .filter(d => d.value)
        .map(d => `${d.label}: ${d.value}`)
        .join('\n');

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        tipo_formulario : tipo,
        destinatario    : EMAIL_DEST,
        mensaje_cuerpo  : cuerpo,
        nombre_cliente  : datos.find(d => d.label === 'Nombre')?.value || '',
        email_cliente   : datos.find(d => d.label === 'Email')?.value  || '',
        telefono_cliente: datos.find(d => d.label === 'Teléfono')?.value || '',
        servicio        : datos.find(d => d.label === 'Servicio')?.value || '',
    }).catch(err => console.warn('EmailJS error:', err));
}

/* ══════════════════════════════════════════════
   FUNCIÓN CENTRAL DE ENVÍO
   Llama a WhatsApp + Email y luego muestra confirmación
══════════════════════════════════════════════ */
function procesarFormulario(tipo, titulo, subtitulo, datos) {
    enviarWhatsApp(datos);
    enviarEmail(tipo, datos);
    showConfirmation(titulo, subtitulo, datos);
}

/* ══════════════════════════════════════════════
   FORMULARIOS
══════════════════════════════════════════════ */

// Formulario cotización del HOME
function handleCotHome(e) {
    e.preventDefault();
    procesarFormulario(
        'Cotización (Home)',
        '¡Solicitud enviada!',
        'Nos comunicaremos contigo pronto para brindarte la mejor solución.',
        [
            { label: 'Nombre',   value: document.getElementById('ch-nombre').value.trim() },
            { label: 'Teléfono', value: document.getElementById('ch-telefono').value.trim() },
            { label: 'Email',    value: document.getElementById('ch-email').value.trim() },
            { label: 'Servicio', value: document.getElementById('ch-servicio').value },
            { label: 'Mensaje',  value: document.getElementById('ch-mensaje').value.trim() }
        ]
    );
    e.target.reset();
}

// Formulario cotización de página Cotizaciones
function handleCotizacion(e) {
    e.preventDefault();
    procesarFormulario(
        'Cotización',
        '¡Solicitud enviada!',
        'Gracias por contactarnos. Te responderemos a la brevedad con la mejor propuesta.',
        [
            { label: 'Nombre',   value: document.getElementById('cot-nombre').value.trim() },
            { label: 'Teléfono', value: document.getElementById('cot-telefono').value.trim() },
            { label: 'Email',    value: document.getElementById('cot-email').value.trim() },
            { label: 'Servicio', value: document.getElementById('cot-servicio').value },
            { label: 'Mensaje',  value: document.getElementById('cot-mensaje').value.trim() }
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
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        fechaStr = `${d} de ${meses[parseInt(m, 10) - 1]} de ${y}`;
    }
    procesarFormulario(
        'Agendar Visita',
        '¡Visita agendada!',
        'Tu visita ha sido registrada. Nos contactaremos contigo para confirmar los detalles.',
        [
            { label: 'Nombre',   value: document.getElementById('ag-nombre').value.trim() },
            { label: 'Teléfono', value: document.getElementById('ag-telefono').value.trim() },
            { label: 'Servicio', value: document.getElementById('ag-servicio').value },
            { label: 'Fecha',    value: fechaStr },
            { label: 'Hora',     value: document.getElementById('ag-hora').value }
        ]
    );
    e.target.reset();
}

// Formulario contacto
function handleContacto(e) {
    e.preventDefault();
    procesarFormulario(
        'Contacto',
        '¡Mensaje enviado!',
        'Gracias por escribirnos. Te responderemos lo antes posible.',
        [
            { label: 'Nombre',   value: document.getElementById('con-nombre').value.trim() },
            { label: 'Email',    value: document.getElementById('con-email').value.trim() },
            { label: 'Teléfono', value: document.getElementById('con-telefono').value.trim() || 'No indicado' },
            { label: 'Mensaje',  value: document.getElementById('con-mensaje').value.trim() }
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
    const fd = document.getElementById('ag-fecha');
    if (fd) fd.min = new Date().toISOString().split('T')[0];

    showPage('inicio');
});


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
