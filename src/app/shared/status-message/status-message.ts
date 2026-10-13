import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Loading, empty and error states, announced to screen readers. */
@Component({
  selector: 'app-status-message',
  template: `
    <div
      class="status"
      [class.status--error]="kind() === 'error'"
      [attr.role]="kind() === 'error' ? 'alert' : 'status'"
    >
      @if (kind() === 'loading') {
        <span class="status__spinner" aria-hidden="true"></span>
      }
      <p class="status__title">{{ title() }}</p>
      @if (detail()) {
        <p class="status__detail">{{ detail() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .status {
      display: grid;
      justify-items: center;
      gap: 0.5rem;
      padding: 3rem 1.5rem;
      border: 1px dashed var(--line);
      border-radius: var(--radius);
      text-align: center;
    }
    .status--error {
      border-color: var(--danger);
    }
    .status__title {
      margin: 0;
      font-weight: 600;
      font-size: 1.125rem;
    }
    .status__detail {
      margin: 0;
      color: var(--muted);
    }
    .status__spinner {
      width: 28px;
      height: 28px;
      border: 3px solid var(--line);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusMessage {
  readonly kind = input<'loading' | 'empty' | 'error'>('loading');
  readonly title = input.required<string>();
  readonly detail = input<string>();
}
