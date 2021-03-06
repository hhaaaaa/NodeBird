import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import ImagesZoom from './ImagesZoom';
import { backUrl } from '../config/config';

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);
  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        {/* role="presentation": 클릭할 순 있지만, 굳이 클릭하지 않아도 된다고 스크린 리더가 인식함 */}
        <img 
          role="presentation" 
          src={`${backUrl}/${images[0].src}`} 
          alt={images[0].src} 
          onClick={onZoom} 
        />  
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  if (images.length === 2) {
    return (
      <>
        <img 
          role="presentation" 
          style={{ display: 'inline-block', width: '50%' }} 
          src={`${backUrl}/${images[0].src}`} 
          alt={images[0].src} 
          onClick={onZoom} 
        />  
        <img role="presentation" 
          style={{ display: 'inline-block', width: '50%' }} 
          src={`${backUrl}/${images[1].src}`} 
          alt={images[1].src} 
          onClick={onZoom} 
        />  
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <>
      <img 
        role="presentation" 
        style={{ display: 'inline-block', width: '50%' }} 
        src={`${backUrl}/${images[0].src}`} 
        alt={images[0].src} 
        onClick={onZoom} 
      />  
      <div
        role="presentation"
        style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
        onClick={onZoom}
      >
        <PlusOutlined />
        <br />
        {images.length - 1}개의 사진 더 보기
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};
PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};
export default PostImages;