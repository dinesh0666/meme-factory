import React from 'react';
import { Modal, ModalHeader, ModalBody, FormGroup, Label, NavbarBrand } from 'reactstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import UploadImage from './UploadImage';
import './App.css';
const initialState = {
  toptext: "",
  bottomtext: "",
  topY: "10%",
  topX: "50%",
  bottomX: "50%",
  bottomY: "90%",
  photos : []
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentImage: 0,
      modalIsOpen: false,
      ownImage:false,
      currentImagebase64: null,
      file:'',
      ...initialState
    };
  }

  componentDidMount(){ 
  //getting memes
  this.getMemes()
  }

  getMemes = () => {
    axios.get(`https://api.imgflip.com/get_memes`)
      .then(res => {
        if(res.status === 200){
          const photos = res.data.data.memes;
          this.setState({ photos });
        }
      })
  }

  openImage = (index) => {
    const image = this.state.photos[index];
    this.getBase64Image(image.url).then(base64=>{
      this.setState(prevState => ({
        currentImage: index,
        ownImage:false,
        modalIsOpen: !prevState.modalIsOpen,
        currentImagebase64: base64,
        ...initialState
      }));
    });
  }


  toggle = () => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen
    }),()=>{
      this.getMemes();
    });
  }


  changeText = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    });
  }
  /**Get the uploaded Image  
    * and append it in base 64 
    */
   handleImageChange=(e)=>{
    e.preventDefault();
        this.setState({
         file: e.target.files[0],
        });
  }
  //function to handle image cropper
  onSubmit = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = this.state.file;
  
    if (file.size > 2097152) {  
    return true;
    };
    reader.onloadend = () => {
    this.setState({
    file: file,
    currentImagebase64: reader.result,
    ownImage:false
    });
    }
        reader.readAsDataURL(file)
    }


  convertSvgToImage = () => {
    const svg = this.svgRef;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = function() {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  }

  getBase64Image(img) {
   return (async function() {
      let blob = await fetch(img).then(r => r.blob());
      let dataUrl = await new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      return dataUrl;
  })();
  }
/** when click Upload own image 
 * Pop-up modal would open
 */
  uploadOwnImage=()=>{
    this.setState({
      currentImagebase64: null,
      modalIsOpen:true,
      ownImage:true,
      toptext: "",
      bottomtext: ""      
    })
  }
  
  render() {
    var textStyle = {
      fontFamily: "Impact",
      fontSize: "50px",
      textTransform: "uppercase",
      fill: "#FFF",
      stroke: "#000",
      userSelect: "none"
    }
    return (
      <div>
        <div className="main-content">
          <div className="sidebar">
            <NavbarBrand href="/"><h1>Meme Factory</h1></NavbarBrand>
            <h3>
              This is a fun project for creating memes. Built with React.
            </h3>
            <h3>
              Here is the List of Meme`s Avaliable to Edit
            </h3>
            <button className="ownUploadButton" onClick={()=>this.uploadOwnImage()}>Create Your Own</button>
          </div>
          <div className="content">
            {this.state.photos && this.state.photos.map((image, index) => (
              <div className="image-holder" key={index}>
                <span className="meme-top-caption">Top text</span>
                <img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    height: "100%"
                  }}
                  alt={index}
                  src={image.url}
                  onClick={() => this.openImage(index)}
                />
              <span className="meme-bottom-caption">Bottom text</span>
              </div>
            ))}
          </div>
        </div>
        <Modal className="meme-gen-modal" isOpen={this.state.modalIsOpen}>
          <ModalHeader toggle={this.toggle}>Create a Meme</ModalHeader>
          <ModalBody>
         { this.state.ownImage &&
          <UploadImage onSubmit={(e)=>this.onSubmit(e)} handleImageChange={(e)=>this.handleImageChange(e)}/> } 
            <svg
              width={"600px"}
              id="svg_ref"
              height={"600px"}
              ref={el => { this.svgRef = el }}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink">
              <image
                ref={el => { this.imageRef = el }}
                xlinkHref={this.state.currentImagebase64}
                height={"600px"}
                width={"600px"}
              />
              <text
                style={{ ...textStyle, zIndex:4 }}
                x={this.state.topX}
                y={this.state.topY}
                dominantBaseline="middle"
                textAnchor="middle"
              >
                  {this.state.toptext}
              </text>
              <text
                style={textStyle}
                dominantBaseline="middle"
                textAnchor="middle"
                x={this.state.bottomX}
                y={this.state.bottomY}
              >
                  {this.state.bottomtext}
              </text>
            </svg>
            <div className="meme-form">
              <FormGroup>
                <Label for="toptext">Top Text</Label>
                <input className="form-control" type="text" name="toptext" id="toptext" placeholder="Add text to the top" onChange={this.changeText} />
              </FormGroup>
              <FormGroup>
                <Label for="bottomtext">Bottom Text</Label>
                <input className="form-control" type="text" name="bottomtext" id="bottomtext" placeholder="Add text to the bottom" onChange={this.changeText} />
              </FormGroup>
              <button onClick={() => this.convertSvgToImage()} className="btn btn-primary">Meme It!</button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}
export default App;