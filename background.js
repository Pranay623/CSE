chrome.webNavigation.onCompleted.addListener(
  (details) => {
    const url = new URL(details.url);
    const hostname = url.hostname;

    if (details.frameId !== 0) return;

    try {
      const domain = hostname;

      // Inject content script to grab storage values
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => {
          const storage = {
            localStorage: { ...localStorage },
            sessionStorage: { ...sessionStorage }
          };
          chrome.runtime.sendMessage({ type: "SAVE_WEB_STORAGE", storage });
        }
      });

      // Log what you're looking for
      console.log(`[CookieSaver] Attempting to save cookies for ${hostname}`);

      chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "SAVE_WEB_STORAGE") {
    const tabUrl = sender.url;
    const domain = new URL(tabUrl).hostname;
    chrome.storage.local.set({
      [`${domain}-webStorage`]: message.storage
    });
  }
});

      chrome.cookies.getAll({}, (cookies) => {
        const relevant = cookies.filter((c) => c.domain.includes('edumarshal.com'));

        if (relevant.length > 0) {
          chrome.storage.local.set({ [hostname]: relevant }, () => {
            console.log(`[CookieSaver] Saved ${relevant.length} cookies for ${hostname}`);
          });
        } else {
          console.warn(`[CookieSaver] No relevant cookies found for ${hostname}`);
        }
      });
    } catch (err) {
      console.error(`[CookieSaver] Error processing ${hostname}:`, err);
    }
  },
  { url: [{ urlMatches: '.*edumarshal\\.com.*' }] }
);
