/* ============================================================
   PAZGO — Chatbot flotante
   Archivo: chatbot.js
   Vanilla JS puro, sin frameworks ni dependencias externas.
   ============================================================ */

'use strict';

/* ── 1. CONSTANTES DE CONFIGURACIÓN ───────────────────────── */
const CB_WA_NUMBER = '573115916633';
const CB_DELAY_MIN = 700;   // ms mínimo antes de responder
const CB_DELAY_MAX = 1400;  // ms máximo antes de responder

/* ── 2. BASE DE CONOCIMIENTO ──────────────────────────────── */
const KB = {

  /* Mensaje de bienvenida */
  welcome: {
    text: 'Hola 👋, soy el asistente virtual de <strong>Pazgo Tecnología</strong>. Estoy aquí para ayudarte con información sobre nuestros servicios y para ayudarte a solicitar una cotización.\n\n¿En qué puedo ayudarte hoy?',
    options: [
      { label: '🛠️ Servicios',           value: 'servicios'   },
      { label: '💰 Solicitar cotización', value: 'cotizar'     },
      { label: '🕐 Horarios',             value: 'horarios'    },
      { label: '📞 Contacto',             value: 'contacto'    },
      { label: '📍 Cobertura',            value: 'cobertura'   },
    ]
  },

  /* Respuestas por intención */
  responses: {

    servicios: {
      text: 'Ofrecemos soluciones tecnológicas integrales:\n\n⚡ <b>Electricidad</b> — Residencial e industrial\n📹 <b>Cámaras de seguridad</b> — Instalación y mantenimiento CCTV/IP\n🔔 <b>Alarmas</b> — Sistemas inalámbricos y cableados\n🌐 <b>Redes y cableado estructurado</b> — LAN/WAN, Cat6, Wi-Fi\n🔐 <b>Control de acceso</b> — Biométrico, RFID, magnético\n📡 <b>Telecomunicaciones</b> — Fibra óptica, enlaces\n💻 <b>Soporte técnico</b> — Nivel 1 y 2, preventivo y correctivo\n\n¿Quieres saber más sobre alguno?',
      options: [
        { label: '📹 Cámaras',        value: 'camaras'    },
        { label: '🔔 Alarmas',        value: 'alarmas'    },
        { label: '🌐 Redes',          value: 'redes'      },
        { label: '⚡ Electricidad',   value: 'electrico'  },
        { label: '💰 Cotizar',        value: 'cotizar'    },
      ]
    },

    camaras: {
      text: '📹 <b>Instalación de cámaras de seguridad:</b>\n\nInstalamos sistemas CCTV e IP para hogares, conjuntos residenciales y empresas. Trabajamos con cámaras domo, bala, PTZ y sistemas con grabador DVR/NVR.\n\nIncluye: instalación, configuración de acceso remoto y asesoría en puntos estratégicos.\n\n¿Te gustaría solicitar una cotización?',
      options: [
        { label: '💰 Sí, cotizar',    value: 'cotizar'  },
        { label: '🔙 Ver más servicios', value: 'servicios' },
      ]
    },

    alarmas: {
      text: '🔔 <b>Sistemas de alarma:</b>\n\nInstalamos alarmas perimetrales, detectores de movimiento, sensores de humo, CO₂ y más. Disponibles en modalidad inalámbrica y cableada con monitoreo 24/7.\n\n¿Te gustaría solicitar una cotización?',
      options: [
        { label: '💰 Sí, cotizar',       value: 'cotizar'   },
        { label: '🔙 Ver más servicios', value: 'servicios' },
      ]
    },

    redes: {
      text: '🌐 <b>Redes y cableado estructurado:</b>\n\nDiseñamos e instalamos redes LAN/WAN, cableado Cat5e/Cat6 certificado, switches, routers, Wi-Fi mesh y sistemas de telecomunicaciones.\n\n¿Te gustaría solicitar una cotización?',
      options: [
        { label: '💰 Sí, cotizar',       value: 'cotizar'   },
        { label: '🔙 Ver más servicios', value: 'servicios' },
      ]
    },

    electrico: {
      text: '⚡ <b>Electricidad residencial e industrial:</b>\n\nRealizamos instalaciones eléctricas nuevas, mantenimiento preventivo y correctivo, tableros de distribución, puesta a tierra, automatización y domótica.\n\n¿Te gustaría solicitar una cotización?',
      options: [
        { label: '💰 Sí, cotizar',       value: 'cotizar'   },
        { label: '🔙 Ver más servicios', value: 'servicios' },
      ]
    },

    horarios: {
      text: '🕐 <b>Horario de atención:</b>\n\nLunes a viernes: <b>8:00 a.m. – 5:00 p.m.</b>\nSábados: <b>8:00 a.m. – 12:00 m.</b>\n\nFuera de horario puedes escribirnos por WhatsApp y te responderemos lo antes posible. ¿En qué más puedo ayudarte?',
      options: [
        { label: '📞 Contacto',          value: 'contacto' },
        { label: '💰 Solicitar cotización', value: 'cotizar' },
        { label: '🏠 Menú principal',    value: 'menu'     },
      ]
    },

    contacto: {
      text: '📞 <b>Medios de contacto Pazgo:</b>\n\n📱 WhatsApp: <b>+57 311 591 6633</b>\n✉️ Correo: <b>juandapaez24@gmail.com</b>\n📍 Ubicación: <b>Soacha, Cundinamarca</b>\n\n¿Prefieres que un asesor te contacte? Puedo tomar tus datos ahora.',
      options: [
        { label: '✅ Sí, que me contacten', value: 'cotizar'  },
        { label: '💬 Ir a WhatsApp',        value: 'wa'       },
        { label: '🏠 Menú principal',        value: 'menu'     },
      ]
    },

    cobertura: {
      text: '📍 <b>Cobertura de Pazgo:</b>\n\nActualmente operamos principalmente en <b>Soacha y Bogotá</b>, con capacidad de atender proyectos en la región Cundinamarca.\n\nPara proyectos fuera de esta zona, consúltanos directamente. ¿En qué más puedo ayudarte?',
      options: [
        { label: '💰 Solicitar cotización', value: 'cotizar' },
        { label: '📞 Contactar asesor',     value: 'contacto' },
        { label: '🏠 Menú principal',       value: 'menu'     },
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

    wa: null, // especial: abre WhatsApp
    cotizar: null, // especial: inicia flujo de cotización
  }
};

/* ── 3. PALABRAS CLAVE para detección de intención ─────────── */
const INTENT_MAP = [
  { keywords: ['servicio','qué hacen','qué ofrecen','ofrecen','oferta','soluciones'], intent: 'servicios'  },
  { keywords: ['cámara','camaras','cctv','dvr','nvr','videovigilancia','vigilancia'],  intent: 'camaras'    },
  { keywords: ['alarma','sensor','sirena','detector','movimiento'],                    intent: 'alarmas'    },
  { keywords: ['red','redes','wifi','wi-fi','cable','cableado','switch','router','lan','wan'], intent: 'redes' },
  { keywords: ['eléctric','electrico','electricidad','tablero','breaker','corriente','tomacorriente'], intent: 'electrico' },
  { keywords: ['horario','horarios','atienden','atención','cuando','cuándo','abren'],  intent: 'horarios'   },
  { keywords: ['contacto','contactar','teléfono','correo','email','llamar','número'],  intent: 'contacto'   },
  { keywords: ['cobertura','dónde','donde','zona','ciudad','municipio','ubicación'],   intent: 'cobertura'  },
  { keywords: ['cotiz','precio','costo','cuánto','cuanto','presupuesto','valor'],      intent: 'cotizar'    },
  { keywords: ['hola','buenas','buenos','hi','hey','saludos'],                         intent: 'menu'       },
  { keywords: ['gracias','thank','listo','ok','perfecto','excelente'],                 intent: 'gracias'    },
];

/* ── 4. ESTADO DEL CHATBOT ────────────────────────────────── */
const cbState = {
  isOpen:    false,
  step:      'idle',      // idle | cot_nombre | cot_correo | cot_tel | cot_servicio | cot_ciudad
  cotData:   {},
  hasShownWelcome: false,
};

/* ── 5. INYECCIÓN DEL HTML ────────────────────────────────── */
function cbInjectHTML() {
  const css = document.createElement('link');
  css.rel  = 'stylesheet';
  css.href = 'chatbot.css';
  document.head.appendChild(css);

  const html = `
  <!-- Botón flotante del chatbot -->
  <button id="cb-toggle" aria-label="Abrir asistente virtual Pazgo" title="Asistente virtual">
    <div id="cb-badge">1</div>
    <!-- Ícono robot / asistente -->
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
    <!-- Ícono X (cerrar) -->
    <svg id="cb-icon-close" viewBox="0 0 24 24" fill="none" width="22" height="22" style="display:none">
      <path d="M6 6 L18 18 M18 6 L6 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </button>

  <!-- Ventana del chat -->
  <div id="cb-window" role="dialog" aria-label="Chat de asistencia Pazgo">

    <!-- Header -->
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
        <div class="cb-header-status">
          <span class="cb-status-dot"></span> En línea
        </div>
      </div>
      <div class="cb-header-actions">
        <!-- Reiniciar conversación -->
        <button class="cb-icon-btn" id="cb-restart" title="Reiniciar conversación" aria-label="Reiniciar">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M3 9 A6 6 0 1 1 6 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M3 5 L3 9 L7 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- Minimizar -->
        <button class="cb-icon-btn" id="cb-minimize" title="Minimizar" aria-label="Minimizar">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M4 9 H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mensajes -->
    <div id="cb-messages" aria-live="polite"></div>

    <!-- Indicador "escribiendo" -->
    <div id="cb-typing" role="status" aria-label="El asistente está escribiendo">
      <span></span><span></span><span></span>
    </div>

    <!-- Input -->
    <div id="cb-input-area">
      <input
        type="text"
        id="cb-input"
        placeholder="Escribe tu mensaje..."
        maxlength="300"
        autocomplete="off"
        aria-label="Escribe tu mensaje"
      />
      <button id="cb-send" aria-label="Enviar mensaje">
        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path d="M2 10 L18 2 L14 10 L18 18 Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>`;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
}

/* ── 6. UTILIDADES ────────────────────────────────────────── */

/** Hora actual formateada HH:MM */
function cbTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' +
         d.getMinutes().toString().padStart(2,'0');
}

/** Retraso aleatorio para simular respuesta humana */
function cbDelay() {
  return CB_DELAY_MIN + Math.random() * (CB_DELAY_MAX - CB_DELAY_MIN);
}

/** Scroll al final del chat */
function cbScrollBottom() {
  const msgs = document.getElementById('cb-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

/** Valida correo electrónico */
function cbValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/** Valida teléfono colombiano (7-10 dígitos, puede incluir +57) */
function cbValidPhone(v) {
  return /^(\+?57)?[3][0-9]{9}$|^[0-9]{7,10}$/.test(v.replace(/\s/g,''));
}

/* ── 7. RENDER DE MENSAJES ────────────────────────────────── */

/**
 * Agrega un mensaje al chat
 * @param {string}   text    - HTML o texto del mensaje
 * @param {'bot'|'user'} role
 * @param {Array}    options - botones de respuesta rápida
 */
function cbAddMessage(text, role = 'bot', options = []) {
  const msgs = document.getElementById('cb-messages');
  if (!msgs) return;

  const wrap = document.createElement('div');
  wrap.className = `cb-msg ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'cb-bubble';
  // Permitir HTML seguro para negritas e íconos
  bubble.innerHTML = text.replace(/\n/g, '<br>');

  const time = document.createElement('div');
  time.className = 'cb-time';
  time.textContent = cbTime();

  wrap.appendChild(bubble);
  wrap.appendChild(time);

  // Botones de respuesta rápida
  if (options && options.length > 0) {
    const optWrap = document.createElement('div');
    optWrap.className = 'cb-options';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'cb-opt-btn';
      btn.textContent = opt.label;
      btn.setAttribute('data-value', opt.value);
      btn.addEventListener('click', () => {
        // Muestra la opción seleccionada como mensaje del usuario
        cbAddMessage(opt.label, 'user');
        // Elimina los botones tras seleccionar
        optWrap.remove();
        // Procesa la intención
        cbHandleIntent(opt.value);
      });
      optWrap.appendChild(btn);
    });
    wrap.appendChild(optWrap);
  }

  msgs.appendChild(wrap);
  cbScrollBottom();
}

/** Muestra / oculta el indicador de "escribiendo" */
function cbShowTyping(show) {
  const el = document.getElementById('cb-typing');
  if (!el) return;
  if (show) {
    el.classList.add('visible');
    cbScrollBottom();
  } else {
    el.classList.remove('visible');
  }
}

/** Respuesta del bot con delay y typing indicator */
function cbBotRespond(text, options = []) {
  cbShowTyping(true);
  setTimeout(() => {
    cbShowTyping(false);
    cbAddMessage(text, 'bot', options);
  }, cbDelay());
}

/* ── 8. LÓGICA DE INTENCIONES ─────────────────────────────── */

function cbHandleIntent(intent) {
  switch (intent) {

    /* Abrir WhatsApp directamente */
    case 'wa': {
      const msg = encodeURIComponent('Hola Pazgo, me gustaría obtener información sobre sus servicios.');
      const a   = document.createElement('a');
      a.href    = `https://wa.me/${CB_WA_NUMBER}?text=${msg}`;
      a.target  = '_blank';
      a.rel     = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      cbBotRespond('Te estoy redirigiendo a WhatsApp 📲. Un asesor te atenderá pronto.', [
        { label: '🏠 Menú principal', value: 'menu' }
      ]);
      break;
    }

    /* Iniciar flujo de cotización */
    case 'cotizar': {
      cbState.step    = 'cot_nombre';
      cbState.cotData = {};
      cbBotRespond('¡Perfecto! Voy a tomar tus datos para la cotización.\n\n¿Cuál es tu <b>nombre completo</b>?');
      break;
    }

    /* Respuesta de agradecimiento */
    case 'gracias': {
      cbBotRespond('¡Con gusto! 😊 Si necesitas algo más, aquí estaré. ¿En qué más puedo ayudarte?', KB.responses.menu.options);
      break;
    }

    /* Intenciones con respuesta en KB */
    default: {
      const resp = KB.responses[intent];
      if (resp) {
        cbBotRespond(resp.text, resp.options);
      } else {
        cbBotRespond(
          'Hmm, no entendí bien tu consulta. 🤔 Puedo ayudarte con:\n\n• Información de servicios\n• Solicitar cotización\n• Horarios y contacto\n\n¿Qué necesitas?',
          KB.responses.menu.options
        );
      }
    }
  }
}

/**
 * Detecta intención a partir del texto libre del usuario
 */
function cbDetectIntent(text) {
  const normalized = text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes

  for (const entry of INTENT_MAP) {
    for (const kw of entry.keywords) {
      if (normalized.includes(kw)) return entry.intent;
    }
  }
  return null;
}

/* ── 9. FLUJO DE COTIZACIÓN ───────────────────────────────── */
function cbHandleCotizacionStep(text) {
  const t = text.trim();

  switch (cbState.step) {

    case 'cot_nombre': {
      if (t.length < 2) {
        cbBotRespond('Por favor ingresa un nombre válido.');
        return;
      }
      cbState.cotData.nombre = t;
      cbState.step = 'cot_correo';
      cbBotRespond(`Gracias, <b>${t}</b>. 👍\n\n¿Cuál es tu <b>correo electrónico</b>?`);
      break;
    }

    case 'cot_correo': {
      if (!cbValidEmail(t)) {
        cbBotRespond('Ese correo no parece válido. Ejemplo: <b>nombre@empresa.com</b>');
        return;
      }
      cbState.cotData.correo = t;
      cbState.step = 'cot_tel';
      cbBotRespond('Perfecto ✉️. ¿Cuál es tu <b>número de teléfono o WhatsApp</b>?');
      break;
    }

    case 'cot_tel': {
      if (!cbValidPhone(t)) {
        cbBotRespond('Número no válido. Ingresa un celular colombiano de 10 dígitos, ej: <b>3115916633</b>');
        return;
      }
      cbState.cotData.telefono = t;
      cbState.step = 'cot_servicio';
      cbBotRespond('¿Para qué <b>servicio</b> necesitas la cotización?', [
        { label: '📹 Cámaras',        value: '__srv_camaras'     },
        { label: '🔔 Alarmas',        value: '__srv_alarmas'     },
        { label: '🌐 Redes',          value: '__srv_redes'       },
        { label: '⚡ Electricidad',   value: '__srv_electricidad'},
        { label: '🔐 Control acceso', value: '__srv_acceso'      },
        { label: '💻 Soporte técnico',value: '__srv_soporte'     },
        { label: '🔧 Otro servicio',  value: '__srv_otro'        },
      ]);
      break;
    }

    case 'cot_servicio': {
      cbState.cotData.servicio = t;
      cbState.step = 'cot_ciudad';
      cbBotRespond('¿En qué <b>ciudad o municipio</b> necesitas el servicio?');
      break;
    }

    case 'cot_ciudad': {
      if (t.length < 2) {
        cbBotRespond('Por favor ingresa una ciudad válida.');
        return;
      }
      cbState.cotData.ciudad = t;
      cbState.step = 'idle';

      // Construir mensaje de WhatsApp con los datos
      const d = cbState.cotData;
      const waMsg = `🔔 *Nueva solicitud de cotización - Pazgo Tecnología*\n\n👤 *Nombre:* ${d.nombre}\n✉️ *Correo:* ${d.correo}\n📱 *Teléfono:* ${d.telefono}\n🛠️ *Servicio:* ${d.servicio}\n📍 *Ciudad:* ${d.ciudad}`;

      // Abrir WhatsApp en segundo plano
      const a = document.createElement('a');
      a.href   = `https://wa.me/${CB_WA_NUMBER}?text=${encodeURIComponent(waMsg)}`;
      a.target = '_blank';
      a.rel    = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      cbBotRespond(
        `✅ <b>¡Muchas gracias, ${d.nombre}!</b>\n\nHemos recibido tu solicitud para <b>${d.servicio}</b> en <b>${d.ciudad}</b>.\n\nUn asesor de Pazgo se pondrá en contacto contigo pronto al número <b>${d.telefono}</b>.\n\n¡Que tengas un excelente día! 😊`,
        [
          { label: '🏠 Menú principal', value: 'menu' },
          { label: '💬 Ir a WhatsApp',  value: 'wa'   },
        ]
      );
      break;
    }
  }
}

/* ── 10. PROCESAMIENTO DE MENSAJE DEL USUARIO ─────────────── */
function cbProcessUserMessage(raw) {
  const text = raw.trim();
  if (!text) return;

  // Mostrar mensaje del usuario
  cbAddMessage(text, 'user');

  // Limpiar input
  const input = document.getElementById('cb-input');
  if (input) input.value = '';

  // Si estamos en flujo de cotización
  if (cbState.step !== 'idle') {
    // Manejar selección de servicio por botón (prefijo __srv_)
    if (text.startsWith('__srv_')) {
      const servicioMap = {
        '__srv_camaras':      'Cámaras de seguridad',
        '__srv_alarmas':      'Alarmas',
        '__srv_redes':        'Redes y cableado estructurado',
        '__srv_electricidad': 'Electricidad',
        '__srv_acceso':       'Control de acceso',
        '__srv_soporte':      'Soporte técnico',
        '__srv_otro':         'Otro',
      };
      cbState.cotData.servicio = servicioMap[text] || text;
      cbState.step = 'cot_ciudad';
      cbBotRespond('¿En qué <b>ciudad o municipio</b> necesitas el servicio?');
      return;
    }
    cbHandleCotizacionStep(text);
    return;
  }

  // Detectar intención
  const intent = cbDetectIntent(text);
  if (intent) {
    cbHandleIntent(intent);
  } else {
    cbBotRespond(
      'No encontré información sobre eso. 🤔\n\nRecuerda que puedo ayudarte con servicios, cotizaciones, horarios, contacto y cobertura. ¿Qué necesitas?',
      KB.responses.menu.options
    );
  }
}

/* ── 11. TOGGLE Y CONTROL DEL CHAT ───────────────────────── */
function cbToggle() {
  cbState.isOpen = !cbState.isOpen;
  const win    = document.getElementById('cb-window');
  const badge  = document.getElementById('cb-badge');
  const iconO  = document.getElementById('cb-icon-open');
  const iconC  = document.getElementById('cb-icon-close');

  if (cbState.isOpen) {
    win.classList.add('cb-open');
    iconO.style.display = 'none';
    iconC.style.display = '';
    if (badge) badge.style.display = 'none';

    // Mostrar bienvenida solo la primera vez
    if (!cbState.hasShownWelcome) {
      cbState.hasShownWelcome = true;
      setTimeout(() => {
        cbBotRespond(KB.welcome.text, KB.welcome.options);
      }, 400);
    }

    // Focus al input
    setTimeout(() => {
      const inp = document.getElementById('cb-input');
      if (inp) inp.focus();
    }, 350);

  } else {
    win.classList.remove('cb-open');
    iconO.style.display = '';
    iconC.style.display = 'none';
  }
}

function cbRestart() {
  // Limpiar mensajes
  const msgs = document.getElementById('cb-messages');
  if (msgs) msgs.innerHTML = '';

  // Resetear estado
  cbState.step    = 'idle';
  cbState.cotData = {};
  cbState.hasShownWelcome = false;

  // Mostrar bienvenida de nuevo
  setTimeout(() => {
    cbBotRespond(KB.welcome.text, KB.welcome.options);
  }, 300);
}

/* ── 12. INICIALIZACIÓN ───────────────────────────────────── */
function cbInit() {
  cbInjectHTML();

  // Esperar que el DOM esté listo tras la inyección
  setTimeout(() => {
    const toggle   = document.getElementById('cb-toggle');
    const minimize = document.getElementById('cb-minimize');
    const restart  = document.getElementById('cb-restart');
    const sendBtn  = document.getElementById('cb-send');
    const input    = document.getElementById('cb-input');

    if (toggle)   toggle.addEventListener('click', cbToggle);
    if (minimize) minimize.addEventListener('click', cbToggle);
    if (restart)  restart.addEventListener('click', cbRestart);

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const v = document.getElementById('cb-input')?.value || '';
        cbProcessUserMessage(v);
      });
    }

    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          cbProcessUserMessage(input.value);
        }
      });
    }

    // Interceptar clics en botones de opción rápida que usen __srv_ (cotización)
    document.addEventListener('click', e => {
      const btn = e.target.closest('.cb-opt-btn');
      if (!btn) return;
      const val = btn.getAttribute('data-value');
      if (!val || !val.startsWith('__srv_')) return;
      // Mostrar el label como mensaje del usuario
      cbAddMessage(btn.textContent, 'user');
      btn.closest('.cb-options')?.remove();
      cbProcessUserMessage(val);
    });

  }, 100);
}

/* ── 13. ARRANQUE ─────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cbInit);
} else {
  cbInit();
}
