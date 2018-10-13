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
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from './Modal';
import './App.css';

let url = new URL(window.location.href)
let token = url.searchParams.get("access_token")
let spotify = new Spotify();

spotify.setAccessToken(token);

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
            genreList: [],
            geography: ''
          };
  }
  componentDidMount() {
    console.log(token)
  }

  handleClick = (geography, evt) => {
    console.log(geography.properties.ISO_A2);
    this.setState({
       geography: geography.properties.ISO_A2
   });

    spotify.getCategoryPlaylists('rock', {limit : 5, country: geography.properties.ISO_A2})
      .then(data => {
        console.log(data);
        spotify.play({
          context_uri: data.playlists.items[0].uri,
          offset: {
            position: 6
          },
          position_ms: 0
        });
        spotify.getCategories({limit : 8, country: geography.properties.ISO_A2})
          .then(data => {
            console.log(this.state);
            for(let i = 0; i < 8; i++){
              let genre = {
                  'id': data.categories.items[i].id,
                  'src': data.categories.items[i].icons[0].url
              };
              this.setState({genreList: [...this.state.genreList, genre]});
              console.log(data.categories.items[i])
            }
            $("#modalWindow").modal();
          }, function(err) {
               console.error(err);
          });
      }, function(err) {
           console.error(err);
      });
  }

  handleImgClick = genre => {
    spotify.getCategoryPlaylists(genre, {limit : 5, country: this.state.geography})
      .then(function(data) {
        console.log(data);
        spotify.play({
          context_uri: data.playlists.items[0].uri,
          offset: {
            position: 6
          },
          position_ms: 0
        });
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
        <Modal data = {this.state} handleClick = {this.handleImgClick}/>
      </div>
    );
  }
}

export default App;
