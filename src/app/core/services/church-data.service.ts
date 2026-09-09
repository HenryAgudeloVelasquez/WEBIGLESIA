import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ChurchEvent,
  Sermon,
  Devotional,
  ChoirSong,
  MinistryService,
  BibleTriviaQuestion,
  KidsStory,
  MemoryVerse,
} from '../models/church.model';

@Injectable({
  providedIn: 'root',
})
export class ChurchDataService {
  private readonly http = inject(HttpClient);

  // Estados de sincronización con Google Sheets
  readonly isLoadingData = signal<boolean>(false);
  readonly lastSyncDate = signal<Date | null>(null);
  readonly syncError = signal<string | null>(null);
  private syncPromise: Promise<void> | null = null;
  // ==========================================
  // Versículo Central / Lema
  // ==========================================
  readonly ministryMotto = signal({
    theme: 'Restauración Familiar & Gracia',
    verse: 'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios.',
    reference: 'Efesios 2:8',
    familyVerse: 'Cree en el Señor Jesucristo, y serás salvo, tú y tu casa.',
    familyReference: 'Hechos 16:31'
  });

  // ==========================================
  // Eventos de la Iglesia
  // ==========================================
  readonly events = signal<ChurchEvent[]>([
    {
      id: 'congreso-familias-2026',
      title: 'Congreso Internacional de Familias: Sanando el Corazón del Hogar',
      subtitle: 'Tres días de renovación para matrimonios, padres e hijos',
      date: '2026-10-16',
      time: '06:30 PM - 09:30 PM',
      location: 'Auditorio Principal - En su Gracia',
      category: 'familia',
      description: 'Una experiencia transformadora con talleres prácticos, conferencias pastorales especializadas y ministración guiada para la restauración de vínculos matrimoniales y familiares.',
      badge: 'Evento Destacado',
      featured: true,
    },
    {
      id: 'vigilia-fuego-gracia',
      title: 'Vigilia de Clamor & Gracia Sobrenatural',
      subtitle: 'Noche de intercesión y manifestación del Espíritu Santo',
      date: '2026-09-25',
      time: '09:00 PM - 03:00 AM',
      location: 'Santuario Central',
      category: 'oracion',
      description: 'Unidos como una sola familia en oración ferviente por nuestras familias, la sanidad de los enfermos y el despertar espiritual de nuestra comunidad.',
      badge: 'Intercesión',
      featured: true,
    },
    {
      id: 'culto-celebracion-domingo',
      title: 'Culto de Celebración & Restauración Familiar',
      subtitle: 'Nuestra cita semanal para alabar a Dios y recibir la Palabra',
      date: '2026-09-13',
      time: '10:00 AM - 12:30 PM',
      location: 'Auditorio Principal & Transmisión Online',
      category: 'culto',
      description: 'Tiempo glorioso de alabanza en vivo con nuestro coro, palabra ungida de revelación en el evangelio y atención especial para los niños en su propia escuela.',
      badge: 'Semanal',
      featured: true,
    },
    {
      id: 'campamento-generacion-gracia',
      title: 'Campamento Juvenil: Jóvenes de Fuego y Gracia',
      subtitle: 'Desconexión digital para conectar con el propósito divino',
      date: '2026-11-06',
      time: 'Viernes a Domingo',
      location: 'Centro de Retiros Monte Carmelo',
      category: 'jovenes',
      description: 'Dinámicas al aire libre, plenarias de liderazgo, fogata de alabanza y una inmersión espiritual inolvidable para jóvenes de 13 a 25 años.',
      badge: 'Juvenil',
    },
    {
      id: 'festival-ninos-gracia-kids',
      title: 'Festival Infantil: Campeones del Reino',
      subtitle: 'Tarde de alegría, juegos bíblicos y regalos',
      date: '2026-10-31',
      time: '03:00 PM - 06:30 PM',
      location: 'Plazoleta Kids & Jardines',
      category: 'ninos',
      description: 'Una fiesta sana y edificante donde los más pequeños aprenderán sobre los héroes de la fe con títeres, inflables, dulces y canciones interactivas.',
      badge: 'Kids',
    },
  ]);

  // ==========================================
  // Prédicas y Enseñanzas del Evangelio
  // ==========================================
  readonly sermons = signal<Sermon[]>([
    {
      id: 'la-gracia-que-restaura-el-hogar',
      title: 'La Gracia que Restaura el Hogar Quebrado',
      preacher: 'Pastor Principal',
      series: 'Familias de Pacto',
      date: 'Domingo pasado',
      passage: 'Lucas 15:11-24 (El Padre Pródigo en Amor)',
      duration: '48 min',
      summary: 'No hay hogar tan destruido que la gracia de Dios no pueda reconstruir. Aprende los 3 principios del perdón incondicional y cómo devolver la paz a tu matrimonio y relación con tus hijos.',
      tags: ['Familia', 'Gracia', 'Restauración', 'Perdón'],
    },
    {
      id: 'viviendo-bajo-la-justicia-de-cristo',
      title: 'Viviendo bajo la Justicia y Favor Inmerecido de Cristo',
      preacher: 'Pastor de Enseñanza',
      series: 'El Poder del Evangelio',
      date: 'Hace 2 semanas',
      passage: 'Romanos 8:1-17',
      duration: '52 min',
      summary: 'Descubre la libertad de vivir sin condenación. Cuando entiendes lo que Jesús logró en la cruz por ti, tu relación diaria con Dios deja de ser un deber pesado y se convierte en un deleite de amor.',
      tags: ['Evangelio', 'Libertad', 'Fe', 'Identidad'],
    },
    {
      id: 'el-altar-familiar-orando-juntos',
      title: 'El Altar Familiar: Levantando Murallas de Protección',
      preacher: 'Pastora de Comunidad',
      series: 'Hogares Sólidos',
      date: 'Hace 3 semanas',
      passage: 'Josué 24:14-15',
      duration: '42 min',
      summary: 'Cómo establecer una atmósfera de adoración en tu casa, bendecir a tus hijos cada noche y enfrentar los desafíos del mundo moderno con la armadura de Dios.',
      tags: ['Oración', 'Paternidad', 'Matrimonio'],
    },
    {
      id: 'sanidad-interior-en-la-presencia',
      title: 'Sanando las Heridas del Pasado: Un Nuevo Comienzo',
      preacher: 'Pastor Principal',
      series: 'Corazón Libre',
      date: 'Hace 1 mes',
      passage: 'Isaías 61:1-3',
      duration: '50 min',
      summary: 'Jesús vino a vendar a los quebrantados de corazón. Rompe con ciclos de dolor generacional y permite que el aceite de alegría reemplace el espíritu de angustia.',
      tags: ['Sanidad', 'Esperanza', 'Gracia'],
    },
  ]);

  // ==========================================
  // Devocional Semanal
  // ==========================================
  readonly currentDevotional = signal<Devotional>({
    id: 'devocional-gracia-abundante',
    title: 'Cuando las Fuerzas se Acaban, la Gracia Abunda',
    author: 'Ministerio Pastoral En su Gracia',
    date: 'Semana Actual',
    keyVerse: 'Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad.',
    verseReference: '2 Corintios 12:9',
    reflection: [
      'En medio de las responsabilidades familiares, la crianza de los hijos y las presiones económicas, es común sentir que nuestras fuerzas no son suficientes. Sin embargo, el evangelio nos enseña una verdad liberadora: Dios no nos pide que seamos autosuficientes, sino que confiemos en Su suficiencia.',
      'La gracia no es una simple doctrina abstracta; es el poder activo del amor de Dios manifestado en Jesucristo que interviene donde terminan nuestros recursos humanos. Cuando admites ante Dios que no puedes solo, es el momento exacto donde Su poder halla espacio para obrar maravillas.',
      'Hoy te invitamos a descansar en Sus promesas. Habla palabras de vida sobre tu cónyuge, bendice a tus hijos con paz y recuerda que el Dios de restauración camina a tu lado en cada paso del camino.'
    ],
    prayer: 'Padre celestial, hoy reconozco que mis fuerzas son limitadas pero Tu gracia es inagotable. Entrego en Tus manos las cargas de mi familia y mi hogar. Declaro que Tu paz sobrepasa todo entendimiento y que Tu amor cubre toda falta. Lléname hoy con el fuego de Tu Espíritu Santo. En el nombre de Jesús, Amén.'
  });

  // ==========================================
  // Ministerio de Alabanza y Coro
  // ==========================================
  readonly choirSongs = signal<ChoirSong[]>([
    {
      id: 'en-su-gracia-hay-vida',
      title: 'En Su Gracia Hay Vida Nueva',
      author: 'Coro En su Gracia Worship',
      tempo: 'Lenta / Íntima (72 BPM)',
      key: 'D (Re Mayor)',
      category: 'adoracion',
      lyrics: `[Estrofa 1]
En medio del desierto y la tempestad
Tu voz de amor me vino a rescatar
No por mis obras, ni por mi bondad
Sino por Tu infinita piedad.

[Coro]
En Tu gracia hay vida nueva
En Tu fuego hay salvación
Restauras a las familias
Traes gozo al corazón.
Jesús, cordero fiel, digno eres Tú!

[Puente]
De gloria en gloria me transformarás
Tu Espíritu en mi casa reinará!`,
      chords: `Intro: D  G  Bm7  A
Estrofa:
D         G
En medio del desierto
Bm7        A
Y la tempestad...
Coro:
G    D      A     Bm7
En Tu gracia hay vida nueva...`
    },
    {
      id: 'restaura-nuestro-hogar',
      title: 'Restaura Nuestro Hogar',
      author: 'Ministerio de Alabanza',
      tempo: 'Moderada (80 BPM)',
      key: 'G (Sol Mayor)',
      category: 'especial',
      lyrics: `[Estrofa]
Señor aquí están nuestras vidas
Une lo que se quebró
Sana las heridas del alma
Con el aceite de Tu amor.

[Coro]
Yo y mi casa serviremos a Jehová
Nuestra familia en Tu gracia vencerá
Fuego de Dios, desciende aquí
Haz de este hogar morada para Ti!`,
      chords: `Intro: G  C  Em  D
Estrofa: G  C  D  Em
Coro: C  G  D  Em`
    },
    {
      id: 'digno-de-alabanza',
      title: 'Digno de Toda Alabanza',
      author: 'En su Gracia Worship',
      tempo: 'Alegre / Júbilo (128 BPM)',
      key: 'E (Mi Mayor)',
      category: 'alabanza',
      lyrics: `[Estrofa]
Cantad con gozo a nuestro Rey
Pueblos todos, alabad Su gran poder
Rompiste las cadenas, nos diste libertad
Hoy celebramos Tu fidelidad!

[Coro]
¡Aleluya! Cristo vive y reina hoy
¡Aleluya! A Ti la gloria doy!`,
      chords: `E  A  C#m  B`
    }
  ]);

  // ==========================================
  // Servicios a la Comunidad & Ministerios
  // ==========================================
  readonly ministries = signal<MinistryService[]>([
    {
      id: 'consejeria-familiar',
      title: 'Consejería Pastoral & Familiar',
      subtitle: 'Acompañamiento confidencial con principios bíblicos',
      icon: 'pi pi-heart',
      schedule: 'Martes y Jueves (Con cita previa)',
      description: 'Sesiones personalizadas para matrimonios en crisis, orientación para padres en la crianza de hijos y apoyo en procesos de duelo o sanidad emocional.',
      benefits: ['100% Confidencial y gratuita', 'Guía basada en la palabra de Dios', 'Plan de restauración paso a paso'],
      contactAction: 'Agendar Consejería'
    },
    {
      id: 'grupos-familiares',
      title: 'Grupos de Conexión en Hogares',
      subtitle: 'Comunidad cercana de amigos y fe entre semana',
      icon: 'pi pi-users',
      schedule: 'Miércoles y Jueves 7:30 PM',
      description: 'Reuniones íntimas en casas de diferentes sectores de la ciudad para orar unos por otros, compartir un café y estudiar la Biblia de forma práctica.',
      benefits: ['Amistad genuina y hermandad', 'Cuidado pastoral cercano', 'Crecimiento espiritual en familia'],
      contactAction: 'Buscar Grupo Cercano'
    },
    {
      id: 'escuela-discipulado',
      title: 'Escuela de Fundamentos y Discipulado',
      subtitle: 'Fortaleciendo las raíces de tu fe cristiana',
      icon: 'pi pi-book',
      schedule: 'Sábados 04:00 PM - 06:00 PM',
      description: 'Programa formativo de 3 módulos diseñado para nuevos creyentes y líderes que desean profundizar en teología de la gracia y ministerio práctico.',
      benefits: ['Material de estudio incluido', 'Certificación de grado', 'Mentores asignados'],
      contactAction: 'Inscribirme a la Escuela'
    },
    {
      id: 'obra-social-manos-de-amor',
      title: 'Acción Social: Manos de Gracia',
      subtitle: 'Llevando pan, abrigo y esperanza a los necesitados',
      icon: 'pi pi-box',
      schedule: 'Último sábado de cada mes',
      description: 'Comedor comunitario, entrega de kits escolares y brigadas de salud gratuitas para familias vulnerables y niños de nuestra comunidad.',
      benefits: ['Voluntariado abierto a toda la congregación', 'Impacto real en barrios necesitados', 'Donaciones transparentes'],
      contactAction: 'Ser Voluntario o Donar'
    }
  ]);

  // ==========================================
  // "Generación Gracia Kids" - Área Infantil
  // ==========================================
  readonly kidsTrivia = signal<BibleTriviaQuestion[]>([
    {
      id: 1,
      question: '¿Quién venció al gigante Goliat confiando únicamente en el Señor?',
      options: ['El rey Saúl', 'David con una honda y una piedra', 'Sansón con su fuerza', 'Moisés con su vara'],
      correctAnswer: 1,
      explanation: 'David era un joven pastor, pero sabía que la batalla no era con espada ni lanza, ¡sino con el poder del Señor de los ejércitos!',
      bibleVerse: '1 Samuel 17:45'
    },
    {
      id: 2,
      question: '¿Cuántos días y noches llovió durante el diluvio en el arca de Noé?',
      options: ['7 días', '40 días y 40 noches', '100 días', '12 días'],
      correctAnswer: 1,
      explanation: 'Llovió 40 días y 40 noches, pero Dios cuidó a Noé, a su familia y a todos los animalitos dentro del arca.',
      bibleVerse: 'Génesis 7:12'
    },
    {
      id: 3,
      question: '¿Qué dijo Jesús a sus discípulos cuando los niños se acercaron a Él?',
      options: ['Dejad a los niños venir a mí y no se lo impidáis', 'Los niños deben esperar a ser grandes', 'Que los niños hagan silencio', 'Solo los adultos pueden entrar'],
      correctAnswer: 0,
      explanation: 'Jesús abrazó a los niños y dijo que de los tales es el Reino de los Cielos.',
      bibleVerse: 'Mateo 19:14'
    },
    {
      id: 4,
      question: '¿Quién fue tragado por un gran pez por intentar huir, y luego oró a Dios?',
      options: ['Jonás', 'Pedro', 'Daniel', 'Elías'],
      correctAnswer: 0,
      explanation: 'Jonás oró desde el vientre del gran pez y Dios en Su misericordia le dio una segunda oportunidad.',
      bibleVerse: 'Jonás 1:17'
    }
  ]);

  readonly kidsStories = signal<KidsStory[]>([
    {
      id: 'david-y-goliat',
      title: 'David, el Pastor Valiente',
      bibleReference: '1 Samuel 17',
      moral: 'Con Dios de nuestro lado, ningún gigante de miedo es invencible.',
      summary: 'Aprende cómo el pequeño David no tuvo miedo al gigante gigante porque confiaba con todo su corazón en el Dios todopoderoso.',
      icon: 'pi pi-shield'
    },
    {
      id: 'arca-de-noe',
      title: 'El Arca de Noé y el Arcoíris de Promesa',
      bibleReference: 'Génesis 6-9',
      moral: 'Dios siempre cumple Sus promesas y cuida a nuestra familia.',
      summary: 'Descubre cómo Noé construyó un gran barco lleno de jirafas, leones y palomas, y cómo Dios pintó un arcoíris en el cielo como señal de Su pacto eterno.',
      icon: 'pi pi-cloud'
    },
    {
      id: 'jesus-los-ninos',
      title: 'Jesús Ama a los Niños',
      bibleReference: 'Marcos 10:13-16',
      moral: 'Eres muy valioso e importante para Jesús.',
      summary: 'Jesús puso Sus manos sobre cada niño, los bendijo y enseñó a todos que para amar a Dios debemos tener un corazón puro y alegre como el de un niño.',
      icon: 'pi pi-heart-fill'
    }
  ]);

  readonly memoryVerses = signal<MemoryVerse[]>([
    {
      id: 1,
      verse: 'Todo lo puedo en Cristo que me fortalece.',
      reference: 'Filipenses 4:13',
      level: 'Fácil',
      hint: '¿Quién es el que nos da fuerzas para todo?'
    },
    {
      id: 2,
      verse: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.',
      reference: 'Salmos 119:105',
      level: 'Intermedio',
      hint: 'La Biblia ilumina nuestros pasos en la oscuridad.'
    },
    {
      id: 3,
      verse: 'Cree en el Señor Jesucristo, y serás salvo, tú y tu casa.',
      reference: 'Hechos 16:31',
      level: 'Campeón',
      hint: 'La promesa gloriosa para toda nuestra familia.'
    }
  ]);

  // ==========================================
  // Métodos Auxiliares
  // ==========================================
  getFeaturedEvents() {
    return computed(() => this.events().filter(e => e.featured));
  }

  getEventById(id: string) {
    return computed(() => this.events().find(e => e.id === id));
  }

  // ==========================================
  // Sincronización con Google Sheets
  // ==========================================
  async syncAllFromGoogleSheets(force: boolean = false): Promise<void> {
    const apiUrl = environment.googleSheetsApiUrl?.trim();
    if (!apiUrl) {
      // Sin URL configurada: se mantienen intactos los datos locales de respaldo
      return;
    }

    if (this.syncPromise && !force) {
      return this.syncPromise;
    }

    if (this.lastSyncDate() && !force) {
      return;
    }

    this.isLoadingData.set(true);
    this.syncError.set(null);

    this.syncPromise = new Promise<void>((resolve) => {
      this.http.get<any>(apiUrl).subscribe({
        next: (res) => {
          try {
            const payload = res?.data || res;
            if (payload) {
              if (Array.isArray(payload.events) && payload.events.length > 0) {
                this.events.set(payload.events.map((e: ChurchEvent) => this.normalizeEvent(e)));
              }
              if (Array.isArray(payload.sermons) && payload.sermons.length > 0) {
                this.sermons.set(payload.sermons.map((s: Sermon) => this.normalizeSermon(s)));
              }
              if (payload.devotional && payload.devotional.title) {
                this.currentDevotional.set(payload.devotional);
              }
              if (Array.isArray(payload.choirSongs) && payload.choirSongs.length > 0) {
                this.choirSongs.set(payload.choirSongs);
              }
              if (Array.isArray(payload.ministries) && payload.ministries.length > 0) {
                this.ministries.set(payload.ministries);
              }
              if (Array.isArray(payload.kidsStories) && payload.kidsStories.length > 0) {
                this.kidsStories.set(payload.kidsStories);
              }
              if (Array.isArray(payload.memoryVerses) && payload.memoryVerses.length > 0) {
                this.memoryVerses.set(payload.memoryVerses);
              }
              if (Array.isArray(payload.kidsTrivia) && payload.kidsTrivia.length > 0) {
                this.kidsTrivia.set(payload.kidsTrivia);
              }
              if (payload.motto && payload.motto.theme) {
                this.ministryMotto.set(payload.motto);
              }
              this.lastSyncDate.set(new Date());
            }
          } catch (e: any) {
            console.warn('Error al procesar datos de Google Sheets:', e);
            this.syncError.set(e?.message || 'Error al procesar datos');
          } finally {
            this.isLoadingData.set(false);
            this.syncPromise = null;
            resolve();
          }
        },
        error: (err) => {
          console.warn('No se pudo sincronizar con Google Sheets. Usando datos de respaldo locales.', err);
          this.syncError.set('No se pudo conectar con Google Sheets');
          this.isLoadingData.set(false);
          this.syncPromise = null;
          resolve();
        }
      });
    });

    return this.syncPromise;
  }

  async syncSheet(sheetName: string): Promise<void> {
    const apiUrl = environment.googleSheetsApiUrl?.trim();
    if (!apiUrl) return;

    this.isLoadingData.set(true);
    const separator = apiUrl.includes('?') ? '&' : '?';
    const targetUrl = `${apiUrl}${separator}sheet=${encodeURIComponent(sheetName)}`;

    return new Promise<void>((resolve) => {
      this.http.get<any>(targetUrl).subscribe({
        next: (res) => {
          const list = res?.data || res;
          if (Array.isArray(list) && list.length > 0) {
            switch (sheetName.toLowerCase()) {
              case 'eventos':
                this.events.set(list);
                break;
              case 'predicas':
                this.sermons.set(list);
                break;
              case 'devocional':
                if (list[0]) this.currentDevotional.set(list[0]);
                break;
              case 'canciones':
                this.choirSongs.set(list);
                break;
              case 'servicios':
                this.ministries.set(list);
                break;
              case 'kids_historias':
                this.kidsStories.set(list);
                break;
              case 'kids_versiculos':
                this.memoryVerses.set(list);
                break;
              case 'kids_trivia':
                this.kidsTrivia.set(list);
                break;
            }
          }
          this.isLoadingData.set(false);
          resolve();
        },
        error: () => {
          this.isLoadingData.set(false);
          resolve();
        }
      });
    });
  }

  private normalizeEvent(e: ChurchEvent): ChurchEvent {
    return {
      ...e,
      date: this.cleanDateString(e.date),
      time: this.cleanTimeString(e.time),
    };
  }

  private normalizeSermon(s: Sermon): Sermon {
    return {
      ...s,
      date: this.cleanDateString(s.date),
    };
  }

  private cleanDateString(val: any): string {
    if (!val) return '';
    const str = String(val).trim();
    if (str.includes('T') && !isNaN(Date.parse(str))) {
      const d = new Date(str);
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    }
    return str;
  }

  private cleanTimeString(val: any): string {
    if (!val) return '';
    const str = String(val).trim();
    if (str.startsWith('1899-') || (str.includes('T') && !isNaN(Date.parse(str)))) {
      const d = new Date(str);
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
    return str;
  }
}
