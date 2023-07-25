const callFunction = async function (data) {
  return new Promise((resolve, reject) => {
    const listener = function (event) {
      if (event.data.id !== `${data.id}Resp`) return;

      window.removeEventListener('message', listener);
      if (event.data.response?.error) reject(event.data.response.error);
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
  openPopupPage: async () => {
    return callFunction({ id: 'openPopupPage' });
  },
  openProfilePage: async () => {
    return callFunction({ id: 'openProfilePage' });
  },
};
