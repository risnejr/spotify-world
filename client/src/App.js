import React, { Component } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";

import './App.css';

import Spotify from 'spotify-web-api-js';
import { geoPath } from "d3-geo"
import { geoTimes } from "d3-geo-projection"

let url = new URL(window.location.href)
let token = url.searchParams.get("access_token")
let spotify = new Spotify();

spotify.setAccessToken(token);

class App extends Component {
  static defaultProps = {
    width: 950,
    height: 600,
  }
  constructor() {
    super()
    this.state = {
      center: [0,1],
      zoom: 1,
      currentCountry: null,
    }
    this.projection = this.projection.bind(this)
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    console.log(token)
  }

  projection() {
    return geoTimes()
      .translate([this.props.width/2, this.props.height/2])
      .scale(205)
  }

  handleClick(geography, evt) {
    // zooming
    const path = geoPath().projection(this.projection())
    const centroid = this.projection().invert(path.centroid(geography))
    this.setState({
      center: centroid,
      zoom: 3,
      currentCountry: geography.properties.iso_a3,
    })
    // Play music
    console.log(geography.properties.ISO_A2);
    spotify.getCategoryPlaylists('pop', {limit : 5, country: geography.properties.ISO_A2})
      .then(function(data) {
        console.log(data)
        let playlist = data.playlists.items[0]
        let playlistUri = playlist.uri
        let trackPosition = Math.floor(Math.random() * playlist.tracks.total);
        spotify.play({
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
        projection={this.projection}
        width={this.props.width}
        height={this.props.height}
        style={{
          width: "90%",
            height: "auto",
        }}
        >
        <ZoomableGroup center={this.state.center} zoom={this.state.zoom}>
        <Geographies geography="world.json" disableOptimization>
        {(geographies, projection) => geographies.map((geography, i) =>
          geography.id !== "010" && (
            <Geography
            key={i}
            geography={geography}
            projection={projection}
            cacheId={`path-${i}`}
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
          ))
        }
        </Geographies>
        </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default App;
