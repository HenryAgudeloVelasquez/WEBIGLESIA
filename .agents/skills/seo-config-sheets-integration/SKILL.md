---
name: seo-config-sheets-integration
description: >-
  Guía y procedimiento estándar para la gestión dinámica de SEO moderno, números de WhatsApp
  por página, contacto pastoral y horarios de bendición mediante Google Sheets y Google Apps Script
  en el portal WEBIGLESIA.
---

# SKILL: Gestión Dinámica de SEO, WhatsApp, Contacto y Horarios con Google Sheets

Esta skill documenta la arquitectura, el diseño de datos y el procedimiento de mantenimiento para gestionar **parámetros operacionales, posicionamiento en motores de búsqueda (SEO), líneas de WhatsApp segmentadas por página, información de contacto pastoral y horarios de cultos** desde un archivo independiente de **Google Sheets** conectado al portal web [WEBIGLESIA](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/).

---

## 1. Arquitectura y Principio de Separación

El portal utiliza una estrategia de **doble hoja de cálculo desacoplada**:

```
Google Drive / Portal Web:
├── 📊 Hoja 1: "Portal Web - En su Gracia" (Contenidos ministeriales)
│   └── Eventos, Prédicas, Devocional, Canciones, Servicios, Kids, Lema
│   └── Despliegue Apps Script 1: googleSheetsApiUrl
│
└── 📊 Hoja 2: "Portal Web - Configuración & SEO" (Parámetros técnicos y operativos)
    ├── 📄 SEO_Paginas (Títulos, Meta, Open Graph, Twitter Cards, Canonicals)
    ├── 📄 WhatsApp_Por_Pagina (Líneas y mensajes sugeridos por sección)
    ├── 📄 Contacto_Pastoral (Teléfonos, correos, dirección, redes)
    └── 📄 Horarios_Bendicion (Reuniones semanales reflejadas en el footer)
    └── Despliegue Apps Script 2: googleSheetsConfigUrl
```

### Ventajas de este Enfoque
1. **Independencia Operativa**: Modificar un número de WhatsApp o un horario no interfiere con las prédicas ni eventos de la iglesia.
2. **Resiliencia (Fallback Offline)**: Si la hoja de cálculo no responde o no hay conexión a internet, la aplicación web recurre instantáneamente a sus configuraciones locales predeterminadas en TypeScript. La página nunca queda en blanco ni rota.
3. **Alto Rendimiento SSR**: Las peticiones HTTP a Google Apps Script se encuentran encapsuladas bajo `isPlatformBrowser`, permitiendo que el servidor SSR de Angular responda con HTML estático inmediato (<50ms) y el cliente en el navegador sincronice en segundo plano sin bloqueos.

---

## 2. Estructura de la Hoja de Cálculo en Google Sheets

Nombre del archivo sugerido: **`Portal Web - Configuración & SEO`**.

### 2.1. Pestaña `SEO_Paginas`
Permite gobernar el SEO moderno (Google, Bing, Yahoo) y las previsualizaciones de tarjetas sociales al compartir enlaces (Facebook, WhatsApp, X/Twitter, LinkedIn).

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `route` / `page` | Texto | Ruta de la página (`/`, `/eventos`, `/coro`, `/evangelio`, `/kids`, `/servicios`) | `/` |
| `title` | Texto | `<title>` en pestaña del navegador y motores | `Ministerio En su Gracia \| Restauración Familiar` |
| `description` | Texto | Meta description (150-160 caracteres óptimos) | `Comunidad cristiana comprometida con la restauración de matrimonios...` |
| `keywords` | Texto | Palabras clave separadas por comas | `iglesia cristiana, gracia, restauracion familiar, medellin` |
| `ogTitle` | Texto | Título Open Graph al compartir enlace | `En su Gracia - Una Casa de Bendición Familiar` |
| `ogDescription`| Texto | Descripción de la tarjeta social | `Descubre la gracia incondicional de Dios para tu hogar.` |
| `ogImage` | Texto | URL de imagen al previsualizar (Drive directa o ruta web) | `assets/images/comunidad.jpg` |
| `ogType` | Texto | Tipo Open Graph (`website`, `article`) | `website` |
| `twitterCard` | Texto | Formato de tarjeta Twitter (`summary_large_image`, `summary`) | `summary_large_image` |
| `canonicalUrl` | Texto | URL canónica para evitar contenido duplicado | `https://ensugracia.org/` |

---

### 2.2. Pestaña `WhatsApp_Por_Pagina`
Permite que el botón flotante de WhatsApp y las acciones de contacto dirijan al usuario a la línea pastoral correspondiente con un mensaje predeterminado contextual a la sección que está leyendo.

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `route` / `page` | Texto | Ruta (`/`, `/eventos`, `/coro`, `/evangelio`, `/kids`, `/servicios`) | `/servicios` |
| `phone` | Texto | Teléfono con código de país, sin signos `+`, espacios ni guiones | `573135246723` |
| `label` | Texto | Nombre descriptivo de la línea o ministerio | `Consejería Pastoral Familiar` |
| `defaultMessage`| Texto | Mensaje sugerido que aparecerá redactado al abrir el chat | `Hola Pastor, me gustaría agendar una cita de consejería familiar.` |
| `isActive` | Booleano | Si la línea se encuentra habilitada (`TRUE`/`FALSE`) | `TRUE` |

---

### 2.3. Pestaña `Contacto_Pastoral`
Controla los datos institucionales visibles en el pie de página (`footer`) y módulos de contacto. Puede definirse como pares clave-valor o en filas:

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `address` | Texto | Dirección física de la congregación | `Carrera 15 # 85-30, Bogotá, Colombia` |
| `phone` | Texto | Teléfono fijo u oficina pastoral | `+57 (601) 555-0199` |
| `email` | Texto | Correo electrónico oficial | `contacto@ensugracia.org` |
| `prayerLine` | Texto | Línea o mensaje de oración | `+57 310 999 8877` |
| `officeHours` | Texto | Horarios de atención en oficina | `Martes a Sábado: 8:00 AM - 5:00 PM` |

---

### 2.4. Pestaña `Horarios_Bendicion`
Gobierna la lista de cultos y reuniones semanales mostrados en la columna "Horarios de Bendición" del pie de página.

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `day` | Texto | Día de la reunión | `Domingo` |
| `title` / `name`| Texto | Nombre del culto o reunión | `Culto Principal de Celebración Familiar` |
| `time` | Texto | Rango de horario | `10:00 AM - 12:30 PM` |
| `subtitle` | Texto | Detalle o subtítulo explicativo | `Con Escuela Kids` |
| `badge` | Texto | Etiqueta distintiva | `Familiar`, `Presencial y Online`, `Jóvenes` |
| `order` | Número | Orden de presentación visual | `1` |

---

## 3. Backend: Google Apps Script (`google-apps-script-config.js`)

El archivo [google-apps-script-config.js](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/google-apps-script-config.js) contiene la lógica para transformar las 4 pestañas en un JSON estructurado.

### Procedimiento de Despliegue en Apps Script
1. En la hoja de cálculo, ve al menú superior: **Extensiones** $\rightarrow$ **Apps Script**.
2. Pega el código de [google-apps-script-config.js](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/google-apps-script-config.js).
3. Guarda el archivo (**Ctrl + S**).
4. Haz clic en **Implementar (Deploy)** $\rightarrow$ **Nueva implementación (New deployment)**.
5. Selecciona tipo engranaje $\rightarrow$ **Aplicación web (Web app)**:
   - **Descripción**: `Configuración y SEO WEBIGLESIA`.
   - **Ejecutar como**: `Yo` *(tu cuenta de Google)*.
   - **Quién tiene acceso**: **`Cualquier persona`** *(Anyone)*.
6. Copia la **URL de la aplicación web** generada (termina en `/exec`).

### Formato de Respuesta JSON del Endpoint
```json
{
  "success": true,
  "timestamp": "2026-09-09T19:35:43.131Z",
  "data": {
    "seo": [
      {
        "page": "/",
        "title": "En su Gracia | Iglesia Cristiana - Bienvenidos a Casa",
        "description": "Somos una comunidad de fe que vive...",
        "keywords": "iglesia cristiana, en su gracia, medellin...",
        "ogImage": "assets/images/comunidad.jpg",
        "canonicalUrl": "https://ensugracia.org/"
      }
    ],
    "whatsapp": [
      {
        "page": "/",
        "phone": "573135246723",
        "label": "Atención Pastoral General",
        "defaultMessage": "¡Hola! Quisiera más información..."
      }
    ],
    "contact": {
      "address": "Carrera 15 # 85-30, Bogotá, Colombia",
      "phone": "+57 (601) 555-0199",
      "email": "contacto@ensugracia.org",
      "prayerLine": "+57 310 999 8877",
      "officeHours": "Martes a Sábado: 8:00 AM - 5:00 PM"
    },
    "schedules": [
      {
        "day": "Domingo",
        "title": "Culto Dominical de Celebración",
        "time": "10:00 AM - 12:30 PM",
        "subtitle": "Alabanza congregacional y mensaje central",
        "badge": "Familiar"
      }
    ]
  }
}
```

---

## 4. Implementación en Angular

### 4.1. Configuración de Entornos
La URL generada se define en:
- [src/environments/environment.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/environments/environment.ts)
- [src/environments/environment.production.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/environments/environment.production.ts)

```typescript
export const environment = {
  // ...
  googleSheetsApiUrl: 'https://script.google.com/macros/s/AKfycb.../exec',   // Hoja 1: Contenidos
  googleSheetsConfigUrl: 'https://script.google.com/macros/s/AKfycby.../exec' // Hoja 2: SEO & Config
};
```

### 4.2. Modelos TypeScript
Ubicados en [src/app/core/models/config.model.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/core/models/config.model.ts):
- `PageSeoConfig`
- `PageWhatsAppConfig`
- `PastoralContactConfig`
- `ChurchScheduleConfig`

### 4.3. Servicio Central: `ChurchConfigService`
Ubicado en [src/app/core/services/church-config.service.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/core/services/church-config.service.ts):
1. **Escucha de Navegación (`NavigationEnd`)**: Detecta cada cambio de ruta de Angular y aplica dinámicamente mediante `Title` y `Meta`:
   - `<title>`
   - `<meta name="description">`
   - `<meta name="keywords">`
   - Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`)
   - Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
   - `<link rel="canonical">`
2. **Normalización y Alias de Rutas**: Limpia barras iniciales (`/eventos` $\rightarrow$ `eventos`, `/` $\rightarrow$ `home`) y soporta sinónimos comunes:
   - `predicas` / `mensajes` $\rightarrow$ asignados a `/evangelio`
   - `ministerios` / `alabanza` $\rightarrow$ asignados a `/coro`
   - `oracion` / `contacto` / `consejeria` $\rightarrow$ asignados a `/servicios`
3. **Cálculo Reactivo de WhatsApp (`currentWhatsApp`)**:
   `computed()` que provee a cualquier componente (`WhatsappButtonComponent`, `FooterComponent`, etc.) el teléfono y mensaje correspondiente a la página actual en tiempo real.
4. **Protección SSR con `isPlatformBrowser`**: Evita llamados bloqueantes durante la serialización en servidor Node, asegurando compilación sin advertencias y respuesta ultrarrápida.

### 4.4. Componentes Consumidores
- [src/app/app.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/app.ts): Llama a `configService.syncConfigFromGoogleSheets()` al iniciar.
- [src/app/layout/whatsapp-button/whatsapp-button.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/layout/whatsapp-button/whatsapp-button.ts): Botón flotante dinámico reactivo a la ruta activa.
- [src/app/layout/footer/footer.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/layout/footer/footer.ts): Muestra cultos dinámicos en "Horarios de Bendición", datos de contacto y enlace a WhatsApp.
- [src/app/features/events/events.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/features/events/events.ts) y [src/app/features/services/services.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/features/services/services.ts): Consumen el teléfono dinámico para inscripciones y citas pastorales.

---

## 5. Buenas Prácticas de Mantenimiento

1. **Edición en Caliente**: Cualquier cambio en una celda de la hoja de Google Sheets se refleja de inmediato en los usuarios que recarguen o naveguen en la web. No es necesario recompilar ni desplegar de nuevo el proyecto en Angular.
2. **Números Telefónicos**: Ingresar siempre el código del país seguido del número celular sin espacios ni caracteres especiales (ej: `573135246723`). El servicio web elimina automáticamente cualquier signo para garantizar compatibilidad con enlaces `https://wa.me/...`.
3. **Longitud de Metaetiquetas SEO**:
   - `title`: Entre 50 y 60 caracteres.
   - `description`: Entre 140 y 160 caracteres.
4. **Imágenes para Redes (`ogImage`)**: Usar imágenes horizontales de resolución recomendada 1200x630 píxeles. Si se almacenan en Google Drive, usar el formato de enlace directo `https://drive.google.com/uc?export=view&id=ID_ARCHIVO`.
