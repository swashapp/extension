var adsScript = (function () {
  const CLOSE_TEXT = 'Close this ad only';
  const FILTER_TEXT = 'Forever on this site';

  const pauseOptions = ['15 minutes', '60 minutes', CLOSE_TEXT, FILTER_TEXT];

  function send_msg(msg) {
    browser.runtime.sendMessage(msg);
  }

  function getAdLink(id, width, height) {
    const url = new URL('https://swashapp.io/user/ads/view');
    url.searchParams.set('id', id);
    url.searchParams.set('w', `${width}`);
    url.searchParams.set('h', `${height}`);

    return url.toString();
  }

  function injectHeaders() {
    const style = document.createElement('style');
    style.innerHTML = `
      .sticky-flex-center {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 12px !important;
      }
    
      .sticky-ads-close {
        width: 16px !important;
        height: 16px !important;
        position: absolute !important;
        top: 0px !important;
        right: 0px !important;
        cursor: pointer !important;
        background-color: #B0AEAE !important;
      }
      
      .sticky-ads-pause {
        height: 100% !important;
      }
      
      .sticky-ads-pause,
      .sticky-ads-pause button {
        font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        line-height: 20px !important;
        color: #24292E !important;
      }
      
      .sticky-ads-pause-text {
        text-align: center !important;
      }
      
      .sticky-ads-pause-button {
        appearance: none !important;
        background-color: #FAFBFC !important;
        border: 1px solid rgba(27, 31, 35, 0.15) !important;
        border-radius: 6px !important;
        box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset !important;
        box-sizing: border-box !important;
        cursor: pointer !important;
        display: inline-block !important;
        list-style: none !important;
        padding: 6px 16px !important;
        position: relative !important;
        transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1) !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        touch-action: manipulation !important;
        vertical-align: middle !important;
        white-space: nowrap !important;
        word-wrap: break-word !important;
        margin: unset !important;
        text-decoration: none !important;
      }
      
      .sticky-ads-pause-button:hover {
        background-color: #F3F4F6 !important;
        text-decoration: none !important;
        transition-duration: 0.1s !important;
      }
      
      .sticky-ads-pause-button:disabled {
        background-color: #FAFBFC !important;
        border-color: rgba(27, 31, 35, 0.15) !important;
        color: #959DA5 !important;
        cursor: default !important;
      }
      
      .sticky-ads-pause-button:active {
        background-color: #EDEFF2 !important;
        box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset !important;
        transition: none 0s !important;
      }
      
      .sticky-ads-pause-button:focus {
        outline: 1px transparent !important;
      }
      
      .sticky-ads-pause-button:before {
        display: none !important;
      }
      
      .sticky-ads-pause-button:-webkit-details-marker {
        display: none !important;
      }
    `;

    document.querySelector('head').appendChild(style);
  }

  function createAdDiv(name, placementId, size) {
    const div = document.createElement('div');
    div.id = `SwashAds${size.width}x${size.height}`;
    div.setAttribute('adName', name);
    div.style.width = `${size.width}px`;
    div.style.height = `${size.height}px`;
    div.style.direction = `ltr`;

    div.innerHTML = `<iframe id="ad-container" seamless="true" title="ads" scrolling="no" frameBorder="no" style="width: ${
      size.width
    }px; height: ${size.height}px;" src="${getAdLink(
      placementId,
      size.width,
      size.height,
    )}" />`;

    return div;
  }

  function onPauseButton(parent, value) {
    const name = parent.getAttribute('adName');
    switch (value) {
      case CLOSE_TEXT:
        break;
      case FILTER_TEXT:
        send_msg({
          obj: 'ads',
          func: 'excludeDomain',
          params: [name, window.location.href],
        });
        break;
      default:
        send_msg({
          obj: 'ads',
          func: 'pauseAds',
          params: [name, value],
        });
        break;
    }
    parent.style.display = 'none';
  }

  function onCloseDiv(parent, div) {
    parent.querySelector('#ad-container').style.display = 'none';

    const divInner = document.createElement('div');
    divInner.className = 'sticky-ads-pause sticky-flex-center';

    divInner.innerHTML =
      '<div class="sticky-ads-pause-text">Pause your ads?</div>';

    for (const opt of pauseOptions) {
      const button = document.createElement('button');
      button.className = 'sticky-ads-pause-button';
      button.innerHTML = opt;

      button.addEventListener('click', () => {
        onPauseButton(parent, opt);
      });

      divInner.appendChild(button);
    }

    div.addEventListener('click', () => {
      parent.style.display = 'none';
    });

    parent.appendChild(divInner);
  }

  function appendCloseDiv(parent) {
    const div = document.createElement('div');
    div.className = 'sticky-ads-close sticky-flex-center';
    div.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="#ffffff"><path d="M15.76 3.44a.773.773 0 0 0-1.12 0L9.6 8.48 4.56 3.44a.792.792 0 0 0-1.12 1.12L8.48 9.6l-5.04 5.04a.773.773 0 0 0 0 1.12A.726.726 0 0 0 4 16a.726.726 0 0 0 .56-.24l5.04-5.04 5.04 5.04a.773.773 0 0 0 1.12 0 .773.773 0 0 0 0-1.12L10.72 9.6l5.04-5.04a.773.773 0 0 0 0-1.12z" transform="translate(2 2)"></path></svg>';

    div.addEventListener('click', () => {
      onCloseDiv(parent, div);
    });

    parent.appendChild(div);
  }

  function addStickyAd(name, placementId, size, position) {
    const div = createAdDiv(name, placementId, size);
    const { top, right, bottom, left } = position;

    div.style.background = 'rgb(245, 245, 245)';
    div.style.position = 'fixed';
    div.style.zIndex = Number.MAX_SAFE_INTEGER;
    if (top !== undefined) div.style.top = `${top}px`;
    if (right !== undefined) div.style.right = `${right}px`;
    if (bottom !== undefined) div.style.bottom = `${bottom}px`;
    if (left !== undefined) div.style.left = `${left}px`;

    appendCloseDiv(div);
    document.querySelector('body').appendChild(div);
  }

  function addEmbeddedAd(name, selector, placementId, size, position) {
    const div = createAdDiv(name, placementId, size, position);
    div.style.margin = 'auto';
    document.querySelector(selector).appendChild(div);
  }

  function handleResponse(messages) {
    injectHeaders();

    for (let message of messages) {
      message.ads.forEach((ad) => {
        const { name, type, placementId, size, position } = ad;
        if (type === 'sticky') addStickyAd(name, placementId, size, position);
        else if (type === 'embedded')
          addEmbeddedAd(name, ad.selector, placementId, size, position);
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
