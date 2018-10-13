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
import { Motion, spring } from "react-motion"

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
      country: null,
    }
    this.projection = this.projection.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.updateCenter = this.updateCenter.bind(this)
  }

  componentDidMount() {
    console.log(token)
  }

  projection() {
    return geoTimes()
      .translate([this.props.width/2, this.props.height/2])
      .scale(205)
  }

  updateCenter(evt) {
    this.setState({
      center: [evt.clientX, evt.clientY]
    })
  }

  handleClick(geography, evt) {
    // zooming
    const path = geoPath().projection(this.projection())
    const centroid = this.projection().invert(path.centroid(geography))
    this.setState({
      center: centroid,
      zoom: 3,
      country: geography.properties.iso_a2,
    })

    // Play music
    console.log(geography.properties.ISO_A2);
    spotify.getCategoryPlaylists('pop', {limit : 5, country: this.state.country})
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
          width: "90%",
            height: "auto",
        }}
        >
        <ZoomableGroup
        center={[x,y]}
        zoom={zoom}
        disablePanning={true} >
        <Geographies geography="world.json" disableOptimization>
        {(geographies, projection) => geographies.map((geography, i) =>
          geography.id !== "010" && (
            <Geography
            key={i}
            geography={geography}
            projection={projection}
            cacheId={`path-${i}`}
            onClick={this.handleClick}
            onMouseUp={this.updateCenter}
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
      )}
      </Motion>
      </div>
    );
  }
}

export default App;
