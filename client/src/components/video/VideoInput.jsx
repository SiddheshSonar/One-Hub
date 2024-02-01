import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton } from "@mui/material";

export default function VideoInput({ width, height }) {
    //   const { width, height } = props;
    const [video, setVideo] = useState(null);

    const inputRef = useRef();

    const [source, setSource] = useState();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file.size > 100000000) {
            toast.error('Video size should be less than 100MB')
            return
        }
        if (file.type !== 'video/mp4') {
            toast.error('Video should be in mp4 format')
            return
        }
        setVideo(file);
        console.log(file)
        const url = URL.createObjectURL(file);
        setSource(url);
    };

    const handleRemove = (event) => {
        setVideo(null);
        setSource(null);
    };

    const handleChoose = (event) => {
        inputRef.current.click();
    };

    return (
        <div className="VideoInput">
            <input
                ref={inputRef}
                className="VideoInput_input hidden"
                type="file"
                onChange={handleFileChange}
                accept=".mov,.mp4"
            />
            {/* {!source &&  */}
            <div className="w-full flex items-center justify-center mb-8">
                <button className="border p-2 rounded-full" onClick={handleChoose}>Choose Video</button>
            </div>
            {source && (
                <video
                    className="VideoInput_video"
                    width={width}
                    height={height}
                    controls
                    src={source}
                />
            )}
            <div className="VideoInput_footer w-full text-center mt-2 font-bold flex items-center justify-center">{video?.name || "Nothing selected"} {video && <IconButton onClick={handleRemove}><CancelIcon /></IconButton>}</div>
        </div>
    );
}
