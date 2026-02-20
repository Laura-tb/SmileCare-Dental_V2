import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { CitasPage } from './pages/citas-page/citas-page';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';


export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'citas',
        component: CitasPage
      }
    ]
  }
];