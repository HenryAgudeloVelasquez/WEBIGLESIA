import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ChurchDataService } from '../../core/services/church-data.service';
import { Sermon } from '../../core/models/church.model';
import { MessageService } from 'primeng/api';

type TabView = 'sermons' | 'devotional' | 'gospel-plan';

@Component({
  selector: 'app-content',
  standalone: true,
  templateUrl: './content.html',
  styleUrl: './content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  private readonly churchService = inject(ChurchDataService);
  private readonly messageService = inject(MessageService);

  readonly isLoading = this.churchService.isLoadingData;
  readonly currentTab = signal<TabView>('sermons');
  readonly selectedTag = signal<string>('todos');
  readonly searchQuery = signal<string>('');

  readonly sermons = this.churchService.sermons;
  readonly devotional = this.churchService.currentDevotional;

  // Active playing sermon simulation
  readonly activePlayingSermon = signal<Sermon | null>(null);
  readonly isAudioPlaying = signal<boolean>(false);

  readonly tags = ['todos', 'Familia', 'Gracia', 'Restauración', 'Evangelio', 'Fe', 'Sanidad'];

  readonly filteredSermons = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const tag = this.selectedTag();

    return this.sermons().filter((sermon) => {
      const matchesTag = tag === 'todos' || sermon.tags.includes(tag);
      const matchesQuery =
        !query ||
        sermon.title.toLowerCase().includes(query) ||
        sermon.preacher.toLowerCase().includes(query) ||
        sermon.passage.toLowerCase().includes(query) ||
        sermon.summary.toLowerCase().includes(query);
      return matchesTag && matchesQuery;
    });
  });

  ngOnInit(): void {
    this.churchService.syncAllFromGoogleSheets();
  }

  setTab(tab: TabView): void {
    this.currentTab.set(tab);
  }

  setTag(tag: string): void {
    this.selectedTag.set(tag);
  }

  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  playSermon(sermon: Sermon): void {
    if (this.activePlayingSermon()?.id === sermon.id) {
      this.isAudioPlaying.update((v) => !v);
    } else {
      this.activePlayingSermon.set(sermon);
      this.isAudioPlaying.set(true);
      this.messageService.add({
        severity: 'info',
        summary: 'Reproduciendo Mensaje',
        detail: `Escuchando: "${sermon.title}"`,
        life: 3000,
      });
    }
  }

  downloadNotes(sermon: Sermon): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Notas del Mensaje',
      detail: `Descargando bosquejo y versículos de: "${sermon.title}"`,
      life: 3000,
    });
  }

  copyDevotionalPrayer(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.devotional().prayer);
      this.messageService.add({
        severity: 'success',
        summary: 'Oración Copiada',
        detail: 'La oración del devocional fue copiada a tu portapapeles.',
        life: 3000,
      });
    }
  }
}
