/* ============================================================
   PAZGO — Chatbot flotante v3
   Flujo: servicio → subproducto → modalidad → cantidad
        → costo estimado → nombre → correo → tel → ciudad
        → WhatsApp + descarga PDF
   ============================================================ */
'use strict';

/* ── 1. CONFIG ────────────────────────────────────────────── */
const CB_WA_NUMBER = '573115916633';
const CB_DELAY_MIN = 500;
const CB_DELAY_MAX = 1100;

/* ── 2. PRECIOS BASE POR PRODUCTO ─────────────────────────── */
// precio_todo = todo costo por unidad
// precio_mano = solo mano de obra por unidad
const CB_PRECIOS = {
  'Cámara Domo HD':                    { todo: 650000,  mano: 250000 },
  'Cámara Bala 4MP':                   { todo: 720000,  mano: 250000 },
  'Cámara PTZ 360°':                   { todo: 1200000, mano: 350000 },
  'Cámara IP Wi-Fi':                   { todo: 580000,  mano: 200000 },
  'Grabador DVR/NVR 8CH':             { todo: 950000,  mano: 150000 },
  'Combo Básico':                      { todo: 1500000, mano: 350000 },
  'Combo Hogar':                       { todo: 2200000, mano: 500000 },
  'Combo Empresa':                     { todo: 4800000, mano: 900000 },
  'Panel de Alarma Inalámbrico':       { todo: 650000,  mano: 200000 },
  'Sensor de Movimiento PIR':          { todo: 180000,  mano: 80000  },
  'Sensor Magnético Puerta/Ventana':   { todo: 120000,  mano: 60000  },
  'Sirena Exterior 110dB':             { todo: 220000,  mano: 80000  },
  'Teclado LCD con Proximidad':        { todo: 280000,  mano: 100000 },
  'Router Wi-Fi 6 Dual Band':          { todo: 480000,  mano: 120000 },
  'Switch 24P Gigabit PoE+':           { todo: 850000,  mano: 150000 },
  'Wi-Fi Mesh 3 nodos':               { todo: 1200000, mano: 250000 },
  'Cableado Cat6 certificado':         { todo: 250000,  mano: 180000 },
  'Firewall UTM':                      { todo: 1800000, mano: 300000 },
  'Tablero Eléctrico':                 { todo: 600000,  mano: 280000 },
  'Cerradura Biométrica':              { todo: 450000,  mano: 150000 },
  'Automatización Acceso Vehicular':   { todo: 1500000, mano: 400000 },
  'Iluminación Smart':                 { todo: 380000,  mano: 120000 },
  'UPS / Regulador':                   { todo: 420000,  mano: 80000  },
  'Diagnóstico y reparación':          { todo: 180000,  mano: 120000 },
  'Instalación OS':                    { todo: 120000,  mano: 80000  },
  'Recuperación de datos':             { todo: 250000,  mano: 180000 },
  'Soporte técnico remoto':            { todo: 80000,   mano: 80000  },
  'Mantenimiento preventivo':          { todo: 150000,  mano: 100000 },
};

/** Busca el precio de un producto por nombre parcial */
function cbGetPrecio(producto) {
  for (const [key, val] of Object.entries(CB_PRECIOS)) {
    if (producto.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { todo: 0, mano: 0 };
}

/** Formatea número a pesos colombianos */
function cbFmtCOP(n) {
  return '$ ' + Number(n).toLocaleString('es-CO');
}

/* ── 3. CATÁLOGO ──────────────────────────────────────────── */
const CB_CATALOGO = {
  camaras: {
    nombre: 'Cámaras de Seguridad', emoji: '📹',
    unidad: 'cámara(s)',
    items: [
      { label: '🔵 Cámara Domo HD',       value: 'Cámara Domo HD (2MP, visión nocturna 20m, IP66)'      },
      { label: '🔵 Cámara Bala 4MP',       value: 'Cámara Bala 4MP (zoom 4x, visión nocturna 40m)'       },
      { label: '🔵 Cámara PTZ 360°',       value: 'Cámara PTZ 360° (zoom 20x, seguimiento automático)'   },
      { label: '🔵 Cámara IP Inalámbrica', value: 'Cámara IP Wi-Fi (app móvil, detección movimiento)'    },
      { label: '🔵 Grabador DVR/NVR 8CH',  value: 'Grabador DVR/NVR 8CH (1TB, grabación 24/7)'           },
      { label: '📦 Combo Básico',           value: 'Combo Básico (DVR 4CH + 4 Cámaras Domo + Cableado)'  },
      { label: '📦 Combo Hogar',            value: 'Combo Hogar (DVR 8CH + 6 Cámaras HD + Disco 1TB)'    },
      { label: '📦 Combo Empresa',          value: 'Combo Empresa (NVR 16CH + 10 Cámaras IP + Disco 2TB)'},
    ]
  },
  alarmas: {
    nombre: 'Alarmas', emoji: '🔔',
    unidad: 'unidad(es)',
    items: [
      { label: '🔵 Panel de Alarma',        value: 'Panel de Alarma Inalámbrico (GSM/Wi-Fi, 64 zonas)'   },
      { label: '🔵 Sensor PIR',             value: 'Sensor de Movimiento PIR (110°, 12m)'                },
      { label: '🔵 Sensor Magnético',       value: 'Sensor Magnético Puerta/Ventana (inalámbrico)'       },
      { label: '🔵 Sirena Exterior 110dB',  value: 'Sirena Exterior 110dB (estroboscópica, IP65)'        },
      { label: '🔵 Teclado LCD',            value: 'Teclado LCD con Proximidad (código + RFID)'          },
      { label: '📦 Combo Básico',           value: 'Combo Básico (Panel + 2 PIR + Sirena + Teclado)'     },
      { label: '📦 Combo Hogar',            value: 'Combo Hogar (Panel GSM + 4 sensores + Sirena)'       },
      { label: '📦 Combo Empresa',          value: 'Combo Empresa (Panel Wi-Fi + 8 zonas + monitoreo)'   },
    ]
  },
  redes: {
    nombre: 'Redes y Conectividad', emoji: '🌐',
    unidad: 'punto(s) / equipo(s)',
    items: [
      { label: '🔵 Router Wi-Fi 6',         value: 'Router Wi-Fi 6 Dual Band (3Gbps, 200m²)'             },
      { label: '🔵 Switch 24P PoE+',        value: 'Switch 24P Gigabit PoE+ (VLAN, QoS)'                },
      { label: '🔵 Wi-Fi Mesh 3 nodos',     value: 'Wi-Fi Mesh 3 nodos (500m², roaming auto)'            },
      { label: '🔵 Cableado Cat6',          value: 'Cableado Cat6 certificado (puntos de red)'           },
      { label: '🔵 Firewall UTM',           value: 'Firewall UTM (VPN, control de contenido)'            },
      { label: '📦 Red Hogar',              value: 'Combo Red Hogar (Router Wi-Fi 6 + 4 puntos Cat6)'    },
      { label: '📦 Red Oficina',            value: 'Combo Red Oficina (Switch 8P + 8 puntos + panel)'    },
      { label: '📦 Red Empresa',            value: 'Combo Red Empresa (Firewall + Switch 24P + Mesh)'    },
    ]
  },
  electricidad: {
    nombre: 'Electricidad y Automatización', emoji: '⚡',
    unidad: 'unidad(es)',
    items: [
      { label: '🔵 Tablero Eléctrico',      value: 'Tablero Eléctrico (breakers + puesta a tierra NTC)'  },
      { label: '🔵 Cerradura Biométrica',   value: 'Cerradura Biométrica (huella + PIN + RFID)'          },
      { label: '🔵 Acceso Vehicular',       value: 'Automatización Acceso Vehicular (barrera/puerta)'    },
      { label: '🔵 Iluminación Smart',      value: 'Iluminación Smart (control por voz/app)'             },
      { label: '🔵 UPS / Regulador',        value: 'UPS / Regulador (respaldo 2 horas)'                  },
      { label: '📦 Instalación Básica',     value: 'Combo Básico (Tablero + 6 circuitos + tierra)'       },
      { label: '📦 Acceso Inteligente',     value: 'Combo Acceso (Cerradura biométrica + vehicular)'     },
      { label: '📦 Smart Home',             value: 'Combo Smart Home (Iluminación smart + UPS)'          },
    ]
  },
  soporte: {
    nombre: 'Soporte Técnico', emoji: '💻',
    unidad: 'equipo(s)',
    items: [
      { label: '🔵 Diagnóstico y Reparación', value: 'Diagnóstico y reparación (computador)'             },
      { label: '🔵 Instalación de OS',        value: 'Instalación OS (Windows/Linux/macOS)'              },
      { label: '🔵 Recuperación de Datos',    value: 'Recuperación de datos (archivos/disco)'            },
      { label: '🔵 Soporte Remoto',           value: 'Soporte técnico remoto'                            },
      { label: '🔵 Mantenimiento Preventivo', value: 'Mantenimiento preventivo (limpieza + optimización)'},
      { label: '📦 Básico',                   value: 'Combo Básico (limpieza + optimización + antivirus)'},
      { label: '📦 Reparación Completa',      value: 'Combo Reparación (diagnóstico + repuesto + OS)'    },
      { label: '📦 Empresa 5 equipos',        value: 'Combo Empresa (mantenimiento 5 equipos)'           },
    ]
  },
  acceso: {
    nombre: 'Control de Acceso', emoji: '🔐',
    unidad: 'punto(s)',
    items: [
      { label: '🔵 Cerradura Biométrica',   value: 'Cerradura Biométrica (huella + PIN + RFID)'          },
      { label: '🔵 Control RFID',           value: 'Control de acceso por tarjeta RFID'                  },
      { label: '🔵 Intercomunicador',       value: 'Intercomunicador con video'                          },
      { label: '🔵 Barrera Vehicular',      value: 'Barrera vehicular con sensor'                        },
      { label: '🔵 Torniquete',             value: 'Torniquete de acceso peatonal'                       },
    ]
  },
};

/* ── 4. KB RESPUESTAS ─────────────────────────────────────── */
const KB = {
  welcome: {
    text: 'Hola 👋, soy el asistente virtual de <strong>Pazgo Tecnología</strong>. Estoy aquí para ayudarte con nuestros servicios y para generar tu cotización.\n\n¿En qué puedo ayudarte?',
    options: [
      { label: '🛠️ Servicios',           value: 'servicios' },
      { label: '💰 Solicitar cotización', value: 'cotizar'   },
      { label: '🕐 Horarios',             value: 'horarios'  },
      { label: '📞 Contacto',             value: 'contacto'  },
      { label: '📍 Cobertura',            value: 'cobertura' },
    ]
  },
  responses: {
    servicios: {
      text: 'Ofrecemos:\n\n📹 <b>Cámaras</b> — CCTV/IP\n🔔 <b>Alarmas</b> — Inalámbricas y cableadas\n🌐 <b>Redes</b> — LAN, Cat6, Wi-Fi\n⚡ <b>Electricidad</b> — Residencial e industrial\n🔐 <b>Control acceso</b> — Biométrico, RFID\n💻 <b>Soporte técnico</b> — Nivel 1 y 2\n\n¿Sobre cuál quieres info?',
      options: [
        { label: '📹 Cámaras',       value: 'info_camaras'      },
        { label: '🔔 Alarmas',       value: 'info_alarmas'      },
        { label: '🌐 Redes',         value: 'info_redes'        },
        { label: '⚡ Electricidad',  value: 'info_electricidad' },
        { label: '🔐 Acceso',        value: 'info_acceso'       },
        { label: '💻 Soporte',       value: 'info_soporte'      },
      ]
    },
    info_camaras:      { text: '📹 CCTV e IP para hogares, conjuntos y empresas. Cámaras domo, bala, PTZ, Wi-Fi y grabadores DVR/NVR con acceso remoto.\n\n¿Cotizamos?', options: [{ label: '💰 Cotizar', value: 'cotizar_camaras' },{ label: '🔙 Servicios', value: 'servicios' }] },
    info_alarmas:      { text: '🔔 Alarmas perimetrales, sensores PIR, magnéticos, sirenas y paneles GSM/Wi-Fi con monitoreo 24/7.\n\n¿Cotizamos?', options: [{ label: '💰 Cotizar', value: 'cotizar_alarmas' },{ label: '🔙 Servicios', value: 'servicios' }] },
    info_redes:        { text: '🌐 Redes LAN/WAN, cableado Cat6 certificado, switches, routers y Wi-Fi mesh.\n\n¿Cotizamos?', options: [{ label: '💰 Cotizar', value: 'cotizar_redes' },{ label: '🔙 Servicios', value: 'servicios' }] },
    info_electricidad: { text: '⚡ Instalaciones eléctricas, tableros, puesta a tierra, domótica e iluminación smart.\n\n¿Cotizamos?', options: [{ label: '💰 Cotizar', value: 'cotizar_electricidad' },{ label: '🔙 Servicios', value: 'servicios' }] },
    info_acceso:       { text: '🔐 Cerraduras biométricas, barreras vehiculares, intercomunicadores y torniquetes.\n\n¿Cotizamos?', options: [{ label: '💰 Cotizar', value: 'cotizar_acceso' },{ label: '🔙 Servicios', value: 'servicios' }] },
    info_soporte:      { text: '💻 Diagnóstico, reparación, instalación OS, recuperación de datos y mantenimiento preventivo.\n\n¿Cotizamos?', options: [{ label: '💰 Cotizar', value: 'cotizar_soporte' },{ label: '🔙 Servicios', value: 'servicios' }] },
    horarios:  { text: '🕐 <b>Horario:</b>\nLun–Vie: <b>8:00 a.m. – 5:00 p.m.</b>\nSáb: <b>8:00 a.m. – 12:00 m.</b>\n\nFuera de horario escríbenos por WhatsApp.', options: [{ label: '📞 Contacto', value: 'contacto' },{ label: '💰 Cotizar', value: 'cotizar' },{ label: '🏠 Menú', value: 'menu' }] },
    contacto:  { text: '📞 <b>Contacto Pazgo:</b>\n\n📱 WhatsApp: <b>+57 311 591 6633</b>\n✉️ Correo: <b>juandapaez24@gmail.com</b>\n📍 Soacha, Cundinamarca', options: [{ label: '✅ Que me contacten', value: 'cotizar' },{ label: '💬 WhatsApp', value: 'wa' },{ label: '🏠 Menú', value: 'menu' }] },
    cobertura: { text: '📍 Operamos en <b>Soacha y Bogotá</b>, región Cundinamarca.\n\nPara otras zonas consúltanos.', options: [{ label: '💰 Cotizar', value: 'cotizar' },{ label: '📞 Contacto', value: 'contacto' },{ label: '🏠 Menú', value: 'menu' }] },
    menu:      { text: '¿En qué más puedo ayudarte?', options: [{ label: '🛠️ Servicios', value: 'servicios' },{ label: '💰 Cotizar', value: 'cotizar' },{ label: '🕐 Horarios', value: 'horarios' },{ label: '📞 Contacto', value: 'contacto' },{ label: '📍 Cobertura', value: 'cobertura' }] },
    wa: null, cotizar: null,
  }
};

/* ── 5. INTENCIONES POR TEXTO ─────────────────────────────── */
const INTENT_MAP = [
  { keywords: ['servicio','ofrecen','soluciones'],                         intent: 'servicios'        },
  { keywords: ['cámara','camaras','cctv','dvr','nvr','vigilancia'],        intent: 'info_camaras'     },
  { keywords: ['alarma','sensor','sirena','detector'],                     intent: 'info_alarmas'     },
  { keywords: ['red','redes','wifi','wi-fi','cableado','switch','router'], intent: 'info_redes'       },
  { keywords: ['eléctric','electrico','electricidad','tablero','breaker'], intent: 'info_electricidad'},
  { keywords: ['acceso','biometrico','rfid','cerradura'],                  intent: 'info_acceso'      },
  { keywords: ['soporte','computador','pc','laptop','software'],           intent: 'info_soporte'     },
  { keywords: ['horario','horarios','atienden','abren'],                   intent: 'horarios'         },
  { keywords: ['contacto','contactar','teléfono','correo','email'],        intent: 'contacto'         },
  { keywords: ['cobertura','dónde','donde','zona','ciudad'],               intent: 'cobertura'        },
  { keywords: ['cotiz','precio','costo','cuánto','cuanto','presupuesto'],  intent: 'cotizar'          },
  { keywords: ['hola','buenas','buenos','hi','hey'],                       intent: 'menu'             },
  { keywords: ['gracias','listo','perfecto','excelente'],                  intent: 'gracias'          },
];

/* ── 6. ESTADO ────────────────────────────────────────────── */
const cbState = {
  isOpen: false, hasShownWelcome: false,
  /*
   * Pasos: idle → cot_subproducto → cot_modalidad → cot_cantidad
   *      → cot_nombre → cot_correo → cot_tel → cot_ciudad → idle
   */
  step: 'idle', cotData: {},
};

/* ── 7. HTML ──────────────────────────────────────────────── */
function cbInjectHTML() {
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = 'chatbot.css';
  document.head.appendChild(css);
  document.body.insertAdjacentHTML('beforeend', `
  <button id="cb-toggle" aria-label="Asistente virtual Pazgo" title="Asistente Pazgo">
    <div id="cb-badge">1</div>
    <svg id="cb-icon-open" viewBox="0 0 28 28" fill="none" width="28" height="28">
      <rect x="6" y="9" width="16" height="13" rx="3" fill="white" opacity=".95"/>
      <rect x="10" y="12" width="3" height="3" rx="1.5" fill="#0a1628"/>
      <rect x="15" y="12" width="3" height="3" rx="1.5" fill="#0a1628"/>
      <path d="M11 18 Q14 21 17 18" stroke="#0a1628" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <rect x="12.5" y="5" width="3" height="5" rx="1.5" fill="white" opacity=".9"/>
      <circle cx="14" cy="5" r="2" fill="white"/>
      <rect x="2" y="13" width="4" height="6" rx="2" fill="white" opacity=".7"/>
      <rect x="22" y="13" width="4" height="6" rx="2" fill="white" opacity=".7"/>
    </svg>
    <svg id="cb-icon-close" viewBox="0 0 24 24" fill="none" width="22" height="22" style="display:none">
      <path d="M6 6 L18 18 M18 6 L6 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </button>
  <div id="cb-window" role="dialog" aria-label="Chat Pazgo">
    <div id="cb-header">
      <div class="cb-avatar">
        <svg viewBox="0 0 28 28" fill="none" width="26" height="26">
          <rect x="6" y="9" width="16" height="13" rx="3" fill="white" opacity=".95"/>
          <rect x="10" y="12" width="3" height="3" rx="1.5" fill="#0a1628"/>
          <rect x="15" y="12" width="3" height="3" rx="1.5" fill="#0a1628"/>
          <path d="M11 18 Q14 21 17 18" stroke="#0a1628" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          <rect x="12.5" y="5" width="3" height="5" rx="1.5" fill="white" opacity=".9"/>
          <circle cx="14" cy="5" r="2" fill="white"/>
        </svg>
      </div>
      <div class="cb-header-info">
        <div class="cb-header-name">Asistente Pazgo</div>
        <div class="cb-header-status"><span class="cb-status-dot"></span> En línea</div>
      </div>
      <div class="cb-header-actions">
        <button class="cb-icon-btn" id="cb-restart" title="Reiniciar" aria-label="Reiniciar">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M3 9 A6 6 0 1 1 6 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M3 5 L3 9 L7 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="cb-icon-btn" id="cb-minimize" title="Minimizar" aria-label="Minimizar">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M4 9 H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
    <div id="cb-messages" aria-live="polite"></div>
    <div id="cb-typing" role="status" aria-label="Escribiendo">
      <span></span><span></span><span></span>
    </div>
    <div id="cb-input-area">
      <input type="text" id="cb-input" placeholder="Escribe tu mensaje..." maxlength="300" autocomplete="off"/>
      <button id="cb-send" aria-label="Enviar">
        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M2 10 L18 2 L14 10 L18 18 Z"/></svg>
      </button>
    </div>
  </div>`);
}

/* ── 8. UTILIDADES ────────────────────────────────────────── */
const cbTime    = () => { const d=new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };
const cbDelay   = () => CB_DELAY_MIN + Math.random()*(CB_DELAY_MAX-CB_DELAY_MIN);
const cbScroll  = () => { const m=document.getElementById('cb-messages'); if(m) m.scrollTop=m.scrollHeight; };
const cbIsEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const cbIsPhone = v => /^(\+?57)?[3][0-9]{9}$|^[0-9]{7,10}$/.test(v.replace(/\s/g,''));

/* ── 9. RENDER ────────────────────────────────────────────── */
function cbAddMessage(html, role='bot', options=[]) {
  const msgs = document.getElementById('cb-messages');
  if (!msgs) return;
  const wrap = document.createElement('div');
  wrap.className = `cb-msg ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'cb-bubble';
  bubble.innerHTML = html.replace(/\n/g,'<br>');
  const time = document.createElement('div');
  time.className = 'cb-time';
  time.textContent = cbTime();
  wrap.appendChild(bubble);
  wrap.appendChild(time);
  if (options && options.length) {
    const optWrap = document.createElement('div');
    optWrap.className = 'cb-options';
    options.forEach(o => {
      const btn = document.createElement('button');
      btn.className = 'cb-opt-btn';
      btn.textContent = o.label;
      btn.dataset.value = o.value;
      btn.addEventListener('click', () => {
        if (btn.dataset.clicked) return;
        btn.dataset.clicked = '1';
        optWrap.querySelectorAll('.cb-opt-btn').forEach(b => b.disabled = true);
        optWrap.remove();
        cbProcessMessage(o.value);
      });
      optWrap.appendChild(btn);
    });
    wrap.appendChild(optWrap);
  }
  msgs.appendChild(wrap);
  cbScroll();
}

function cbShowTyping(show) {
  const el = document.getElementById('cb-typing');
  if (el) el.classList.toggle('visible', show);
  if (show) cbScroll();
}

function cbBotRespond(html, options=[]) {
  cbShowTyping(true);
  setTimeout(() => { cbShowTyping(false); cbAddMessage(html,'bot',options); }, cbDelay());
}

/* ── 10. WHATSAPP ─────────────────────────────────────────── */
function cbOpenWA(msg) {
  const a = document.createElement('a');
  a.href = `https://wa.me/${CB_WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  a.target = '_blank'; a.rel = 'noopener noreferrer';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

/* ── 11. GENERACIÓN DE PDF ────────────────────────────────── */
function cbGenerarPDF(d) {
  // Usamos jsPDF desde CDN (se carga al inicio)
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) { console.warn('jsPDF no disponible'); return; }

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const fecha = new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' });
  const W = 210; const margin = 18;

  // Fondo header
  doc.setFillColor(10, 22, 40);
  doc.rect(0, 0, W, 42, 'F');

  // Logo texto
  doc.setTextColor(0, 200, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica','bold');
  doc.text('PAZGO', margin, 18);
  doc.setFontSize(8);
  doc.setTextColor(160, 200, 220);
  doc.text('TECNOLOGÍA', margin, 24);

  // Título cotización
  doc.setTextColor(255,255,255);
  doc.setFontSize(14);
  doc.text('COTIZACIÓN DE SERVICIOS', W/2, 18, { align:'center' });
  doc.setFontSize(9);
  doc.setTextColor(0,200,255);
  doc.text(`Fecha: ${fecha}`, W/2, 26, { align:'center' });

  // Datos cliente
  doc.setFillColor(240, 248, 255);
  doc.rect(margin, 50, W - margin*2, 38, 'F');
  doc.setDrawColor(200, 220, 240);
  doc.rect(margin, 50, W - margin*2, 38);

  doc.setTextColor(10,22,40);
  doc.setFontSize(10);
  doc.setFont('helvetica','bold');
  doc.text('DATOS DEL CLIENTE', margin+4, 58);
  doc.setFont('helvetica','normal');
  doc.setFontSize(9);
  doc.text(`Nombre:    ${d.nombre}`,          margin+4, 65);
  doc.text(`Teléfono:  ${d.telefono}`,         margin+4, 71);
  doc.text(`Correo:    ${d.correo}`,           margin+4, 77);
  doc.text(`Ciudad:    ${d.ciudad}`,           margin+4, 83);

  // Detalle del servicio
  doc.setFillColor(10,22,40);
  doc.rect(margin, 96, W - margin*2, 8, 'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(9);
  doc.setFont('helvetica','bold');
  doc.text('CONCEPTO',    margin+4,   102);
  doc.text('CANT.',       margin+105, 102);
  doc.text('V. UNIT.',    margin+120, 102);
  doc.text('TOTAL',       margin+148, 102);

  // Fila del producto
  const precioObj  = cbGetPrecio(d.producto || '');
  const esTodo     = (d.modalidad || '').includes('todo') || (d.modalidad || '').includes('Todo');
  const precioUnit = esTodo ? precioObj.todo : precioObj.mano;
  const cantidad   = parseInt(d.cantidad, 10) || 1;
  const subtotal   = precioUnit * cantidad;
  const margen     = Math.round(subtotal * 0.05);
  const total      = subtotal + margen;

  doc.setFillColor(248, 252, 255);
  doc.rect(margin, 104, W - margin*2, 10, 'F');
  doc.setDrawColor(210,225,240);
  doc.rect(margin, 104, W - margin*2, 10);
  doc.setTextColor(30,40,60);
  doc.setFont('helvetica','normal');
  doc.setFontSize(8.5);

  // Texto del producto con wrap
  const prodLabel = (d.producto || d.servicio || '').split('(')[0].trim();
  doc.text(prodLabel, margin+4, 111, { maxWidth: 95 });
  doc.text(String(cantidad),                            margin+107, 111);
  doc.text(cbFmtCOP(precioUnit),                        margin+116, 111);
  doc.text(cbFmtCOP(subtotal),                          margin+143, 111);

  // Margen
  doc.setFillColor(240,255,240);
  doc.rect(margin, 114, W - margin*2, 9, 'F');
  doc.setTextColor(30,100,50);
  doc.setFontSize(8.5);
  doc.text('Margen de imprevistos (5%)', margin+4, 120);
  doc.text(cbFmtCOP(margen), margin+143, 120);

  // Total
  doc.setFillColor(10,22,40);
  doc.rect(margin, 123, W - margin*2, 10, 'F');
  doc.setTextColor(0,200,255);
  doc.setFontSize(10);
  doc.setFont('helvetica','bold');
  doc.text('TOTAL ESTIMADO', margin+4, 130);
  doc.text(cbFmtCOP(total), margin+137, 130);

  // Modalidad badge
  doc.setFillColor(esTodo ? 0 : 30, esTodo ? 120 : 100, esTodo ? 200 : 200);
  doc.roundedRect(margin, 137, 80, 8, 2, 2, 'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(8);
  doc.text(`Modalidad: ${esTodo ? 'Todo costo' : 'Solo mano de obra'}`, margin+4, 143);

  // Notas
  doc.setTextColor(100,120,140);
  doc.setFont('helvetica','italic');
  doc.setFontSize(8);
  doc.text('* Precios estimados sujetos a confirmación en visita técnica.', margin, 153);
  doc.text('* El valor final puede variar según condiciones del lugar de instalación.', margin, 158);
  doc.text('* El primer mantenimiento a partir de la fecha de entrega cuenta con 6 meses gratuitos.', margin, 163);
  doc.setTextColor(10, 100, 10);
  doc.setFont('helvetica','bold');
  doc.setFontSize(8);
  doc.text('★ Garantía: El trabajo realizado tiene garantía de 1 año.', margin, 169);

  // Footer
  doc.setFillColor(10,22,40);
  doc.rect(0, 272, W, 25, 'F');
  doc.setTextColor(0,200,255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.text('Pazgo Tecnología', W/2, 280, { align:'center' });
  doc.setTextColor(160,200,220);
  doc.setFont('helvetica','normal');
  doc.setFontSize(8);
  doc.text('📱 +57 311 591 6633  |  ✉️ juandapaez24@gmail.com  |  📍 Soacha, Cundinamarca', W/2, 286, { align:'center' });
  doc.text('www.pazgotecnologia.com', W/2, 291, { align:'center' });

  doc.save(`Cotizacion_Pazgo_${d.nombre.replace(/\s/g,'_')}.pdf`);
}

/* ── 12. INTENCIONES ──────────────────────────────────────── */
function cbHandleIntent(intent) {
  if (intent === 'wa') {
    cbOpenWA('Hola Pazgo, quisiera información sobre sus servicios.');
    cbBotRespond('Abriendo WhatsApp 📲. Un asesor te atenderá pronto.', [{ label:'🏠 Menú', value:'menu' }]);
    return;
  }
  if (intent === 'cotizar') {
    cbBotRespond('¿Para cuál servicio deseas cotizar?', [
      { label:'📹 Cámaras',      value:'cotizar_camaras'      },
      { label:'🔔 Alarmas',      value:'cotizar_alarmas'      },
      { label:'🌐 Redes',        value:'cotizar_redes'        },
      { label:'⚡ Electricidad', value:'cotizar_electricidad' },
      { label:'🔐 Acceso',       value:'cotizar_acceso'       },
      { label:'💻 Soporte',      value:'cotizar_soporte'      },
    ]);
    return;
  }
  if (intent.startsWith('cotizar_')) {
    const key = intent.replace('cotizar_','');
    const cat = CB_CATALOGO[key];
    if (cat) {
      cbState.step    = 'cot_subproducto';
      cbState.cotData = { servicioKey: key, servicio: cat.nombre, unidad: cat.unidad };
      cbBotRespond(`${cat.emoji} <b>${cat.nombre}</b>\n\n¿Qué producto o solución te interesa?`, cat.items);
      return;
    }
  }
  if (intent.startsWith('__sub_')) {
    const producto = decodeURIComponent(intent.replace('__sub_',''));
    cbState.cotData.producto = producto;
    cbState.step = 'cot_modalidad';
    cbBotRespond(`Excelente: <b>${producto.split('(')[0].trim()}</b> ✅\n\n¿Cómo prefieres el servicio?`, [
      { label:'🏗️ Todo costo — Materiales + Mano de obra',   value:'__mod_todo' },
      { label:'🔧 Solo mano de obra — Yo pongo los materiales', value:'__mod_mano' },
    ]);
    return;
  }
  if (intent.startsWith('__mod_')) {
    const esTodo = intent === '__mod_todo';
    cbState.cotData.modalidad = esTodo
      ? 'Todo costo (materiales + mano de obra)'
      : 'Solo mano de obra (cliente provee materiales)';
    cbState.cotData.esTodo = esTodo;
    cbState.step = 'cot_cantidad';
    const unidad = cbState.cotData.unidad || 'unidad(es)';
    const precioObj  = cbGetPrecio(cbState.cotData.producto || '');
    const precioUnit = esTodo ? precioObj.todo : precioObj.mano;
    cbBotRespond(
      `<b>${esTodo ? '🏗️ Todo costo' : '🔧 Solo mano de obra'}</b> seleccionado ✅\n\n` +
      `💵 Precio unitario: <b>${cbFmtCOP(precioUnit)}</b> por ${unidad}\n\n` +
      `¿Cuántas <b>${unidad}</b> necesitas?\n(Escribe solo el número, ej: <b>4</b>)`
    );
    return;
  }
  if (intent === 'gracias') {
    cbBotRespond('¡Con gusto! 😊', KB.responses.menu.options);
    return;
  }
  const resp = KB.responses[intent];
  if (resp) { cbBotRespond(resp.text, resp.options); return; }
  cbBotRespond('🤔 No entendí eso. ¿En qué puedo ayudarte?', KB.responses.menu.options);
}

/* ── 13. DETECCIÓN DE INTENCIÓN ───────────────────────────── */
function cbDetectIntent(text) {
  const n = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  for (const e of INTENT_MAP) {
    for (const kw of e.keywords) { if (n.includes(kw)) return e.intent; }
  }
  return null;
}

/* ── 14. FLUJO DE COTIZACIÓN ──────────────────────────────── */
function cbHandleCotStep(text) {
  const t = text.trim();
  switch (cbState.step) {

    case 'cot_cantidad': {
      const qty = parseInt(t, 10);
      if (isNaN(qty) || qty < 1) { cbBotRespond('Por favor ingresa un número válido mayor a 0.'); return; }
      cbState.cotData.cantidad = qty;

      // Calcular costo estimado
      const esTodo     = cbState.cotData.esTodo;
      const precioObj  = cbGetPrecio(cbState.cotData.producto || '');
      const precioUnit = esTodo ? precioObj.todo : precioObj.mano;
      const subtotal   = precioUnit * qty;
      const margen     = Math.round(subtotal * 0.05);
      const total      = subtotal + margen;

      cbState.cotData.precioUnit = precioUnit;
      cbState.cotData.subtotal   = subtotal;
      cbState.cotData.total      = total;
      cbState.step = 'cot_nombre';

      cbBotRespond(
        `✅ <b>Resumen de costos estimado:</b>\n\n` +
        `📦 Producto: <b>${(cbState.cotData.producto||'').split('(')[0].trim()}</b>\n` +
        `🔢 Cantidad: <b>${qty} ${cbState.cotData.unidad||'unidad(es)'}</b>\n` +
        `💵 Precio unit.: <b>${cbFmtCOP(precioUnit)}</b>\n` +
        `📊 Subtotal: <b>${cbFmtCOP(subtotal)}</b>\n` +
        `➕ Margen (5%): <b>${cbFmtCOP(margen)}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `💰 <b>TOTAL ESTIMADO: ${cbFmtCOP(total)}</b>\n` +
        `⚙️ Modalidad: <b>${cbState.cotData.modalidad}</b>\n\n` +
        `_*Precios aproximados, sujetos a visita técnica._\n\n` +
        `Ahora necesito tus datos para enviar la cotización. ¿Cuál es tu <b>nombre completo</b>?`
      );
      break;
    }

    case 'cot_nombre':
      if (t.length < 2) { cbBotRespond('Por favor ingresa un nombre válido.'); return; }
      cbState.cotData.nombre = t;
      cbState.step = 'cot_correo';
      cbBotRespond(`Gracias, <b>${t}</b> 👍\n\n¿Cuál es tu <b>correo electrónico</b>?`);
      break;

    case 'cot_correo':
      if (!cbIsEmail(t)) { cbBotRespond('Correo no válido. Ej: <b>nombre@empresa.com</b>'); return; }
      cbState.cotData.correo = t;
      cbState.step = 'cot_tel';
      cbBotRespond('Perfecto ✉️\n\n¿Cuál es tu <b>número de WhatsApp o teléfono</b>?');
      break;

    case 'cot_tel':
      if (!cbIsPhone(t)) { cbBotRespond('Número no válido. Ej: <b>3115916633</b>'); return; }
      cbState.cotData.telefono = t;
      cbState.step = 'cot_ciudad';
      cbBotRespond('¿En qué <b>ciudad o municipio</b> necesitas el servicio?');
      break;

    case 'cot_ciudad':
      if (t.length < 2) { cbBotRespond('Por favor ingresa una ciudad válida.'); return; }
      cbState.cotData.ciudad = t;
      cbState.step = 'idle';
      cbEnviarCotizacion();
      break;
  }
}

/* ── 15. ENVÍO FINAL ──────────────────────────────────────── */
function cbEnviarCotizacion() {
  const d = cbState.cotData;

  // Mensaje WhatsApp
  const waMsg =
    `🔔 *Nueva Cotización - Pazgo Tecnología*\n\n` +
    `📋 *Servicio:* ${d.servicio}\n` +
    `🔵 *Producto:* ${(d.producto||'').split('(')[0].trim()}\n` +
    `🔢 *Cantidad:* ${d.cantidad} ${d.unidad||''}\n` +
    `⚙️ *Modalidad:* ${d.modalidad}\n` +
    `💰 *Total estimado:* ${cbFmtCOP(d.total||0)}\n\n` +
    `👤 *Nombre:* ${d.nombre}\n` +
    `✉️ *Correo:* ${d.correo}\n` +
    `📱 *Teléfono:* ${d.telefono}\n` +
    `📍 *Ciudad:* ${d.ciudad}\n\n` +
    `_Precios sujetos a confirmación en visita técnica._`;

  cbOpenWA(waMsg);

  // Generar PDF
  setTimeout(() => cbGenerarPDF(d), 800);

  cbBotRespond(
    `✅ <b>¡Muchas gracias, ${d.nombre}!</b>\n\n` +
    `Tu cotización fue enviada a WhatsApp y se está descargando el PDF 📄.\n\n` +
    `📦 <b>${(d.producto||d.servicio||'').split('(')[0].trim()}</b>\n` +
    `🔢 Cantidad: ${d.cantidad} ${d.unidad||''}\n` +
    `💰 Total: <b>${cbFmtCOP(d.total||0)}</b>\n\n` +
    `Un asesor te contactará al <b>${d.telefono}</b> pronto. 😊`,
    [
      { label:'🏠 Menú principal', value:'menu' },
      { label:'💬 WhatsApp',       value:'wa'   },
    ]
  );
}

/* ── 16. MAPA DE LABELS ───────────────────────────────────── */
const CB_LABELS = {
  servicios:'🛠️ Servicios', cotizar:'💰 Cotización',
  horarios:'🕐 Horarios', contacto:'📞 Contacto', cobertura:'📍 Cobertura',
  wa:'💬 WhatsApp', menu:'🏠 Menú', gracias:'¡Gracias!',
  info_camaras:'📹 Cámaras', info_alarmas:'🔔 Alarmas',
  info_redes:'🌐 Redes', info_electricidad:'⚡ Electricidad',
  info_acceso:'🔐 Acceso', info_soporte:'💻 Soporte',
  cotizar_camaras:'📹 Cotizar Cámaras', cotizar_alarmas:'🔔 Cotizar Alarmas',
  cotizar_redes:'🌐 Cotizar Redes', cotizar_electricidad:'⚡ Cotizar Electricidad',
  cotizar_acceso:'🔐 Cotizar Acceso', cotizar_soporte:'💻 Cotizar Soporte',
  '__mod_todo':'🏗️ Todo costo — Materiales + Mano de obra',
  '__mod_mano':'🔧 Solo mano de obra — Yo pongo los materiales',
};
function cbGetLabel(v) {
  if (CB_LABELS[v]) return CB_LABELS[v];
  if (v.startsWith('__sub_')) {
    try { return decodeURIComponent(v.replace('__sub_','')).split('(')[0].trim(); } catch { return v; }
  }
  return v;
}

/* ── 17. CANAL ÚNICO DE ENTRADA ───────────────────────────── */
function cbProcessMessage(raw) {
  const value = raw.trim();
  if (!value) return;
  cbAddMessage(cbGetLabel(value), 'user');
  const input = document.getElementById('cb-input');
  if (input) input.value = '';

  // Comandos internos → cbHandleIntent
  if (value.startsWith('__sub_') || value.startsWith('__mod_') ||
      value.startsWith('cotizar_') || value.startsWith('info_') ||
      ['wa','menu','horarios','contacto','cobertura','servicios','cotizar','gracias'].includes(value)) {
    cbHandleIntent(value); return;
  }
  // Pasos de texto libre del flujo
  if (cbState.step !== 'idle') { cbHandleCotStep(value); return; }
  // Detección libre
  cbHandleIntent(cbDetectIntent(value) || '__unknown__');
}

/* ── 18. TOGGLE / RESTART ─────────────────────────────────── */
function cbToggle() {
  cbState.isOpen = !cbState.isOpen;
  const win = document.getElementById('cb-window');
  const badge = document.getElementById('cb-badge');
  const iO = document.getElementById('cb-icon-open');
  const iC = document.getElementById('cb-icon-close');
  if (cbState.isOpen) {
    win.classList.add('cb-open');
    if (iO) iO.style.display = 'none';
    if (iC) iC.style.display = '';
    if (badge) badge.style.display = 'none';
    if (!cbState.hasShownWelcome) {
      cbState.hasShownWelcome = true;
      setTimeout(() => cbBotRespond(KB.welcome.text, KB.welcome.options), 400);
    }
    setTimeout(() => document.getElementById('cb-input')?.focus(), 350);
  } else {
    win.classList.remove('cb-open');
    if (iO) iO.style.display = '';
    if (iC) iC.style.display = 'none';
  }
}

function cbRestart() {
  const msgs = document.getElementById('cb-messages');
  if (msgs) msgs.innerHTML = '';
  cbState.step = 'idle'; cbState.cotData = {}; cbState.hasShownWelcome = false;
  setTimeout(() => cbBotRespond(KB.welcome.text, KB.welcome.options), 300);
}

/* ── 19. INIT ─────────────────────────────────────────────── */
function cbInit() {
  cbInjectHTML();
  setTimeout(() => {
    document.getElementById('cb-toggle')  ?.addEventListener('click', cbToggle);
    document.getElementById('cb-minimize')?.addEventListener('click', cbToggle);
    document.getElementById('cb-restart') ?.addEventListener('click', cbRestart);
    document.getElementById('cb-send')    ?.addEventListener('click', () => {
      cbProcessMessage(document.getElementById('cb-input')?.value || '');
    });
    document.getElementById('cb-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); cbProcessMessage(e.target.value); }
    });
  }, 120);
}

/* ── 20. PATCH CATÁLOGO (prefijo __sub_) ─────────────────── */
;(function() {
  Object.values(CB_CATALOGO).forEach(cat => {
    cat.items = cat.items.map(item => ({
      label: item.label,
      value: `__sub_${encodeURIComponent(item.value)}`
    }));
  });
})();

/* ── 21. CARGAR jsPDF Y ARRANCAR ─────────────────────────── */
(function loadJsPDFAndInit() {
  if (!document.querySelector('script[src*="jspdf"]')) {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cbInit);
      } else { cbInit(); }
    };
    s.onerror = () => {
      // jsPDF no cargó, arrancar igual (sin PDF)
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cbInit);
      } else { cbInit(); }
    };
    document.head.appendChild(s);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cbInit);
    } else { cbInit(); }
  }
})();
