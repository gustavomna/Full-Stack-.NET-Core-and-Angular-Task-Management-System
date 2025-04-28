import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class DebounceHelper<T> {
  private subject = new Subject<T>();
  private debounceTime: number;

  constructor(debounceTimeMs: number = 300) {
    this.debounceTime = debounceTimeMs;
  }

  get valueChanges(): Observable<T> {
    return this.subject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );
  }

  next(value: T): void {
    this.subject.next(value);
  }

  complete(): void {
    this.subject.complete();
  }
}