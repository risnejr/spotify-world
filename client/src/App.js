import React, { Component } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import Spotify from 'spotify-web-api-js';
import Modal from './Components/Modal'

import './App.css';

let url = new URL(window.location.href)
let token = url.searchParams.get("access_token")
let spotify = new Spotify();
let availableMarkets = ["AD", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK",
                        "DO", "EC", "EE", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IS", "IT",
                        "LI", "LT", "LU", "LV", "MC", "MT", "MY", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PL", "PT",
                        "PY", "SE", "SG", "SK", "SV", "TR", "TW", "UY", "US", "JP", "CA", "ZA", "MX", "RO", "TH"]
let deviceId = ""

spotify.setAccessToken(token);

class App extends Component {
  constructor() {
    super()

    this.state = {
      deviceId: ""
    }
  }

  componentDidMount() {
    window.onSpotifyPlayerAPIReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Template',
        getOAuthToken: cb => { cb(token); }
      });
    
      // Error handling
      player.on('initialization_error', e => console.error(e));
      player.on('authentication_error', e => console.error(e));
      player.on('account_error', e => console.error(e));
      player.on('playback_error', e => console.error(e));
    
      // Ready
      player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);
        
        this.setState({deviceId: data.device_id});
        deviceId = data.device_id
        //console.log(this.state.deviceId)
      });
    
      // Connect to the player!
      player.connect();
    }

  }

  handleClick(geography, evt) {
    console.log(geography.properties.ISO_A2);
    spotify.getCategoryPlaylists('pop', {limit : 1, country: geography.properties.ISO_A2})
      .then(function(data) {
        console.log(data)
        let playlist = data.playlists.items[0]
        let playlistUri = playlist.uri  
        let trackPosition = Math.floor(Math.random() * playlist.tracks.total)
        console.log(deviceId)
        
        spotify.play({
          device_id: deviceId,
          context_uri: playlistUri,
          offset: {
            position: trackPosition
          },
          position_ms: 60000
        })
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
            width: "99%",
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
                  style={ availableMarkets.includes(geography.properties.ISO_A2) ? {
                    default: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#55efc4",
                      stroke: "#00b894",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {  
                      fill: "#00b894",
                      stroke: "#00b894",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    } : {default: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#fab1a0",
                      stroke: "#e17055",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#e17055",
                      stroke: "#e17055",
                      strokeWidth: 0.75,
                      outline: "none",
                    }}}
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
