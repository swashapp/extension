import React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import '../../statics/css/custom-notifications.css';
import NumberPicker from 'react-widgets/lib/NumberPicker';

import simpleNumberLocalizer from 'react-widgets-simple-number';
import DelaySend from '../microcomponents/DelaySend';

simpleNumberLocalizer();

class DataPage extends React.Component {
  state = {
    messages: [],
    delay: 0,
  };

  loadDelay() {
    window.helper.load().then((db) => {
      this.setState({delay: db.configs.delay});
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.loadDelay();
    //Load Messages
    let that = this;

    async function loader() {
      let retMessages = await window.helper.loadMessages();
      let db = await window.helper.load();
      let delay = db.configs.delay * 60000;
      let currentTime = Number(new Date().getTime());
      let messages = [];
      for (let msgId in retMessages) {
        let host = 'Undetermined';
        let msg = retMessages[msgId].message;
        let percentage = Math.round(((currentTime - retMessages[msgId].createTime) * 100) / delay);
        percentage = percentage > 100 ? 100 : percentage;
        try {
          host = new URL(msg.origin).host;
        } catch (err) {}
        delete msg.origin;
        messages.push({
          percentage: percentage,
          currentTime: currentTime,
          msg: msg,
          msgId: retMessages[msgId].id,
          icon: window.helper.getCategory(msg.header.category).icon,
          link: host,
          title: msg.header.module,
        });
      }
      that.setState({messages: messages});
    }

    loader();
    this.interval = setInterval(loader, 100);
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const deleteMsg = (message) => {
      var messages = this.state.messages.filter(function (msg, index, arr) {
        return msg.msgId !== message.msgId;
      });
      //clearTimeout(message.msgId);
      window.helper.cancelSending(message.msgId);
      this.setState({messages: messages});
    };
    const saveDelay = (delay) => {
      if (!delay || delay < 0) delay = 0;
      window.helper.saveConfigs({delay: delay}).then(() => {
        this.setState({delay: delay});
        //NotificationManager.success('Configuration is updated successfully', 'Update Configuration');
      });
    };

    let collapses = this.state.messages.map((item) => {
      return <DelaySend isOpened={false} message={item} onDelete={deleteMsg} />;
    });

    return (
      <div id="data-page" className="swash-col">
        <React.Fragment>
          <div className="swash-col">
            <div className="setting-part-small">
              <div className="swash-head">Collected data</div>
              <div className="swash-p2">
                The data collected from your browsing sessions is shown here before being sent. You can check and delete it here. You can also adjust
                the sending delay to a level that suits you.
              </div>
              <div>
                <div className="form-caption">Delay data send</div>
                <div>
                  <NumberPicker onChange={(value) => saveDelay(value)} value={this.state.delay} className="delayNumberPicker" />
                </div>
              </div>
            </div>

            <div className="setting-part">{collapses}</div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default DataPage;
