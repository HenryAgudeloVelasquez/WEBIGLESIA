import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ChurchDataService } from '../../core/services/church-data.service';
import { ChurchEvent, EventCategory } from '../../core/models/church.model';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './events.html',
  styleUrl: './events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent implements OnInit {
  private readonly churchService = inject(ChurchDataService);
  private readonly messageService = inject(MessageService);

  readonly allEvents = this.churchService.events;
  readonly isLoading = this.churchService.isLoadingData;
  readonly selectedCategory = signal<EventCategory | 'todos'>('todos');
  readonly activeEventModal = signal<ChurchEvent | null>(null);
  readonly env = environment;

  ngOnInit(): void {
    this.churchService.syncAllFromGoogleSheets();
  }

  refreshEvents(): void {
    this.churchService.syncSheet('Eventos');
  }

  readonly categories: { label: string; value: EventCategory | 'todos'; icon: string }[] = [
    { label: 'Todos los Eventos', value: 'todos', icon: 'pi pi-th-large' },
    { label: 'Cultos & Celebración', value: 'culto', icon: 'pi pi-sun' },
    { label: 'Familias & Matrimonios', value: 'familia', icon: 'pi pi-heart' },
    { label: 'Jóvenes', value: 'jovenes', icon: 'pi pi-bolt' },
    { label: 'Oración & Vigilias', value: 'oracion', icon: 'pi pi-shield' },
    { label: 'Gracia Kids', value: 'ninos', icon: 'pi pi-star' },
  ];

  readonly filteredEvents = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'todos') {
      return this.allEvents();
    }
    return this.allEvents().filter((e) => e.category === cat);
  });

  setCategory(cat: EventCategory | 'todos'): void {
    this.selectedCategory.set(cat);
  }

  openEventDetails(event: ChurchEvent): void {
    this.activeEventModal.set(event);
  }

  closeEventDetails(): void {
    this.activeEventModal.set(null);
  }

  getGoogleCalendarUrl(event: ChurchEvent): string {
    const title = encodeURIComponent(event.title + ' - Iglesia En su Gracia');
    const details = encodeURIComponent(event.description + '\nUbicación: ' + event.location);
    const location = encodeURIComponent(event.location);
    // Standard Google Calendar link
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  }

  getWhatsAppRegistrationUrl(event: ChurchEvent): string {
    const msg = `¡Hola! Deseo registrarme y recibir más información sobre el evento: *${event.title}* del ${event.date}.`;
    return `https://wa.me/${this.env.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
}
