interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

// Track active abort controllers for cancellation
const activeControllers = new Map<string, AbortController>();

export function stopAllStreams(): void {
  activeControllers.forEach((controller) => {
    controller.abort();
  });
  activeControllers.clear();
}

export function stopStream(modelId: string): void {
  const controller = activeControllers.get(modelId);
  if (controller) {
    controller.abort();
    activeControllers.delete(modelId);
  }
}

export function hasActiveStreams(): boolean {
  return activeControllers.size > 0;
}

export async function streamModelResponse(
  modelId: string,
  messages: { role: string; content: string }[],
  callbacks: StreamCallbacks
): Promise<void> {
  const { onToken, onComplete, onError } = callbacks;

  // Create abort controller for this request
  const controller = new AbortController();
  activeControllers.set(modelId, controller);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: modelId, messages }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Check if aborted
      if (controller.signal.aborted) {
        reader.cancel();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            activeControllers.delete(modelId);
            onComplete();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onToken(parsed.content);
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }

    activeControllers.delete(modelId);
    onComplete();
  } catch (error) {
    activeControllers.delete(modelId);
    if ((error as Error).name === "AbortError") {
      onComplete(); // Treat abort as completion (message stays as-is)
      return;
    }
    onError(error as Error);
  }
}
