var adsScript = (function () {
  const CLOSE_TEXT = 'Close this ads only';
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
    const script = document.createElement('script');
    script.src = 'https://app.swashapp.io/main.js';
    script.type = 'text/javascript';
    script.async = true;

    const style = document.createElement('style');
    style.innerHTML = `
      .sticky-flex-center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
      }
    
      .sticky-ads-close {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 0px;
        right: 0px;
        cursor: pointer;
        background-color: #B0AEAE;
      }
      
      .sticky-ads-pause {
        height: 100%;
      }
      
      .sticky-ads-pause,
      .sticky-ads-pause button {
        font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #24292E;
      }
      
      .sticky-ads-pause-text {
        text-align: center;
      }
      
      .sticky-ads-pause-button {
        appearance: none;
        background-color: #FAFBFC;
        border: 1px solid rgba(27, 31, 35, 0.15);
        border-radius: 6px;
        box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        list-style: none;
        padding: 6px 16px;
        position: relative;
        transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: middle;
        white-space: nowrap;
        word-wrap: break-word;
      }
      
      .sticky-ads-pause-button:hover {
        background-color: #F3F4F6;
        text-decoration: none;
        transition-duration: 0.1s;
      }
      
      .sticky-ads-pause-button:disabled {
        background-color: #FAFBFC;
        border-color: rgba(27, 31, 35, 0.15);
        color: #959DA5;
        cursor: default;
      }
      
      .sticky-ads-pause-button:active {
        background-color: #EDEFF2;
        box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
        transition: none 0s;
      }
      
      .sticky-ads-pause-button:focus {
        outline: 1px transparent;
      }
      
      .sticky-ads-pause-button:before {
        display: none;
      }
      
      .sticky-ads-pause-button:-webkit-details-marker {
        display: none;
      }
    `;

    document.querySelector('head').appendChild(script);
    document.querySelector('head').appendChild(style);
  }

  function createAdDiv(name, placementId, size) {
    const div = document.createElement('div');
    div.id = `SwashAds${size.width}x${size.height}`;
    div.setAttribute('adName', name);
    div.style.width = `${size.width}px`;
    div.style.height = `${size.height}px`;

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

  function onCloseDiv(parent) {
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

    parent.appendChild(divInner);
  }

  function appendCloseDiv(parent) {
    const div = document.createElement('div');
    div.className = 'sticky-ads-close sticky-flex-center';
    div.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="#ffffff"><path d="M15.76 3.44a.773.773 0 0 0-1.12 0L9.6 8.48 4.56 3.44a.792.792 0 0 0-1.12 1.12L8.48 9.6l-5.04 5.04a.773.773 0 0 0 0 1.12A.726.726 0 0 0 4 16a.726.726 0 0 0 .56-.24l5.04-5.04 5.04 5.04a.773.773 0 0 0 1.12 0 .773.773 0 0 0 0-1.12L10.72 9.6l5.04-5.04a.773.773 0 0 0 0-1.12z" transform="translate(2 2)"></path></svg>';

    div.addEventListener('click', () => {
      onCloseDiv(parent);
    });

    parent.appendChild(div);
  }

  function addStickyAd(name, placementId, size, position) {
    const div = createAdDiv(name, placementId, size);
    const { top, right, bottom, left } = position;

    div.style.background = 'rgb(245, 245, 245)';
    div.style.position = 'fixed';
    div.style.zIndex = '10';
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
