import { useState, Component } from "react";
import Mouse from "./Mouse.js";
import logo from './logo.svg';
import NameForm from './NameForm.js'
import { Container, Row, Col, Navbar, NavbarBrand, NavbarText } from 'reactstrap';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseNum: "1698",
      bgColor: "#000000",
      glowRadius: "50",
      makeGIF: false,
    };

    this.numberUpdated = this.numberUpdated.bind(this)
    this.generateGIF = this.generateGIF.bind(this)
    this.gifGenerated = this.gifGenerated.bind(this)
  }

  numberUpdated(state) {
    this.setState(state);
  }

  generateGIF(state) {
    this.setState({makeGIF: true});
  }

  gifGenerated() {
    console.log('Done!');
    this.setState({makeGIF: false});
  }

  render() {
    return (
      <div className="App">
        <Navbar className="Test" color="faded" light>
          <NavbarBrand href="/">Anonymouse GIF Animator</NavbarBrand>
          <NavbarText className="Description">Always free. Currently supports Irradiated, gl1tch3d, and Crazy Eyes. More to come. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Discord: ab#7777 <a href="https://twitter.com/abwagmi">Twitter</a></NavbarText>
        </Navbar>
      <Container>
        <Row>
          <Col/>
          <Col>
            <Mouse mouseNum={this.state.mouseNum} bgColor={this.state.bgColor} glowRadius={this.state.glowRadius} makeGIF={this.state.makeGIF} gifGenerated={this.gifGenerated} />
          </Col>
          <Col />
        </Row>
        <Row>
          <Col xs={0} />
          <Col xs="auto">
            <NameForm numberSubmitted={this.numberUpdated} generateGIF={this.generateGIF} isMakingGIF={this.state.makeGIF} />
          </Col>
          <Col xs={0} />
        </Row>
      </Container>
      <div className="fixed-bottom">  
          <Navbar color="faded" light>
              <Container>
                  <NavbarText></NavbarText>
              </Container>
          </Navbar>
      </div>
        
      </div>
    );
  }
}

export default App;
