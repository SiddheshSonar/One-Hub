import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import VideoInput from '../components/video/VideoInput';

const Uploads = () => {
    const [video, setVideo] = useState(null)

    return (
        <div className='w-full h-screen flex flex-col items-center '>
            <div className='mt-4 font-bold text-4xl'>
                Start Uploading!
            </div>
            <div className='mt-8'>
                <VideoInput width={600} height={600} />
            </div>
        </div>
    );
};

export default Uploads;