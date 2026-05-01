export const getFriendlyErrorMessage = (error: any) => {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;
  const message = error?.response?.data?.message;
  const fallback = error?.message;
  const rawText =
    typeof detail === 'string'
      ? detail
      : typeof message === 'string'
        ? message
        : typeof fallback === 'string'
          ? fallback
          : '';

  if (status === 401) {
    return 'Session expired or unauthorized request. Please sign in and try again.';
  }

  if (status === 429) {
    const waitMatch = rawText.match(/try again in ([^.]*)/i);
    const waitTime = waitMatch?.[1]?.trim();

    return waitTime
      ? `AI limit reached. Please try again in ${waitTime}.`
      : 'AI limit reached. Please try again later.';
  }

  if (rawText) {
    return rawText;
  }

  return 'Something went wrong. Please try again.';
};
