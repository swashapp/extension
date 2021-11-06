const DataIcon = '/static/images/icons/help/data.png';
const GettingStartedIcon = '/static/images/icons/help/getting-started.png';
const InviteFriendsIcon = '/static/images/icons/help/invite-friends.png';
const SettingsIcon = '/static/images/icons/help/settings.png';
const UsefulLinksIcon = '/static/images/icons/help/useful-links.png';
const WalletIcon = '/static/images/icons/help/wallet.png';
const WelcomeIcon = '/static/images/icons/help/welcome.png';

export interface HELP_TYPE {
  title: string;
  content: string;
  icon: string;
}

const HelpData = [
  {
    title: 'Welcome',
    icon: WelcomeIcon,
    content:
      "<div class='title1'>Welcome to the world’s first digital Data Union!</div>" +
      '<br/>' +
      '<p>' +
      'You are now part of a game-changing movement to create a better internet.' +
      '<br /><br />' +
      'Before you dive in, make sure you get the latest updates by joining' +
      ' the chat on <a href="https://t.me/swashapp_group">Telegram</a>' +
      ' or by following Swash on ' +
      '<a href="https://twitter.com/swashapp">Twitter</a>.' +
      '</p>' +
      '<br/>' +
      '<i>So, what is Swash?</i>' +
      '<br/><br/>' +
      '<p>' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://swashapp.io/"' +
      '>' +
      'Swash' +
      '</a>' +
      ' is an ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://medium.com/swashapp/weve-open-sourced-swash-to-make-data-unions-a-reality-7049e92c364b"' +
      '>' +
      'open-source' +
      '</a>' +
      ' solution that makes it possible for you to monetise your surfing data.' +
      ' Simply install, browse, and earn - that’s it. Swash does all the rest' +
      ' for you and rewards you for the value of your data.' +
      '<br />' +
      '<br />' +
      'The current ecosystem doesn’t acknowledge that, without people, the' +
      ' digital economy wouldn’t exist. A small number of companies enjoy the' +
      ' profits that are created by collecting, using, and selling our data in' +
      ' shady ways without any consequences.' +
      '<br />' +
      '<br />' +
      'Until now.' +
      '<br />' +
      '<br />' +
      'By redistributing 70% of profits back to the people (yes, you!), Swash' +
      ' aims to rebalance and set new standards for the data economy.' +
      '<br />' +
      '<br />' +
      'It makes it possible to easily crowdsource and crowdsell your data as' +
      ' you surf. Cool, huh?' +
      '<br />' +
      '<br />' +
      'Data gets more valuable as it grows. The more people who join Swash,' +
      ' the more value returned to you and everyone else in the Swash Data Union.' +
      '<br />' +
      '<br />' +
      'In this section, you’ll find a walkthrough of each feature within the' +
      ' Swash extension. If you have any questions, check out the ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://swashapp.io/faq"' +
      '>' +
      'Swash FAQ' +
      '</a>' +
      ', or ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://swashapp.io/contact"' +
      '>' +
      'get in touch' +
      '</a>' +
      ' with the team.</p>',
  },
  {
    title: 'Getting Started',
    icon: GettingStartedIcon,
    content:
      '<p>' +
      'When you’ve installed Swash, click on the icon to make sure it’s' +
      ' switched on.' +
      '<br />' +
      '<br />' +
      '</p>' +
      "<div class='help-getting-started-image'></div>" +
      '<p>' +
      '<br />' +
      '<br />' +
      'This popup gives you a quick look at your balance and easy' +
      ' access icons to your Swash Settings, the Data page, and the Help' +
      ' section, plus the option to exclude the current domain from' +
      ' being captured.' +
      '<br />' +
      '<br />' +
      'Within the extension, you’ll see four options; <em>Wallet</em>, <em>Settings</em>, <em>Data</em>, and <em>Help</em>.' +
      '</p>',
  },
  {
    title: 'Wallet',
    icon: WalletIcon,
    content:
      '<p>' +
      'The wallet page is where you can see what you’ve earned when' +
      ' using Swash. All earnings are listed in ' +
      '<a' +
      'target="_blank"' +
      'rel="noopener noreferrer"' +
      'href="https://etherscan.io/token/0xa130e3a33a4d84b04c3918c4e5762223ae252f80"' +
      '>' +
      'SWASH' +
      '</a>' +
      ' native cryptocurrency. For more information on Swash’s' +
      ' connection to Streamr, check out the ' +
      '<a' +
      'target="_blank"' +
      'rel="noopener noreferrer"' +
      'href="https://swashapp.io/faq"' +
      '>' +
      'FAQ' +
      '</a>' +
      ' section.' +
      '</p>' +
      '<br/>' +
      '<br/>' +
      "<div class='title1'>Balance</div>" +
      '<br/>' +
      '<br/>' +
      '<p>' +
      'Your earnings are divided into two:' +
      '<br />' +
      '<br />' +
      '<em>SWASH Earnings</em> - This is the total amount you’ve earned' +
      ' by surfing the web.' +
      '<br />' +
      '<br />' +
      '<em>SWASH Referral bonus</em> - This is the total amount you have' +
      ' received in referral bonuses.' +
      '<br />' +
      '<br />' +
      '</p>' +
      "<div class='help-wallet-earnings-image'></div>" +
      '<p>' +
      '<br />' +
      '<br />' +
      'Press ‘Claim’ to add your referral bonus to your balance.' +
      '<br />' +
      '<br />' +
      'Below your balance, you can find your wallet address and your' +
      ' private key.' +
      '<br />' +
      '<br />' +
      'You can share your wallet address with others but your private' +
      ' key should not be shared with anyone. Think of this like a' +
      ' password to access your wallet. If someone has your private key,' +
      ' then they can access your wallet and its contents.' +
      '</p>' +
      '<br />' +
      '<br />' +
      "<div class='title1' id='withdrawals'>" +
      'Withdrawals' +
      '</div>' +
      '<br />' +
      '<br />' +
      '<p>' +
      'When you withdraw your SWASH, you can then exchange them for' +
      ' other cryptocurrencies or fiat currencies through various' +
      ' exchanges.' +
      '<br />' +
      '<br />' +
      'You can withdraw your earnings using the xDai chain or Ethereum' +
      ' mainnet.' +
      '<br />' +
      '<br />' +
      '</p>' +
      "<div class='title2'>xDai (recommended):</div>" +
      '<br />' +
      '<p>' +
      'Using xDai is faster and Swash will cover the cost for you! 🎉' +
      '<br />' +
      '<br />' +
      'Set up your wallet according to the following instructions to' +
      ' receive your earnings (it only takes a few minutes!):' +
      '<br />' +
      '</p>' +
      '<ol>' +
      '<li>' +
      '<a href="https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup">' +
      ' Connect your Metamask to xDai' +
      '</a>' +
      '</li>' +
      '<li>' +
      'Add SWASH as a token in your Metamask xDai wallet using the' +
      " 'Import Token' button. You can find the SWASH Token Contract Address " +
      '<a href="https://blockscout.com/xdai/mainnet/tokens/0x84e2c67cbefae6b5148fca7d02b341b12ff4b5bb">' +
      ' here' +
      '</a>' +
      '</li>' +
      '<li>' +
      'Copy the Metamask xDai wallet address you just created and' +
      " paste it in the 'Recipient wallet address' box below and" +
      " click 'Withdraw'" +
      '</li>' +
      '</ol>' +
      '<p>' +
      '🎉 Bonus: Once received, you can also put your SWASH to work by' +
      ' trading or staking liquidity on the ' +
      '<a href="https://info.honeyswap.org/pair/0x0110f008b8815cf00514d54ea11bfa8bb555c69b#/pair/0xfd8fe4c85e5c2e56207ffb50b0e9eb43116f282f">' +
      'SWASH/ xDAI pool' +
      '</a>' +
      ' on <a href="https://app.honeyswap.org/#/swap">Honeyswap</a> 🐝' +
      '<br/><br />' +
      '</p>' +
      "<div class='title2'>Ethereum:</div>" +
      '<br />' +
      '<p>' +
      'If you choose to withdraw using Ethereum:' +
      '<br />' +
      '</p>' +
      '<ol>' +
      '<li>' +
      "Choose 'Mainnet' from the 'Withdraw to' dropdown menu below" +
      '</li>' +
      '<li>' +
      "Enter your Ethereum wallet address in the 'Recipient wallet" +
      " address' box below and click 'Withdraw'. Exchange wallets" +
      ' are not currently supported' +
      '</li>' +
      '<li>' +
      'A small box will appear telling you the amount needed in' +
      ' your wallet (in ETH) to cover the transaction fees or if' +
      ' your balance is enough for Swash to cover the transaction' +
      ' fee for you' +
      '</li>' +
      '<li>' +
      'You will then be asked to confirm the transaction you want' +
      ' to make. When you click ‘Confirm’, the transaction will' +
      ' happen' +
      '</li>' +
      '</ol>' +
      '<p>' +
      'Transaction fees (or ‘' +
      '<a href="https://ethereum.org/en/developers/docs/gas/">' +
      'gas fees' +
      '</a>' +
      '’) are the cost of energy needed to run a transaction on' +
      ' Ethereum. The cost will vary depending on the Ethereum network' +
      ' and the cost of the particular transaction in question.' +
      '</p>',
  },
  {
    title: 'Invite Friends',
    icon: InviteFriendsIcon,
    content:
      '<p>Invite your friends to Swash to earn even more and grow the community!' +
      '<br />' +
      '<br />' +
      'This section is divided into two:' +
      '<br />' +
      '<br />' +
      '<i>Total Bonus Earned</i> - The amount you have earned from referrals' +
      '<br />' +
      '<br />' +
      '<i>Total Invited Friends</i> - The number of people who have used your referral link to install Swash' +
      '<br />' +
      '<br />' +
      'The current referral program rewards you 1 SWASH for every new person you bring' +
      ' plus a 1000 SWASH prize for the person who makes the most referrals in a month. ' +
      '<br />' +
      '<br />' +
      'This program is live until the 100K SWASH budget is met and there will be different kinds of referral programs in future.' +
      '<br />' +
      '<br />' +
      'You can also find your referral link to copy and share plus a way to share your link directly on Twitter, Facebook, LinkedIn, and email.' +
      '<br />' +
      '<br />' +
      'The more people who join, the more value that gets returned to everyone!</p>',
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    content:
      "<div class='title2' id='backup-your-wallet-settings'>" +
      'Backup your wallet settings' +
      '</div>' +
      '<br /><br />' +
      '<p>' +
      'If you want to use this wallet on other devices or browsers, you' +
      ' will need to download your settings as a local file, Google' +
      ' Drive, Dropbox, or 3box.' +
      '<br />' +
      '<br />' +
      'You can then use this file to connect Swash on other devices and' +
      ' browsers, so keep it in a safe place. Even if you don’t think' +
      ' you’ll do this, it’s highly recommended that you backup your' +
      ' settings anyway.' +
      '<br />' +
      '<br />' +
      'If you don’t do this but you lose access to your wallet, you' +
      ' won’t be able to access your earnings and Swash won’t be able to' +
      ' help you!' +
      ' </p>' +
      '<br />' +
      '<br />' +
      "<div class='title2' id='private-key'>" +
      'Private key' +
      '</div>' +
      '<br /><br />' +
      '<p>Think of your private key like a password. It should <u>not</u> be shared with anyone.' +
      ' If you share it, the person who has it can access all of your SWASH earnings!</p>',
  },
  {
    title: 'Data',
    icon: DataIcon,
    content:
      "<div class='title1' id='text-masking'>" +
      'Text masking' +
      '</div>' +
      '<br /><br />' +
      '<p>' +
      'Swash doesn’t collect any sensitive data from you, like your' +
      ' name, email, or passwords.' +
      '<br />' +
      '<br />' +
      'If you really want to be sure, you can hide certain sensitive' +
      ' words or numbers so they don’t get added to the Swash dataset.' +
      '<br />' +
      '<br />' +
      'This feature is an extra, it’s not something you have to do to' +
      ' guarantee the security of Swash.' +
      '</p>' +
      '<br /><br />' +
      "<div class='title1' id='your-data'>" +
      'Your Data' +
      '</div>' +
      '<br /><br />' +
      '<p>' +
      'The data collected as you browse is shown here before being' +
      ' added to the Swash dataset. If you want time to check the data' +
      ' before it gets uploaded, you can adjust the sending delay and' +
      ' delete anything that you don’t want to share.' +
      '</p>',
  },
  {
    title: 'Useful Links',
    icon: UsefulLinksIcon,
    content:
      '<p>' +
      'For more information on the data Swash collects, check out the' +
      ' privacy ' +
      '<a href="https://swashapp.io/privacy-policy/extension">' +
      'policy' +
      '</a>' +
      '.' +
      '<br />' +
      '<br />' +
      'Follow ' +
      '<a' +
      'target="_blank"' +
      'rel="noopener noreferrer"' +
      'href="https://swashapp.io/"' +
      '>' +
      'Swash' +
      '</a>' +
      ' on ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://twitter.com/swashapp"' +
      '>' +
      'Twitter' +
      '</a>' +
      ', ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://t.me/swashapp_group"' +
      '>' +
      'Telegram' +
      '</a>' +
      ', and ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://www.reddit.com/r/Swash_App/"' +
      '>' +
      'Reddit' +
      '</a>' +
      ' to stay in the loop.' +
      '<br />' +
      '<br />' +
      'Keep an eye out for regular ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://swashapp.io/blog/"' +
      '>' +
      'blog posts' +
      '</a>' +
      ' and ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://swashapp.io/media"' +
      '>' +
      'media features' +
      '</a>' +
      '.' +
      '<br />' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://chrome.google.com/webstore/detail/swash/cmndjbecilbocjfkibfbifhngkdmjgog">' +
      'Leave a review' +
      '</a>' +
      ' so others know how important Swash is for the future of data.' +
      '<br />' +
      '<br />' +
      'And finally, watch and share ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://youtu.be/pmH3yhkDiic"' +
      '>' +
      'this video' +
      '</a>' +
      ' and your referral link to spread the word about Swash! ' +
      '</p>',
  },
] as HELP_TYPE[];

export default HelpData;
