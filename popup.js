document.addEventListener('DOMContentLoaded', () => {
  const domainSelect = document.getElementById('domains');
  const display = document.getElementById('cookiesDisplay');
  const exportBtn = document.getElementById('export');
  const exportAllBtn = document.getElementById('exportAll');

  // Load all saved cookies from storage
  chrome.storage.local.get(null, (allCookies) => {
    const domains = Object.keys(allCookies);

    Object.keys(allCookies).forEach(key => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = key;
  domainSelect.appendChild(option);
});

domainSelect.addEventListener('change', () => {
  const key = domainSelect.value;
  display.textContent = JSON.stringify(allCookies[key], null, 2);
});

    if (domains.length === 0) {
      display.textContent = "No cookies saved yet. Visit a site and refresh.";
      return;
    }

    // Populate dropdown
    domains.forEach(domain => {
      const option = document.createElement('option');
      option.value = domain;
      option.textContent = domain;
      domainSelect.appendChild(option);
    });

    // Default display the first domain's cookies
    domainSelect.value = domains[0];
    display.textContent = JSON.stringify(allCookies[domains[0]], null, 2);

    // Change listener for domain selection
    domainSelect.addEventListener('change', () => {
      const cookies = allCookies[domainSelect.value];
      display.textContent = JSON.stringify(cookies, null, 2);
    });

    // Export selected domain cookies
    exportBtn.addEventListener('click', () => {
      const domain = domainSelect.value;
      const cookies = allCookies[domain];
      if (!cookies) return;
      const data = JSON.stringify(cookies, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url,
        filename: `${domain}-cookies.json`
      });
    });

    // Export all cookies
    exportAllBtn.addEventListener('click', () => {
      const data = JSON.stringify(allCookies, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url,
        filename: `all-cookies.json`
      });
    });
  });
});
