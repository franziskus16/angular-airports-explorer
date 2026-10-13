import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './auth/store/auth.actions';
import { selectIsLoggedIn, selectUsername } from './auth/store/auth.selectors';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly isLoggedIn = this.store.selectSignal(selectIsLoggedIn);
  protected readonly username = this.store.selectSignal(selectUsername);

  protected logout(): void {
    this.store.dispatch(AuthActions.logout());
    void this.router.navigate(['/login']);
  }
}
