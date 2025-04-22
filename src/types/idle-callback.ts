
export interface IdleRequestCallback {
  (deadline: IdleDeadline): void;
}

export interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

export interface IdleRequestOptions {
  timeout: number;
}

// Global type declaration
declare global {
  interface Window {
    requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number;
    cancelIdleCallback(handle: number): void;
  }
}
