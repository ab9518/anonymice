import React from "react";
import Sketch from "react-p5";
import { mouseSetup, mouseDraw, numberSubmitted, makeGIF } from "./sketch.js"

//1698

class Mouse extends React.Component {

  p5 = () => {}

	constructor(props) {
    super(props);
    this.state = {
      mouseNum: "1698",
      bgColor: "#000000",
      glowRadius: "50",
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });
  }

	componentDidUpdate(prevProps) {
    if (!this.p5) {
      return;
    }
    if (this.props.makeGIF == true && prevProps.makeGIF == false) {
      makeGIF(this.p5, this.props.gifGenerated);
    }
	  if (prevProps.mouseNum !== this.props.mouseNum || prevProps.bgColor !== this.props.bgColor || prevProps.glowRadius !== this.props.glowRadius) {
      numberSubmitted(this.p5, this.canvasParentRef, this.props);
	  }
	}

	setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
    this.p5 = p5;
    this.canvasParentRef = canvasParentRef;
		mouseSetup(p5, canvasParentRef);
	}

	draw = (p5) => {
		mouseDraw(p5);
	}

	render() {
		return (
			<Sketch setup={this.setup} draw={this.draw} />
		)
	};
};

export default Mouse;