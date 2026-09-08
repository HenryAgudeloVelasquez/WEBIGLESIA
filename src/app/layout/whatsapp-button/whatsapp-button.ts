import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

interface QuickOption {
  title: string;
  icon: string;
  message: string;
}

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappButtonComponent {
  readonly isCardOpen = signal<boolean>(false);
  readonly phoneNumber = environment.whatsappNumber;

  readonly quickOptions: QuickOption[] = [
    {
      title: 'Petición de Oración',
      icon: 'pi pi-heart-fill',
      message: '¡Hola Pastores! Me gustaría compartir una petición de oración por mi familia y hogar.',
    },
    {
      title: 'Información de Cultos y Horarios',
      icon: 'pi pi-calendar',
      message: '¡Hola! Deseo saber los horarios y ubicación para visitar la iglesia este domingo.',
    },
    {
      title: 'Solicitar Consejería Familiar',
      icon: 'pi pi-users',
      message: '¡Hola! Deseo información para agendar una cita de consejería matrimonial/familiar.',
    },
    {
      title: 'Hablar con un Líder',
      icon: 'pi pi-comment',
      message: '¡Hola! Deseo comunicarme con un hermano de la iglesia En su Gracia.',
    },
  ];

  toggleCard(): void {
    this.isCardOpen.update((v) => !v);
  }

  closeCard(): void {
    this.isCardOpen.set(false);
  }

  getWhatsAppLink(customMessage: string): string {
    return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(customMessage)}`;
  }
}
