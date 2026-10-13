import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

export const { selectUsername, selectSecurityKey } = authFeature;

export const selectIsLoggedIn = createSelector(selectSecurityKey, (key) => key !== null);
