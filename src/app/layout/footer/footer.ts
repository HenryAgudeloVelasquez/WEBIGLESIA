import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChurchDataService } from '../../core/services/church-data.service';
import { ChurchConfigService } from '../../core/services/church-config.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly churchService = inject(ChurchDataService);
  private readonly configService = inject(ChurchConfigService);

  readonly motto = this.churchService.ministryMotto;
  readonly schedules = this.configService.schedules;
  readonly contact = this.configService.pastoralContact;
  readonly currentWhatsApp = this.configService.currentWhatsApp;
  readonly env = environment;
  readonly currentYear = new Date().getFullYear();
}

