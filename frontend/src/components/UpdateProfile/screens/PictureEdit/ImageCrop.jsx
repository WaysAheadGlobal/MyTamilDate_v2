import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCrop = forwardRef(({ url, onCropComplete,handleCropSave }, ref) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({ unit: 'px', width: 100, height: 100, x: 20, y: 20 });
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [completedCrop, setCompletedCrop] = useState({ unit: 'px', width: 100, height: 100, x: 0, y: 0 });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [showCrop, setShowCrop] = useState(true);
  const imageUrl = url;

  useEffect(() => {
    // Reset state when a new image URL is provided
    setCrop({ unit: 'px', width: 100, height: 100, x: (width - 100) / 2, y: (height - 100) / 2 });
    setHeight('');
    setWidth('');
    setCompletedCrop({ unit: 'px', width: 100, height: 100, x: 0, y: 0 });
    setCroppedImageUrl(null);
    setShowCrop(true);
  }, [url]);

  const onImageLoad = (e) => {
    const imgHeight = e?.currentTarget?.height;
    const imgWidth = e?.currentTarget?.width;
    setHeight(imgHeight);
    setWidth(imgWidth);
    const initialCrop = {
      unit: 'px',
      width: 100,
      height: 100,
      x: (imgWidth - 100) / 2,
      y: (imgHeight - 100) / 2
    };
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        1 // Setting the image quality to 1 (maximum quality)
      );
    });
  };
  
  
  const handleSubmit = async () => {
    if (imgRef.current) {
      const cropArea = completedCrop || crop;
      const croppedUrl = await getCroppedImg(imgRef.current, cropArea);
      setCroppedImageUrl(croppedUrl);
      console.log(croppedUrl)
      onCropComplete(croppedUrl);
      setShowCrop(false);
      console.log("handlesubmit", croppedUrl);
      handleCropSave(croppedUrl);
    }
  };

  // Expose the handleSubmit function to the parent component
  useImperativeHandle(ref, () => ({
    handleSubmit
  }));

  return (
    <div className="outerDiv">
      <>
     
        <ReactCrop
          src={imageUrl}
          crop={crop}
          onChange={(_, percentCrop) => {
            setCrop(percentCrop);
          }}
          onComplete={(e) => {
            if (e?.height === 0 || e?.width === 0) {
              setCompletedCrop({
                x: 0,
                y: 0,
                height: height,
                width: width,
                unit: 'px'
              });
            } else {
              setCompletedCrop(e);
            }
          }}
          style={{
            maxHeight: '300px',
            marginTop : "50px"
          }}
          restrictPosition={true}
        >
          <img
            ref={imgRef}
            crossorigin='anonymous'
            alt='Error'
            src={imageUrl}
            style={{ maxHeight: '250px', maxWidth: '100%', objectFit: 'cover' }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
        {/* <div className="controlsIcon" style={{
          marginTop : "30px"
        }}>
          <button onClick={handleSubmit}>Upload</button>
        </div>
        <div>
          <img src={croppedImageUrl} alt="" />
        </div> */}
      </>
    </div>
  );
});

export default ImageCrop;
