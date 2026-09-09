import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ChurchDataService } from '../../core/services/church-data.service';
import { MinistryService } from '../../core/models/church.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit {
  private readonly churchService = inject(ChurchDataService);
  readonly isLoading = this.churchService.isLoadingData;
  readonly ministries = this.churchService.ministries;
  readonly env = environment;

  readonly activeMinistryModal = signal<MinistryService | null>(null);

  ngOnInit(): void {
    this.churchService.syncAllFromGoogleSheets();
  }

  openModal(m: MinistryService): void {
    this.activeMinistryModal.set(m);
  }

  closeModal(): void {
    this.activeMinistryModal.set(null);
  }

  getWhatsAppScheduleUrl(m: MinistryService): string {
    const msg = `¡Hola! Me comunico desde la web para recibir información o agendar: *${m.title}* (${m.subtitle}).`;
    return `https://wa.me/${this.env.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
}
