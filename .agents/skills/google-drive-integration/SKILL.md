---
name: google-drive-integration
description: >-
  Guía y procedimiento estándar para la integración de Google Drive y Google Sheets
  con el portal web WEBIGLESIA (Ministerio de Restauración Familiar - En su Gracia),
  incluyendo almacenamiento de imágenes, estructura de hojas, Google Apps Script y consumo en Angular.
---

# SKILL: Integración Google Drive & Google Sheets

Esta skill documenta el procedimiento integral para gestionar y consumir datos, contenidos y archivos multimedia desde **Google Drive** y **Google Sheets** hacia el portal web de la iglesia ([WEBIGLESIA](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/)), permitiendo que el cuerpo pastoral y los líderes administren todo sin tocar código fuente.

---

## 1. Estructura y Organización en Google Drive

### 1.1. Carpeta Raíz en Google Drive
Crea una carpeta principal en tu unidad de Google Drive:
```
📁 WEBIGLESIA - Gestión de Contenidos/
├── 📊 Portal Web - En su Gracia (Google Sheets)
├── 📁 Multimedia Eventos/
├── 📁 Fotos Comunidad y Noticias/
└── 📁 Bosquejos y Recursos PDF/
```

### 1.2. Compartir Carpetas y Archivos en Google Drive
Para que las imágenes y documentos alojados en Google Drive se muestren en la web:
1. Haz clic derecho sobre la carpeta `📁 Multimedia Eventos` (o sobre el archivo).
2. Selecciona **Compartir** $\rightarrow$ **Acceso general**.
3. Cambia a: **`Cualquier persona con el enlace`** en rol **`Lector`**.

### 1.3. Conversión de Enlaces de Imágenes de Google Drive
Cuando subas una foto a Google Drive, su enlace normal es:
```text
https://drive.google.com/file/d/ID_DEL_ARCHIVO/view?usp=sharing
```
Para usarla directamente como `<img src="...">` en la web o en la columna `image` de Google Sheets, usa el formato directo:
```text
https://drive.google.com/uc?export=view&id=ID_DEL_ARCHIVO
```
*(Reemplazando `ID_DEL_ARCHIVO` por el identificador alfanumérico que está entre `/d/` y `/view`)*.

---

## 2. Estructura de la Hoja de Google Sheets

Crea un archivo de Google Sheets llamado **"Portal Web - En su Gracia"** dentro de tu carpeta de Drive, con las siguientes **9 pestañas** exactas:

### 📄 Pestaña 1: `Eventos` (Página `/eventos` y `/home`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador único | `ev-1` |
| `title` | Texto | Título principal del evento | `Congreso de Familias 2026` |
| `subtitle` | Texto | Subtítulo explicativo | `Sanando el Corazón del Hogar` |
| `date` | Texto | Fecha (`AAAA-MM-DD` o legible) | `2026-10-16` |
| `time` | Texto | Horario de inicio y fin | `06:30 PM - 09:30 PM` |
| `location` | Texto | Lugar físico u online | `Auditorio Principal - En su Gracia` |
| `category` | Texto | Categoría de filtro | `culto`, `familia`, `jovenes`, `ninos`, `oracion`, `especial` |
| `description` | Texto | Descripción detallada | `Tres días de renovación y talleres prácticos...` |
| `badge` | Texto | Etiqueta destacada | `Evento Destacado`, `Semanal`, `Intercesión` |
| `featured` | Booleano | Mostrar en el Home | `TRUE` o `FALSE` |
| `image` | Texto | Enlace directo Drive o ruta | `https://drive.google.com/uc?export=view&id=...` |

---

### 📄 Pestaña 2: `Predicas` (Página `/evangelio` y `/home`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador | `sermon-1` |
| `title` | Texto | Título de la enseñanza | `La Gracia que Restaura el Hogar` |
| `preacher` | Texto | Predicador(a) | `Pastor Principal` |
| `series` | Texto | Serie temática | `Familias de Pacto` |
| `date` | Texto | Fecha | `Domingo pasado` |
| `passage` | Texto | Cita bíblica | `Lucas 15:11-24` |
| `duration` | Texto | Duración | `48 min` |
| `summary` | Texto | Resumen doctrinal | `Principios del perdón incondicional...` |
| `youtubeId` | Texto | ID de video YouTube | `dQw4w9WgXcQ` |
| `audioUrl` | Texto | Audio MP3 | Enlace de Drive o MP3 |
| `notesUrl` | Texto | Bosquejo PDF | Enlace a PDF de Drive |
| `tags` | Texto | Etiquetas separadas por coma | `Familia, Gracia, Restauración` |

---

### 📄 Pestaña 3: `Devocional` (Página `/evangelio`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador | `dev-1` |
| `title` | Texto | Título devocional | `Cuando las Fuerzas se Acaban, la Gracia Abunda` |
| `author` | Texto | Autor | `Ministerio Pastoral En su Gracia` |
| `date` | Texto | Período | `Semana Actual` |
| `keyVerse` | Texto | Versículo clave | `Y me ha dicho: Bástate mi gracia...` |
| `verseReference` | Texto | Referencia | `2 Corintios 12:9` |
| `reflection` | Texto | Párrafos separados con `\|\|` | `Párrafo 1 \|\| Párrafo 2 \|\| Párrafo 3` |
| `prayer` | Texto | Oración guiada | `Padre celestial... En el nombre de Jesús, Amén.` |

---

### 📄 Pestaña 4: `Canciones` (Página `/coro`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador | `song-1` |
| `title` | Texto | Título de alabanza | `En Su Gracia Hay Vida Nueva` |
| `author` | Texto | Autor / Grupo | `Coro En su Gracia Worship` |
| `tempo` | Texto | Tempo y BPM | `Lenta / Íntima (72 BPM)` |
| `key` | Texto | Tono | `D (Re Mayor)` |
| `category` | Texto | Tipo de cántico | `adoracion`, `alabanza`, `especial` |
| `lyrics` | Texto | Letra completa | Letra con saltos de línea |
| `chords` | Texto | Acordes cifrados | `Intro: D G Bm7 A` |
| `audioSample` | Texto | Enlace demo audio | Enlace de Drive |

---

### 📄 Pestaña 5: `Servicios` (Página `/servicios`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador | `serv-1` |
| `title` | Texto | Nombre del ministerio | `Consejería Pastoral & Familiar` |
| `subtitle` | Texto | Propósito | `Acompañamiento confidencial con principios bíblicos` |
| `icon` | Texto | Icono PrimeIcons | `pi pi-heart`, `pi pi-users`, `pi pi-book` |
| `schedule` | Texto | Horarios de atención | `Martes y Jueves (Con cita previa)` |
| `description` | Texto | Detalle del servicio | `Sesiones privadas para matrimonios...` |
| `benefits` | Texto | Puntos clave separados por `\|\|` | `100% Confidencial \|\| Gratuita \|\| Guía bíblica` |
| `contactAction` | Texto | Texto botón WhatsApp | `Agendar Consejería` |

---

### 📄 Pestaña 6: `Kids_Historias` (Página `/kids`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador | `david-y-goliat` |
| `title` | Texto | Título de la historia | `David, el Pastor Valiente` |
| `bibleReference` | Texto | Cita bíblica | `1 Samuel 17` |
| `moral` | Texto | Enseñanza | `Con Dios ningún gigante da miedo.` |
| `summary` | Texto | Resumen para niños | `David confió en Dios y venció...` |
| `icon` | Texto | Icono PrimeIcons | `pi pi-shield`, `pi pi-cloud`, `pi pi-heart-fill` |

---

### 📄 Pestaña 7: `Kids_Versiculos` (Página `/kids`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Número | Identificador | `1` |
| `verse` | Texto | Texto bíblico | `Todo lo puedo en Cristo que me fortalece.` |
| `reference` | Texto | Referencia | `Filipenses 4:13` |
| `level` | Texto | Nivel de dificultad | `Fácil`, `Intermedio`, `Campeón` |
| `hint` | Texto | Pista para memorizar | `¿Quién nos da fuerzas para todo?` |

---

### 📄 Pestaña 8: `Kids_Trivia` (Página `/kids`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Número | Número de pregunta | `1` |
| `question` | Texto | Pregunta bíblica | `¿Quién venció al gigante Goliat?` |
| `options` | Texto | 4 Opciones separadas por `\|\|` | `Saúl \|\| David con una honda \|\| Sansón \|\| Moisés` |
| `correctAnswer` | Número | Índice respuesta (inicia en 0) | `1` *(segunda opción)* |
| `explanation` | Texto | Explicación formativa | `David sabía que la batalla era del Señor.` |
| `bibleVerse` | Texto | Cita bíblica | `1 Samuel 17:45` |

---

### 📄 Pestaña 9: `Lema_Iglesia` (Página `/home` y `/footer`)
| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `theme` | Texto | Lema general | `Restauración Familiar & Gracia` |
| `verse` | Texto | Versículo lema | `Porque por gracia sois salvos por medio de la fe...` |
| `reference` | Texto | Cita | `Efesios 2:8` |
| `familyVerse` | Texto | Versículo familiar | `Cree en el Señor Jesucristo, y serás salvo, tú y tu casa.` |
| `familyReference` | Texto | Cita familiar | `Hechos 16:31` |

---

## 3. Backend: Google Apps Script

El archivo fuente reside en [google-apps-script.js](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/google-apps-script.js).

### Procedimiento de Despliegue:
1. En tu hoja de Google Sheets, ve a **Extensiones** $\rightarrow$ **Apps Script**.
2. Copia todo el contenido de [google-apps-script.js](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/google-apps-script.js) y pégalo reemplazando cualquier código anterior.
3. Haz clic en **Guardar** (Ctrl + S).
4. Haz clic en el botón azul superior **Implementar (Deploy)** $\rightarrow$ **Nueva implementación (New deployment)**.
5. Selecciona el tipo **Aplicación web (Web app)**:
   - **Descripción**: `API WEBIGLESIA`.
   - **Ejecutar como**: `Yo (tu correo)`.
   - **Quién tiene acceso**: **`Cualquier persona`** *(Anyone)*. *(Indispensable para no requerir login)*.
6. Pulsa **Implementar**, concede permisos con tu cuenta de Google y copia la **URL de la aplicación web** generada (termina en `/exec`).

---

## 4. Conexión en el Código Angular

### 4.1. Archivos de Entorno
Pega la URL de Apps Script en:
- [src/environments/environment.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/environments/environment.ts):
  ```typescript
  export const environment = {
    production: false,
    // ...
    googleSheetsApiUrl: 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec'
  };
  ```
- [src/environments/environment.production.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/environments/environment.production.ts):
  ```typescript
  export const environment = {
    production: true,
    // ...
    googleSheetsApiUrl: 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec'
  };
  ```

### 4.2. Servicio Central (`ChurchDataService`)
El servicio [src/app/core/services/church-data.service.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/core/services/church-data.service.ts) administra la sincronización:
- **`syncAllFromGoogleSheets()`**: Solicita todas las pestañas consolidadas en un solo llamado HTTP, actualizando reactivamente las señales (`Signals`) de Angular.
- **`syncSheet(sheetName)`**: Permite sincronizar una pestaña puntual si se requiere.
- **Mecanismo Fallback**: Si no hay conexión o no se ha configurado la URL, se preservan los datos locales por defecto.

---

## 5. Buenas Prácticas y Mantenimiento

1. **Evitar filas vacías intermedias**: Mantén las filas de cada pestaña consecutivas.
2. **Actualizaciones inmediatas**: Al modificar una celda en Google Sheets, los cambios están disponibles al instante sin necesidad de recompilar la web en Angular.
3. **Respaldo periódico**: Puedes descargar una copia de seguridad en Excel (`.xlsx`) desde **Archivo** $\rightarrow$ **Descargar**.
