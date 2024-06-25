// src/components/chat/error-message.ts
interface ErrorMessageProps {
  error: any;
}

const tips = `
  <div class="mt-2">
    <span class="font-semibold">Troubleshooting:</span>
    <ul class="list-disc list-inside ml-4 mt-1">
      <li>Requires Chrome 127 or later: <a href="https://www.google.com/chrome/canary/" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Chrome Canary</a></li>
      <li>Enable: <code class="bg-accent px-1 rounded">chrome://flags/#prompt-api-for-gemini-nano</code></li>
      <li>Enable: <code class="bg-accent px-1 rounded">chrome://flags/#optimization-guide-on-device-model</code></li>
      <li>Click "Optimization Guide On Device Model" in <code class="bg-accent px-1 rounded">chrome://components/</code></li>
      <li>Wait for the model to download.</li>
    </ul>
  </div>
`;

const generateErrorMessage = ({ error }: ErrorMessageProps): string => {
  const baseErrorMessage = `
    <div class="p-4 border-l-4 border-red-700">
      <div class="text-lg font-semibold text-red-700">An unknown error occurred.</div>
      <div class="mt-2">
        <span class="font-semibold">Possible solutions:</span>
        <ul class="list-disc list-inside ml-4 mt-1">
          <li>Try refreshing the page.</li>
        </ul>
      </div>
      ${tips}
    </div>
  `;

  if (error.message.includes("AI session creation failed")) {
    return `
      <div class="p-4 border-l-4 border-red-700">
        <div class="text-lg font-semibold text-red-700">Error: ${error.message}</div>
        <div class="mt-2">
          <span class="font-semibold">Possible solutions:</span>
          <ul class="list-disc list-inside ml-4 mt-1">
            <li>Ensure you have an active internet connection.</li>
            <li>Verify that the AI service is operational and not under maintenance.</li>
          </ul>
        </div>
        ${tips}
      </div>
    `;
  }

  if (error.message.includes("network")) {
    return `
      <div class="p-4 border-l-4 border-red-700">
        <div class="text-lg font-semibold text-red-700">Error: Network issue detected.</div>
        <div class="mt-2">
          <span class="font-semibold">Possible solutions:</span>
          <ul class="list-disc list-inside ml-4 mt-1">
            <li>Check your internet connection.</li>
            <li>Retry sending the message.</li>
          </ul>
        </div>
        ${tips}
      </div>
    `;
  }

  if (error.message.includes("API key")) {
    return `
      <div class="p-4 border-l-4 border-red-700">
        <div class="text-lg font-semibold text-red-700">Error: Invalid AI service API key.</div>
        <div class="mt-2">
          <span class="font-semibold">Possible solutions:</span>
          <ul class="list-disc list-inside ml-4 mt-1">
            <li>Check if the AI service API key is correct.</li>
            <li>Obtain a valid API key from the AI service provider.</li>
          </ul>
        </div>
        ${tips}
      </div>
    `;
  }

  if (error.message.includes("Chrome version")) {
    return `
      <div class="p-4 border-l-4 border-red-700">
        <div class="text-lg font-semibold text-red-700">Error: ${error.message}</div>
        <div class="mt-2">
          <span class="font-semibold">Possible solutions:</span>
          <ul class="list-disc list-inside ml-4 mt-1">
            <li>Update to Chrome 127 or later. You can download the latest version from <a href="https://www.google.com/chrome/canary/" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Chrome Canary</a>.</li>
          </ul>
        </div>
        ${tips}
      </div>
    `;
  }

  return baseErrorMessage;
};

export default generateErrorMessage;
