chrome.webNavigation.onCompleted.addListener((details) => {
  const url = new URL(details.url);
  const hostname = url.hostname;

  // Log what you're looking for
  console.log(`[CookieSaver] Attempting to save cookies for ${hostname}`);

  chrome.cookies.getAll({}, (cookies) => {
    const relevant = cookies.filter(c => c.domain.includes('edumarshal.com'));

    if (relevant.length > 0) {
      chrome.storage.local.set({ [hostname]: relevant }, () => {
        console.log(`[CookieSaver] Saved ${relevant.length} cookies for ${hostname}`);
      });
    } else {
      console.warn(`[CookieSaver] No relevant cookies found for ${hostname}`);
    }
  });
}, { url: [{ urlMatches: '.*edumarshal\\.com.*' }] });
