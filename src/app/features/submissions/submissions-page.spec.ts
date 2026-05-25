import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { SubmissionsApiService } from './submissions-api.service';
import { SubmissionsPage } from './submissions-page';

describe('SubmissionsPage', () => {
  let fixture: ComponentFixture<SubmissionsPage>;
  let submissionsApi: Pick<SubmissionsApiService, 'listCurrentUserSubmissions'>;

  beforeEach(async () => {
    submissionsApi = {
      listCurrentUserSubmissions: vi.fn().mockReturnValue(
        of({
          content: [
            {
              id: 'submission-id',
              userId: 'user-id',
              taskId: 'task-id',
              sourceCode: 'class Solution {}',
              status: 'ACCEPTED',
              executionMetadata: '{"status":"ACCEPTED"}',
              executionDurationMs: 42,
              createdAt: '2026-05-25T00:00:00Z',
              updatedAt: '2026-05-25T00:01:00Z',
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
      imports: [SubmissionsPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ page: '0', size: '20' })),
          },
        },
        {
          provide: SubmissionsApiService,
          useValue: submissionsApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmissionsPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render current user submissions', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(submissionsApi.listCurrentUserSubmissions).toHaveBeenCalledWith({
      page: 0,
      size: 20,
    });
    expect(compiled.textContent).toContain('ACCEPTED');
    expect(compiled.textContent).toContain('task-id');
    expect(compiled.textContent).toContain('42 ms');
  });

  it('should navigate when page changes', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance['setPage'](1);

    expect(navigateSpy).toHaveBeenCalledWith(['/submissions'], {
      queryParams: {
        page: 1,
        size: 20,
      },
    });
  });
});
