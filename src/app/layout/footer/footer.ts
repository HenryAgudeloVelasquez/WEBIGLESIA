import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChurchDataService } from '../../core/services/church-data.service';
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
  readonly motto = this.churchService.ministryMotto;
  readonly env = environment;
  readonly currentYear = new Date().getFullYear();
}
