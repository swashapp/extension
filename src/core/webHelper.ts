/* eslint-disable */
// @ts-nocheck
import browser from 'webextension-polyfill';

function sendMessage(message) {
  return browser.runtime.sendMessage(message);
}

const helper = (function () {
  function handleFilter() {
    const message = {
      obj: 'pageAction',
      func: 'handleFilter',
      params: [],
    };
    return sendMessage(message);
  }

  function isCurrentDomainFiltered() {
    const message = {
      obj: 'pageAction',
      func: 'isCurrentDomainFiltered',
      params: [],
    };
    return sendMessage(message);
  }

  function loadFilters() {
    const message = {
      obj: 'storageHelper',
      func: 'getFilters',
      params: [],
    };
    return sendMessage(message);
  }

  function loadPrivacyData() {
    const message = {
      obj: 'storageHelper',
      func: 'getPrivacyData',
      params: [],
    };
    return sendMessage(message);
  }

  function loadMessages() {
    const message = {
      obj: 'databaseHelper',
      func: 'getAllMessages',
      params: [],
    };
    return sendMessage(message);
  }

  function cancelSending(msgId) {
    const message = {
      obj: 'dataHandler',
      func: 'cancelSending',
      params: [msgId],
    };
    return sendMessage(message);
  }

  function loadModules() {
    const message = {
      obj: 'storageHelper',
      func: 'getModules',
      params: [],
    };
    return sendMessage(message);
  }

  function load() {
    const message = {
      obj: 'storageHelper',
      func: 'getAll',
      params: [],
    };
    return sendMessage(message);
  }

  function loadNotifications() {
    const message = {
      obj: 'storageHelper',
      func: 'getNotifications',
      params: [],
    };
    return sendMessage(message);
  }

  function save(data) {}

  function saveFilters(data) {
    const message = {
      obj: 'storageHelper',
      func: 'saveFilters',
      params: [data],
    };
    return sendMessage(message);
  }

  function savePrivacyData(data) {
    const message = {
      obj: 'storageHelper',
      func: 'savePrivacyData',
      params: [data],
    };
    return sendMessage(message);
  }

  function saveProfile(data) {
    const message = {
      obj: 'storageHelper',
      func: 'updateData',
      params: ['profile', data],
    };
    return sendMessage(message);
  }

  function saveModule(data) {
    const message = {
      obj: 'storageHelper',
      func: 'updateData',
      params: ['modules', data],
    };
    return sendMessage(message);
  }

  function removeModule(data) {
    const message = {
      obj: 'storageHelper',
      func: 'removeModule',
      params: [data],
    };
    return sendMessage(message);
  }

  function updateConfigs(key, value) {
    const message = {
      obj: 'storageHelper',
      func: 'updateConfigs',
      params: [key, value],
    };
    return sendMessage(message);
  }

  function configModule(moduleName, settings) {
    const message = {
      obj: 'loader',
      func: 'configModule',
      params: [moduleName, settings],
    };
    return sendMessage(message);
  }

  function startAuth(moduleName) {
    const message = {
      obj: 'apiCall',
      func: 'startOauth',
      params: [moduleName],
    };
    return sendMessage(message);
  }

  function removeAuth(moduleName) {
    param = {};
    param[moduleName] = { apiCall: {} };
    param[moduleName].apiCall.access_token = '';
    const message = {
      obj: 'storageHelper',
      func: 'updateModules',
      params: [param],
    };
    return sendMessage(message);
  }

  function isConnected(moduleName) {
    const message = {
      obj: 'apiCall',
      func: 'isConnected',
      params: [moduleName],
    };
    return sendMessage(message);
  }

  function start() {
    const message = {
      obj: 'loader',
      func: 'start',
      params: [],
    };
    return sendMessage(message);
  }

  function reload() {
    const message = {
      obj: 'loader',
      func: 'reload',
      params: [],
    };
    return sendMessage(message);
  }

  function stop() {
    const message = {
      obj: 'loader',
      func: 'stop',
      params: [],
    };
    return sendMessage(message);
  }

  function enforcePolicy(msg, mSalt, salt, privacyData) {
    const message = {
      obj: 'dataHandler',
      func: 'enforcePolicy',
      params: [msg, mSalt, salt, privacyData],
    };
    return sendMessage(message);
  }

  function identityPrivacy(id, mId, privacyLevel) {
    const message = {
      obj: 'privacyUtils',
      func: 'identityPrivacy',
      params: [id, mId, privacyLevel],
    };
    return sendMessage(message);
  }

  function updatePrivacyLevel(privacyLevel) {
    const message = {
      obj: 'storageHelper',
      func: 'updatePrivacyLevel',
      params: [privacyLevel],
    };
    return sendMessage(message);
  }

  function decryptWallet(encryptedWallet, password) {
    const message = {
      obj: 'userHelper',
      func: 'decryptWallet',
      params: [encryptedWallet, password],
    };
    return sendMessage(message);
  }

  function getWalletAddress() {
    const message = {
      obj: 'userHelper',
      func: 'getWalletAddress',
      params: [],
    };
    return sendMessage(message);
  }

  function getWalletPrivateKey() {
    const message = {
      obj: 'userHelper',
      func: 'getWalletPrivateKey',
      params: [],
    };
    return sendMessage(message);
  }

  function getEthBalance(address) {
    const message = {
      obj: 'userHelper',
      func: 'getEthBalance',
      params: [address],
    };
    return sendMessage(message);
  }

  function getAvailableBalance() {
    const message = {
      obj: 'userHelper',
      func: 'getAvailableBalance',
      params: [],
    };
    return sendMessage(message);
  }

  function getCumulativeEarnings() {
    const message = {
      obj: 'userHelper',
      func: 'getCumulativeEarnings',
      params: [],
    };
    return sendMessage(message);
  }

  function getTotalBalance() {
    const message = {
      obj: 'userHelper',
      func: 'getTotalBalance',
      params: [],
    };
    return sendMessage(message);
  }

  function getBonus() {
    const message = {
      obj: 'userHelper',
      func: 'getBonus',
      params: [],
    };
    return sendMessage(message);
  }

  function generateJWT() {
    const message = {
      obj: 'userHelper',
      func: 'generateJWT',
      params: [],
    };
    return sendMessage(message);
  }

  function getVersion() {
    const message = {
      obj: 'storageHelper',
      func: 'getVersion',
      params: [],
    };
    return sendMessage(message);
  }

  function loadWallets() {
    const message = {
      obj: 'storageHelper',
      func: 'retrieveData',
      params: ['wallets'],
    };
    return sendMessage(message);
  }

  function saveWallets(data) {
    const message = {
      obj: 'storageHelper',
      func: 'updateData',
      params: ['wallets', data],
    };
    return sendMessage(message);
  }

  function isNeededOnBoarding() {
    const message = {
      obj: 'onboarding',
      func: 'isNeededOnBoarding',
      params: [],
    };
    return sendMessage(message);
  }

  function isNeededJoin() {
    const message = {
      obj: 'onboarding',
      func: 'isNeededJoin',
      params: [],
    };
    return sendMessage(message);
  }

  function getOnboardingFlow() {
    const message = {
      obj: 'onboarding',
      func: 'getOnboardingFlow',
      params: [],
    };
    return sendMessage(message);
  }

  function submitOnBoarding() {
    const message = {
      obj: 'onboarding',
      func: 'submitOnBoarding',
      params: [],
    };
    return sendMessage(message);
  }

  function startOnBoarding(onboardingName, tabId) {
    const message = {
      obj: 'onboarding',
      func: 'startOnBoarding',
      params: [onboardingName, tabId],
    };
    return sendMessage(message);
  }

  function startOnBoardingOAuth(onboardingName) {
    const message = {
      obj: 'onboarding',
      func: 'startOnBoardingOAuth',
      params: [onboardingName],
    };
    return sendMessage(message);
  }

  function loadFile(file) {
    const message = {
      obj: 'onboarding',
      func: 'loadFile',
      params: [file],
    };
    return sendMessage(message);
  }

  function applyConfig(config) {
    const message = {
      obj: 'onboarding',
      func: 'applyConfig',
      params: [config],
    };
    return sendMessage(message);
  }

  function saveConfig() {
    const message = {
      obj: 'onboarding',
      func: 'saveConfig',
      params: [],
    };
    return sendMessage(message);
  }

  function getFilesList(onboardingName) {
    const message = {
      obj: 'onboarding',
      func: 'getFilesList',
      params: [onboardingName],
    };
    return sendMessage(message);
  }

  function downloadFile(onboardingName, fileId) {
    const message = {
      obj: 'onboarding',
      func: 'downloadFile',
      params: [onboardingName, fileId],
    };
    return sendMessage(message);
  }

  function uploadFile(onboardingName) {
    const message = {
      obj: 'onboarding',
      func: 'uploadFile',
      params: [onboardingName],
    };
    return sendMessage(message);
  }

  function openOnBoarding() {
    const message = {
      obj: 'onboarding',
      func: 'openOnBoarding',
      params: [],
    };
    return sendMessage(message);
  }

  function repeatOnboarding(pages, clicked) {
    const message = {
      obj: 'onboarding',
      func: 'repeatOnboarding',
      params: [pages, clicked],
    };
    return sendMessage(message);
  }

  function saveProfileInOnBoarding(gender, age, income) {
    const message = {
      obj: 'onboarding',
      func: 'saveProfileInfo',
      params: [gender, age, income],
    };
    return sendMessage(message);
  }

  function createAndSaveWallet() {
    const message = {
      obj: 'onboarding',
      func: 'createAndSaveWallet',
      params: [],
    };
    return sendMessage(message);
  }

  function importAndSaveWallet(privateKey) {
    const message = {
      obj: 'onboarding',
      func: 'importAndSaveWallet',
      params: [privateKey],
    };
    return sendMessage(message);
  }

  function joinSwash() {
    const message = {
      obj: 'userHelper',
      func: 'joinSwash',
      params: [],
    };
    return sendMessage(message);
  }

  function getRewards() {
    const message = {
      obj: 'userHelper',
      func: 'getRewards',
      params: [],
    };
    return sendMessage(message);
  }

  function resendCodeToEmail(email) {
    const message = {
      obj: 'userHelper',
      func: 'resendCodeToEmail',
      params: [email],
    };
    return sendMessage(message);
  }

  function join(requestId, code) {
    const message = {
      obj: 'userHelper',
      func: 'join',
      params: [requestId, code],
    };
    return sendMessage(message);
  }

  function updateEmail(requestId, code) {
    const message = {
      obj: 'userHelper',
      func: 'updateEmail',
      params: [requestId, code],
    };
    return sendMessage(message);
  }

  function newsletterSignUp(email, newsletter) {
    const message = {
      obj: 'swashApiHelper',
      func: 'newsletterSignUp',
      params: [email, newsletter],
    };
    return sendMessage(message);
  }

  function getReferrals() {
    const message = {
      obj: 'userHelper',
      func: 'getReferrals',
      params: [],
    };
    return sendMessage(message);
  }

  function checkWithdrawAllowance(amount) {
    const message = {
      obj: 'userHelper',
      func: 'checkWithdrawAllowance',
      params: [amount],
    };
    return sendMessage(message);
  }

  function getCategory(name) {
    const message = {
      obj: 'configManager',
      func: 'getCategory',
      params: [name],
    };
    return sendMessage(message);
  }

  function getDataEthPairPrice() {
    const message = {
      obj: 'swashApiHelper',
      func: 'getDataEthPairPrice',
      params: [],
    };
    return sendMessage(message);
  }

  function withdrawToTarget(recipient, amount) {
    const message = {
      obj: 'userHelper',
      func: 'withdrawToTarget',
      params: [recipient, amount],
    };
    return sendMessage(message);
  }

  function donateToTarget(recipient, amount) {
    const message = {
      obj: 'userHelper',
      func: 'donateToTarget',
      params: [recipient, amount],
    };
    return sendMessage(message);
  }

  function claimRewards() {
    const message = {
      obj: 'userHelper',
      func: 'claimRewards',
      params: [],
    };
    return sendMessage(message);
  }

  function getJoinedSwash() {
    const message = {
      obj: 'userHelper',
      func: 'getJoinedSwash',
      params: [],
    };
    return sendMessage(message);
  }

  function isJoinedSwash() {
    const message = {
      obj: 'userHelper',
      func: 'isJoinedSwash',
      params: [],
    };
    return sendMessage(message);
  }

  function updateVerification() {
    const message = {
      obj: 'userHelper',
      func: 'updateVerification',
      params: [],
    };
    return sendMessage(message);
  }

  function isVerified() {
    const message = {
      obj: 'userHelper',
      func: 'isVerified',
      params: [],
    };
    return sendMessage(message);
  }

  function isVerificationNeeded() {
    const message = {
      obj: 'userHelper',
      func: 'isVerificationNeeded',
      params: [],
    };
    return sendMessage(message);
  }

  function isAccountInitialized() {
    const message = {
      obj: 'userHelper',
      func: 'isAccountInitialized',
      params: [],
    };
    return sendMessage(message);
  }

  function getWithdrawBalance() {
    const message = {
      obj: 'userHelper',
      func: 'getWithdrawBalance',
      params: [],
    };
    return sendMessage(message);
  }

  function getLatestPrograms() {
    const message = {
      obj: 'userHelper',
      func: 'getLatestPrograms',
      params: [],
    };
    return sendMessage(message);
  }

  function getUserProfile() {
    const message = {
      obj: 'userHelper',
      func: 'getUserProfile',
      params: [],
    };
    return sendMessage(message);
  }

  function updateUserProfile(profile) {
    const message = {
      obj: 'userHelper',
      func: 'updateUserProfile',
      params: [profile],
    };
    return sendMessage(message);
  }

  function getCharities() {
    const message = {
      obj: 'charityHelper',
      func: 'getCharities',
      params: [],
    };
    return sendMessage(message);
  }

  function getCharityMetadata() {
    const message = {
      obj: 'charityHelper',
      func: 'getCharityMetadata',
      params: [],
    };
    return sendMessage(message);
  }

  function toggleCharityLike(id) {
    const message = {
      obj: 'charityHelper',
      func: 'toggleCharityLike',
      params: [id],
    };
    return sendMessage(message);
  }

  function addCharityAutoPayment(id, wallet, percent) {
    const message = {
      obj: 'charityHelper',
      func: 'addCharityAutoPayment',
      params: [id, wallet, percent],
    };
    return sendMessage(message);
  }

  function delCharityAutoPayment(id) {
    const message = {
      obj: 'charityHelper',
      func: 'delCharityAutoPayment',
      params: [id],
    };
    return sendMessage(message);
  }

  function getUserHistory(type) {
    const message = {
      obj: 'graphApiHelper',
      func: 'getUserHistory',
      params: [type],
    };
    return sendMessage(message);
  }

  function getIsFullScreenAvailable() {
    const message = {
      obj: 'adsHelper',
      func: 'getIsFullScreenAvailable',
      params: [],
    };
    return sendMessage(message);
  }

  function getAdsSlots(width, height) {
    const message = {
      obj: 'adsHelper',
      func: 'getAdsSlots',
      params: [width, height],
    };
    return sendMessage(message);
  }

  function updateAdsStatus(status) {
    const message = {
      obj: 'adsHelper',
      func: 'updateAdsStatus',
      params: [status],
    };
    return sendMessage(message);
  }

  function getAdsStatus() {
    const message = {
      obj: 'adsHelper',
      func: 'getAdsStatus',
      params: [],
    };
    return sendMessage(message);
  }

  function getNewTabConfig() {
    const message = {
      obj: 'newTabHelper',
      func: 'getConfig',
      params: [],
    };
    return sendMessage(message);
  }

  function addSite(rank, title, url, icon) {
    const message = {
      obj: 'newTabHelper',
      func: 'addSite',
      params: [rank, title, url, icon],
    };
    return sendMessage(message);
  }

  function setBackground(background) {
    const message = {
      obj: 'newTabHelper',
      func: 'setBackground',
      params: [background],
    };
    return sendMessage(message);
  }

  function getUnsplashImage(width) {
    const message = {
      obj: 'newTabHelper',
      func: 'getUnsplashImage',
      params: [width],
    };
    return sendMessage(message);
  }

  function setSearchEngine(searchEngine) {
    const message = {
      obj: 'newTabHelper',
      func: 'setSearchEngine',
      params: [searchEngine],
    };
    return sendMessage(message);
  }

  function setDatetime(datetime) {
    const message = {
      obj: 'newTabHelper',
      func: 'setDatetime',
      params: [datetime],
    };
    return sendMessage(message);
  }

  function getDatetime() {
    const message = {
      obj: 'newTabHelper',
      func: 'getDatetime',
      params: [],
    };
    return sendMessage(message);
  }

  return {
    load,
    save,
    stop,
    start,
    reload,
    configModule,
    loadModules,
    loadFilters,
    saveFilters,
    saveProfile,
    updateConfigs,
    startAuth,
    removeAuth,
    isConnected,
    savePrivacyData,
    loadPrivacyData,
    loadMessages,
    cancelSending,
    saveModule,
    removeModule,
    enforcePolicy,
    identityPrivacy,
    getWalletAddress,
    getWalletPrivateKey,
    getEthBalance,
    getAvailableBalance,
    getCumulativeEarnings,
    getTotalBalance,
    updatePrivacyLevel,
    decryptWallet,
    getVersion,
    handleFilter,
    isCurrentDomainFiltered,
    loadWallets,
    saveWallets,
    generateJWT,
    startOnBoarding,
    isNeededOnBoarding,
    isNeededJoin,
    getOnboardingFlow,
    submitOnBoarding,
    startOnBoardingOAuth,
    loadFile,
    applyConfig,
    saveConfig,
    getFilesList,
    downloadFile,
    uploadFile,
    openOnBoarding,
    repeatOnboarding,
    saveProfileInOnBoarding,
    createAndSaveWallet,
    importAndSaveWallet,
    joinSwash,
    getRewards,
    getBonus,
    getReferrals,
    checkWithdrawAllowance,
    getCategory,
    getDataEthPairPrice,
    withdrawToTarget,
    donateToTarget,
    claimRewards,
    getJoinedSwash,
    isJoinedSwash,
    updateVerification,
    isVerified,
    isVerificationNeeded,
    isAccountInitialized,
    getWithdrawBalance,
    getLatestPrograms,
    resendCodeToEmail,
    join,
    updateEmail,
    newsletterSignUp,
    loadNotifications,
    getUserHistory,
    getUserProfile,
    updateUserProfile,
    getCharities,
    getCharityMetadata,
    toggleCharityLike,
    addCharityAutoPayment,
    delCharityAutoPayment,
    getIsFullScreenAvailable,
    getAdsSlots,
    updateAdsStatus,
    getAdsStatus,
    getNewTabConfig,
    addSite,
    setBackground,
    getUnsplashImage,
    setSearchEngine,
    setDatetime,
    getDatetime,
  };
})();

export { helper };
