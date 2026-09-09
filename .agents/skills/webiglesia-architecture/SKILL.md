---
name: webiglesia-architecture
description: >-
  Arquitectura, patrones de diseño, estructura de directorios y directrices de desarrollo
  y despliegue del proyecto WEBIGLESIA (Ministerio de Restauración Familiar - En su Gracia).
---

# Arquitectura del Proyecto WEBIGLESIA

Esta skill documenta la arquitectura técnica, estándares de código, patrones de diseño y flujo de despliegue para el portal web **Ministerio de Restauración Familiar - En su Gracia** (`iglesia-ensugracia`).

---

## 1. Stack Tecnológico

| Capa / Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **Angular** | `^21.2.0` | Framework SPA principal con componentes Standalone |
| **Angular CLI & Build** | `^21.2.23` | Builder `@angular/build:application` (Vite / esbuild) |
| **Angular SSR** | `^21.2.23` | Server-Side Rendering con `@angular/ssr` y Express 5 |
| **PrimeNG** | `^22.1.0` | Biblioteca UI de componentes |
| **PrimeUIX Themes** | `^3.0.0` | Motor de theming con preset Aura personalizado |
| **PrimeIcons / PrimeFlex** | `^8.0.0` / `^4.0.0` | Iconografía y utilidades flexbox |
| **TypeScript** | `~5.9.2` | Tipado estricto |
| **Estilos** | SCSS | BEM + Tokens CSS semánticos + Glassmorphism |

---

## 2. Principios Arquitectónicos Clave

### 2.1. Standalone Components & OnPush
- **100% Standalone**: No se utilizan `NgModule`. Cada componente importa explícitamente sus dependencias.
- **Detección de Cambios `OnPush`**: Todos los componentes usan `changeDetection: ChangeDetectionStrategy.OnPush` para maximizar el rendimiento.

### 2.2. Manejo de Estado Reactivo con Signals
- Se utilizan **Signals** (`signal`, `computed`, `effect`) para el estado de la interfaz y la reactividad.
- Se evita el uso de `BehaviorSubject` o suscripciones manuales innecesarias a RxJS en componentes UI.
- Inyección de dependencias funcional mediante `inject()` en lugar de constructores verbosos.

### 2.3. Server-Side Rendering (SSR) & Hidratación
- Configuración en [src/app/app.config.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/app.config.ts) con `provideClientHydration(withEventReplay())`.
- Servidor Express en [src/server.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/server.ts) usando `AngularNodeAppEngine`.
- Rutas del servidor configuradas en `src/app/app.routes.server.ts` con `RenderMode.Server`.
- **Protección contra APIs del navegador**: Siempre salvaguardar `localStorage`, `window` y `document`:
  ```typescript
  if (typeof localStorage !== 'undefined') {
    // acceso seguro en cliente
  }
  // Uso de DOCUMENT inyectado:
  private readonly document = inject(DOCUMENT);
  ```

### 2.4. Sistema de Diseño Institucional & Theming
- **Colores Oficiales**:
  - `Royal Navy`: `#0A192F` / `#0F254B`
  - `Imperial Gold`: `#D4AF37` / `#F5D061`
  - `Warm Burgundy`: `#8B1E2D`
- **Preset de PrimeNG**: `GraceNavyGoldPreset` configurado con `definePreset(Aura, ...)` en `app.config.ts`.
- **Modo Oscuro / Claro**: Selector `.app-dark` alternado en el elemento raíz `<html>` con persistencia en `localStorage`.

---

## 3. Estructura de Directorios

```
WEBIGLESIA/
├── .agents/
│   └── skills/
│       └── webiglesia-architecture/
│           └── SKILL.md                 # Esta guía de arquitectura
├── public/                              # Archivos estáticos servidos tal cual
│   ├── favicon.ico                      # Ícono oficial del navegador
│   └── assets/
│       └── images/                      # Logotipos (png, jpg) y fotos (comunidad.jpg)
├── src/
│   ├── index.html                       # HTML base con fuentes de Google y favicon
│   ├── main.ts                          # Entrada cliente (import dinámico de bootstrap)
│   ├── bootstrap.ts                     # bootstrapApplication(App, appConfig)
│   ├── styles.scss                      # Tokens de diseño, variables CSS y utilidades
│   ├── server.ts                        # Servidor Express para SSR
│   ├── environments/
│   │   ├── environment.ts               # Variables de desarrollo
│   │   └── environment.production.ts    # Variables de producción
│   └── app/
│       ├── app.ts / app.html / app.scss # Componente raíz
│       ├── app.config.ts                # Proveedores cliente (Router, Hydration, PrimeNG)
│       ├── app.config.server.ts         # Proveedores de servidor (provideServerRendering)
│       ├── app.routes.ts                # Rutas con lazy loading (loadComponent)
│       ├── app.routes.server.ts         # Configuración de renderizado SSR por ruta
│       ├── core/                        # Núcleo singleton de la app
│       │   ├── models/                  # Interfaces de TypeScript (church.model.ts)
│       │   └── services/                # Servicios singleton reactivos (church-data.service.ts)
│       ├── layout/                      # Estructura visual permanente
│       │   ├── header/                  # Navegación responsive y switch dark/light
│       │   ├── footer/                  # Información institucional, horarios y redes
│       │   └── whatsapp-button/         # Botón flotante interactivo de WhatsApp
│       └── features/                    # Módulos y vistas por dominio
│           ├── home/                    # Portada, cuenta regresiva, versículo, comunidad
│           ├── events/                  # Calendario, filtros por categoría e inscripción
│           ├── content/                 # Prédicas, devocionales y estudios bíblicos
│           ├── choir/                   # Ministerio de Alabanza, música y audiciones
│           ├── services/                # Consejería familiar, grupos de conexión
│           └── kids/                    # Generación Gracia Kids (zona infantil)
├── angular.json                         # Configuración del builder de Angular
├── package.json                         # Dependencias y scripts de ejecución
├── web.config                           # Configuración IIS para SSR (httpPlatformHandler)
└── web.config.static                    # Configuración IIS para SPA estática tradicional
```

---

## 4. Convenciones de Desarrollo

### 4.1. Creación de Nuevas Vistas / Features
1. Ubicar la vista bajo `src/app/features/<nombre-feature>/`.
2. Nombrar los archivos de forma limpia: `<nombre>.ts`, `<nombre>.html`, `<nombre>.scss`.
3. El componente debe ser `standalone: true` con `changeDetection: ChangeDetectionStrategy.OnPush`.
4. Registrar la ruta en [src/app/app.routes.ts](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/src/app/app.routes.ts) usando carga perezosa:
   ```typescript
   {
     path: 'nueva-seccion',
     loadComponent: () => import('./features/nueva-seccion/nueva-seccion').then(m => m.NuevaSeccionComponent),
     title: 'Nueva Sección | En su Gracia',
   }
   ```

### 4.2. Modelos y Servicios
- Definir interfaces de datos en `src/app/core/models/church.model.ts`.
- Exponer el estado en `src/app/core/services/church-data.service.ts` utilizando señales de solo lectura (`asReadonly()`):
  ```typescript
  private readonly _eventos = signal<EventItem[]>([]);
  readonly eventos = this._eventos.asReadonly();
  ```

---

## 5. Ciclo de Vida y Comandos

| Comando | Descripción | Puerto / Salida |
| :--- | :--- | :--- |
| `npm run start:dev` | Servidor de desarrollo con recarga en vivo | `http://localhost:4200` |
| `npm run build` | Compilación de producción (CSR + SSR) | `dist/iglesia-ensugracia/` |
| `npm start` o `npm run serve:ssr` | Inicia el servidor Node Express SSR en local | `http://localhost:4000` |

---

## 6. Configuración de Despliegue y Producción

### 6.1. Despliegue en IIS con Node SSR (`web.config`)
- Requiere el módulo **HttpPlatformHandler** instalado en IIS.
- `web.config` en la raíz ejecuta:
  `processPath="node" arguments="./dist/iglesia-ensugracia/server/server.mjs"`
- IIS administra el puerto dinámico vía `%HTTP_PLATFORM_PORT%`.

### 6.2. Despliegue Estático SPA Tradicional (`web.config.static`)
- Si se hospeda sin Node.js en un IIS estático:
  - Copiar los contenidos de `dist/iglesia-ensugracia/browser/`.
  - Renombrar o aplicar las reglas de [web.config.static](file:///c:/Users/ASUS/Documents/PROYECTOS/ANGULAR/IGLESIA/WEBIGLESIA/web.config.static) para reescribir las rutas no existentes hacia `/index.csr.html`.
