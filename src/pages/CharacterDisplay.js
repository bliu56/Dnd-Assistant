import './CharacterDisplay.css';
import React, { useState } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, ToggleButtonGroup, DropdownButton, Tabs, Tab, ButtonToolbar } from 'react-bootstrap';


function CharacterDisplay(){
    return(
        // title of page
        <>
            {/* </>title of page */}
            <h2 className='characterDisplayTitle'>Character Display</h2>

            <Container fluid className='characterDisplayContainer'>
                    <Container className = 'GeneralCharacterInformation'>
                    <h5>Character Name</h5>
                        <div class="row">
                            <div class="col-sm">
                                <p><strong>Race and Class</strong></p>
                                <p><strong>Experience Points</strong></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                <p><strong>Background</strong></p>
                                <p><strong>Alignment</strong></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                <p><strong>Player Name</strong></p>
                                <p><strong>Adventuring Group</strong></p>
                            </div>
                        </div>     
                    </Container>
            </Container>
        </>
    );
}

export default CharacterDisplay;

// confirm page will be same as display page just with an addition save button
// display page on the top have a dropdown that will show all the characters