import React, { Component } from 'react';


class UploadImage extends Component{
    constructor(props){
        super(props);
        // this.state = {file:'',imagePreviewUrl:''}
    }

  




    render(){
        return <>        
         <form onSubmit={(e)=>this.props.onSubmit(e)}>
                <h1>File Upload</h1>
                <input type="file" name="myImage" onChange= {(e)=>this.props.handleImageChange(e)} />
                <button type="submit">Upload</button>
            </form>
        
        {/* <img src={this.state.imagePreviewUrl} ></img> */}
        </>

    }


}

export default UploadImage;