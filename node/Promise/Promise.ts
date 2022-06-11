async function fn1(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

async function fn2(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
}

async function test1() {
  await fn1();
  await fn2();
}

async function test2() {
  await Promise.all([fn1(), fn2()]);
}

async function timer(fn: Function) {
  const start = Date.now();
  await fn();
  const now = Date.now();
  const diff = now - start;

  console.log(`${fn.name} ${diff}ms`);

  return now - start;
}

timer(test1);
timer(test2);
