import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { API_BASE_URL } from './core/api/api-config';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: API_BASE_URL,
          useValue: 'http://localhost:8080',
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the application shell', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-text')?.textContent).toContain('Monad Academy');
    expect(compiled.querySelector('nav')?.textContent).toContain('Tasks');
  });

  it('should switch language from the topbar and persist selection', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.language-toggle');

    expect(toggle?.textContent?.trim()).toBe('EN');

    toggle?.click();
    fixture.detectChanges();

    expect(toggle?.textContent?.trim()).toBe('RU');
    expect(compiled.querySelector('nav')?.textContent).toContain('Задачи');
    expect(localStorage.getItem('monad-academy.locale')).toBe('ru');
  });
});
