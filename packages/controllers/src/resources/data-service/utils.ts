import type { Observable } from 'rxjs';

import { NEVER } from 'rxjs';

import { ETodoListType } from '@/api';

export function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export function emptyObservable<T>() {
  return NEVER as Observable<T>;
}

export function getInitialStatus<T>(initialValue: T) {
  const result: Record<ETodoListType, T> = {
    [ETodoListType.PENDING]: initialValue,
    [ETodoListType.OVERDUE]: initialValue,
    [ETodoListType.ARCHIVE]: initialValue,
  };
  return result;
}
