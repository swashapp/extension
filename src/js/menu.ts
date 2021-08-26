// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
function filterIconStat(filtered) {
  const target = document.getElementById('add_filter');
  if (filtered) {
    target.classList.add('active');
  } else {
    target.classList.remove('active');
  }
}

function showPageOnTab(url_to_show: string) {
  window.helper.isNeededOnBoarding().then((result) => {
    if (result)
      url_to_show = browser.runtime.getURL('dashboard/index.html#/OnBoarding');
    return browser.windows
      .getAll({
        populate: true,
        windowTypes: ['normal'],
      })
      .then(() => {
        browser.tabs.create({ url: url_to_show, active: true }).then(() => {
          window.close();
        });
      });
  });
}

function updateBalance(balance: string) {
  document.getElementById('balance').innerText = `${balance} DATA`;
}

function updateVersion(version: string) {
  document.getElementById('version').innerText = `V${version}`;
}

function purgeNumber(num: string) {
  if (num.indexOf('.') < 0) return num;
  return num.slice(0, num.indexOf('.') + 5);
}

document.getElementById('open_setting').addEventListener('click', function () {
  const url = browser.runtime.getURL('dashboard/index.html');
  showPageOnTab(url);
});

document.getElementById('open_messages').addEventListener('click', function () {
  const url = browser.runtime.getURL('dashboard/index.html#/Data');
  showPageOnTab(url);
});

document.getElementById('open_logs').addEventListener('click', function () {
  const url = browser.runtime.getURL('dashboard/index.html#/Help');
  showPageOnTab(url);
});

document.getElementById('add_filter').addEventListener('click', function () {
  window.helper.handleFilter().then((res) => {
    filterIconStat(res);
  });
});

document.getElementById('streaming').addEventListener('click', function () {
  const is_enabled = document.getElementById('streaming').checked;
  if (is_enabled) {
    window.helper.start();
  } else {
    window.helper.stop();
  }
});

updateVersion(browser.runtime.getManifest().version);

window.helper.load().then((db) => {
  window.helper.isNeededOnBoarding().then((result) => {
    if (!result) {
      document.getElementById('streaming').checked = db.configs.is_enabled;

      window.helper.getTotalBalance().then((balance) => {
        balance =
          balance === '' ||
          balance === 'undefined' ||
          typeof balance === 'undefined'
            ? '0.00'
            : balance;
        updateBalance(purgeNumber(balance));
      });
    }
  });
});

window.helper.isCurrentDomainFiltered().then((filtered) => {
  filterIconStat(filtered);
});
