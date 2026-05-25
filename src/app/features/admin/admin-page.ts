import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <p class="eyebrow">Admin</p>
      <h1>Administration</h1>
    </section>

    <section class="admin-actions">
      <a routerLink="/admin/tasks/new">
        <span>Task authoring</span>
        <strong>Create a task</strong>
      </a>
    </section>
  `,
  styles: `
    .page-header {
      margin-bottom: 20px;
    }

    .eyebrow {
      margin: 0 0 6px;
      color: #697386;
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      line-height: 1.1;
    }

    .admin-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    a {
      display: grid;
      gap: 8px;
      padding: 20px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
      color: #151922;
      text-decoration: none;
    }

    a:hover {
      background: #f8fafc;
    }

    span {
      color: #697386;
      font-size: 0.82rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    strong {
      font-size: 1.1rem;
    }
  `,
})
export class AdminPage {}
