/*
 *
 * SelectedRoverPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {
    selectRover,
    fetchRoverDataIfNeeded,
    invalidateRover,
    fetchRoverImagesIfNeeded,
    fetchNextRoverImages,
    cameraSelected,
    cameraUnselected
} from '../../actions'
import {Flex, Box} from 'grid-styled';
import Gallery from 'components/Gallery';
import RoverDiagram from 'components/RoverDiagram';
import CameraNavigation from 'components/CameraNavigation';

const Loading = styled.div`
`;

const ActiveCameraLayer = styled(Flex)`
    background-color: #000;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;    
`;

const GalleryContain = styled(Box)`
    overflow-y: scroll;
`

const RoverName = styled.h1`
    color: #fff;
    position:absolute;
`;

class SelectedRoverPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);

        this.state = {
            selectedRover: this.props.routeParams.rover,
            page: 1,
        }

        this.mountGallery            = this.mountGallery.bind(this);
        this.unmountGallery          = this.unmountGallery.bind(this);
        this.grabNextAvailablePhotos = this.grabNextAvailablePhotos.bind(this);
    }

    componentWillMount() {
        const {dispatch, selectedRover, getDataByRover} = this.props;

        dispatch(selectRover(this.state.selectedRover));
        dispatch(fetchRoverDataIfNeeded(this.state.selectedRover));
    }

    componentDidMount() {
        const {selectCamera} = this.props;

        if (typeof selectCamera['selected'] === true || Object.keys(selectCamera).length !== 0) {
            this.mountGallery(selectCamera.rover, selectCamera.cameraIndex, selectCamera.camera, selectCamera.sol);
        }
    }

    mountGallery(rover, cameraIndex, selectedCamera, cameraFullName, currentSol) {
        const {dispatch, selectedRover, getDataByRover, isFetching} = this.props;

        if (!isFetching && typeof getDataByRover[selectedRover][selectedCamera] === 'undefined') {

            console.log("has not fetched images from this camera");

            const _rover          = rover || selectedRover,
                  _camera         = selectedCamera || getDataByRover[selectedRover].data.cameras[cameraIndex].name,
                  _cameraFullName = cameraFullName || getDataByRover[selectedRover].data.cameras[cameraIndex].full_name,
                  _sol            = currentSol || getDataByRover[selectedRover].data.max_sol,
                  _page           = this.state.page;

            dispatch(fetchRoverImagesIfNeeded(_rover, _sol, _page, _camera, _cameraFullName, cameraIndex));

        } else if (!isFetching && getDataByRover[selectedRover][selectedCamera]["hasFetchedImages"] === true) {

            console.log("has fetched images from this camera");

            const _rover          = rover || selectedRover,
                  _camera         = selectedCamera || getDataByRover[selectedRover].data.cameras[cameraIndex].name,
                  _cameraFullName = cameraFullName || getDataByRover[selectedRover].data.cameras[cameraIndex].full_name,
                  _sol            = currentSol || getDataByRover[selectedRover]["latestMeaningfulSol"],
                  _page           = this.state.page;

            console.log(_sol);

            dispatch(fetchRoverImagesIfNeeded(_rover, _sol, _page, _camera, _cameraFullName, cameraIndex));
        }

    }

    unmountGallery() {
        const {dispatch} = this.props;
        dispatch(cameraUnselected());
        this.setState({
            galleryMounted: false,
        })
    }

    grabNextAvailablePhotos(i) {
        const {dispatch, selectedRover, selectCamera} = this.props;

        dispatch(fetchNextRoverImages(selectedRover, selectCamera['sol'] - 1, 1, selectCamera['camera'], i));
    }

    render() {
        const {selectedRover, getDataByRover, isFetching, selectCamera} = this.props;

        return (
            <div>
                <Helmet
                    title="SelectedRoverPage"
                    meta={[
                        {name: 'description', content: 'Description of SelectedRoverPage'},
                    ]}
                />

                {selectedRover && <RoverName>{selectedRover}</RoverName>}

                { Object.keys(getDataByRover[selectedRover]['data']).length !== 0
                && getDataByRover[selectedRover]['isFetching'] === false
                || Object.keys(selectCamera).length === 0
                || typeof selectCamera['selected'] === false ? (
                        <RoverDiagram
                            cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                            mountGallery={(i) => this.mountGallery(...[, i, , ,])}
                        />) : (
                        <Loading>Loading...</Loading>
                    )
                }

                {selectCamera['selected'] === true
                && getDataByRover[selectedRover][selectCamera['camera']][selectCamera['sol']]['isFetching'] === false
                &&
                <ActiveCameraLayer>
                    <Flex direction="column" flex={1}>
                        <Box>
                            <CameraNavigation
                                rover={selectedRover}
                                cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                                mountGallery={(i) => this.mountGallery(...[, i, , ,])} />
                        </Box>
                        <Box>
                            <RoverDiagram
                                cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                                mountGallery={(i) => this.mountGallery(...[, i, , ,])} />
                        </Box>
                    </Flex>
                    <GalleryContain flex={2}>
                        <Gallery cameraAbbrev={selectCamera["camera"]}
                            cameraFullName={getDataByRover[selectedRover][selectCamera['camera']][selectCamera["sol"]]["cameraFullName"]}
                            sol={getDataByRover[selectedRover][selectCamera['camera']]["sol"]}
                            earthDay={getDataByRover[selectedRover][selectCamera['camera']]["earthDate"]}
                            photos={getDataByRover[selectedRover][selectCamera['camera']][selectCamera["sol"]]["photoData"]}
                            grabNextAvailablePhotos={(i) => this.grabNextAvailablePhotos(i)}
                            unmountGallery={() => this.unmountGallery()} />
                    </GalleryContain>
                </ActiveCameraLayer>
                }

            </div>
        );
    }
}

function mapStateToProps(state) {
    const {selectedRover, getDataByRover, selectCamera} = state;

    const {
              isFetching,
              lastUpdated,
              data: roverData
          } = getDataByRover[selectedRover] || {
        isFetching: true,
        data: []
    }

    const {
              rover,
              cameraIndex,
              camera,
              sol,
          } = selectCamera || {}

    return {
        selectedRover,
        roverData,
        getDataByRover,
        isFetching,
        lastUpdated,
        selectCamera
    };
}

SelectedRoverPage.propTypes = {
    routeParams: PropTypes.objectOf(PropTypes.string).isRequired,
    selectedRover: PropTypes.string.isRequired,
    getDataByRover: PropTypes.objectOf(PropTypes.shape({
            didInvalidate: PropTypes.bool,
            isFetching: PropTypes.bool,
            lastUpdated: PropTypes.number,
            name: PropTypes.string,
            data: PropTypes.shape({
                cameras: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
                id: PropTypes.number,
                landing_date: PropTypes.string,
                launch_date: PropTypes.string,
                max_date: PropTypes.string,
                max_sol: PropTypes.number,
                name: PropTypes.string,
                status: PropTypes.string,
                total_photos: PropTypes.number,
            })
        })
    ).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(SelectedRoverPage);
