var sdkScript = (function () {
  var profile = {};

  function send_msg(msg) {
    browser.runtime.sendMessage(msg);
  }

  function handleResponse(messages) {
    profile = messages;
    embed(codeToInject);

    // Solution #1
    // document.addEventListener('getUserInfo', function () {
    //   console.log('received request');
    //   document.dispatchEvent(
    //     new CustomEvent('getUserInfoResponse', { detail: profile }),
    //   );
    // console.log('sent response');
    // });
    // Solution #2
    window.addEventListener('message', (event) => {
      if (event.data !== 'getUserInfo') return;
      console.log('received request');
      console.log(event.data);
      event.source.postMessage(profile, event.origin);
      console.log('sent response');
    });
  }

  function handleError(error) {
    console.error(`Error: ${error}`);
  }

  function codeToInject() {
    window.swashSdk = {
      getUserInfo: async () => {
        // Solution #1
        // return new Promise((resolve) => {
        // document.addEventListener('getUserInfoResponse', function (e) {
        //   console.log('received response');
        //   console.log(e.detail);
        // });
        // document.dispatchEvent(new CustomEvent('getUserInfo'));
        // console.log('sent request');
        // });
        // Solution #2
        return new Promise((resolve) => {
          window.addEventListener('message', function (e) {
            if (e.data === 'getUserInfo') return;
            console.log('received response');
            console.log(e);
            resolve(e.data);
          });
          window.postMessage('getUserInfo', '*');
          console.log('sent request');
        });
        // return {
        //   user_id: '1',
        //   gender: 'Male',
        //   birth: '1988',
        //   age: '32-30',
        //   income: '50-75K',
        //   country: 'Netherlands',
        //   city: 'Smilde',
        //   marital: 'Married',
        //   household: '3',
        //   employment: 'Full-time',
        //   industry: 'Finance and Economic',
        // };
      },
    };
  }

  function embed(fn) {
    const script = document.createElement('script');
    script.text = `(${fn.toString()})();`;
    document.documentElement.appendChild(script);
  }

  return {
    handleResponse,
    handleError,
  };
})();

if (typeof window.swashSdk === 'undefined') {
  window.swashSdk = {
    obj: 'sdk',
    func: 'getUserProfile',
    params: [],
  };

  browser.runtime
    .sendMessage(window.swashSdk)
    .then(sdkScript.handleResponse, sdkScript.handleError);
}
