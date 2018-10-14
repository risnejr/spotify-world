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
let availableMarkets = ["AD", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK",
                        "DO", "EC", "EE", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", 'IL', "IS", "IT",
                        "JP", "LI", "LT", "LU", "LV", "MC", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PL",
                        "PT", "PY", "RO", "SE", "SG", "SK", "SV", "TR", "TH", "TW", "UY", "US", "VN", "ZA"]
let deviceId = ""

let viralPlaylist = {
    'AD' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMxjQJh4Um8T',
    'AR' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJajpaXyaKll',
    'AT' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKxYYIUIgn7V',
    'AU' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbO5MSE9RdfN2',
    'BE' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJx9hUtTN0Sj',
    'BG' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJcpVBLdFV7m',
    'BO' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMTKZuy8ORFV',
    'BR' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMOkSwG072hV',
    'CA' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKfIuOAZrk7G',
    'CH' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNjqq6Tw4Fb0',
    'CL' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJs8e2vk15a8',
    'CO' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKrooeK9WSFF',
    'CR' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKOefHPXPMyf',
    'CY' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNBxnXSWuAcX',
    'CZ' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMBUm3g7j4Kb',
    'DE' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNv6cjoMVCyg',
    'DK' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMA8BIYDeMkD',
    'DO' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJWZV7aRNQck',
    'EC' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJpRQ294oZ9N',
    'EE' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbK4KA2JSuft7',
    'ES' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMfVLvbaC3bj',
    'FI' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMBNcyQCfU4w',
    'FR' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJmRv5TqJW16',
    'GB' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbL3DLHfQeDmV',
    'GR' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbLOov4J0GutU',
    'GT' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNF1heNYHDnE',
    'HK' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKXd6qahcpCg',
    'HN' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNpKdqfZ9Upp',
    'HU' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbLuey1EKVv9I',
    'ID' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKpV6RVDTWcZ',
    'IE' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbLzhUVGQUCoe',
    'IL' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNGlbFNNXxgC',
    'IS' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMHnoaLVkVuk',
    'IT' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNGlbFNNXxgC',
    'JP' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbINTEnbFeb8d',
    'LI' : 'spotify:album:2viDI6oI3hemgZROjm9IKZ',
    'LT' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbLDLOTfCtAUM',
    'LU' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJ9SRaVj0yDF',
    'LV' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbIUY6VUoboP4',
    'MC' : 'spotify:album:4X8OmfHoxew8PIprjgCp5Z',
    'MT' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMjKD6qnoc8p',
    'MX' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbLuUZrygauiA',
    'MY' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbLRmg3qDbY1H',
    'NI' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKgCVIE0PTOD',
    'NL' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMQaPQjt027d',
    'NO' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbOcsE2WCaJa2',
    'NZ' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJ7gPAehey5W',
    'PA' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMIO7B1pcKUy',
    'PE' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbN7gfhgaomhA',
    'PH' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJv2Mvelmc3I',
    'PL' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNGGDnE9UFTF',
    'PT' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKHoaIcElSSA',
    'PY' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNxY4E5g33Gy',
    'RO' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbNwDVyEEfWV3',
    'SE' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbIPOivNiyjjS',
    'SG' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJVi45MafAu0',
    'SK' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbK3Iy2zvpfp4',
    'SV' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbLo3yC8XJf1e',
    'TR' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMIJZxwqzod6',
    'TH' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMnf7ONzeQWM',
    'TW' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbMGnTCc4Vx7v',
    'UY' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbM1qaaFAyPLz',
    'US' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbKuaTI1Z1Afx',
    'VN' : 'spotify:user:spotifycharts:playlist:37i9dQZEVXbL1G1MbPav3j',
    'ZA' : 'spotify:album:3GrlEr00MvyR2TKqyElU6q'
};

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

      // player.on('player_state_changed', state => {
      //   this.setState({song: state.track_window.current_track.name,
      //                  artist: state.track_window.current_track.artists[0].name})
      // })

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
    spotify.getCategories({limit : 8, country: geography.properties.ISO_A2})
          .then(data => {
             this.setState({genreList: [{
                'id': "viral",
                'name': "Viral",
                'src': "https://t.scdn.co/images/827d138e-b6f6-4467-9782-3550ee1f6bec.jpg"
            }]});
            for(let i = 0; i < 7; i++){
              let genre = {
                  'id': data.categories.items[i].id,
                  'name': data.categories.items[i].name,
                  'src': data.categories.items[i].icons[0].url
              };

              this.setState({genreList: [...this.state.genreList, genre]});
            }
            $("#modalWindow").modal();
          }, function(err) {
               console.error(err);
    });
  }

  handleImgClick = genre => {
    if (genre == "viral"){
        let playlistUri = viralPlaylist[this.state.country];
        let temp = playlistUri.split(":");
        let playlist = temp[temp.length-1];
        spotify.getPlaylistTracks(playlist, {fields : "total"})
          .then(data => {
            let trackPosition = Math.floor(Math.random() * data.total);
            spotify.play({
                device_id: deviceId,
                context_uri: playlistUri,
                offset : {
                    position: trackPosition
                },
                position_ms: 60000
            })
        }, function(err) {
            console.error(err);
        });
    }
    else {
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
