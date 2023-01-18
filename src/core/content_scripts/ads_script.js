var adsScript = (function () {
  function getAdLink(id, width, height) {
    const url = new URL('https://swashapp.io/user/ads/view');
    url.searchParams.set('id', id);
    url.searchParams.set('w', `${width}`);
    url.searchParams.set('h', `${height}`);

    return url.toString();
  }

  function createAdDiv(placementId, size) {
    const div = document.createElement('div');
    div.id = `SwashAds${size.width}x${size.height}`;
    div.style.width = `${size.width}px`;
    div.style.height = `${size.height}px`;
    div.style.border = '1px solid red';

    div.innerHTML = `<iframe seamless="true" title="ads" scrolling="no" frameBorder="no" style="width: ${
      size.width
    }px; height: ${size.height}px;" src="${getAdLink(
      placementId,
      size.width,
      size.height,
    )}" />`;

    return div;
  }

  function appendCloseDiv(parent) {
    const div = document.createElement('div');
    div.style.position = `absolute`;
    div.style.top = `0px`;
    div.style.left = `0px`;
    div.style.width = `16px`;
    div.style.height = `16px`;
    div.style.cursor = 'pointer';
    div.style.background =
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnARIOAwrBg6DpAAAAb0lEQVQoz42RsQ3AIAwET6lpGAgyKlnGWSFUMIpTRAgQCuAO/2E/D2yVwQ49i6nyxY3vZIcQCmIRlNggnogida7jQYmc3cn3I0uzhwckk8bbFUkoSm7lYy+Hz3m74sfBr8nFM5dBGQIyi3r5WdN6ATcqPCkW9kzyAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTAxLTE4VDE0OjAzOjAyKzAwOjAwN60+LAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wMS0xOFQxNDowMzowMiswMDowMEbwhpAAAAAASUVORK5CYII=) red';

    div.addEventListener('click', () => {
      parent.style.display = 'none';
    });

    parent.appendChild(div);
  }

  function injectScript() {
    var script = document.createElement('script');
    script.src = 'https://app.swashapp.io/main.js';
    script.type = 'text/javascript';
    script.async = true;
    document.querySelector('head').appendChild(script);
  }

  function addStickyAd(placementId, size, position) {
    const div = createAdDiv(placementId, size);
    const { top, right, bottom, left } = position;

    div.style.position = 'fixed';
    div.style.zIndex = '10';
    if (top !== undefined) div.style.top = `${top}px`;
    if (right !== undefined) div.style.right = `${right}px`;
    if (bottom !== undefined) div.style.bottom = `${bottom}px`;
    if (left !== undefined) div.style.left = `${left}px`;

    appendCloseDiv(div);
    document.querySelector('body').appendChild(div);
  }

  function addEmbeddedAd(selector, placementId, size, position) {
    const div = createAdDiv(placementId, size, position);
    div.style.margin = 'auto';
    document.querySelector(selector).appendChild(div);
  }

  function handleResponse(messages) {
    injectScript();

    for (let message of messages) {
      message.ads.forEach((ad) => {
        console.log(ad);
        if (ad.type === 'sticky')
          addStickyAd(ad.placementId, ad.size, ad.position);
        else if (ad.type === 'embedded')
          addEmbeddedAd(ad.selector, ad.placementId, ad.size, ad.position);
      });
    }
  }

  function handleError(error) {
    console.error(`Error: ${error}`);
  }

  return {
    handleResponse,
    handleError,
  };
})();

if (typeof window.swashSAds === 'undefined') {
  window.swashSAds = {
    obj: 'ads',
    func: 'getAdsInfo',
    params: [window.location.href],
  };

  browser.runtime
    .sendMessage(window.swashSAds)
    .then(adsScript.handleResponse, adsScript.handleError);
}
