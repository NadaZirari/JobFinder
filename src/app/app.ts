import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header />
      <main class="flex-grow">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('job-finder');
}
