import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { WhatsappButtonComponent } from './layout/whatsapp-button/whatsapp-button';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ChurchConfigService } from './core/services/church-config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    WhatsappButtonComponent,
    Toast,
    ConfirmDialog,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly configService = inject(ChurchConfigService);

  ngOnInit(): void {
    this.configService.syncConfigFromGoogleSheets();
  }
}
