import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChurchDataService } from '../../core/services/church-data.service';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly churchService = inject(ChurchDataService);
  private readonly messageService = inject(MessageService);

  readonly motto = this.churchService.ministryMotto;
  readonly communityImageUrl = computed(() => {
    const raw = (this.motto() as any)?.communityImage || (this.motto() as any)?.image;
    if (raw && typeof raw === 'string' && raw.trim().length > 0) {
      const trimmed = raw.trim();
      const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
      }
      return trimmed;
    }
    return 'assets/images/comunidad.jpg';
  });
  readonly events = this.churchService.events;
  readonly featuredEvents = computed(() => this.events().slice(0, 3));
  readonly sermons = this.churchService.sermons;
  readonly latestSermon = computed(() => this.sermons()[0]);
  readonly env = environment;


  // Countdown al próximo domingo 10:00 AM
  readonly countdown = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 4 Pilares del Ministerio
  readonly pillars = [
    {
      title: 'Restauración Familiar',
      icon: 'pi pi-heart',
      badge: 'Núcleo Central',
      color: 'var(--color-burgundy-light)',
      description: 'Creemos en la sanidad profunda de matrimonios, la reconciliación entre padres e hijos y el fortalecimiento espiritual del hogar bajo el pacto de Dios.',
    },
    {
      title: 'Evangelio de la Gracia',
      icon: 'pi pi-sun',
      badge: 'Fundamento',
      color: 'var(--color-primary)',
      description: 'Predicamos la obra consumada de Jesús en la cruz: salvación por fe, justificación inmerecida y libertad total de toda condenación.',
    },
    {
      title: 'Alabanza & Adoración Viva',
      icon: 'pi pi-volume-up',
      badge: 'Presencia',
      color: '#38BDF8',
      description: 'Un coro y ministerio musical que adora en espíritu y en verdad, desatando una atmósfera de gloria y sanidad en cada reunión.',
    },
    {
      title: 'Generación Gracia Kids',
      icon: 'pi pi-star',
      badge: 'Semillero',
      color: '#F59E0B',
      description: 'Espacio lúdico y educativo donde niños de todas las edades aprenden a amar a Jesús mediante historias bíblicas, juegos y memorización.',
    },
  ];

  ngOnInit(): void {
    this.churchService.syncAllFromGoogleSheets();
    this.calculateCountdown();
    if (typeof window !== 'undefined') {
      setInterval(() => this.calculateCountdown(), 1000);
    }
  }

  calculateCountdown(): void {
    const now = new Date();
    const nextSunday = new Date();
    // Calcular próximo domingo a las 10:00 AM
    const dayOfWeek = now.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 && now.getHours() >= 12 ? 7 : daysUntilSunday));
    nextSunday.setHours(10, 0, 0, 0);

    const diff = nextSunday.getTime() - now.getTime();
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      this.countdown.set({ days, hours, minutes, seconds });
    }
  }

  copyVerse(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const text = `"${this.motto().verse}" — ${this.motto().reference} | Ministerio En su Gracia`;
      navigator.clipboard.writeText(text);
      this.messageService.add({
        severity: 'success',
        summary: 'Versículo Copiado',
        detail: 'El versículo ha sido copiado a tu portapapeles para compartir.',
        life: 3000,
      });
    }
  }
}
