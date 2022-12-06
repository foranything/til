import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

function add5(a: number, callback: (num: number) => void) {
  setTimeout(() => {
    callback(a + 5);
  }, 10);
}

Deno.test("callback", async () => {
  await new Promise<void>(res => {
    add5(10, (num: number) => {
      assertEquals(num, 15);
      res();
    })
  });
});
