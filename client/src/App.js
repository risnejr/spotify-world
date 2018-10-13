import React, { Component } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";

import './App.css';

let url = new URL(window.location.href)
let token = url.searchParams.get("access_token")
let spotifyApi = require('spotify-web-api-js');
let spotify = new spotifyApi();
spotify.setAccessToken(token);

class App extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    console.log(token)
  }

  handleClick(geography, evt) {
    console.log(geography.properties.ISO_A2);
    spotify.getCategoryPlaylists('rock', {limit : 5, country: geography.properties.ISO_A2})
      .then(function(data) {
           console.log(data);
      }, function(err) {
           console.error(err);
      });
  }


  render() {
    return (
      <div className="App">
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11,0,0],
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[0,20]} disablePanning>
            <Geographies geography="world.json">
              {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  onClick={this.handleClick}
                  style={{
                    default: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#607D8B",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#FF5722",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                />
              ))}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default App;
