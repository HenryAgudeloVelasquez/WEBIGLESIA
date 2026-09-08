import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { filter } from 'rxjs';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  highlight?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule, TooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly isDarkMode = signal<boolean>(true);
  readonly isMenuOpen = signal<boolean>(false);

  readonly navItems = signal<NavItem[]>([
    { label: 'Inicio', route: '/home', icon: 'pi pi-home' },
    { label: 'Eventos', route: '/eventos', icon: 'pi pi-calendar' },
    { label: 'Evangelio', route: '/evangelio', icon: 'pi pi-book' },
    { label: 'Coro & Alabanza', route: '/coro', icon: 'pi pi-volume-up' },
    { label: 'Servicios', route: '/servicios', icon: 'pi pi-users' },
    { label: 'Gracia Kids', route: '/kids', icon: 'pi pi-star', highlight: true },
  ]);

  readonly themeIcon = computed(() =>
    this.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon',
  );

  readonly themeLabel = computed(() =>
    this.isDarkMode() ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Noche',
  );

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('church-dark-mode');
      const prefersDark =
        stored !== null
          ? stored === 'true'
          : true; // Modo oscuro por defecto para resaltar el oro y azul marino

      this.isDarkMode.set(prefersDark);
      this.applyTheme(prefersDark);
    }

    const navSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
      });

    this.destroyRef.onDestroy(() => navSub.unsubscribe());
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleDarkMode(): void {
    this.isDarkMode.update((v) => !v);
    this.applyTheme(this.isDarkMode());

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('church-dark-mode', String(this.isDarkMode()));
    }
  }

  private applyTheme(isDark: boolean): void {
    const root = this.document.documentElement;
    if (isDark) {
      root.classList.add('app-dark');
    } else {
      root.classList.remove('app-dark');
    }
  }
}
