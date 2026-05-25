import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AdminSubmissionsApiService } from './admin-submissions-api.service';
import { AdminSubmissionsPage } from './admin-submissions-page';

describe('AdminSubmissionsPage', () => {
  let fixture: ComponentFixture<AdminSubmissionsPage>;
  let adminSubmissionsApi: Pick<AdminSubmissionsApiService, 'listSubmissions'>;

  beforeEach(async () => {
    adminSubmissionsApi = {
      listSubmissions: vi.fn().mockReturnValue(
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
          page: 1,
          size: 10,
          totalElements: 1,
          totalPages: 2,
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [AdminSubmissionsPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(
              convertToParamMap({
                userId: 'user-id',
                taskId: 'task-id',
                status: 'ACCEPTED',
                page: '1',
                size: '10',
              }),
            ),
          },
        },
        {
          provide: AdminSubmissionsApiService,
          useValue: adminSubmissionsApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSubmissionsPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render admin submissions and request query filters', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(adminSubmissionsApi.listSubmissions).toHaveBeenCalledWith({
      userId: 'user-id',
      taskId: 'task-id',
      status: 'ACCEPTED',
      page: 1,
      size: 10,
    });
    expect(compiled.textContent).toContain('submission-id');
    expect(compiled.textContent).toContain('user-id');
    expect(compiled.textContent).toContain('task-id');
    expect(compiled.textContent).toContain('42 ms');
  });

  it('should navigate with current filters when page changes', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance['setPage'](2);

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/submissions'], {
      queryParams: {
        userId: 'user-id',
        taskId: 'task-id',
        status: 'ACCEPTED',
        page: 2,
        size: 10,
      },
    });
  });

  it('should navigate with form filters when applying filters', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance['filtersForm'].setValue({
      userId: ' next-user ',
      taskId: 'next-task',
      status: 'WRONG_ANSWER',
    });
    fixture.componentInstance['applyFilters']();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/submissions'], {
      queryParams: {
        page: 0,
        size: 10,
        userId: 'next-user',
        taskId: 'next-task',
        status: 'WRONG_ANSWER',
      },
    });
  });
});
