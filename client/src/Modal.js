import React, { Component } from 'react';

class Modal extends Component {
  constructor(props){
    super(props);
  }

  handleClick = e => {
    this.props.handleClick(e.target.id);
  }

  sentenceCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }

  render(){
    return(
      <div className={`modal fade`} id="modalWindow" tabIndex="1" role="dialog" aria-hidden="true">
        <div className={`modal-dialog modal-dialog-centered modal-lg`} role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="album" id="genres">
                <div className="container">
                  <div className="row">
                    {this.props.data.genreList.map((genre, index) => {
                      return(
                        <div className="col-md-3" key={index}>
                          <div className={`card mb-3 shadow-sm`}>
                            <img id={genre.id} src={genre.src} className="card-img-top" alt="Card image cap" onClick={this.handleClick}/>
                            <p class="card-img-txt">{genre.name}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
