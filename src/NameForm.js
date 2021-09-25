import React from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
//import numberSubmitted from "./sketch.js"

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseNum: '1698',
      bgColor: 'black',
      glowRadius: '50',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMakeGIF = this.handleMakeGIF.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.numberSubmitted(this.state);
  }

  handleMakeGIF(event) {
    event.preventDefault();

    this.props.generateGIF(this.state);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup className="mb-3">
          <Label>Mouse ID #</Label>
          <Input name="mouseNum" type="text" placeholder="7767" value={this.state.value} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup className="mb-3">
          <Label>Background Color</Label>
          <Input name="bgColor" type="text" placeholder="#000000" value={this.state.value} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup className="mb-3">
          <Label>Irradiated Glow Radius</Label>
          <Input name="glowRadius" type="text" placeholder="50" value={this.state.value} onChange={this.handleChange} />
        </FormGroup>
        <Button name="refresh" variant="primary" color="primary" type="submit">
          Refresh
        </Button>&nbsp;&nbsp;
        <Button name="makegif" variant="primary" color="success" onClick={this.handleMakeGIF}>
          {this.props.isMakingGIF ? 'Making...' : 'Make GIF'}
        </Button>

      </Form>
    );
  }
}

export default NameForm;