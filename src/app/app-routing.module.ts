import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SentryClipsComponent } from './sentry-clips/sentry-clips.component';

const routes: Routes = [
  { 
    path: 'home',
    title: 'Home',
    component: HomePageComponent
  },
  {
    path: 'sentry-clips',
    title: 'Sentry clips',
    component: SentryClipsComponent
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
