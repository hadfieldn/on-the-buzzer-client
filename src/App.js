import React, { Component } from "react";
import WebSocketConnection from "./WebSocketConnection";
import EVENTS from "./events";
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      buzzed: undefined
    };
  }
  componentDidMount() {
    this.connection = new WebSocketConnection(this.onMessage.bind(this));

    document.addEventListener("keydown", this.reset.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.reset.bind(this));
  }

  onMessage(data) {
    console.log({data: data})
    if (data.event === EVENTS.BUZZ) {
      const button = data.payload.button
      this.setState({ buzzed: data.payload.button });
    } else if (data.event === EVENTS.QUESTION_RESETTED) {
      this.playSound(button === 1 ? "small-dog-bark" : "big-dog-bark");
      this.setState({ buzzed: undefined });
    }
  }

  playSound(soundId) {
    const sound = document.getElementById(soundId)
    sound.play();
  }

  reset() {
    this.connection.send(EVENTS.RESET_QUESTION);
  }

  render() {
    return (
      <div className="App">
        <audio id="buzzer-audio" src="/beep4.wav" autoPlay={false} />
        <audio id="big-dog-bark" src="/big_dog_bark.wav" autoPlay={false} />
        <audio id="small-dog-bark" src="/small_dog_bark.m4a" autoPlay={false} />
        <div className="Result">
          <div
            className={`team-1 ${
              this.state.buzzed
                ? this.state.buzzed === 1
                  ? "buzzed"
                  : "not-buzzed"
                : ""
            }`}
          >
            <img src="/small_dog.png" alt={"small dog"}/>
          </div>
          <div
            className={`team-2 ${
              this.state.buzzed
                ? this.state.buzzed === 2
                  ? "buzzed"
                  : "not-buzzed"
                : ""
            }`}
          >
            <img src="/big_dog.png" alt={"big dog"}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
