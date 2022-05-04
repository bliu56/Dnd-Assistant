import React from 'react';
import {Offcanvas, Button, ButtonGroup, Form } from 'react-bootstrap';
import {diceRoll} from '../diceRoll.js';

class DiceOffCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {dieSize:6, dieNumber:1 ,rollModifier:0, rollResult:0 };
        this.setDieSizeForm = this.setDieSizeForm.bind(this);
        this.setDieNumberForm = this.setDieNumberForm.bind(this);
        this.setRollModifierForm = this.setRollModifierForm.bind(this);

    }
    
    /* button/form handlers */
    setDieSize = n => () => this.setState({dieSize:n});
    setDieNumber = n => () => this.setState({dieNumber:n});
    decrDieSize = () => this.setState({dieSize:(this.state.dieSize - 1)});
    incrDieSize = () => this.setState({dieSize:(this.state.dieSize + 1)});
    decrDieNumber = () => this.setState({dieNumber:(this.state.dieNumber - 1)});
    incrDieNumber = () => this.setState({dieNumber:(this.state.dieNumber + 1)});
    decrRollModifier = () => this.setState({rollModifier:(this.state.rollModifier - 1)});
    incrRollModifier = () => this.setState({rollModifier:(this.state.rollModifier + 1)});
    setDieNumberForm(event){
        let prev = this.state.dieNumber;
        let n = Number(event.target.value);
        this.setState({dieNumber:n});
        if(isNaN(n) || event.target.value=="") {
            this.setState({dieNumber:prev});
        }
    }
    setDieSizeForm(event){
        let prev = this.state.dieSize;
        let n = Number(event.target.value);
        this.setState({dieSize:n});
        if(isNaN(n) || event.target.value=="") {
            this.setState({dieSize:prev});
        }
    }
    setRollModifierForm(event){
        let prev = this.state.rollModifier;
        let n = Number(event.target.value);
        this.setState({rollModifier:n});
        if(isNaN(n) || event.target.value=="") {
            this.setState({rollModifier:prev});
        }
    }
    rollDice = () => this.setState({rollResult:(diceRoll(this.state.dieNumber, this.state.dieSize, this.state.rollModifier))});

    render() {
        return(
            <Offcanvas.Body>
                <div>
                    <Button variant="dark" size="mb-2" onClick={this.rollDice}>Roll</Button>
                    <span>{this.state.dieNumber}d{this.state.dieSize}+({this.state.rollModifier}) : </span>
                    <span><strong>{this.state.rollResult}</strong></span>
                </div>
                <p></p>
                <div> {/* Number of di(c)e to roll */}
                    <div>Number of: <strong>{this.state.dieNumber}</strong></div>
                    <ButtonGroup className="me-2" size="sm">
                        <Button variant="outline-dark" onClick={this.decrDieNumber}>&lt;</Button>
                        <Button variant="outline-dark" onClick={this.incrDieNumber}>&gt;</Button>
                    </ButtonGroup>
                    <ButtonGroup className="me-2" size="sm">
                        <Button variant="outline-dark" onClick={this.setDieNumber(1)}>1</Button>
                        <Button variant="outline-dark" onClick={this.setDieNumber(2)}>2</Button>
                        <Button variant="outline-dark" onClick={this.setDieNumber(3)}>3</Button>
                    </ButtonGroup>
                    <ButtonGroup className="me-2" size="sm">
                        <Form>
                            <Form.Control size="sm" onChange={this.setDieNumberForm}></Form.Control>
                        </Form>
                    </ButtonGroup>
                </div>
                <p></p>
                <div> {/* Size of each die */}
                    <div>Die size: <strong>{this.state.dieSize}</strong></div>
                    <ButtonGroup className="me-2" size="sm">
                        <Button variant="outline-dark" onClick={this.decrDieSize}>&lt;</Button>
                        <Button variant="outline-dark" onClick={this.incrDieSize}>&gt;</Button>
                    </ButtonGroup>
                    <ButtonGroup className="me-2" size="sm">
                        <Button variant="outline-dark" onClick={this.setDieSize(  4)}>  4</Button>
                        <Button variant="outline-dark" onClick={this.setDieSize(  6)}>  6</Button>
                        <Button variant="outline-dark" onClick={this.setDieSize(  8)}>  8</Button>
                        <Button variant="outline-dark" onClick={this.setDieSize( 10)}> 10</Button>
                        <Button variant="outline-dark" onClick={this.setDieSize( 12)}> 12</Button>
                        <Button variant="outline-dark" onClick={this.setDieSize( 20)}> 20</Button>
                        <Button variant="outline-dark" onClick={this.setDieSize(100)}>100</Button>
                    </ButtonGroup>
                    <ButtonGroup className="me-2" size="sm">
                        <Form>
                            <Form.Control size="sm" onChange={this.setDieSizeForm}></Form.Control>
                        </Form>
                    </ButtonGroup>
                </div>
                <p></p>
                <div> {/* Roll Modifier */}
                    <div>Modifier: <strong>{this.state.rollModifier}</strong></div>
                    <ButtonGroup className="me-2" size="sm">
                        <Button variant="outline-dark" onClick={this.decrRollModifier}>&lt;</Button>
                        <Button variant="outline-dark" onClick={this.incrRollModifier}>&gt;</Button>
                    </ButtonGroup>
                    <ButtonGroup className="me-2" size="sm">
                        <Form>
                            <Form.Control size="sm" onChange={this.setRollModifierForm}></Form.Control>
                        </Form>
                    </ButtonGroup>
                </div>
            </Offcanvas.Body>
        );
    }
}
export default DiceOffCanvas;