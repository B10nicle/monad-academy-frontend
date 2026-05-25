import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { API_BASE_URL } from '../../core/api/api-config';
import { TasksApiService } from './tasks-api.service';
import { TasksPage } from './tasks-page';

describe('TasksPage', () => {
  let fixture: ComponentFixture<TasksPage>;
  let tasksApi: Pick<TasksApiService, 'listTasks'>;

  beforeEach(async () => {
    tasksApi = {
      listTasks: vi.fn().mockReturnValue(
        of({
          content: [
            {
              id: 'task-id',
              title: 'Stream filter',
              slug: 'stream-filter',
              difficulty: 'EASY',
              topic: 'STREAM_API',
            },
          ],
          page: 0,
          size: 20,
          totalElements: 1,
          totalPages: 1,
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [TasksPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: API_BASE_URL,
          useValue: 'http://localhost:8080',
        },
        {
          provide: TasksApiService,
          useValue: tasksApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render tasks from API', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(tasksApi.listTasks).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(compiled.textContent).toContain('Stream filter');
    expect(compiled.textContent).toContain('EASY');
    expect(compiled.textContent).toContain('STREAM_API');
  });

  it('should navigate when page changes', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance['setPage'](1);

    expect(navigateSpy).toHaveBeenCalledWith(['/tasks'], {
      queryParams: {
        page: 1,
        size: 20,
      },
    });
  });
});
