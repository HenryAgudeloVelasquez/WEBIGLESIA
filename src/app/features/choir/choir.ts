import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ChurchDataService } from '../../core/services/church-data.service';
import { ChoirSong } from '../../core/models/church.model';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-choir',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './choir.html',
  styleUrl: './choir.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoirComponent {
  private readonly churchService = inject(ChurchDataService);
  private readonly messageService = inject(MessageService);

  readonly songs = this.churchService.choirSongs;
  readonly selectedCategory = signal<'todas' | 'adoracion' | 'alabanza' | 'especial'>('todas');
  readonly activeSong = signal<ChoirSong | null>(this.songs()[0]);
  readonly showChords = signal<boolean>(false);
  readonly env = environment;

  // Audition Form signals
  readonly applicantName = signal<string>('');
  readonly applicantInstrument = signal<string>('Voz / Canto');
  readonly applicantExperience = signal<string>('');

  readonly filteredSongs = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'todas') return this.songs();
    return this.songs().filter((s) => s.category === cat);
  });

  setCategory(cat: 'todas' | 'adoracion' | 'alabanza' | 'especial'): void {
    this.selectedCategory.set(cat);
  }

  selectSong(song: ChoirSong): void {
    this.activeSong.set(song);
  }

  toggleChords(): void {
    this.showChords.update((v) => !v);
  }

  sendAuditionRequest(): void {
    const name = this.applicantName().trim();
    const inst = this.applicantInstrument();
    const exp = this.applicantExperience().trim();

    if (!name) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Por favor ingresa tu nombre completo para la audición.',
        life: 3000,
      });
      return;
    }

    const msg = `¡Hola Líderes de Alabanza! Mi nombre es *${name}*. Deseo postularme a las audiciones del coro En su Gracia para el área de: *${inst}*. Experiencia: ${exp || 'Deseo aprender y servir de corazón'}.`;
    const url = `https://wa.me/${this.env.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Solicitud Enviada',
      detail: 'Tu información ha sido enviada al ministerio de alabanza por WhatsApp.',
      life: 3500,
    });
  }
}
