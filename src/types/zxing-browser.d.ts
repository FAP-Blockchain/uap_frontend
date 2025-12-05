declare module "@zxing/browser" {
  // Minimal type declarations to satisfy TypeScript in this project.
  // If you need richer typings later, you can replace this with full definitions.
  export class BrowserQRCodeReader {
    constructor(hints?: unknown, timeBetweenScansMillis?: number);
    decodeFromVideoDevice(
      deviceId: string | null,
      videoElement: HTMLVideoElement,
      callback: (result: { getText(): string } | null, error?: unknown) => void
    ): Promise<void>;
    decodeFromImageElement(
      imageElement: HTMLImageElement
    ): Promise<{ getText(): string }>;
    reset(): void;
  }
}


