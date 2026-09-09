import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChurchScheduleConfig,
  PageSeoConfig,
  PageWhatsAppConfig,
  PastoralContactConfig,
} from '../models/config.model';

@Injectable({
  providedIn: 'root',
})
export class ChurchConfigService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);


  // Estados de sincronización
  readonly isLoading = signal<boolean>(false);
  readonly lastSync = signal<Date | null>(null);
  readonly syncError = signal<string | null>(null);
  private syncPromise: Promise<void> | null = null;

  // Ruta activa limpia ('home', 'eventos', 'evangelio', 'coro', 'servicios', 'kids')
  readonly currentRoute = signal<string>('home');

  // ==============================================================================
  // Estado Reactivo con Valores por Defecto (Fallback Seguro)
  // ==============================================================================

  readonly seoConfigs = signal<Record<string, PageSeoConfig>>({
    home: {
      page: 'home',
      title: 'Ministerio de Restauración Familiar - En su Gracia | Inicio',
      description: 'Comunidad cristiana de fe, amor, alabanza y restauración integral para toda la familia. Cultos dominicales, eventos y escuela bíblica.',
      keywords: 'iglesia en su gracia, restauracion familiar, comunidad cristiana, predicas, devocionales, eventos cristianos, coro, fe, evangelio',
      ogImage: 'assets/images/comunidad.jpg',
      ogType: 'website',
    },
    eventos: {
      page: 'eventos',
      title: 'Eventos & Agenda Familiar | En su Gracia',
      description: 'Próximos cultos especiales, congresos matrimoniales, vigilias de clamor y campamentos juveniles para toda la familia.',
      keywords: 'eventos cristianos, vigilias, congresos de familia, campamentos, cultos dominicales',
      ogImage: 'assets/images/logo.png',
      ogType: 'website',
    },
    evangelio: {
      page: 'evangelio',
      title: 'Evangelio, Prédicas & Devocionales | En su Gracia',
      description: 'Enseñanzas bíblicas transformadoras sobre el amor y la gracia redentora de Jesucristo. Mensajes y devocionales semanales.',
      keywords: 'predicas cristianas, devocionales diarios, estudios biblicos, evangelio de la gracia, fe en cristo',
      ogImage: 'assets/images/logo.png',
      ogType: 'article',
    },
    coro: {
      page: 'coro',
      title: 'Ministerio de Alabanza & Coro | En su Gracia Worship',
      description: 'Música de alabanza y adoración congregacional, letras, acordes y convocatorias de audición para músicos y coristas.',
      keywords: 'coro cristiano, ministerio de alabanza, musica de adoracion, acordes cristianos, letras cristianas',
      ogImage: 'assets/images/logo.png',
      ogType: 'website',
    },
    servicios: {
      page: 'servicios',
      title: 'Servicios & Consejería Familiar | En su Gracia',
      description: 'Acompañamiento pastoral confidencial, consejería matrimonial, grupos de conexión en hogares y escuela de discipulado.',
      keywords: 'consejeria familiar, consejeria matrimonial, grupos de conexion, discipulado cristiano, bautismos',
      ogImage: 'assets/images/logo.png',
      ogType: 'website',
    },
    kids: {
      page: 'kids',
      title: 'Generación Gracia Kids | Espacio Infantil Bíblico',
      description: 'Espacio lúdico y educativo para niños con historias bíblicas ilustradas, versículos para memorizar y juegos interactivos.',
      keywords: 'iglesia para niños, escuela dominical, historias de la biblia para niños, trivia biblica, juegos cristianos',
      ogImage: 'assets/images/logo.png',
      ogType: 'website',
    },
  });

  readonly whatsAppConfigs = signal<Record<string, PageWhatsAppConfig>>({
    home: {
      page: 'home',
      phone: environment.whatsappNumber,
      label: 'Atención General & Bienvenida',
      defaultMessage: '¡Hola! Me gustaría conocer más sobre la iglesia En su Gracia y solicitar oración.',
    },
    eventos: {
      page: 'eventos',
      phone: environment.whatsappNumber,
      label: 'Inscripciones y Eventos',
      defaultMessage: '¡Hola! Deseo recibir información e inscribirme a los próximos eventos de la iglesia.',
    },
    evangelio: {
      page: 'evangelio',
      phone: environment.whatsappNumber,
      label: 'Orientación Espiritual',
      defaultMessage: '¡Hola! Quisiera conversar con un líder o pastor sobre el mensaje de la palabra de Dios.',
    },
    coro: {
      page: 'coro',
      phone: environment.whatsappNumber,
      label: 'Ministerio de Alabanza',
      defaultMessage: '¡Hola! Me gustaría información sobre audiciones y ensayos del coro de la iglesia.',
    },
    servicios: {
      page: 'servicios',
      phone: environment.whatsappNumber,
      label: 'Consejería Pastoral & Familiar',
      defaultMessage: '¡Hola! Deseo información para agendar una cita de consejería matrimonial o familiar.',
    },
    kids: {
      page: 'kids',
      phone: environment.whatsappNumber,
      label: 'Generación Gracia Kids',
      defaultMessage: '¡Hola! Deseo más información sobre las actividades y escuela dominical para niños.',
    },
    general: {
      page: 'general',
      phone: environment.whatsappNumber,
      label: 'Línea de Oración',
      defaultMessage: '¡Hola! Deseo compartir una petición de oración por mi familia.',
    },
  });

  readonly pastoralContact = signal<PastoralContactConfig>({
    address: environment.address,
    phone: environment.phone,
    email: environment.email,
    prayerLine: 'Línea de Oración Inmediata: Activa 24/7',
    officeHours: 'Lunes a Viernes 8:00 AM - 5:00 PM',
  });

  readonly schedules = signal<ChurchScheduleConfig[]>([
    {
      day: 'Domingos',
      title: 'Culto de Celebración Familiar',
      time: '10:00 AM - 12:30 PM',
      subtitle: 'Con Escuela Kids',
      badge: 'Semanal',
    },
    {
      day: 'Miércoles',
      title: 'Noche de Gracia & Discipulado',
      time: '07:00 PM - 08:30 PM',
      subtitle: 'Estudio Bíblico Profundo',
      badge: 'Semanal',
    },
    {
      day: 'Sábados',
      title: 'Jóvenes & Ensayos de Alabanza',
      time: '04:00 PM - 06:30 PM',
      subtitle: 'Generación de Impacto',
      badge: 'Jóvenes',
    },
  ]);

  // Configuración de WhatsApp dinámica para la página donde esté el usuario
  readonly currentWhatsApp = computed<PageWhatsAppConfig>(() => {
    const route = this.currentRoute();
    const map = this.whatsAppConfigs();
    return map[route] || map['home'] || map['general'];
  });

  constructor() {
    this.setupRouterListener();
  }

  // ==============================================================================
  // Motor SEO Dinámico Adaptado a Motores de Búsqueda
  // ==============================================================================

  private setupRouterListener(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = (event.urlAfterRedirects || event.url || '/home')
          .replace(/^\//, '')
          .split('?')[0]
          .split('#')[0]
          .toLowerCase();

        const pageKey = url === '' ? 'home' : url;
        this.currentRoute.set(pageKey);
        this.applySeoForPage(pageKey);
      });
  }

  applySeoForPage(pageKey: string): void {
    const seo = this.seoConfigs()[pageKey] || this.seoConfigs()['home'];
    if (!seo) return;

    // 1. Título de página (<title>)
    this.titleService.setTitle(seo.title);

    // 2. Meta tags estándar para Google y Bing
    this.metaService.updateTag({ name: 'description', content: seo.description });
    this.metaService.updateTag({ name: 'keywords', content: seo.keywords });

    // 3. Open Graph (Facebook, WhatsApp preview, LinkedIn, iMessage)
    this.metaService.updateTag({ property: 'og:title', content: seo.title });
    this.metaService.updateTag({ property: 'og:description', content: seo.description });
    this.metaService.updateTag({ property: 'og:type', content: seo.ogType || 'website' });
    if (seo.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: seo.ogImage });
    }

    // 4. Twitter Cards
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: seo.title });
    this.metaService.updateTag({ name: 'twitter:description', content: seo.description });
    if (seo.ogImage) {
      this.metaService.updateTag({ name: 'twitter:image', content: seo.ogImage });
    }

    // 5. Canonical URL
    if (seo.canonicalUrl && typeof document !== 'undefined') {
      let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
      }
      link.setAttribute('href', seo.canonicalUrl);
    }
  }

  // ==============================================================================
  // Sincronización con el Segundo Google Sheet (Configuración & SEO)
  // ==============================================================================

  async syncConfigFromGoogleSheets(force: boolean = false): Promise<void> {
    const apiUrl = environment.googleSheetsConfigUrl?.trim();
    if (!apiUrl || !isPlatformBrowser(this.platformId)) {
      // Sin URL configurada o en SSR: se conservan los valores locales inmediatos
      return;
    }


    if (this.syncPromise && !force) {
      return this.syncPromise;
    }

    if (this.lastSync() && !force) {
      return;
    }

    this.isLoading.set(true);
    this.syncError.set(null);

    this.syncPromise = new Promise<void>((resolve) => {
      this.http.get<any>(apiUrl).subscribe({
        next: (res) => {
          try {
            const payload = res?.data || res;
            if (payload) {
              // 1. SEO por Página
              if (Array.isArray(payload.seo) && payload.seo.length > 0) {
                const current = { ...this.seoConfigs() };
                payload.seo.forEach((item: PageSeoConfig) => {
                  const raw = (item.page || (item as any).route || '').trim().toLowerCase();
                  const cleanKey = raw.replace(/^\//, '') || 'home';
                  current[cleanKey] = { ...item, page: cleanKey };
                  // Aliases para sincronizar con las páginas de Angular de WEBIGLESIA
                  if (cleanKey === 'predicas' || cleanKey === 'mensajes') current['evangelio'] = { ...item, page: 'evangelio' };
                  if (cleanKey === 'ministerios' || cleanKey === 'alabanza') current['coro'] = { ...item, page: 'coro' };
                  if (cleanKey === 'oracion' || cleanKey === 'contacto' || cleanKey === 'consejeria') current['servicios'] = { ...item, page: 'servicios' };
                });
                this.seoConfigs.set(current);
                // Re-aplica SEO en la página actual
                this.applySeoForPage(this.currentRoute());
              }

              // 2. WhatsApp por Página
              if (Array.isArray(payload.whatsapp) && payload.whatsapp.length > 0) {
                const currentWa = { ...this.whatsAppConfigs() };
                payload.whatsapp.forEach((item: PageWhatsAppConfig) => {
                  const raw = (item.page || (item as any).route || '').trim().toLowerCase();
                  const cleanKey = raw.replace(/^\//, '') || 'home';
                  const cleanPhone = item.phone ? String(item.phone).replace(/\D/g, '') : environment.whatsappNumber;
                  const normalized: PageWhatsAppConfig = {
                    ...item,
                    page: cleanKey,
                    phone: cleanPhone,
                  };
                  currentWa[cleanKey] = normalized;
                  // Aliases para sincronizar con las páginas de Angular de WEBIGLESIA
                  if (cleanKey === 'predicas' || cleanKey === 'mensajes') currentWa['evangelio'] = { ...normalized, page: 'evangelio' };
                  if (cleanKey === 'ministerios' || cleanKey === 'alabanza') currentWa['coro'] = { ...normalized, page: 'coro' };
                  if (cleanKey === 'oracion' || cleanKey === 'contacto' || cleanKey === 'consejeria') currentWa['servicios'] = { ...normalized, page: 'servicios' };
                });
                this.whatsAppConfigs.set(currentWa);
              }


              // 3. Contacto Pastoral
              if (payload.contact && payload.contact.address) {
                this.pastoralContact.set({
                  address: payload.contact.address || this.pastoralContact().address,
                  phone: payload.contact.phone || this.pastoralContact().phone,
                  email: payload.contact.email || this.pastoralContact().email,
                  prayerLine: payload.contact.prayerLine || this.pastoralContact().prayerLine,
                  officeHours: payload.contact.officeHours || this.pastoralContact().officeHours,
                });
              }

              // 4. Horarios de Bendición
              if (Array.isArray(payload.schedules) && payload.schedules.length > 0) {
                this.schedules.set(payload.schedules);
              }

              this.lastSync.set(new Date());
            }
          } catch (e: any) {
            console.warn('Error al procesar configuración de Google Sheets:', e);
            this.syncError.set(e?.message || 'Error al procesar configuración');
          } finally {
            this.isLoading.set(false);
            this.syncPromise = null;
            resolve();
          }
        },
        error: (err) => {
          console.warn('No se pudo cargar configuración de Google Sheets. Usando valores locales:', err);
          this.syncError.set('No se pudo conectar con Google Sheets Config');
          this.isLoading.set(false);
          this.syncPromise = null;
          resolve();
        },
      });
    });

    return this.syncPromise;
  }
}
