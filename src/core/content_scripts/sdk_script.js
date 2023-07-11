var sdkScript = (function () {
  function init() {
    embed(codeToInject);
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

  function codeToInject() {
    const callFunction = async function (data) {
      return new Promise((resolve, reject) => {
        const listener = function (event) {
          if (event.data.id !== `${data.id}Resp`) return;

          window.removeEventListener('message', listener);
          if (event.data.response.error) reject(event.data.response.error);
          else resolve(event.data.response);
        };

        window.addEventListener('message', listener);
        window.postMessage(data, '*');
      });
    };

    window.swashSdk = {
      getStatus: async () => {
        return callFunction({ id: 'getStatus' });
      },
      getUserInfo: async () => {
        return callFunction({ id: 'getUserInfo' });
      },
      getSurveyUrl: async (provider) => {
        return callFunction({ id: 'getSurveyUrl', params: [provider] });
      },
      getSurveyHistory: async (params) => {
        return callFunction({ id: 'getSurveyHistory', params: [params] });
      },
    };
  }

  function embed(fn) {
    const script = document.createElement('script');
    script.text = `(${fn.toString()})();`;
    document.documentElement.appendChild(script);
  }

  return {
    init,
  };
})();

sdkScript.init();
