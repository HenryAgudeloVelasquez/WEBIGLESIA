import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
    title: 'Inicio | Ministerio de Restauración Familiar - En su Gracia',
  },
  {
    path: 'eventos',
    loadComponent: () => import('./features/events/events').then((m) => m.EventsComponent),
    title: 'Eventos y Agenda | En su Gracia',
  },
  {
    path: 'evangelio',
    loadComponent: () => import('./features/content/content').then((m) => m.ContentComponent),
    title: 'Evangelio y Enseñanzas | En su Gracia',
  },
  {
    path: 'coro',
    loadComponent: () => import('./features/choir/choir').then((m) => m.ChoirComponent),
    title: 'Ministerio de Alabanza y Coro | En su Gracia Worship',
  },
  {
    path: 'servicios',
    loadComponent: () => import('./features/services/services').then((m) => m.ServicesComponent),
    title: 'Servicios a la Comunidad | En su Gracia',
  },
  {
    path: 'kids',
    loadComponent: () => import('./features/kids/kids').then((m) => m.KidsComponent),
    title: 'Generación Gracia Kids | Espacio Infantil Interactivo',
  },
];
