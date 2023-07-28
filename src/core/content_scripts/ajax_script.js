var ajaxScript = (function () {
  function send_msg(msg) {
    browser.runtime.sendMessage(msg);
  }

  function handleResponse(messages) {
    for (const msg of messages) {
      for (const item of msg.items) {
        for (const event of item.events) {
          if (event.object === 'window') {
            window.addEventListener(event.event_name, () => {
              send_msg({
                obj: 'ajax',
                func: 'startTimer',
                params: [item.timeframe],
              });
            });
          } else {
            var allElements = document.querySelectorAll(event.selector);
            for (var i = 0; i < allElements.length; i++) {
              allElements[i].addEventListener(event.event_name, () => {
                send_msg({
                  obj: 'ajax',
                  func: 'startTimer',
                  params: [item.timeframe],
                });
              });
            }
          }
        }
      }
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

if (typeof window.swashAjax === 'undefined') {
  window.swashAjax = {
    obj: 'ajax',
    func: 'getConfigs',
    params: [window.location.href],
  };

  browser.runtime
    .sendMessage(window.swashAjax)
    .then(ajaxScript.handleResponse, ajaxScript.handleError);
}
