import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';

import { Overlay, Global, Header, CloseBtn, SlickWrapper, ImageWrapper, Indicator } from './styles';
import { backUrl } from '../../config/config';

// ImagesZoom 폴더 내부에 index.js로 파일을 생성했음
// => 곁다리 코드들을 다른 js파일로 만들어서 import 해오는 형식으로 사용!
//    (styled-components와 같은)
//  - 따로 파일만들어서 export하면 다른 컴포넌트에서 재사용이 가능해짐!
const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            // beforeChange={(slide, newSlide) => setCurrentSlide(newSlide)}  // 공지사항 참조
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImageWrapper key={v.src}>
                <img 
                  src={`${backUrl}/${v.src}`} 
                  alt={v.src} 
                />
              </ImageWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1}
              {' '}
              /
              {' '}
              {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};
ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ImagesZoom;