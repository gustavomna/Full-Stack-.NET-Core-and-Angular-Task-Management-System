import { Observable, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export class ThrottleHelper<T> {
  private subject = new Subject<T>();
  private throttleTime: number;
  private leading: boolean;
  private trailing: boolean;

  constructor(throttleTimeMs: number = 300, leading: boolean = true, trailing: boolean = false) {
    this.throttleTime = throttleTimeMs;
    this.leading = leading;
    this.trailing = trailing;
  }

  get valueChanges(): Observable<T> {
    return this.subject.pipe(
      throttleTime(this.throttleTime, undefined, { leading: this.leading, trailing: this.trailing })
    );
  }

  next(value: T): void {
    this.subject.next(value);
  }

  complete(): void {
    this.subject.complete();
  }
}