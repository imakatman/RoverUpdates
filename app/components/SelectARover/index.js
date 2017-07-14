/**
 *
 * RoverSimpleData
 *
 */

import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router';
import {Overlay} from '../Overlay';

const RoverColumn = styled.div`
    position: relative;
    background-size: cover;
    background-position: ${props => props.name === "Curiosity" ? "40%" : "50%"};
    height: 90vh;
`;

function SelectARover(props) {
    return (
        <RoverColumn name={props.name} style={{backgroundImage: "url(" + props.portrait + ")"}}>
            <h3>
                <Link to={"/r/" + props.name}>
                    {props.name}
                </Link>
            </h3>
            <p>{props.totalPhotos}</p>
            <Overlay/>
        </RoverColumn>
    );
}

SelectARover.propTypes = {};

export default SelectARover;
