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
  id: string;
}

const HelpData = [
  {
    title: 'Welcome',
    icon: WelcomeIcon,
    id: 'welcome-title-id',
    content:
      "<div class='title1'>Welcome to the world’s first digital Data Union!</div>" +
      '<br/>' +
      '<p>' +
      'You are now part of a game-changing movement to create a better internet.' +
      '<br /><br />' +
      'Before you dive in, make sure you get the latest updates by joining the chat on ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://t.me/swashapp_group">Telegram</a>' +
      ' or by following Swash on ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://twitter.com/swashapp">Twitter</a>.' +
      '</p>' +
      '<br/>' +
      '<i>So, what is Swash?</i>' +
      '<br/><br/>' +
      '<p>' +
      'Swash is an ecosystem of tools and services that enable people, businesses, and developers to unlock the latent value of data by pooling, securely sharing, and monetising its value.' +
      '<br/><br/>' +
      'People share their data to earn while retaining their privacy. Businesses access high-quality, zero-party data in a sustainable and compliant way. Developers set up and build systems within a collaborative development framework with ease.' +
      '<br/><br/>' +
      'Swash is reimagining data ownership by enabling all actors of the data economy to earn, access, build and collaborate in a liquid digital ecosystem for data.' +
      '</p>' +
      '<br/>' +
      '<div class="title1">The Swash app</b>' +
      '<br/><br/>' +
      '<p>' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://swashapp.io/"' +
      '>' +
      'The Swash app' +
      '</a>' +
      ' is an ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://medium.com/swashapp/weve-open-sourced-swash-to-make-data-unions-a-reality-7049e92c364b"' +
      '>' +
      'open-source' +
      '</a>' +
      ' solution that makes it possible for you to monetise your surfing data. Simply install, browse, and earn - that’s it. Swash does all the rest for you and rewards you for the value of your data.' +
      '<br />' +
      '<br />' +
      'The current ecosystem doesn’t acknowledge that, without people, the digital economy wouldn’t exist. A small number of companies enjoy the profits that are created by collecting, using, and selling our data in shady ways without any consequences.' +
      '<br />' +
      '<br />' +
      'Until now.' +
      '<br />' +
      '<br />' +
      'By redistributing 70% of profits back to everyday internet users (that means you!), Swash aims to rebalance and set new standards for the data economy.' +
      '<br />' +
      '<br />' +
      'It makes it possible to easily crowdsource and crowdsell your data as you surf. Cool, huh?' +
      '<br />' +
      '<br />' +
      'Data gets more valuable as it grows. The more people who join Swash, the more value returned to you and everyone else in the Swash Data Union.' +
      '<br />' +
      '<br />' +
      'In this section, you’ll find a walkthrough of each feature within the Swash extension. If you have any questions, check out the ' +
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
    id: 'getting-started-title-id',
    content:
      '<p>' +
      'When you’ve installed Swash, click on the icon to make sure it’s switched on.' +
      '<br />' +
      '<br />' +
      '</p>' +
      "<div class='help-getting-started-image'></div>" +
      '<p>' +
      '<br />' +
      '<br />' +
      'This popup gives you a quick look at your balance and easy access to your Swash Wallet, Settings, and the Help section, plus the option to exclude the current domain (the website you are currently on) from being captured.' +
      '<br />' +
      '<br />' +
      'Within the extension, you’ll see five options; <em>Wallet</em>, <em>Invite Friends</em>, <em>Data</em>, <em>Settings</em>, and <em>Help</em>.' +
      '</p>',
  },
  {
    title: 'Wallet',
    icon: WalletIcon,
    id: 'wallet-title-id',
    content:
      '<p>' +
      'The wallet page is where you can see what you’ve earned when using Swash. All earnings are listed in Swash’s native token, or cryptocurrency, called ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://etherscan.io/token/0xa130e3a33a4d84b04c3918c4e5762223ae252f80"' +
      '>' +
      'SWASH' +
      '</a>' +
      '<br/>' +
      '<br/>' +
      'Your wallet address is your unique identifier within the Swash ecosystem.' +
      '</p>' +
      '<br/>' +
      '<br/>' +
      '<div class="title1">Balance</div>' +
      '<br/>' +
      '<p>' +
      'Your earnings are divided into two:' +
      '<br />' +
      '<br />' +
      '<em>SWASH Earnings</em> - This is the total amount you’ve earned for the value of your data by surfing the web.' +
      '<br />' +
      '<br />' +
      '<em>SWASH Rewards</em> - This is the total amount you have received in rewards from referrals, airdrops, and everything except earnings from your data.' +
      '<br />' +
      '<br />' +
      '</p>' +
      "<div class='help-wallet-earnings-image'></div>" +
      '<p>' +
      '<br />' +
      '<br />' +
      'Earnings update every 48 hours.' +
      '<br />' +
      '<br />' +
      'Press ‘Claim’ to add your referral bonus to your SWASH earnings balance.' +
      '<br />' +
      '<br />' +
      'Below your balances, you can find your public wallet address. This is your unique identifier within the Swash ecosystem.' +
      '</p>' +
      '<br />' +
      '<br />' +
      "<div class='title1' id='withdrawals'>" +
      'Withdrawals' +
      '</div>' +
      '<br />' +
      '<p>' +
      'You can withdraw your earnings using xDai chain (recommended) or Ethereum mainnet (not recommended due to high fees!). Exchange wallets are not currently supported.' +
      '<br />' +
      '<br />' +
      '</p>' +
      "<div class='title2'>xDai (recommended):</div>" +
      '<br />' +
      '<p>' +
      'Using xDai is faster and Swash will cover the cost for you! 🎉' +
      '<br />' +
      '<br />' +
      'Set up your wallet according to the following instructions to receive your earnings (it only takes a few minutes!):' +
      '<br />' +
      '</p>' +
      '<ol>' +
      '<li>' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup">' +
      ' Connect your Metamask to xDai' +
      '</a>' +
      '<br />' +
      '<br />' +
      '<iframe src="https://www.youtube.com/embed/Fahs29XBrcw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>' +
      'Add the xDai network to MetaMask' +
      '</iframe>' +
      '<br />' +
      '<br />' +
      '</li>' +
      '<li>' +
      "Add SWASH as a token in your Metamask xDai wallet using the 'Import Token' button. You can find the SWASH Token Contract Address " +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://blockscout.com/xdai/mainnet/tokens/0x84e2c67cbefae6b5148fca7d02b341b12ff4b5bb">' +
      'here' +
      '</a>' +
      '<br />' +
      '<br />' +
      '<iframe src="https://www.youtube.com/embed/aeoJrVbkP5Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>' +
      'Add the Swash token to MetaMask' +
      '</iframe>' +
      '<br />' +
      '<br />' +
      '</li>' +
      '<li>' +
      "Copy the Metamask xDai wallet address you just created and paste it in the 'Recipient wallet address' box below and click 'Withdraw'" +
      '<br />' +
      '<br />' +
      '<iframe src="https://www.youtube.com/embed/B1X8S7-WBrI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>' +
      'Import the Swash wallet in MetaMask' +
      '</iframe>' +
      '<br />' +
      '<br />' +
      '</li>' +
      '<li>' +
      'Withdrawal successful!' +
      '<br />' +
      '<br />' +
      '<iframe src="https://www.youtube.com/embed/WLjV46KjVk0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>' +
      'Withdrawal successful!' +
      '</iframe>' +
      '<br />' +
      '<br />' +
      '</li>' +
      '</ol>' +
      '<p>' +
      '🎉 Bonus: Once received, you can also put your SWASH to work by trading or staking liquidity on the ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://info.honeyswap.org/pair/0x0110f008b8815cf00514d54ea11bfa8bb555c69b#/pair/0xfd8fe4c85e5c2e56207ffb50b0e9eb43116f282f">' +
      'SWASH/xDAI pool' +
      '</a>' +
      ' on ' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://app.honeyswap.org/#/swap">Honeyswap</a> 🐝' +
      '<br/><br />' +
      '</p>' +
      "<div class='title2'>Understanding error messages</div>" +
      '<br />' +
      '<p>' +
      'Blacklisting happens when people try to cheat referral programs or somehow generate fake data. If your behaviour is flagged, you will receive this error message when you try to withdraw.' +
      '<br />' +
      '<br />' +
      '<iframe src="https://www.youtube.com/embed/gjrenrlBcTA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
      '<br />' +
      '<br />' +
      'If you are new to Swash and have been using it for less than one month, then you will receive an error message telling you the date from when you are able to withdraw.' +
      '<br />' +
      '<br />' +
      '<iframe src="https://www.youtube.com/embed/7uPTmV0QZCA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
      '<br />' +
      '<br />' +
      'You need at least 10 $SWASH to be able to withdraw. If your balance is too low, you will receive an error message.' +
      '<br />' +
      '<br />' +
      '<iframe src="https://www.youtube.com/embed/EH3uA7LIiAI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
      '<br />' +
      '<br />' +
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
      "Enter your Ethereum wallet address in the 'Recipient wallet address' box below and click 'Withdraw'. Exchange wallets are not currently supported" +
      '</li>' +
      '<li>' +
      'A small box will appear telling you the amount needed in your wallet (in ETH) to cover the transaction fees or if your balance is enough for Swash to cover the transaction fee for you' +
      '</li>' +
      '<li>' +
      'You will then be asked to confirm the transaction you want to make. When you click ‘Confirm’, the transaction will happen' +
      '</li>' +
      '</ol>' +
      '<p>' +
      'Transaction fees (or ‘' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://ethereum.org/en/developers/docs/gas/">' +
      'gas fees' +
      '</a>' +
      '’) are the cost of energy needed to run a transaction on Ethereum. The cost will vary depending on the Ethereum network and the cost of the particular transaction in question.' +
      '<br />' +
      '<br />' +
      'Alternatively, if you use Ethereum, you will be presented with the amount needed in your wallet (in ETH) to cover the transaction fee.' +
      '</p>',
  },
  {
    title: 'Invite Friends',
    icon: InviteFriendsIcon,
    id: 'invite-friends-title-id',
    content:
      '<p>Invite your friends to Swash to earn even more and grow the community!' +
      '<br />' +
      '<br />' +
      'This section is divided into two:' +
      '<br />' +
      '<br />' +
      '<i>SWASH Referral Bonus</i> - The amount you have earned from referrals' +
      '<br />' +
      '<br />' +
      '<i>Invited Friends</i> - The number of people who have used your referral link to install Swash' +
      '<br />' +
      '<br />' +
      '$REWARD_PROGRAM' +
      '<br />' +
      '<br />' +
      'There is an anti-fraud mechanism in place to combat fake users in the Swash ecosystem. If your referrals are not reflected it is because your activity is flagged as malicious.' +
      '<br />' +
      '<br />' +
      'As fake users drain rewards from the ecosystem and are detrimental to genuine Swash members and the larger community, using malicious techniques, bots, and other fraudulent activities to cheat the system will get you blacklisted from Swash!' +
      '<br />' +
      '<br />' +
      'If you’re certain your referrals are genuine but they are not reflected, reach out to the Swash team for support.' +
      '<br />' +
      '<br />' +
      'You can also find your referral link to copy and share plus a way to share your link directly on Twitter, Facebook, LinkedIn, and email.' +
      '<br />' +
      '<br />' +
      'The more people who join, the more value that gets returned to everyone!</p>',
  },
  {
    title: 'Data',
    icon: DataIcon,
    id: 'data-title-id',
    content:
      "<div class='title1' id='text-masking'>" +
      'Text masking' +
      '</div>' +
      '<br />' +
      '<p>' +
      'Swash doesn’t collect any sensitive data from you, like your name, email, or passwords.' +
      '<br />' +
      '<br />' +
      'If you want to be really sure, you can hide certain sensitive words or numbers so they don’t get added to the Swash dataset.' +
      '<br />' +
      '<br />' +
      'This feature is an extra, it’s not something you have to do to guarantee the security of Swash.' +
      '</p>' +
      '<br /><br />' +
      "<div class='title1' id='your-data'>" +
      'Your Data' +
      '</div>' +
      '<br />' +
      '<p>' +
      'The data collected as you browse is shown here before being added to the Swash dataset. If you want time to check the data before it gets uploaded, you can adjust the sending delay and delete anything that you don’t want to share.' +
      '</p>',
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    id: 'settings-title-id',
    content:
      "<div class='title2' id='backup-your-wallet-settings'>" +
      'Backup your wallet settings.' +
      '</div>' +
      '<br />' +
      '<p>' +
      'It’s important that you download your settings as either a local file, Google Drive, Dropbox, or 3box.' +
      '<br />' +
      '<br />' +
      'You can then use this file to connect Swash on other devices and browsers, so keep it in a safe place. Even if you don’t think you’ll do this, it’s highly recommended that you backup your settings anyway.' +
      '<br />' +
      '<br />' +
      'If you don’t do this but you lose access to your wallet, you will not be able to access your earnings and Swash won’t be able to help you!' +
      ' </p>' +
      '<br />' +
      '<br />' +
      "<div class='title2' id='private-key'>" +
      'Private key' +
      '</div>' +
      '<br />' +
      '<p>Think of your private key like a password. It should <u>not</u> be shared with anyone. If you share it, the person who has it can access all of your SWASH earnings!</p>',
  },
  {
    title: 'Useful Links',
    id: 'useful-links-title-id',
    content:
      '<p>' +
      'For more information on the data Swash captures, check out the ' +
      '<a' +
      ' target="_blank"' +
      ' rel="noopener noreferrer"' +
      ' href="https://swashapp.io/privacy-policy/extension">' +
      'privacy policy' +
      '</a>' +
      '.' +
      '<br />' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://twitter.com/swashapp"' +
      '>' +
      'Twitter' +
      '</a>' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://t.me/swashapp"' +
      '>' +
      'Telegram Announcements' +
      '</a>' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://t.me/swashapp_group"' +
      '>' +
      'Telegram Community' +
      '</a>' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://medium.com/swashapp"' +
      '>' +
      'Blog' +
      '</a>' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://www.reddit.com/r/Swash_App/"' +
      '>' +
      'Reddit' +
      '</a>' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://www.linkedin.com/company/swashapp/"' +
      '>' +
      'Linkedin' +
      '</a>' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://swashapp.io/newsletter"' +
      '>' +
      'Newsletter' +
      '</a>' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://swashapp.io/media"' +
      '>' +
      'Media' +
      '</a>' +
      '<br />' +
      '<a' +
      '  target="_blank"' +
      '  rel="noopener noreferrer"' +
      '  href="https://youtu.be/r9o1AUcNfoI"' +
      '>' +
      'Video' +
      '</a>' +
      '</p>',
    icon: UsefulLinksIcon,
  },
] as HELP_TYPE[];

export default HelpData;
