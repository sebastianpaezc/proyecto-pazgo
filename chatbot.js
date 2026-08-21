/* ============================================================
   PAZGO — Chatbot flotante v2
   Archivo: chatbot.js
   Vanilla JS puro. Flujo: servicio → subproducto → modalidad
   → nombre → correo → teléfono → ciudad → WhatsApp
   ============================================================ */

'use strict';

/* ── 1. CONFIGURACIÓN ─────────────────────────────────────── */
const CB_WA_NUMBER = '573115916633';
const CB_DELAY_MIN = 600;
const CB_DELAY_MAX = 1300;

/* ── 2. CATÁLOGO DE SUBPRODUCTOS POR SERVICIO ─────────────── */
const CB_CATALOGO = {
  camaras: {
    nombre: 'Cámaras de Seguridad',
    emoji:  '📹',
    items: [
      { label: '🔵 Cámara Domo HD',          value: 'Cámara Domo HD (2MP, visión nocturna 20m, IP66)'        },
      { label: '🔵 Cámara Bala 4MP',          value: 'Cámara Bala 4MP (zoom óptico 4x, visión nocturna 40m)'  },
      { label: '🔵 Cámara PTZ 360°',          value: 'Cámara PTZ 360° (zoom 20x, seguimiento automático)'     },
      { label: '🔵 Cámara IP Inalámbrica',    value: 'Cámara IP Wi-Fi (app móvil, detección de movimiento)'   },
      { label: '🔵 Grabador DVR/NVR 8CH',     value: 'Grabador DVR/NVR 8CH (1TB, grabación 24/7)'             },
      { label: '📦 Combo Básico',              value: 'Combo Básico (DVR 4CH + 4 Cámaras Domo + Cableado)'    },
      { label: '📦 Combo Hogar',               value: 'Combo Hogar (DVR 8CH + 6 Cámaras HD + Disco 1TB)'      },
      { label: '📦 Combo Empresa',             value: 'Combo Empresa (NVR 16CH + 10 Cámaras IP + Disco 2TB)'  },
    ]
  },
  alarmas: {
    nombre: 'Alarmas',
    emoji:  '🔔',
    items: [
      { label: '🔵 Panel de Alarma Inalámbrico', value: 'Panel de Alarma Inalámbrico (GSM/Wi-Fi, 64 zonas)'    },
      { label: '🔵 Sensor de Movimiento PIR',    value: 'Sensor de Movimiento PIR (110°, cobertura 12m)'       },
      { label: '🔵 Sensor Magnético Puerta',     value: 'Sensor Magnético Puerta/Ventana (inalámbrico)'        },
      { label: '🔵 Sirena Exterior 110dB',       value: 'Sirena Exterior 110dB (estroboscópica, IP65)'         },
      { label: '🔵 Teclado LCD con Proximidad',  value: 'Teclado LCD con Proximidad (código + RFID)'           },
      { label: '📦 Combo Básico Alarma',         value: 'Combo Básico (Panel + 2 PIR + Sirena + Teclado)'      },
      { label: '📦 Combo Hogar Alarma',          value: 'Combo Hogar (Panel GSM + 4 sensores + Sirena)'        },
      { label: '📦 Combo Empresa Alarma',        value: 'Combo Empresa (Panel Wi-Fi + 8 zonas + monitoreo 24/7)'},
    ]
  },
  redes: {
    nombre: 'Redes y Conectividad',
    emoji:  '🌐',
    items: [
      { label: '🔵 Router Wi-Fi 6 Dual Band',      value: 'Router Wi-Fi 6 Dual Band (3Gbps, cobertura 200m²)'  },
      { label: '🔵 Switch Administrable 24 Puertos',value: 'Switch 24P Gigabit PoE+ (VLAN, QoS)'               },
      { label: '🔵 Sistema Wi-Fi Mesh (3 nodos)',   value: 'Wi-Fi Mesh 3 nodos (cobertura 500m², roaming auto)' },
      { label: '🔵 Cableado Estructurado Cat6',     value: 'Cableado Cat6 certificado (puntos de red)'          },
      { label: '🔵 Firewall / UTM Empresarial',     value: 'Firewall UTM (VPN, control de contenido)'           },
      { label: '📦 Red Hogar',                      value: 'Combo Red Hogar (Router Wi-Fi 6 + 4 puntos Cat6)'   },
      { label: '📦 Red Oficina',                    value: 'Combo Red Oficina (Switch 8P + 8 puntos + patch panel)'},
      { label: '📦 Red Empresa',                    value: 'Combo Red Empresa (Firewall + Switch 24P + Mesh)'   },
    ]
  },
  electricidad: {
    nombre: 'Electricidad y Automatización',
    emoji:  '⚡',
    items: [
      { label: '🔵 Tablero Eléctrico Residencial',   value: 'Tablero Eléctrico (breakers + puesta a tierra NTC)' },
      { label: '🔵 Cerradura Biométrica',            value: 'Cerradura Biométrica (huella + PIN + RFID)'         },
      { label: '🔵 Automatización Acceso Vehicular', value: 'Automatización Acceso Vehicular (barrera/puerta)'   },
      { label: '🔵 Iluminación Inteligente',         value: 'Iluminación Smart (control por voz/app)'            },
      { label: '🔵 UPS / Regulador de Voltaje',      value: 'UPS / Regulador (respaldo 2 horas)'                 },
      { label: '📦 Instalación Básica',              value: 'Combo Básico (Tablero + 6 circuitos + puesta tierra)'},
      { label: '📦 Acceso Inteligente',              value: 'Combo Acceso (Cerradura biométrica + vehicular)'    },
      { label: '📦 Smart Home',                      value: 'Combo Smart Home (Iluminación smart + UPS)'         },
    ]
  },
  soporte: {
    nombre: 'Soporte Técnico',
    emoji:  '💻',
    items: [
      { label: '🔵 Diagnóstico y Reparación PC', value: 'Diagnóstico y reparación de computador'              },
      { label: '🔵 Instalación de OS / Software', value: 'Instalación y configuración de sistema operativo'   },
      { label: '🔵 Recuperación de Datos',        value: 'Recuperación de datos (archivos borrados/dañados)'  },
      { label: '🔵 Soporte Remoto',               value: 'Soporte técnico remoto'                             },
      { label: '🔵 Mantenimiento Preventivo',     value: 'Mantenimiento preventivo (limpieza + optimización)' },
      { label: '📦 Mantenimiento Básico',         value: 'Combo Básico (limpieza + optimización + antivirus)' },
      { label: '📦 Reparación Completa',          value: 'Combo Reparación (diagnóstico + repuesto + OS)'     },
      { label: '📦 Soporte Empresa (5 equipos)',  value: 'Combo Empresa (mantenimiento preventivo 5 equipos)' },
    ]
  },
  acceso: {
    nombre: 'Control de Acceso',
    emoji:  '🔐',
    items: [
      { label: '🔵 Cerradura Biométrica',    value: 'Cerradura biométrica (huella + PIN + RFID)'             },
      { label: '🔵 Control de Acceso RFID',  value: 'Control de acceso por tarjeta RFID'                     },
      { label: '🔵 Intercomunicador',        value: 'Intercomunicador con video'                             },
      { label: '🔵 Barrera Vehicular',       value: 'Barrera vehicular con sensor de presencia'              },
      { label: '🔵 Torniquete de Acceso',    value: 'Torniquete de acceso peatonal'                          },
    ]
  },
};

/* ── 3. BASE DE CONOCIMIENTO ──────────────────────────────── */
const KB = {
  welcome: {
    text: 'Hola 👋, soy el asistente virtual de <strong>Pazgo Tecnología</strong>. Estoy aquí para ayudarte con información sobre nuestros servicios y para solicitar una cotización.\n\n¿En qué puedo ayudarte hoy?',
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
      text: 'Ofrecemos soluciones tecnológicas integrales:\n\n📹 <b>Cámaras de seguridad</b> — CCTV/IP\n🔔 <b>Alarmas</b> — Inalámbricas y cableadas\n🌐 <b>Redes</b> — LAN/WAN, Cat6, Wi-Fi\n⚡ <b>Electricidad</b> — Residencial e industrial\n🔐 <b>Control de acceso</b> — Biométrico, RFID\n💻 <b>Soporte técnico</b> — Nivel 1 y 2\n\n¿Sobre cuál quieres más información?',
      options: [
        { label: '📹 Cámaras',      value: 'info_camaras'       },
        { label: '🔔 Alarmas',      value: 'info_alarmas'       },
        { label: '🌐 Redes',        value: 'info_redes'         },
        { label: '⚡ Electricidad', value: 'info_electricidad'  },
        { label: '🔐 Control acceso',value:'info_acceso'        },
        { label: '💻 Soporte',      value: 'info_soporte'       },
      ]
    },
    info_camaras: {
      text: '📹 <b>Cámaras de seguridad:</b>\n\nInstalamos sistemas CCTV e IP para hogares, conjuntos y empresas. Cámaras domo, bala, PTZ, Wi-Fi y grabadores DVR/NVR. Incluye acceso remoto desde el celular.\n\n¿Quieres cotizar?',
      options: [
        { label: '💰 Sí, cotizar cámaras', value: 'cotizar_camaras' },
        { label: '🔙 Ver más servicios',   value: 'servicios'        },
      ]
    },
    info_alarmas: {
      text: '🔔 <b>Sistemas de alarma:</b>\n\nAlarmas perimetrales, sensores PIR, magnéticos, sirenas y paneles GSM/Wi-Fi. Monitoreo 24/7 con notificación al celular.\n\n¿Quieres cotizar?',
      options: [
        { label: '💰 Sí, cotizar alarmas', value: 'cotizar_alarmas' },
        { label: '🔙 Ver más servicios',   value: 'servicios'       },
      ]
    },
    info_redes: {
      text: '🌐 <b>Redes y cableado estructurado:</b>\n\nRedes LAN/WAN, cableado Cat6 certificado, switches, routers, Wi-Fi mesh y telecomunicaciones.\n\n¿Quieres cotizar?',
      options: [
        { label: '💰 Sí, cotizar redes', value: 'cotizar_redes' },
        { label: '🔙 Ver más servicios', value: 'servicios'     },
      ]
    },
    info_electricidad: {
      text: '⚡ <b>Electricidad y automatización:</b>\n\nInstalaciones eléctricas, tableros, puesta a tierra, cerraduras biométricas, domótica e iluminación smart.\n\n¿Quieres cotizar?',
      options: [
        { label: '💰 Sí, cotizar electricidad', value: 'cotizar_electricidad' },
        { label: '🔙 Ver más servicios',         value: 'servicios'           },
      ]
    },
    info_acceso: {
      text: '🔐 <b>Control de acceso:</b>\n\nCerraduras biométricas (huella, PIN, RFID), barreras vehiculares, intercomunicadores y torniquetes.\n\n¿Quieres cotizar?',
      options: [
        { label: '💰 Sí, cotizar acceso', value: 'cotizar_acceso' },
        { label: '🔙 Ver más servicios',  value: 'servicios'      },
      ]
    },
    info_soporte: {
      text: '💻 <b>Soporte técnico:</b>\n\nDiagnóstico, reparación, instalación de OS, recuperación de datos, mantenimiento preventivo y soporte remoto.\n\n¿Quieres cotizar?',
      options: [
        { label: '💰 Sí, cotizar soporte', value: 'cotizar_soporte' },
        { label: '🔙 Ver más servicios',   value: 'servicios'       },
      ]
    },
    horarios: {
      text: '🕐 <b>Horario de atención:</b>\n\nLunes a viernes: <b>8:00 a.m. – 5:00 p.m.</b>\nSábados: <b>8:00 a.m. – 12:00 m.</b>\n\nFuera de horario escríbenos por WhatsApp. ¿En qué más puedo ayudarte?',
      options: [
        { label: '📞 Contacto',          value: 'contacto' },
        { label: '💰 Solicitar cotización', value: 'cotizar' },
        { label: '🏠 Menú',              value: 'menu'     },
      ]
    },
    contacto: {
      text: '📞 <b>Medios de contacto Pazgo:</b>\n\n📱 WhatsApp: <b>+57 311 591 6633</b>\n✉️ Correo: <b>juandapaez24@gmail.com</b>\n📍 Ubicación: <b>Soacha, Cundinamarca</b>\n\n¿Prefieres que un asesor te contacte directamente?',
      options: [
        { label: '✅ Sí, que me contacten', value: 'cotizar' },
        { label: '💬 Ir a WhatsApp',        value: 'wa'      },
        { label: '🏠 Menú',                 value: 'menu'    },
      ]
    },
    cobertura: {
      text: '📍 <b>Cobertura de Pazgo:</b>\n\nOperamos en <b>Soacha y Bogotá</b>, con proyectos en toda la región de Cundinamarca.\n\nPara otras zonas, consúltanos directamente. ¿En qué más puedo ayudarte?',
      options: [
        { label: '💰 Solicitar cotización', value: 'cotizar'  },
        { label: '📞 Contactar asesor',     value: 'contacto' },
        { label: '🏠 Menú',                 value: 'menu'     },
      ]
    },
    menu: {
      text: '¿En qué más puedo ayudarte?',
      options: [
        { label: '🛠️ Servicios',           value: 'servicios' },
        { label: '💰 Solicitar cotización', value: 'cotizar'   },
        { label: '🕐 Horarios',             value: 'horarios'  },
        { label: '📞 Contacto',             value: 'contacto'  },
        { label: '📍 Cobertura',            value: 'cobertura' },
      ]
    },
    wa: null,
    cotizar: null,
  }
};

/* ── 4. PALABRAS CLAVE ────────────────────────────────────── */
const INTENT_MAP = [
  { keywords: ['servicio','qué hacen','ofrecen','soluciones'],                          intent: 'servicios'       },
  { keywords: ['cámara','camaras','cctv','dvr','nvr','videovigilancia'],                intent: 'info_camaras'    },
  { keywords: ['alarma','sensor','sirena','detector'],                                  intent: 'info_alarmas'    },
  { keywords: ['red','redes','wifi','wi-fi','cableado','switch','router','lan','wan'],  intent: 'info_redes'      },
  { keywords: ['eléctric','electrico','electricidad','tablero','breaker'],              intent: 'info_electricidad'},
  { keywords: ['acceso','biometrico','rfid','cerradura','tarjeta'],                    intent: 'info_acceso'     },
  { keywords: ['soporte','computador','pc','laptop','software','windows'],              intent: 'info_soporte'    },
  { keywords: ['horario','horarios','atienden','atención','cuando','abren'],            intent: 'horarios'        },
  { keywords: ['contacto','contactar','teléfono','correo','email','llamar'],            intent: 'contacto'        },
  { keywords: ['cobertura','dónde','donde','zona','ciudad','municipio'],                intent: 'cobertura'       },
  { keywords: ['cotiz','precio','costo','cuánto','cuanto','presupuesto','valor'],       intent: 'cotizar'         },
  { keywords: ['hola','buenas','buenos','hi','hey','saludos'],                          intent: 'menu'            },
  { keywords: ['gracias','thank','listo','perfecto','excelente'],                       intent: 'gracias'         },
];

/* ── 5. ESTADO ────────────────────────────────────────────── */
const cbState = {
  isOpen: false,
  hasShownWelcome: false,
  processing: false,   // evita doble disparo de botones
  /*
   * Pasos del flujo de cotización:
   * idle → cot_subproducto → cot_modalidad →
   * cot_nombre → cot_correo → cot_tel → cot_ciudad → idle
   */
  step:    'idle',
  cotData: {},
};

/* ── 6. INYECCIÓN DE HTML ─────────────────────────────────── */
function cbInjectHTML() {
  const css = document.createElement('link');
  css.rel  = 'stylesheet';
  css.href = 'chatbot.css';
  document.head.appendChild(css);

  document.body.insertAdjacentHTML('beforeend', `
  <button id="cb-toggle" aria-label="Abrir asistente virtual Pazgo" title="Asistente virtual Pazgo">
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

  <div id="cb-window" role="dialog" aria-label="Chat de asistencia Pazgo">
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
        <button class="cb-icon-btn" id="cb-restart" title="Reiniciar" aria-label="Reiniciar conversación">
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
      <input type="text" id="cb-input" placeholder="Escribe tu mensaje..." maxlength="300" autocomplete="off" aria-label="Escribe tu mensaje"/>
      <button id="cb-send" aria-label="Enviar">
        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path d="M2 10 L18 2 L14 10 L18 18 Z"/>
        </svg>
      </button>
    </div>
  </div>`);
}

/* ── 7. UTILIDADES ────────────────────────────────────────── */
const cbTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};
const cbDelay   = () => CB_DELAY_MIN + Math.random() * (CB_DELAY_MAX - CB_DELAY_MIN);
const cbScroll  = () => { const m = document.getElementById('cb-messages'); if (m) m.scrollTop = m.scrollHeight; };
const cbIsEmail = v  => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const cbIsPhone = v  => /^(\+?57)?[3][0-9]{9}$|^[0-9]{7,10}$/.test(v.replace(/\s/g,''));

/* ── 8. RENDER ────────────────────────────────────────────── */
function cbAddMessage(html, role = 'bot', options = []) {
  const msgs = document.getElementById('cb-messages');
  if (!msgs) return;

  const wrap   = document.createElement('div');
  wrap.className = `cb-msg ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'cb-bubble';
  bubble.innerHTML = html.replace(/\n/g, '<br>');

  const time = document.createElement('div');
  time.className   = 'cb-time';
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
        // Evitar doble disparo
        if (btn.dataset.clicked) return;
        btn.dataset.clicked = '1';
        optWrap.querySelectorAll('.cb-opt-btn').forEach(b => b.disabled = true);

        cbAddMessage(o.label, 'user');
        optWrap.remove();
        cbHandleIntent(o.value);
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

function cbBotRespond(html, options = []) {
  cbShowTyping(true);
  setTimeout(() => {
    cbShowTyping(false);
    cbAddMessage(html, 'bot', options);
  }, cbDelay());
}

/* ── 9. ABRIR WHATSAPP ────────────────────────────────────── */
function cbOpenWA(msg) {
  const a = document.createElement('a');
  a.href   = `https://wa.me/${CB_WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  a.target = '_blank';
  a.rel    = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ── 10. INTENCIONES ──────────────────────────────────────── */
function cbHandleIntent(intent) {

  /* — WhatsApp directo — */
  if (intent === 'wa') {
    cbOpenWA('Hola Pazgo, me gustaría obtener información sobre sus servicios.');
    cbBotRespond('Te estamos redirigiendo a WhatsApp 📲. Un asesor te atenderá pronto.', [
      { label: '🏠 Menú', value: 'menu' }
    ]);
    return;
  }

  /* — Cotización genérica: preguntar qué servicio — */
  if (intent === 'cotizar') {
    cbBotRespond('¿Para cuál servicio deseas la cotización?', [
      { label: '📹 Cámaras',           value: 'cotizar_camaras'       },
      { label: '🔔 Alarmas',           value: 'cotizar_alarmas'       },
      { label: '🌐 Redes',             value: 'cotizar_redes'         },
      { label: '⚡ Electricidad',      value: 'cotizar_electricidad'  },
      { label: '🔐 Control de acceso', value: 'cotizar_acceso'        },
      { label: '💻 Soporte técnico',   value: 'cotizar_soporte'       },
    ]);
    return;
  }

  /* — Cotización de un servicio específico: mostrar subproductos — */
  if (intent.startsWith('cotizar_')) {
    const srvKey = intent.replace('cotizar_', '');
    const cat    = CB_CATALOGO[srvKey];
    if (cat) {
      cbState.step            = 'cot_subproducto';
      cbState.cotData         = { servicioKey: srvKey, servicio: cat.nombre };
      cbBotRespond(
        `${cat.emoji} <b>${cat.nombre}</b>\n\n¿Qué producto o solución te interesa?`,
        cat.items
      );
      return;
    }
  }

  /* — Selección interna de subproducto (prefijo __sub_) — */
  if (intent.startsWith('__sub_')) {
    const producto = decodeURIComponent(intent.replace('__sub_', ''));
    cbState.cotData.producto = producto;
    cbState.step             = 'cot_modalidad';
    cbBotRespond(
      `Excelente elección: <b>${producto}</b> ✅\n\n¿Cómo prefieres el servicio?`,
      [
        { label: '🏗️ Todo costo — Materiales + Mano de obra', value: '__mod_todo'  },
        { label: '🔧 Solo mano de obra — Yo pongo los materiales', value: '__mod_mano' },
      ]
    );
    return;
  }

  /* — Selección de modalidad (prefijo __mod_) — */
  if (intent.startsWith('__mod_')) {
    const modalidad = intent === '__mod_todo'
      ? 'Todo costo (materiales + mano de obra)'
      : 'Solo mano de obra (cliente provee materiales)';
    cbState.cotData.modalidad = modalidad;
    cbState.step              = 'cot_nombre';
    cbBotRespond(`Perfecto, <b>${modalidad}</b> ✅\n\nAhora necesito tus datos para enviar la cotización.\n\n¿Cuál es tu <b>nombre completo</b>?`);
    return;
  }

  /* — Gracias — */
  if (intent === 'gracias') {
    cbBotRespond('¡Con gusto! 😊 Si necesitas algo más, aquí estaré.', KB.responses.menu.options);
    return;
  }

  /* — Respuestas del KB — */
  const resp = KB.responses[intent];
  if (resp) {
    cbBotRespond(resp.text, resp.options);
  } else {
    cbBotRespond(
      '🤔 No encontré información sobre eso. Puedo ayudarte con servicios, cotizaciones, horarios y contacto.',
      KB.responses.menu.options
    );
  }
}

/* ── 11. DETECCIÓN DE INTENCIÓN POR TEXTO LIBRE ──────────── */
function cbDetectIntent(text) {
  const n = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const e of INTENT_MAP) {
    for (const kw of e.keywords) {
      if (n.includes(kw)) return e.intent;
    }
  }
  return null;
}

/* ── 12. FLUJO DE COTIZACIÓN (pasos de texto libre) ──────── */
function cbHandleCotStep(text) {
  const t = text.trim();

  switch (cbState.step) {

    case 'cot_nombre':
      if (t.length < 2) { cbBotRespond('Por favor ingresa un nombre válido.'); return; }
      cbState.cotData.nombre = t;
      cbState.step = 'cot_correo';
      cbBotRespond(`Gracias, <b>${t}</b> 👍\n\n¿Cuál es tu <b>correo electrónico</b>?`);
      break;

    case 'cot_correo':
      if (!cbIsEmail(t)) { cbBotRespond('Ese correo no es válido. Ejemplo: <b>nombre@empresa.com</b>'); return; }
      cbState.cotData.correo = t;
      cbState.step = 'cot_tel';
      cbBotRespond('Perfecto ✉️\n\n¿Cuál es tu <b>número de WhatsApp o teléfono</b>?');
      break;

    case 'cot_tel':
      if (!cbIsPhone(t)) { cbBotRespond('Número no válido. Ingresa un celular de 10 dígitos, ej: <b>3115916633</b>'); return; }
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

/* ── 13. ENVÍO FINAL DE COTIZACIÓN ───────────────────────── */
function cbEnviarCotizacion() {
  const d = cbState.cotData;
  const waMsg =
    `🔔 *Nueva Cotización - Pazgo Tecnología*\n\n` +
    `📋 *Servicio:* ${d.servicio || '—'}\n` +
    `🔵 *Producto:* ${d.producto || '—'}\n` +
    `⚙️ *Modalidad:* ${d.modalidad || '—'}\n` +
    `👤 *Nombre:* ${d.nombre}\n` +
    `✉️ *Correo:* ${d.correo}\n` +
    `📱 *Teléfono:* ${d.telefono}\n` +
    `📍 *Ciudad:* ${d.ciudad}`;

  cbOpenWA(waMsg);

  cbBotRespond(
    `✅ <b>¡Muchas gracias, ${d.nombre}!</b>\n\nHemos recibido tu solicitud de cotización:\n\n` +
    `🔵 <b>${d.producto || d.servicio}</b>\n` +
    `⚙️ ${d.modalidad}\n` +
    `📍 ${d.ciudad}\n\n` +
    `Un asesor de Pazgo se pondrá en contacto contigo al <b>${d.telefono}</b> pronto. ¡Que tengas un excelente día! 😊`,
    [
      { label: '🏠 Menú principal',  value: 'menu' },
      { label: '💬 Ir a WhatsApp',   value: 'wa'   },
    ]
  );
}

/* ── 14. PROCESAMIENTO DE MENSAJE DEL USUARIO ────────────── */
function cbProcessMessage(raw) {
  const text = raw.trim();
  if (!text) return;

  cbAddMessage(text, 'user');
  const input = document.getElementById('cb-input');
  if (input) input.value = '';

  /* Estamos en un paso del flujo de cotización */
  if (cbState.step !== 'idle') {
    /* Selección de subproducto por botón */
    if (cbState.step === 'cot_subproducto') {
      cbState.cotData.producto = text;
      cbState.step = 'cot_modalidad';
      cbBotRespond(
        `Excelente elección: <b>${text}</b> ✅\n\n¿Cómo prefieres el servicio?`,
        [
          { label: '🏗️ Todo costo — Materiales + Mano de obra',       value: '__mod_todo'  },
          { label: '🔧 Solo mano de obra — Yo pongo los materiales',   value: '__mod_mano'  },
        ]
      );
      return;
    }
    cbHandleCotStep(text);
    return;
  }

  /* Detección de intención libre */
  const intent = cbDetectIntent(text);
  cbHandleIntent(intent || '__unknown__');
}

/* ── 15. TOGGLE ───────────────────────────────────────────── */
function cbToggle() {
  cbState.isOpen = !cbState.isOpen;
  const win   = document.getElementById('cb-window');
  const badge = document.getElementById('cb-badge');
  const iO    = document.getElementById('cb-icon-open');
  const iC    = document.getElementById('cb-icon-close');

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
  cbState.step    = 'idle';
  cbState.cotData = {};
  cbState.hasShownWelcome = false;
  setTimeout(() => cbBotRespond(KB.welcome.text, KB.welcome.options), 300);
}

/* ── 16. INIT ─────────────────────────────────────────────── */
function cbInit() {
  cbInjectHTML();
  setTimeout(() => {
    document.getElementById('cb-toggle') ?.addEventListener('click', cbToggle);
    document.getElementById('cb-minimize')?.addEventListener('click', cbToggle);
    document.getElementById('cb-restart') ?.addEventListener('click', cbRestart);
    document.getElementById('cb-send')    ?.addEventListener('click', () => {
      cbProcessMessage(document.getElementById('cb-input')?.value || '');
    });
    document.getElementById('cb-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); cbProcessMessage(e.target.value); }
    });

    /* Captura clics en botones de opciones del catálogo (__sub_ / __mod_) */
    // NOTA: los botones __sub_ y __mod_ ya son manejados por el listener
    // individual en cbAddMessage. Este listener global solo es un fallback
    // para casos donde el botón no tenga listener propio.
    // Se elimina para evitar doble disparo.

  }, 120);
}

/* Ajustar botones de catálogo para usar prefijo __sub_ */
(function patchCatalogoOptions() {
  Object.values(CB_CATALOGO).forEach(cat => {
    cat.items = cat.items.map(item => ({
      label: item.label,
      value: `__sub_${encodeURIComponent(item.value)}`
    }));
  });
})();

/* ── ARRANQUE ─────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cbInit);
} else {
  cbInit();
}
