var sdkScript = (function () {
  function init() {
    embed('core/content_scripts/sdk_code_script.js');
    addMessageHandler();
  }

  function send_msg(msg) {
    return browser.runtime.sendMessage(msg);
  }

  function addMessageHandler() {
    const validFunctions = [
      'getStatus',
      'getUserInfo',
      'getSurveyUrl',
      'getSurveyHistory',
      'openProfilePage',
      'openPopupPage',
    ];

    window.addEventListener('message', (event) => {
      if (!event.data.id) return;

      const func = event.data.id;
      const params = event.data.params || [];

      if (!validFunctions.includes(func)) return;

      send_msg({
        obj: 'sdk',
        func,
        params,
      }).then(
        (data) => sendResponse(event, data),
        (error) =>
          sendResponse(event, {
            error: error.message || 'Something unexpected happened',
          }),
      );
    });
  }

  function sendResponse(event, data) {
    event.source.postMessage(
      { id: `${event.data.id}Resp`, response: data },
      event.origin,
    );
  }

  function embed(sdk_code_script) {
    const url = browser.runtime.getURL(sdk_code_script);
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    document.documentElement.appendChild(script);
  }

  return {
    init,
  };
})();

sdkScript.init();
