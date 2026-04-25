// ============================================
// data-productos.js - Base de datos de productos
// Edita AQUÍ las imágenes, precios, nombres, etc.
// ============================================

const PRODUCTOS_DATA = [
  {
    "id": 1,
    "name": "DAHUA IPC-B1E40 - Cámara IP Bullet 4MP",
    "category": "Camaras",
    "price": 1358.55,
    "originalPrice": 0,
    "stock": 18,
    "emoji": "📷",
    "image": "img/DAHUA-DHT0030179-CAMARA-BULLET-4MP-PRINCIPAL-TVC.png",
    "desc": "Resolución 4K Ultra HD, visión nocturna a color, detección de movimiento con IA, IP67.",
    "stars": 4.9,
    "reviews": 128,
    "badge": "Más vendido",
    "featured": true,
    "brand": "DAHUA",
    "model": "DH-IPC-B1E40",
    "tvcKey": "DHT0030179",
    "satKey": "46171610",
    "warrantyMonths": 12,
    "fullDescription": "​La cámara Dahua Serie ECO está diseñada para ofrecer una experiencia de videovigilancia sencilla y práctica.Su funcionalidad plug and play permite generar imágenes de inmediato al conectarla a un NVR Dahua.Además, admite monitoreo remoto a través de la aplicación móvil de Dahua y puede activar alarmas en caso de detección de movimiento, manipulación de video o excepciones de seguridad, brindando un servicio IP conveniente y seguro.",
    "specs": {
      "Resolución": "4 MP",
      "Visión Nocturna": "no",
      "Conectividad": "PoE",
      "Grado IP": "IP67",
      "Resolución": "4K / 8MP",
  "Visión Nocturna": "30 metros",
  "Conectividad": "WiFi + PoE",
  "Grado IP": "IP67",
  "Ángulo de visión": "110°",           // ← NUEVO
  "Compresión de video": "H.265 / H.264", // ← NUEVO
  "Temperatura operativa": "-30°C a 60°C", // ← NUEVO
  "Consumo de energía": "Máx 8W"         // ← NUEVO
    },
    "technicalDetails": [
      "Resolución: 4K / 8MP",
      "Visión Nocturna: 30 metros",
      "Conectividad: PoE",
      "Grado IP: IP67",
      "Resolución: 4K / 8MP",
  "Visión Nocturna: 30 metros",
  "Conectividad: WiFi + PoE",
  "Grado IP: IP67",
  "Ángulo de visión: 110°",                    // ← NUEVO
  "Lente: 2.8mm fija",                         // ← NUEVO
  "Sensor: CMOS 1/2.5 pulgadas",               // ← NUEVO
  "Relación señal/ruido: >50dB",               // ← NUEVO
  "Detección de movimiento: 3 zonas ajustables", // ← NUEVO
  "Protocolos soportados: TCP/IP, HTTP, DHCP", // ← NUEVO
  "Compatibilidad: ONVIF Profile S/G"          // ← NUEVO
    ]
  },
  {
    "id": 2,
    "name": "ZKTECO Horus-E1 - Control de Asistencia Visible Light portátil con Autenticación Facial (6000 Rostros), Registro de 100,000 Eventos, Batería de Respaldo, Conectividad Wifi y Chip 4G #ZKL #CM1 #HD8",
    "category": "Control",
    "price": 55007.04,
    "originalPrice": 0,
    "stock": 24,
    "emoji": "📡",
    "image": "img/Control-Asistencia-Reconocimiento-Facial-Visible-Light-HorusE1-ZKTeco-Secundaria-convertido-de-webp.png",
    "desc": "Cobertura de 250m², velocidad AX3000, hasta 200 dispositivos simultáneos, WPA3.",
    "stars": 4.8,
    "reviews": 87,
    "badge": "Nuevo",
    "featured": true,
    "brand": "ZKTECO",
    "model": "HORUS-E1 - Bat",
    "tvcKey": "ZKT0810023",
    "satKey": "46171619",
    "warrantyMonths": 12,
    "fullDescription": "La tecnología de autenticación facial por luz visible ha transformado la experiencia biométrica. ZKTeco, líder en la industria, presenta el Horus E1, un terminal portátil para el control de asistencia que ofrece más de 8 horas de funcionamiento con una carga completa en 5-6 horas. Con un diseño compacto, el Horus E1 permite una autenticación de hasta 3 metros y cuenta con una tolerancia de ángulo amplia. Además, garantiza alta resistencia a intentos de suplantación, asegurando la seguridad en el registro de asistencia.Este terminal es compatible con múltiples protocolos de comunicación, incluyendo 4G, y cuenta con función de posicionamiento, lo que permite una integración fácil en cualquier entorno de trabajo. Mejora la gestión de asistencia en tu empresa con el Horus E1, la solución biométrica más avanzada del mercado. ",
    "specs": {
      "Estándar": "WiFi, G4",
      "Velocidad": "3000 Mbps",
      "Cobertura": "250 m²",
      "Puertos": "0",
      "Autenticación Facial" : "0", 	
      "Biometría Dactilar": "0",
      "Entrada Wiegand": "0",
      "Registro por Contraseña": "0",
        "Verificación por Palma":"0",
        "Conexión Ethernet":"0",
        "Conexión Wifi":"0",
        "Entrada Auxiliar":"0",	
        "Entrada Botón de Salida":"0",	
        "Entrada RS485":"0",
        "Entrada Sensor de Puerta":"0",
        "Entrada Wiegand":"0",
        "Salida Auxiliar":"0",
        "Salida de Alarma":"0",	
        "Salida Wiegand	":"0",
        "Conexión RS232 (para Impresora)":"0",
        "Modo de Funcionamiento	":"0",
        "Control de Asistencia	":"0",
        "Función SSR":"0",
        "Grado de protección IK":"0",	
        "Grado de protección IP":"0"

      
    },
    "technicalDetails": [
      "Pantalla: 720 x 1080 LCD táctil IPS",
      "Temperatura de Operación: 0°c a 45°c",
      "Dimensiones: 160.6 * 76.6 * 34.7 mm",
      "Sistema: Android 8.1",
      "Cámara: 2MP Dual",
      "Batería:",
      "Puertos: 4x Gigabit LAN",
      "Capacidad: 4300 mAh",
      "Voltaje nominal: 7.4V",
      "Salida: 12±0.5V 1.5A"
    ]
  },
  {
    "id": 3,
    "name": "NVR 16 Canales 4K",
    "category": "NVR",
    "price": 4299,
    "originalPrice": 4999,
    "stock": 9,
    "emoji": "💾",
    "image": "img/toshiba.png",
    "desc": "Grabador de red 16 canales, compatible H.265+, soporta hasta 16TB, acceso remoto.",
    "stars": 4.7,
    "reviews": 54,
    "badge": "",
    "featured": true,
    "brand": "TOSHIBA",
    "model": "NVR-0003",
    "tvcKey": "sz0000003",
    "satKey": "46171621",
    "warrantyMonths": 18,
    "fullDescription": "Solución de grabación para proyectos medianos y grandes, con acceso remoto y gran capacidad de almacenamiento.",
    "specs": {
      "Canales": "16",
      "Almacenamiento": "Hasta 16TB",
      "Codificación": "H.265+",
      "Salida Video": "HDMI 4K"
    },
    "technicalDetails": [
      "Canales: 16",
      "Almacenamiento: Hasta 16TB",
      "Codificación: H.265+",
      "Salida Video: HDMI 4K"
    ]
  },
  {
    "id": 4,
    "name": "Camara PTZ 360° Outdoor",
    "category": "Camaras",
    "price": 3199,
    "originalPrice": null,
    "stock": 7,
    "emoji": "🎥",
    "image": "img/vivotek.png",
    "desc": "Paneo/inclinación motorizado 360°, zoom óptico 20x, seguimiento automático de personas.",
    "stars": 4.8,
    "reviews": 43,
    "badge": "Premium",
    "featured": true,
    "brand": "VIVOTEK",
    "model": "CAM-0004",
    "tvcKey": "sz0000004",
    "satKey": "46171610",
    "warrantyMonths": 12,
    "fullDescription": "Cámara PTZ para monitoreo avanzado en patios, bodegas, estacionamientos y proyectos de vigilancia profesional.",
    "specs": {
      "Zoom Óptico": "20x",
      "Rotación": "360° Pan",
      "Resolución": "5MP",
      "Seguimiento": "Automático IA"
    },
    "technicalDetails": [
      "Zoom Óptico: 20x",
      "Rotación: 360° Pan",
      "Resolución: 5MP",
      "Seguimiento: Automático IA"
    ]
  },
  {
    "id": 5,
    "name": "Router VPN Empresarial AC5400",
    "category": "Routers",
    "price": 3599,
    "originalPrice": 3999,
    "stock": 10,
    "emoji": "🌐",
    "image": "img/tplink.png",
    "desc": "Tri-banda AC5400, servidor VPN integrado, QoS avanzado, ideal para oficinas y PYMES.",
    "stars": 4.6,
    "reviews": 31,
    "badge": "",
    "featured": false,
    "brand": "TP-LINK",
    "model": "RTR-0005",
    "tvcKey": "sz0000005",
    "satKey": "43222609",
    "warrantyMonths": 24,
    "fullDescription": "Router empresarial para tráfico constante, múltiples equipos conectados y administración más fina de la red.",
    "specs": {
      "Estándar": "AC5400 Tri-banda",
      "VPN": "OpenVPN / IPSec",
      "CPU": "Quad-core 1.8GHz",
      "RAM": "512MB"
    },
    "technicalDetails": [
      "Estándar: AC5400 Tri-banda",
      "VPN: OpenVPN / IPSec",
      "CPU: Quad-core 1.8GHz",
      "RAM: 512MB"
    ]
  },
  {
    "id": 6,
    "name": "Sistema de Alarma WiFi 32 Zonas",
    "category": "Alarmas",
    "price": 2799,
    "originalPrice": 3199,
    "stock": 14,
    "emoji": "🚨",
    "image": "img/dsc.png",
    "desc": "Central WiFi/GSM, 32 zonas, notificaciones push, sirena de 110dB, monitoreo 24/7.",
    "stars": 4.7,
    "reviews": 62,
    "badge": "",
    "featured": false,
    "brand": "DSC",
    "model": "ALM-0006",
    "tvcKey": "sz0000006",
    "satKey": "46171604",
    "warrantyMonths": 12,
    "fullDescription": "Sistema de alarma pensado para casas, oficinas y pequeños negocios que necesitan protección constante y alertas inmediatas.",
    "specs": {
      "Zonas": "32 cableadas / 128 inalámbricas",
      "Conectividad": "WiFi + 4G GSM",
      "Sirena": "110 dB",
      "Backup": "Batería 12h"
    },
    "technicalDetails": [
      "Zonas: 32 cableadas / 128 inalámbricas",
      "Conectividad: WiFi + 4G GSM",
      "Sirena: 110 dB",
      "Backup: Batería 12h"
    ]
  },
  {
    "id": 7,
    "name": "Lectora de Huella + Tarjeta RFID",
    "category": "Control",
    "price": 1299,
    "originalPrice": 1599,
    "stock": 16,
    "emoji": "🔐",
    "image": "img/commax.png",
    "desc": "Control de acceso biométrico con 3000 usuarios, historial de eventos, apertura remota.",
    "stars": 4.5,
    "reviews": 78,
    "badge": "Oferta",
    "featured": false,
    "brand": "COMMAX",
    "model": "CTRL-0007",
    "tvcKey": "sz0000007",
    "satKey": "46171619",
    "warrantyMonths": 12,
    "fullDescription": "Controlador de acceso práctico para oficinas, condominios y puntos de entrada que requieren historial y gestión de usuarios.",
    "specs": {
      "Usuarios": "3,000",
      "Tecnología": "Huella + RFID 13.56MHz",
      "Memoria": "100,000 registros",
      "Interfaz": "TCP/IP + RS485"
    },
    "technicalDetails": [
      "Usuarios: 3,000",
      "Tecnología: Huella + RFID 13.56MHz",
      "Memoria: 100,000 registros",
      "Interfaz: TCP/IP + RS485"
    ]
  },
  {
    "id": 8,
    "name": "Camara Interior Baby Monitor 2K",
    "category": "Camaras",
    "price": 899,
    "originalPrice": 1199,
    "stock": 20,
    "emoji": "👶",
    "image": "img/vivotek.png",
    "desc": "Cámara para interiores 2K, audio bidireccional, detector de llanto, app móvil incluida.",
    "stars": 4.6,
    "reviews": 95,
    "badge": "",
    "featured": false,
    "brand": "VIVOTEK",
    "model": "CAM-0008",
    "tvcKey": "sz0000008",
    "satKey": "46171610",
    "warrantyMonths": 12,
    "fullDescription": "Equipo compacto para monitoreo interior con audio, alertas y fácil instalación desde la app.",
    "specs": {
      "Resolución": "2K (2304×1296)",
      "Audio": "Bidireccional",
      "IA": "Detector de llanto",
      "App": "iOS + Android"
    },
    "technicalDetails": [
      "Resolución: 2K (2304×1296)",
      "Audio: Bidireccional",
      "IA: Detector de llanto",
      "App: iOS + Android"
    ]
  },
  {
    "id": 9,
    "name": "Switch PoE 24 Puertos Gigabit",
    "category": "Routers",
    "price": 2199,
    "originalPrice": 2499,
    "stock": 13,
    "emoji": "🔌",
    "image": "img/tplink.png",
    "desc": "Switch PoE+ 24 puertos Gigabit + 4 SFP uplink, presupuesto PoE 370W, administrable.",
    "stars": 4.8,
    "reviews": 22,
    "badge": "",
    "featured": false,
    "brand": "TP-LINK",
    "model": "RTR-0009",
    "tvcKey": "sz0000009",
    "satKey": "43222609",
    "warrantyMonths": 24,
    "fullDescription": "Switch PoE para proyectos de cámaras IP, telefonía y redes empresariales con buena capacidad eléctrica.",
    "specs": {
      "Puertos": "24x PoE+ Gigabit + 4 SFP",
      "PoE Budget": "370W",
      "Conmutación": "48 Gbps",
      "Administración": "Web + SNMP"
    },
    "technicalDetails": [
      "Puertos: 24x PoE+ Gigabit + 4 SFP",
      "PoE Budget: 370W",
      "Conmutación: 48 Gbps",
      "Administración: Web + SNMP"
    ]
  },
  {
    "id": 10,
    "name": "Kit 8 Camaras + NVR 4K",
    "category": "NVR",
    "price": 12999,
    "originalPrice": 15999,
    "stock": 6,
    "emoji": "📦",
    "image": "img/toshiba.png",
    "desc": "Kit completo: 8 cámaras 4K bullet exterior + NVR 8ch + disco duro 2TB preinstalado.",
    "stars": 4.9,
    "reviews": 147,
    "badge": "Kit",
    "featured": true,
    "brand": "TOSHIBA",
    "model": "NVR-0010",
    "tvcKey": "sz0000010",
    "satKey": "46171621",
    "warrantyMonths": 24,
    "fullDescription": "Paquete listo para instalar con grabador, cámaras y almacenamiento integrado para proteger negocios o viviendas grandes.",
    "specs": {
      "Cámaras": "8x Bullet 4K IP67",
      "Grabador": "NVR 8 canales",
      "Almacenamiento": "HDD 2TB incluido",
      "Garantía": "2 años"
    },
    "technicalDetails": [
      "Cámaras: 8x Bullet 4K IP67",
      "Grabador: NVR 8 canales",
      "Almacenamiento: HDD 2TB incluido",
      "Garantía: 2 años"
    ]
  },
  {
    "id": 11,
    "name": "Sensor de Movimiento PIR Inalámbrico",
    "category": "Alarmas",
    "price": 349,
    "originalPrice": 499,
    "stock": 32,
    "emoji": "👁️",
    "image": "img/dsc.png",
    "desc": "Sensor infrarrojo pasivo, alcance 12m, ángulo 90°, batería 3 años, compatible con cualquier central.",
    "stars": 4.4,
    "reviews": 156,
    "badge": "",
    "featured": false,
    "brand": "DSC",
    "model": "ALM-0011",
    "tvcKey": "sz0000011",
    "satKey": "46171604",
    "warrantyMonths": 12,
    "fullDescription": "Sensor confiable para ampliar zonas de detección en casas, oficinas y negocios.",
    "specs": {
      "Alcance": "12 metros",
      "Ángulo": "90°",
      "Batería": "3 años",
      "Frecuencia": "433MHz"
    },
    "technicalDetails": [
      "Alcance: 12 metros",
      "Ángulo: 90°",
      "Batería: 3 años",
      "Frecuencia: 433MHz"
    ]
  },
  {
    "id": 12,
    "name": "Cerradura Biométrica Smart",
    "category": "Control",
    "price": 2899,
    "originalPrice": 3299,
    "stock": 11,
    "emoji": "🔒",
    "image": "img/commax.png",
    "desc": "Cerradura digital con huella, código PIN, tarjeta RFID, app y llave mecánica de emergencia.",
    "stars": 4.7,
    "reviews": 89,
    "badge": "Nuevo",
    "featured": false,
    "brand": "COMMAX",
    "model": "CTRL-0012",
    "tvcKey": "sz0000012",
    "satKey": "46171619",
    "warrantyMonths": 12,
    "fullDescription": "Cerradura moderna para accesos residenciales u oficinas, con varios métodos de apertura y mejor control.",
    "specs": {
      "Modos": "Huella / PIN / RFID / App / Llave",
      "Usuarios": "200 huellas",
      "Alarma": "Anti-manipulación",
      "Certificación": "ANSI Grade 2"
    },
    "technicalDetails": [
      "Modos: Huella / PIN / RFID / App / Llave",
      "Usuarios: 200 huellas",
      "Alarma: Anti-manipulación",
      "Certificación: ANSI Grade 2"
    ]
  },
  {
    "id": 13,
    "name": "Cable UTP Cat6 305m",
    "category": "Accesorios",
    "price": 699,
    "originalPrice": 899,
    "stock": 27,
    "emoji": "🔧",
    "image": "img/SAXXON.png",
    "desc": "Bobina de 305 metros cable UTP Cat6 23AWG para instalaciones de red y cámaras IP.",
    "stars": 4.3,
    "reviews": 201,
    "badge": "",
    "featured": false,
    "brand": "SAXXON",
    "model": "ACC-0013",
    "tvcKey": "sz0000013",
    "satKey": "39121006",
    "warrantyMonths": 6,
    "fullDescription": "Cable para instalaciones profesionales de red y videovigilancia con buena resistencia y rendimiento.",
    "specs": {
      "Categoría": "Cat6 / UTP",
      "Conductor": "23 AWG puro cobre",
      "Longitud": "305 metros",
      "CMR": "Certificado"
    },
    "technicalDetails": [
      "Categoría: Cat6 / UTP",
      "Conductor: 23 AWG puro cobre",
      "Longitud: 305 metros",
      "CMR: Certificado"
    ]
  },
  {
    "id": 14,
    "name": "Soporte Universal Camara 360°",
    "category": "Accesorios",
    "price": 199,
    "originalPrice": 299,
    "stock": 40,
    "emoji": "🗜️",
    "image": "img/SAXXON.png",
    "desc": "Soporte metálico articulado, compatible con cámaras hasta 5kg, instalación en techo o pared.",
    "stars": 4.5,
    "reviews": 318,
    "badge": "",
    "featured": false,
    "brand": "SAXXON",
    "model": "ACC-0014",
    "tvcKey": "sz0000014",
    "satKey": "39121006",
    "warrantyMonths": 6,
    "fullDescription": "Soporte práctico y resistente para instalaciones de cámaras en múltiples superficies.",
    "specs": {
      "Material": "Acero galvanizado",
      "Carga máx.": "5 kg",
      "Articulación": "360° horizontal / 90° vertical",
      "Incluye": "Tornillería completa"
    },
    "technicalDetails": [
      "Material: Acero galvanizado",
      "Carga máx.: 5 kg",
      "Articulación: 360° horizontal / 90° vertical",
      "Incluye: Tornillería completa"
    ]
  },
  {
    "id": 15,
    "name": "Fuente Switching 12V 10A CCTV",
    "category": "Accesorios",
    "price": 449,
    "originalPrice": 599,
    "stock": 21,
    "emoji": "⚡",
    "image": "img/SAXXON.png",
    "desc": "Fuente de alimentación regulada 12V 10A con 8 salidas para distribución de cámaras CCTV.",
    "stars": 4.6,
    "reviews": 134,
    "badge": "",
    "featured": false,
    "brand": "SAXXON",
    "model": "ACC-0015",
    "tvcKey": "sz0000015",
    "satKey": "39121006",
    "warrantyMonths": 6,
    "fullDescription": "Fuente de poder para sistemas de cámaras con distribución segura y estable en varias salidas.",
    "specs": {
      "Salida": "12V DC / 10A",
      "Canales": "8 salidas con fusible",
      "Entrada": "AC 100-240V",
      "Protección": "Cortocircuito / Sobrecarga"
    },
    "technicalDetails": [
      "Salida: 12V DC / 10A",
      "Canales: 8 salidas con fusible",
      "Entrada: AC 100-240V",
      "Protección: Cortocircuito / Sobrecarga"
    ]
  }
];

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.PRODUCTOS_DATA = PRODUCTOS_DATA;
}

// Para Node.js (si se necesita)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTOS_DATA;
}