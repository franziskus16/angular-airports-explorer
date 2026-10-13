import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth.actions';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  /** Set by the auth guard so the user lands where they were heading. */
  readonly returnUrl = input<string>();

  protected readonly form = inject(NonNullableFormBuilder).group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Demo only: there is no real backend, so any valid credentials sign in
    // and the session gets a fresh random security key.
    this.store.dispatch(
      AuthActions.loginSucceeded({
        username: this.form.getRawValue().username.trim(),
        securityKey: crypto.randomUUID(),
      }),
    );

    const target = this.returnUrl();
    void this.router.navigateByUrl(target?.startsWith('/') ? target : '/airports');
  }

  protected showError(control: 'username' | 'password'): boolean {
    const field = this.form.controls[control];
    return field.invalid && field.touched;
  }
}
