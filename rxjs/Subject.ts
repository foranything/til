import { Observable, Subject } from "rxjs";

class C {
  private value: number = 0;

  private subject = new Subject<number>();

  valueChanges: Observable<number>;

  constructor() {
    this.valueChanges = this.subject.asObservable();
  }

  getValue(): number {
    return this.value;
  }

  setValue(v: number): void {
    this.value = v;
    this.subject.next(v);
  }
}

const instance = new C();

const subs = instance.valueChanges.subscribe((res) => {
  console.log(res);
});

instance.setValue(1);
instance.setValue(2);
instance.setValue(3);

subs.unsubscribe();

instance.setValue(4);
