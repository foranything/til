function main(): void {
  try {
    const targetUrl = "https://fr.wikipedia.org/wiki/Main_Page";
    const iframe = document.getElementById("iframe");
    Assert.assert(iframe);
    setIframe(iframe as HTMLIFrameElement, targetUrl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = main;

function setIframe(iframe: HTMLIFrameElement, targetUrl: string): void {
  if (iframe instanceof HTMLIFrameElement) iframe.src = targetUrl;
}

namespace Assert {
  export function assert(value: unknown): asserts value {
    if (!value) {
      throw new Error("Assertion failed");
    }
  }

  type Falsy = false | 0 | "" | null | undefined;

  export const isTruthy = <T>(x: T | Falsy): x is T => !!x;
}
