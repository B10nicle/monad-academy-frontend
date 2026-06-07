import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SessionService } from './core/auth/session.service';
import { I18nPipe } from './core/i18n/i18n.pipe';
import { I18nService } from './core/i18n/i18n.service';

@Component({
  selector: 'app-root',
  imports: [I18nPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);

  protected readonly i18n = inject(I18nService);
  protected readonly session = inject(SessionService);

  protected logout(): void {
    this.session.logout();
    void this.router.navigate(['/tasks']);
  }

  protected toggleLanguage(): void {
    this.i18n.toggleLocale();
  }
}
