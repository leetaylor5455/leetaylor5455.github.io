import React, { useState } from 'react';
import './App.css';

import { SketchPicker } from 'react-color';

class App extends React.Component {
  state = {
    background: '#fff',
    rgb: {
      r: 0,
      g: 0,
      b: 0, 
      a: 0
    }
  };

  handleChange = (color) => {
    this.setState({ background: color.hex });
  }

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
    this.setState({ rgb: color.rgb })
    console.log(this.state.rgb);

    let appendURL = `/?r${this.state.rgb.r}g${this.state.rgb.g}b${this.state.rgb.b}&`;
    fetch("http://192.168.0.79" + appendURL)
      .then(response => console.log(response));
  };

  render() {
    return (
      <SketchPicker
        color={ this.state.background }
        onChange={ this.handleChange }
        onChangeComplete={ this.handleChangeComplete }
      />
    );
  }
}

export default App;
