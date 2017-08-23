/**
 *
 * Gallery
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import { Button } from 'components/StyledComponents/Button';
import Masonry from 'react-masonry-component';
import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleDoubleRight from 'react-icons/lib/fa/angle-double-right';

const GalleryContainer = styled.div`
    position:relative;
    z-index: 3;
    height: 100%;
    background: #000;
`;

const Navigation = styled.div`
    flex: 1;
    text-align: right;   
`;

const GalleryBtn = styled(Button)`    
    font-size: 2rem;
    margin: 0 0.5em;
    span{
      font-size: 1.3rem;
    } 
`;

const LoadMore = styled(GalleryBtn)`
  text-align:right;
  display:block;
  margin: 2rem 1.5rem 1rem;
  font-size: 1.3rem;
`;

const Img = styled.img`
    width: 100%;
    max-width: 100%;
    height: auto;
    display:block;
`;

class Gallery extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GalleryContainer>
        <h1>
          {this.props.cameraFullName}
        </h1>
        {this.props.fetchingImagesState ? (
            <p>Loading... looking for the latest sol in which this camera took photos</p>
          ) : (
            <div>
              <Flex>
                <Box flex='1'>
                  <h3>
                    Sol: {this.props.sol} || {this.props.earthDate}
                  </h3>
                </Box>
                <Box flex='1'>
                  <Navigation>
                    <GalleryBtn title="Previous Date" onClick={() => this.props.returnToPreviousDate()}>
                      <FaAngleLeft/><span>Prev</span>
                    </GalleryBtn>
                    <GalleryBtn title="Next Available Date with Photos" onClick={(i) => this.props.fetchNextAvailablePhotos(i)}>
                      <span>Next</span><FaAngleDoubleRight/>
                    </GalleryBtn>
                  </Navigation>
                </Box>
              </Flex>
              <Flex wrap={true}>
                <Masonry style={{ width: '100%' }}>
                  {this.props.photos ? (
                      this.props.photos.map(photo =>
                        <Box
                          w={1 / 4}
                          m='10px 0'
                          p='0 15px'
                          key={photo.id}>
                          <Img
                            src={photo.img_src}
                            alt={photo.roverName + ':' + photo.camera + '-' + photo.id} />
                        </Box>)
                    ) : (
                      <p style={{ color: '#fff' }}>
                        No Photos Available
                      </p>
                    )
                  }
                </Masonry>
              </Flex>
              <LoadMore onClick={(i) => this.props.fetchNextSet(i)}>
                Load more photos
              </LoadMore>
            </div>
          )}
      </GalleryContainer>
    );
  }
}

Gallery.propTypes = {
  cameraFullName: PropTypes.string.isRequired,
  fetchingImagesState: PropTypes.bool.isRequired,
  sol: PropTypes.number.isRequired,
  earthDate: PropTypes.string,
  photos: PropTypes.arrayOf(PropTypes.shape({
    camera: PropTypes.object,
    earth_date: PropTypes.string,
    id: PropTypes.number,
    img_src: PropTypes.string,
    rover: PropTypes.object,
  })).isRequired,
  fetchNextSet: PropTypes.func.isRequired,
};

export default Gallery;
