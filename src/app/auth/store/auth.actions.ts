import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Succeeded': props<{ username: string; securityKey: string }>(),
    Logout: emptyProps(),
  },
});
