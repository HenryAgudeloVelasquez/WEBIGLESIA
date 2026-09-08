import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ChurchDataService } from '../../core/services/church-data.service';
import { BibleTriviaQuestion, KidsStory, MemoryVerse } from '../../core/models/church.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-kids',
  standalone: true,
  templateUrl: './kids.html',
  styleUrl: './kids.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KidsComponent {
  private readonly churchService = inject(ChurchDataService);
  private readonly messageService = inject(MessageService);

  readonly triviaList = this.churchService.kidsTrivia;
  readonly stories = this.churchService.kidsStories;
  readonly verses = this.churchService.memoryVerses;

  // Active Story Modal
  readonly activeStory = signal<KidsStory | null>(null);

  // Trivia State
  readonly currentQuestionIndex = signal<number>(0);
  readonly selectedOption = signal<number | null>(null);
  readonly isAnswerChecked = signal<boolean>(false);
  readonly score = signal<number>(0);
  readonly isTriviaFinished = signal<boolean>(false);

  // Memory Verse Revealed State
  readonly revealedVerses = signal<Record<number, boolean>>({});

  readonly currentQuestion = computed<BibleTriviaQuestion>(() => {
    return this.triviaList()[this.currentQuestionIndex()];
  });

  selectTriviaOption(index: number): void {
    if (this.isAnswerChecked()) return;
    this.selectedOption.set(index);
  }

  checkAnswer(): void {
    if (this.selectedOption() === null) return;
    this.isAnswerChecked.set(true);

    const isCorrect = this.selectedOption() === this.currentQuestion().correctAnswer;
    if (isCorrect) {
      this.score.update((s) => s + 100);
      this.messageService.add({
        severity: 'success',
        summary: '¡Respuesta Correcta! ⭐',
        detail: '¡Excelente! Has ganado 100 puntos de fe.',
        life: 2500,
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: '¡Casi lo logras!',
        detail: 'Revisa la explicación bíblica y sigue aprendiendo.',
        life: 3000,
      });
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.triviaList().length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
      this.selectedOption.set(null);
      this.isAnswerChecked.set(false);
    } else {
      this.isTriviaFinished.set(true);
    }
  }

  restartTrivia(): void {
    this.currentQuestionIndex.set(0);
    this.selectedOption.set(null);
    this.isAnswerChecked.set(false);
    this.score.set(0);
    this.isTriviaFinished.set(false);
  }

  toggleVerse(id: number): void {
    this.revealedVerses.update((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  openStory(story: KidsStory): void {
    this.activeStory.set(story);
  }

  closeStory(): void {
    this.activeStory.set(null);
  }

  printColoringPage(title: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Hoja para Colorear',
      detail: `Abriendo dibujo para imprimir de: "${title}"`,
      life: 3000,
    });
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
