import "./App.css";
import React, { Component } from "react";
import crypto from "crypto-js";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      unlockpassword: "",
      keypairpassword: "",
    };
  }
  render() {
    return (
      <div className="App">
        <div>
          <div class="container">
            <div>1.设置密码</div>
            <input type="text" onChange={this.handleInput.bind(this)} />
            <button onClick={this.savePassWordFrist.bind(this)}>
              保存密码
            </button>
            <br />
            <br />
            <br />
            <div>2.解锁钱包</div>
            <input type="text" onChange={this.handleUnlockInput.bind(this)} />
            <button onClick={this.unlockwallet.bind(this)}>解锁钱包</button>
            <br />
            <br />
            <br />
            <button onClick={this.makekeypair}>3.密码钱包Keypair关联</button>
            <br />
            <br />
            <br />
            <div>4.解锁密码显示私钥</div>
            <input type="text" onChange={this.handleUnlockKeypair.bind(this)} />
            <button onClick={this.unlockkeypairpassword.bind(this)}>
              解锁
            </button>
          </div>
        </div>
      </div>
    );
  }
  savePassWordFrist() {
    const hash_str = this.makeSha256(this.state.password);
    chrome.storage.sync.set({ cache: hash_str }, () => {});
  }
  handleInput(e) {
    this.setState({
      password: e.target.value,
    });
  }
  handleUnlockInput(e) {
    this.setState({
      unlockpassword: e.target.value,
    });
  }
  handleUnlockKeypair(e) {
    this.setState({
      keypairpassword: e.target.value,
    });
  }
  unlockwallet() {
    const unlockpassword_hash = this.makeSha256(this.state.unlockpassword);
    chrome.storage.sync.get(["cache"], function (result) {
      if (unlockpassword_hash == result.cache) {
        alert("success");
      } else {
        alert("error");
      }
    });
  }
  makeSha256(str) {
    var hash = crypto.SHA256(str);
    var hash_str = hash.toString(crypto.enc.Hex);
    return hash_str;
  }
  makekeypair() {
    var privatekey = "MIetvzkqz3_HUlc9fgawbwBCqLMjs0DkrZw7UGy7Lqc=";
    chrome.storage.sync.get(["cache"], function (result) {
      var encrypted = crypto.AES.encrypt(privatekey, result.cache);
      chrome.storage.sync.set({ cache: encrypted }, () => {
        alert("将密码加密keypair成功");
      });
    });
  }
  unlockkeypairpassword() {

    const unlockpassword_hash = this.makeSha256(this.state.keypairpassword);
    chrome.storage.sync.get(["cache"], function (result) {
      console.log(result.cache);
      var decrypted = crypto.AES.decrypt(result.cache, unlockpassword_hash);
      var result = decrypted.toString(crypto.enc.Utf8);
      if (result != "") {
        alert("解锁成功" + result);
      } else {
        alert("密码错误");
      }
    });
  }
}

export default App;
