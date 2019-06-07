import React, { Component } from "react";

class UploadImage extends Component {
  render() {
    return (
      <>
        <form onSubmit={e => this.props.onSubmit(e)}>
          <p>Choose and Upload your own Image</p>
          <input
            type="file"
            name="myImage"
            onChange={e => this.props.handleImageChange(e)}
          />
          {this.props.file ? (
            <button type="submit" className="uploadImage">
              Upload
            </button>
          ) : (
            ""
          )}
        </form>
      </>
    );
  }
}

export default UploadImage;
