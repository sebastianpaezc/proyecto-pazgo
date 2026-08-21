'use strict';

/* ══════════════════════════════════════════════
   CONFIGURACIÓN
══════════════════════════════════════════════ */
const WA_NUMBER = '573115916633'; // Colombia +57

/* ══════════════════════════════════════════════
   NAVEGACIÓN SPA
══════════════════════════════════════════════ */
const PAGES = [
    'inicio', 'servicios', 'cotizaciones', 'agendar', 'confirmacion',
    'nosotros', 'contacto',
    'catalogo-camaras', 'catalogo-alarmas', 'catalogo-redes',
    'catalogo-electricidad', 'catalogo-soporte',
    'cotizador-camaras', 'cotizador-alarmas', 'cotizador-redes',
    'cotizador-electricidad', 'cotizador-soporte'
];

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
        const m = a.getAttribute('onclick')?.match(/showPage\('([\w-]+)'\)/);
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
    const nav  = document.getElementById('navLinks');
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
   WHATSAPP
   Usa un <a> temporal para evitar el bloqueo
   de popups que causa window.open en submit
══════════════════════════════════════════════ */
function enviarWhatsApp(tipo, datos) {
    const lineas = datos
        .filter(d => d.value)
        .map(d => `• *${d.label}:* ${d.value}`)
        .join('\n');

    const texto = `🔔 *Nueva ${tipo} - Pazgo Tecnología*\n\n${lineas}`;
    const url   = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`;

    const a = document.createElement('a');
    a.href   = url;
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/* ══════════════════════════════════════════════
   FORMULARIOS
══════════════════════════════════════════════ */

// Cotización del HOME
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
    showConfirmation('¡Solicitud enviada!', 'Te abrimos WhatsApp con tu solicitud lista para enviar.', datos);
    e.target.reset();
}

// Cotización página Cotizaciones
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
    showConfirmation('¡Solicitud enviada!', 'Te abrimos WhatsApp con tu solicitud lista para enviar.', datos);
    e.target.reset();
}

// Agendar visita
function handleAgendar(e) {
    e.preventDefault();
    const fecha = document.getElementById('ag-fecha').value;
    let fechaStr = fecha;
    if (fecha) {
        const [y, m, d] = fecha.split('-');
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                       'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
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
    showConfirmation('¡Visita agendada!', 'Te abrimos WhatsApp para confirmar tu cita.', datos);
    e.target.reset();
}

// Contacto
function handleContacto(e) {
    e.preventDefault();
    const datos = [
        { label: 'Nombre',   value: document.getElementById('con-nombre').value.trim() },
        { label: 'Email',    value: document.getElementById('con-email').value.trim() },
        { label: 'Teléfono', value: document.getElementById('con-telefono').value.trim() || 'No indicado' },
        { label: 'Mensaje',  value: document.getElementById('con-mensaje').value.trim() }
    ];
    enviarWhatsApp('Mensaje de Contacto', datos);
    showConfirmation('¡Mensaje enviado!', 'Te abrimos WhatsApp para completar tu consulta.', datos);
    e.target.reset();
}

/* ══════════════════════════════════════════════
   PANTALLA DE CONFIRMACIÓN
══════════════════════════════════════════════ */
function showConfirmation(title, msg, details) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-msg').textContent   = msg;
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
        .replace(/&/g, '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;');
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
   COTIZADOR INTERACTIVO
══════════════════════════════════════════════ */

// Estado: modalidad por servicio ('todo' | 'mano')
const modalidades = {
    camaras: 'todo', alarmas: 'todo', redes: 'todo',
    electricidad: 'todo', soporte: 'todo'
};

// Abre el cotizador del servicio indicado
function abrirCotizador(servicio) {
    showPage('cotizador-' + servicio);
    recalcular(servicio);
}

// Cambia la modalidad y actualiza la UI
function setModalidad(servicio, modo) {
    modalidades[servicio] = modo;

    // Botones activos
    document.getElementById(servicio + '-mod-todo').classList.toggle('active', modo === 'todo');
    document.getElementById(servicio + '-mod-mano').classList.toggle('active', modo === 'mano');

    const wrap = document.getElementById('page-cotizador-' + servicio);

    // Mostrar / ocultar columna de precio unitario
    wrap.querySelectorAll('.todo-costo').forEach(el => {
        el.style.display = modo === 'todo' ? '' : 'none';
    });

    // En modo mano de obra, poner qty=0 a filas que no tienen mano de obra
    const tabla = document.getElementById('tabla-' + servicio);
    tabla.querySelectorAll('tbody tr').forEach(tr => {
        const mano = parseInt(tr.dataset.mano, 10);
        const input = tr.querySelector('.qty-input');
        if (modo === 'mano' && mano === 0) {
            input.value = 0;
            input.disabled = true;
        } else {
            input.disabled = false;
            if (modo === 'mano' && parseInt(input.value, 10) === 0) input.value = 1;
        }
    });

    // Precios de combos
    wrap.querySelectorAll('.combo-precio.todo-costo').forEach(el => el.style.display = modo === 'todo' ? '' : 'none');
    wrap.querySelectorAll('.combo-precio.mano-obra').forEach(el => el.style.display = modo === 'mano' ? '' : 'none');

    recalcular(servicio);
}

// Recalcula el total de la tabla
function recalcular(servicio) {
    const modo  = modalidades[servicio];
    const tabla = document.getElementById('tabla-' + servicio);
    let subtotal = 0;

    tabla.querySelectorAll('tbody tr').forEach(tr => {
        const precio = parseInt(tr.dataset[modo === 'todo' ? 'todo' : 'mano'], 10) || 0;
        const qty    = parseInt(tr.querySelector('.qty-input').value, 10) || 0;
        const sub    = precio * qty;
        tr.querySelector('.subtotal').textContent = '$ ' + sub.toLocaleString('es-CO');
        subtotal += sub;
    });

    // Margen automático del 5% (no editable por el cliente)
    const margen    = Math.round(subtotal * 0.05);
    const margenEl  = document.getElementById('margen-' + servicio);
    if (margenEl) margenEl.textContent = '$ ' + margen.toLocaleString('es-CO');

    const total = subtotal + margen;
    document.getElementById('total-' + servicio).textContent = '$ ' + total.toLocaleString('es-CO');
}

// Selecciona / deselecciona un combo (visual, no suma al total aún)
function toggleCombo(card, servicio, id) {
    card.classList.toggle('selected');
}

// Formatea número a pesos colombianos
function formatCOP(n) {
    return '$ ' + Number(n).toLocaleString('es-CO');
}

// Arma el resumen de la tabla para enviarlo por WhatsApp
function buildResumen(servicio) {
    const modo   = modalidades[servicio];
    const tabla  = document.getElementById('tabla-' + servicio);
    const lineas = [];
    let subtotal = 0;

    tabla.querySelectorAll('tbody tr').forEach(tr => {
        const precio = parseInt(tr.dataset[modo === 'todo' ? 'todo' : 'mano'], 10) || 0;
        const qty    = parseInt(tr.querySelector('.qty-input').value, 10) || 0;
        if (qty === 0) return;
        const concepto = tr.querySelector('td').textContent.trim();
        subtotal += precio * qty;
        lineas.push(`  • ${concepto}: ${qty} × ${formatCOP(precio)} = ${formatCOP(precio * qty)}`);
    });

    // Margen 5% automático
    const margen = Math.round(subtotal * 0.05);
    if (margen > 0) lineas.push(`  • Margen imprevistos (5%): ${formatCOP(margen)}`);

    // Combos seleccionados
    const combos = [];
    document.querySelectorAll(`#page-cotizador-${servicio} .combo-card.selected strong`).forEach(el => {
        combos.push('  📦 ' + el.textContent.trim());
    });

    return { lineas, combos };
}

// Envía la cotización por WhatsApp
function enviarCotizador(servicio) {
    const nombre  = document.getElementById('nombre-' + servicio).value.trim();
    const tel     = document.getElementById('tel-'    + servicio).value.trim();
    const total   = document.getElementById('total-'  + servicio).textContent;
    const modo    = modalidades[servicio] === 'todo' ? 'Todo costo (materiales + M.O.)' : 'Solo mano de obra';
    const nombres = { camaras:'Cámaras de Seguridad', alarmas:'Alarmas',
                      redes:'Redes y Conectividad', electricidad:'Electricidad y Automatización',
                      soporte:'Soporte Técnico' };

    const { lineas, combos } = buildResumen(servicio);

    let msg = `🔔 *Cotización - Pazgo Tecnología*\n`;
    msg    += `📋 *Servicio:* ${nombres[servicio]}\n`;
    msg    += `⚙️ *Modalidad:* ${modo}\n`;
    if (nombre) msg += `👤 *Nombre:* ${nombre}\n`;
    if (tel)    msg += `📱 *Teléfono:* ${tel}\n`;
    msg    += `\n`;

    if (combos.length) {
        msg += `*Combos seleccionados:*\n${combos.join('\n')}\n\n`;
    }
    if (lineas.length) {
        msg += `*Ítems:\n*${lineas.join('\n')}\n\n`;
    }
    msg += `💰 *Total estimado: ${total}*\n`;
    msg += `\n_Precios sujetos a confirmación en visita técnica._`;

    const a   = document.createElement('a');
    a.href    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    a.target  = '_blank';
    a.rel     = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
