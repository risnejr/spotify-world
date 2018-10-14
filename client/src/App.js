import React, { Component } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import Spotify from 'spotify-web-api-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from './Modal';
import './App.css';

import { geoPath } from "d3-geo"
import { geoTimes } from "d3-geo-projection"
import { Motion, spring } from "react-motion"

let url = new URL(window.location.href)
let token = url.searchParams.get("access_token")
let spotify = new Spotify();
let availableMarkets = ["AD", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK",
                        "DO", "EC", "EE", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IS", "IT",
                        "LI", "LT", "LU", "LV", "MC", "MT", "MY", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PL", "PT",
                        "PY", "SE", "SG", "SK", "SV", "TR", "TW", "UY", "US", "JP", "CA", "ZA", "MX", "RO", "TH", "VN"]
let deviceId = ""

spotify.setAccessToken(token);

document.body.style.overflow = "hidden"

class App extends Component {
  static defaultProps = {
    width: 950,
    height: 400,
  }
  constructor(props) {
    super(props)
    this.state = {
      genreList: [],
      center: [0,1],
      zoom: 1,
      country: '',
      artist: '',
      song: '',
    }
    this.projection = this.projection.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.zoomOut = this.zoomOut.bind(this)
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

      player.on('player_state_changed', state => { 
        this.setState({song: state.track_window.current_track.name,
                       artist: state.track_window.current_track.artists[0].name})
      })
    
      // Ready
      player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);
        deviceId = data.device_id
      });
    
      // Connect to the player!
      player.connect();
    }

  }

  projection() {
    return geoTimes()
      .translate([this.props.width/2, this.props.height/2])
      .scale(205)
  }

  zoomOut() {
    this.setState({
      center: [0, 1],
      zoom: 1
    })
  }

  handleClick = (geography) => {
    if(this.state.country === geography.properties.ISO_A2) {
      this.zoomOut()
      return
    }
    // zooming
    const path = geoPath().projection(this.projection())
    const centroid = this.projection().invert(path.centroid(geography))
    this.setState({
      center: centroid,
      zoom: 3,
      country: geography.properties.ISO_A2,
    })

    // Play music
    console.log(geography.properties.ISO_A2);
      spotify.getCategories({limit : 8, country: geography.properties.ISO_A2})
          .then(data => {
            this.setState({genreList: []});
            for(let i = 0; i < 8; i++){
              let genre = {
                  'id': data.categories.items[i].id,
                  'src': data.categories.items[i].icons[0].url
              };
              this.setState({genreList: [...this.state.genreList, genre]});
            }
            $("#modalWindow").modal();
          }, function(err) {
               console.error(err);
    });
    //this.setState({country: ''})
  }

  handleImgClick = genre => {
    spotify.getCategoryPlaylists(genre, {limit : 1, country: this.state.country})
      .then(data => {
        let playlist = data.playlists.items[0]
        let playlistUri = playlist.uri
        let trackPosition = Math.floor(Math.random() * playlist.tracks.total);
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
      <Motion
          defaultStyle={{
            zoom: 1,
            x: 0,
            y: 0,
          }}
          style={{
            zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
            x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
            y: spring(this.state.center[1], {stiffness: 210, damping: 20}),
          }}
          >
      {({zoom,x,y}) => (
        <ComposableMap
        projection={this.projection}
        width={this.props.width}
        height={this.props.height}
        style={{
          width: "100%",
          height: "100%",
        }}
        >
        <ZoomableGroup
        center={[x,y]}
        zoom={zoom}
        disablePanning={true} >
        <Geographies geography="world.json" disableOptimization>
        {(geographies, projection) => geographies.map((geography, i) =>
          geography.id !== "ATA" && (
            <Geography
            key={i}
            geography={geography}
            projection={projection}
            cacheId={`path-${i}`}
            onClick={availableMarkets.includes(geography.properties.ISO_A2) ? this.handleClick : this.zoomOut}
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
          ))
        }
        </Geographies>
        </ZoomableGroup>
        </ComposableMap>
      )}
      </Motion>
      <Modal data = {this.state} handleClick = {this.handleImgClick}/>
      </div>
    );
  }
}

export default App;
