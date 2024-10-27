

import { TopSection } from './TopSection';
import ImageCrop from './ImageCrop';
import { useState } from 'react';

function CropImage() {
  const [url,setUrl]=useState('')
  
  return (
    <div className="App">
      <h2 className="title"> Crop Image</h2>
    
     {url && <ImageCrop url={url}/>}
    </div>
  );
}


export default CropImage;
