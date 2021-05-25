import React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import '../../statics/css/custom-notifications.css';
import NumberPicker from 'react-widgets/lib/NumberPicker';

import simpleNumberLocalizer from 'react-widgets-simple-number';
import DelaySend from '../microcomponents/DelaySend';
import CustomSnackbar from '../microcomponents/CustomSnackbar';

simpleNumberLocalizer();

class DataPage extends React.Component {
  constructor(props) {
    super(props);
    this.notifyRef = React.createRef();
    this.state = {
      masks: [],
      messages: [],
      delay: 0,
    };
  }

  loadSettings() {
    window.helper.load().then((db) => {
      let masks = db.privacyData;
      let newMasks = [];
      for (let x in masks) {
        newMasks.push({
          value: masks[x].value,
        });
      }

      this.setState({
        masks: newMasks,
        delay: db.configs.delay,
      });
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.loadSettings();
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
          icon: (await window.helper.getCategory(msg.header.category)).icon,
          link: host,
          title: msg.header.module,
        });
      }
      that.setState({messages: messages});
    }

    loader().then();
    this.interval = setInterval(loader, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addMask() {
    let mvElement = document.getElementById('swash-mask-value');
    let f = {
      value: mvElement.value,
    };
    mvElement.value = '';
    if (!f.value || f.value === 'undefined') {
      this.notifyRef.current.handleNotification('Null is not allowed', 'error');
      return;
    }

    let allow = true;
    window.helper.loadPrivacyData().then((pData) => {
      for (let i in pData) {
        if (pData[i].value === f.value) {
          allow = false;
        }
      }
      if (allow) {
        pData.push(f);
        window.helper.savePrivacyData(pData);
        let i = this.state.masks;
        i.push(f);
        this.setState({masks: i});
      } else {
        this.notifyRef.current.handleNotification('Duplicate entry', 'error');
      }
    });
  }

  deleteMaskRecord(id) {
    let newArray = [];
    let storageArray = [];
    for (let i in this.state.masks) {
      if (this.state.masks[i].value !== id) {
        newArray.push(this.state.masks[i]);
        storageArray.push({value: this.state.masks[i].value});
      }
    }
    window.helper.savePrivacyData(storageArray);
    this.setState({masks: newArray});
  }

  render() {
    let maskTableDataRows = this.state.masks.map((row) => {
      return (
        <tr key={row.value} className="swash-table-row">
          <td className="swash-table-text swash-disabled-masked-text-td">
            <input type="text" value={row.value} disabled className="swash-disabled-masked-text" />
          </td>
          <td className="swash-table-text swash-delete-masked-text-td">
            <button
              className="swash-link-button"
              onClick={() => {
                this.deleteMaskRecord(row.value);
              }}>
              Delete
            </button>
          </td>
        </tr>
      );
    });
    let addMaskText = (
      <div>
        <div className="swash-form-caption">Mask it 👇</div>
        <div>
          <input
            type="text"
            id="swash-mask-value"
            onKeyDown={(e) => {
              if (e.key === 'Enter') this.addMask();
            }}
            placeholder="Peter"
            className="swash-form-input swash-mask-input"
          />
        </div>
      </div>
    );
    let AddMaskButton = (
      <button className="swash-link-button" onClick={() => this.addMask()}>
        Add
      </button>
    );
    const deleteMsg = (message) => {
      var messages = this.state.messages.filter(function (msg, index, arr) {
        return msg.msgId !== message.msgId;
      });
      window.helper.cancelSending(message.msgId);
      this.setState({messages: messages});
    };
    const saveDelay = (delay) => {
      if (!delay || delay < 0) delay = 0;
      window.helper.saveConfigs({delay: delay}).then(() => {
        this.setState({delay: delay});
      });
    };

    let collapses = this.state.messages.map((item) => {
      return <DelaySend isOpened={false} message={item} onDelete={deleteMsg} key={item.msgId} />;
    });

    return (
      <div id="swash-data-page" className="swash-col">
        <React.Fragment>
          <div id="swash-advanced-page">
            <div className="swash-col">
              <div className="swash-setting-part">
                <div className="swash-head">Text masking</div>
                <div className="swash-p2">
                  Swash doesn’t collect any sensitive data from you, like your name, email, or passwords.
                  <br />
                  <br />
                  If you really want to be sure, you can hide certain sensitive words or numbers so they don’t get added to the Swash dataset.
                </div>

                <div>
                  <div>
                    <div>
                      <tr className="swash-table-head-row">
                        <th className="swash-table-text swash-table-head-text swash-add-mask-text-th">{addMaskText}</th>
                        <th className="swash-table-text swash-table-head-text swash-add-mask-button-th">{AddMaskButton}</th>
                      </tr>
                    </div>

                    <div>{maskTableDataRows}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swash-col">
            <div className="swash-setting-part-small">
              <div className="swash-head">Your data</div>
              <div className="swash-p2">
                The data collected as you browse is shown here before being added to the Swash dataset. If you want time to check the data before it
                gets uploaded, you can adjust the sending delay and delete anything that you don’t want to share.
              </div>
              <div>
                <div className="swash-form-caption">Delay my data by</div>
                <div>
                  <NumberPicker onChange={(value) => saveDelay(value)} value={this.state.delay} className="swash-delay-number-picker" />
                </div>
              </div>
            </div>

            <div className="swash-setting-part">{collapses}</div>
          </div>
        </React.Fragment>
        <CustomSnackbar ref={this.notifyRef} />
      </div>
    );
  }
}

export default DataPage;
