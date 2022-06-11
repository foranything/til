import { evalTime } from "../lib";

class Factorial {
  readonly #num = 2000n;

  calc_(num: bigint): bigint {
    if (num === 1n) return 1n;
    return num * this.calc_(num - 1n);
  }

  @evalTime
  calc(): bigint {
    return this.calc_(this.#num);
  }

  calcTailRecursion_(num: bigint, total: bigint = 1n): bigint {
    if (num === 1n) return total;
    return this.calcTailRecursion_(num - 1n, num * total);
  }

  @evalTime
  calcTailRecursion(): bigint {
    return this.calcTailRecursion_(this.#num);
  }
}

const factorial = new Factorial();

factorial.calc();
factorial.calcTailRecursion();
