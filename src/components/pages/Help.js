import React from 'react';
import ReactPlayer from 'react-player';

import popImg from '../../statics/images/help/swash-popup.jpg';
import earningsImg from '../../statics/images/help/swash-earnings.jpg';
import walletImg from '../../statics/images/help/swash-wallet.jpg';
import withdrawImg from '../../statics/images/help/swash-withdraw.jpg';
import referralImg from '../../statics/images/help/swash-referral.jpg';
import backupImg from '../../statics/images/help/swash-backup.jpg';
import textMaskingImg from '../../statics/images/help/swash-text-masking.jpg';
import dataImg from '../../statics/images/help/swash-data.jpg';

class HelpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reward: 0,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadActiveReferral();
  }

  loadActiveReferral() {
    window.helper.getActiveReferral().then((referral) => {
      if (referral.reward) this.setState({reward: referral.reward});
    });
  }

  render() {
    return (
      <div id="swash-help-page" className="swash-col">
        <React.Fragment>
          <div className="swash-col">
            <div className="swash-setting-part">
              <div className="swash-head">Welcome to the world’s first digital Data Union!</div>
              <div className="swash-p">
                Before you dive in, make sure you get the latest updates by joining the chat on <a href={'https://t.me/swashapp_group'}>Telegram </a>
                or following Swash on <a href={'https://twitter.com/swashapp'}>Twitter</a>.
                <br />
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/'}>
                  {'Swash '}
                </a>
                is an
                <a
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                  href={'https://medium.com/swashapp/weve-open-sourced-swash-to-make-data-unions-a-reality-7049e92c364b'}>
                  {' open-source '}
                </a>
                solution that makes it possible for you to monetise your surfing data. Simply install, browse, and earn - that’s it. Swash does all
                the rest for you and rewards you for the value of your data.
                <div className="swash-video">
                  <ReactPlayer url={'https://youtu.be/pmH3yhkDiic'} width={'100%'} height={'100%'} controls={true} />
                </div>
                The current ecosystem doesn’t acknowledge that, without people, the digital economy wouldn’t exist. A select few reap the rewards that
                belong to the many by collecting, using, and selling our data in shady ways without hesitation or consequence.
                <br />
                <br />
                Swash aims to rebalance the data economy by redistributing 70% of profits back to the people. It makes it possible to crowdsource and
                crowdsell data in a transparent and unobtrusive way so you can easily profit from the value you generate as you surf the web.
                <br />
                <br />
                Swash is ready for you to install and start earning. The more people who join, the more value returned to everyone.
                <br />
                <br />
                In this section, you’ll find a walkthrough of each feature within the Swash extension. If you have any questions, check out
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/faq'}>
                  {' Swash FAQ'}
                </a>
                , or
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/contact'}>
                  {' get in touch '}
                </a>
                with the team.
              </div>

              <div className="swash-head">Getting Started</div>
              <div className="swash-p2">
                When you’ve installed Swash, click on the icon to check that it’s switched on (the toggle will be green).
                <br />
                <br />
                <div className="swash-image">
                  <img src={popImg} alt={'popup'} />
                </div>
                <br />
                <br />
                Here is where you can see your balance and quick access icons to the Swash plugin.
              </div>

              <div className="swash-head2">Navigation</div>
              <div className="swash-p2">
                Within the extension, you’ll see four options; <em>Wallet</em>, <em>Settings</em>, <em>Data</em>, and <em>Help</em>.
              </div>

              <div className="swash-head3">Wallet</div>
              <div className="swash-p2">
                The wallet page is where you can see what you’ve earned when using Swash. All earnings are listed in
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://etherscan.io/token/0x0cf0ee63788a0849fe5297f3407f701e122cc023'}>
                  {' DATA coin '}
                </a>
                -
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://streamr.network/'}>
                  {' Streamr'}
                </a>
                ’s native cryptocurrency. For more information on Swash’s connection to Streamr, check the
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/faq'}>
                  {' FAQ '}
                </a>
                section.
              </div>

              <div className="swash-head4">Earnings</div>
              <div className="swash-p2">
                Your earnings are divided into two:
                <br />
                <br />
                <em>Earnings</em> - This is the total amount you have earned by surfing the web with Swash
                <br />
                <br />
                <em>Referral bonus</em> - This section is the total amount you have received in referral bonuses since installing Swash
                <br />
                <br />
                <div className="swash-image">
                  <img src={earningsImg} alt={'earnings'} />
                </div>
              </div>

              <div className="swash-head4">Your wallet</div>
              <div className="swash-p2">
                Here is where you will find your wallet address and your private key.
                <br />
                <br />
                You can share your wallet address with others to receive crypto.
                <br />
                <br />
                <div className="swash-image">
                  <img src={walletImg} alt={'wallet'} />
                </div>
                <br />
                <br />
                Your private key should not be shared with anyone. Think of this like a password to access your wallet. If someone has your private
                key, then they can access your wallet and its contents.
              </div>

              <div className="swash-head4">Withdrawals</div>
              <div className="swash-p2">
                To withdraw your earnings, simply add your chosen wallet address and press ‘Withdraw’. Currently, the amount you can withdraw is the
                total sum of your earnings, not including your referral bonus. Your referral earnings will be available to withdraw at the end of Feb
                2021.
                <br />
                <br />
                When you click ‘Withdraw’, a small box will appear telling you the amount needed to cover the transaction gas fees and if your balance
                is enough for Swash to cover the cost for you.
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://ethereum.org/en/developers/docs/gas/'}>
                  {' Gas fees '}
                </a>
                are the cost of energy needed to run a transaction on the Ethereum. The cost will vary depending on the Ethereum network and the cost
                of the particular transaction in question.
                <br />
                <br />
                When you withdraw your DATAcoin, you can then exchange them for other cryptocurrencies or fiat currencies through various exchanges.
                <br />
                <br />
                You will then be presented with a confirmation of the transaction you want to make. When you click ‘Confirm and send’, the transaction
                will happen. After, you will be given the option to view the transaction on Etherscan, which is where you can find, confirm, and
                validate all transactions made on the Ethereum blockchain.
                <br />
                <br />
                <div className="swash-image">
                  <img src={withdrawImg} alt={'withdraw'} />
                </div>
              </div>

              <div className="swash-head3">Settings</div>
              <div className="swash-head4">Invite a friend</div>
              <div className="swash-p2">
                The first thing you will see in your Swash settings is the option to ‘Invite a friend’. Here is where you can find your unique
                referral link to share Swash with others. For every new installation of Swash made using your referral link, you receive{' '}
                {this.state.reward} DATAcoin.
                <br />
                <br />
                <div className="swash-image">
                  <img src={referralImg} alt={'referral'} />
                </div>
                <br />
                <br />
                The user who invites the most new people to Swash using their referral link will be rewarded with 1000 DATAcoin each month.
                <br />
                <br />
                You can also use the social icons to share your referral link directly on Twitter, Facebook, LinkedIn, and email.
                <br />
                <br />
                The more people who join, the more value returned to everyone.
                <br />
                <br />
                <em>Your referral earnings will be available to withdraw at the end of Feb 2021.</em>
              </div>

              <div className="swash-head4">Backup your wallet settings</div>
              <div className="swash-p2">
                If you want to use this wallet on other devices or browsers, you will need to download your settings using either local file, Google
                Drive, Dropbox, or 3box.
                <br />
                <br />
                You can then use this file to connect Swash on other devices and browsers, so keep it in a safe place. Even if you don’t think you’ll
                do this, it’s strongly recommended that you backup your settings anyway.
                <br />
                <br />
                <div className="swash-image">
                  <img src={backupImg} alt={'backup'} />
                </div>
              </div>

              <div className="swash-head3">Data</div>
              <div className="swash-head4">Text masking</div>
              <div className="swash-p2">
                Swash doesn’t collect any sensitive data from you, like your name, email, or passwords. However, with text masking, you can add
                another layer of security to hide certain sensitive words or numbers so they don’t get added to the Streamr Marketplace.
                <br />
                <br />
                This feature is an extra, it’s not something you have to do to guarantee the security of Swash. However, you may find it useful if you
                search for your name, email address, or phone number in search bars, for example.
                <br />
                <br />
                <div className="swash-image">
                  <img src={textMaskingImg} alt={'text masking'} />
                </div>
              </div>

              <div className="swash-head4">Your Data</div>
              <div className="swash-p2">
                In this section, the data collected while you browse is shown here before being uploaded to the Streamr Marketplace. You can choose
                how long the sending delay should be (in minutes), giving you time to check and delete anything you don’t want to upload.
                <br />
                <br />
                For more information on the data Swash collects, check the
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/files/privacy-policy.pdf'}>
                  {' privacy policy'}
                </a>
                .
                <br />
                <br />
                <div className="swash-image">
                  <img src={dataImg} alt={'data'} />
                </div>
              </div>

              <div className="swash-head">Still hungry for more?</div>
              <div className="swash-p">
                Follow
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/'}>
                  {' Swash '}
                </a>
                on
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://twitter.com/swashapp'}>
                  {' Twitter'}
                </a>
                ,
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://t.me/swashapp_group'}>
                  {' Telegram'}
                </a>
                , and
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://www.reddit.com/r/Swash_App/'}>
                  {' Reddit '}
                </a>
                to stay in the loop.
                <br />
                <br />
                Keep an eye out for regular
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/blog/'}>
                  {' blog posts '}
                </a>
                and
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/media'}>
                  {' media features '}
                </a>
                .
                <br />
                <br />
                Watch and share
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://youtu.be/pmH3yhkDiic'}>
                  {' this video '}
                </a>
                to spread the word about Swash.
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default HelpPage;
