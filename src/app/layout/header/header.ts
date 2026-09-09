import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT } from '@angular/common';
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
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly isMenuOpen = signal<boolean>(false);

  readonly navItems = signal<NavItem[]>([
    { label: 'Inicio', route: '/home', icon: 'pi pi-home' },
    { label: 'Eventos', route: '/eventos', icon: 'pi pi-calendar' },
    { label: 'Evangelio', route: '/evangelio', icon: 'pi pi-book' },
    { label: 'Coro & Alabanza', route: '/coro', icon: 'pi pi-volume-up' },
    { label: 'Servicios', route: '/servicios', icon: 'pi pi-users' },
    { label: 'Gracia Kids', route: '/kids', icon: 'pi pi-star', highlight: true },
  ]);

  ngOnInit(): void {
    // Modo oscuro permanente (Royal Navy & Oro Imperial)
    const root = this.document.documentElement;
    root.classList.add('app-dark');

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
}

