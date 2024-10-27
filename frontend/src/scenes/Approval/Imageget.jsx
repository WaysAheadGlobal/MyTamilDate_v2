import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../api';


const ImageGallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/users/paymentstatuu`);
                setImages(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <h1>Image Gallery</h1>
            <div className="image-gallery">
                {images.map(media => {
                    const imageUrl = `${API_URL}/admin/users/image/${media.hash}.${media.extension}`;
                    return (
                        <img
                            key={media.id}
                            src={imageUrl}
                            alt={JSON.parse(media.meta).original.name}
                            className="gallery-image"
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ImageGallery;
