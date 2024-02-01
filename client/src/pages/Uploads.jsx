import React, { useState, useEffect, useRef } from 'react';
import { FiCreditCard, FiMail, FiUpload, FiYoutube, FiInstagram } from "react-icons/fi";
import { toast } from 'react-toastify';
import VideoInput from '../components/video/VideoInput';
import Checkbox from '@mui/material/Checkbox';
import { Check } from '@mui/icons-material';
import DCenter from '../animated-components/DCenter';

const Uploads = () => {
    const [video, setVideo] = useState(null)
    const [isInstaSelected, setIsInstaSelected] = useState(false)
    const [isYoutubeSelected, setIsYoutubeSelected] = useState(false)

    const toggleYt = () => {
        setIsYoutubeSelected(!isYoutubeSelected)
    }

    const toggleInsta = () => {
        setIsInstaSelected(!isInstaSelected)
    }

    return (
        <DCenter>
            <div className='w-full h-screen flex items-start justify-around'>
                <div className='w-1/2 flex flex-col items-center justify-center'>
                    <div className='mt-4 font-bold text-4xl'>
                        Start Uploading!
                    </div>
                    <div className='mt-4'>
                        <VideoInput width={600} height={600} setVid={setVideo} />
                    </div>
                    <Card
                        title="Upload"
                        subtitle="Manage profile"
                        href="#"
                        Icon={FiUpload}
                    />
                </div>
                <div className='w-1/2 flex flex-col gap-16 items-start h-full justify-start mt-12'>
                    <div className='w-full flex items-center justify-center'>
                        <Checkbox
                            checked={isYoutubeSelected}
                            // onChange={() => setIsYoutubeSelected(!isYoutubeSelected)}
                            // icon={<Check />}
                            // checkedIcon={<Check />}
                            sx={{
                                '& .MuiSvgIcon-root': { fontSize: 28 },
                            }}
                        />
                        <YtCard Icon={FiYoutube} toggleYt={toggleYt} isYoutubeSelected={isYoutubeSelected} />
                    </div>
                    <div className='w-full flex items-center justify-center'>
                        <Checkbox
                            checked={isInstaSelected}
                            // onChange={() => setIsYoutubeSelected(!isYoutubeSelected)}
                            // icon={<Check />}
                            // checkedIcon={<Check />}
                            sx={{
                                '& .MuiSvgIcon-root': { fontSize: 28 },
                            }}
                        />
                        {/* <YtCard Icon={FiYoutube} toggleYt={toggleYt} /> */}
                        <InstaCard Icon={FiInstagram} toggleInsta={toggleInsta} isInstaSelected={isInstaSelected} />
                    </div>
                </div>
            </div>
        </DCenter>
    );
};

const Card = ({ title, subtitle, Icon, href }) => {
    return (
        <a
            href={href}
            className="w-[250px] absolute bottom-12 p-4 self-center rounded-2xl border-[1px] border-slate overflow-hidden group bg-white"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cobalt to-d-blue translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

            <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-cobalt group-hover:rotate-12 transition-transform duration-300" />
            <Icon className="mb-2 text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
            <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
                {title}
            </h3>
            {/* <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
                {subtitle}
            </p> */}
        </a>
    );
};

const YtCard = ({ title, subtitle, Icon, href, toggleYt, isYoutubeSelected }) => {
    return (
        <a
            onClick={() => toggleYt()}
            href={href}
            className="w-[500px] h-[250px] cursor-pointer p-4 self-center rounded-2xl border-[1px] border-slate relative overflow-hidden group bg-white"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-yt-red to-red translate-y-[0%] transition-transform duration-300" />

            <Icon className={`absolute z-10 -top-12 -right-12 text-[14rem] text-slate-100 ${isYoutubeSelected ? "text-[#FD1D1D] rotate-12" : "group-hover:text-[#FD1D1D] group-hover:rotate-12"} transition-transform duration-300`} />
            <Icon className={`mb-2 text-[3rem] text-violet-600 ${isYoutubeSelected ? "text-white" : "group-hover:text-white"} transition-colors relative z-10 duration-300`} />
            <h3 className={`font-medium text-[2rem] text-slate-950 ${isYoutubeSelected ? "text-white" : "group-hover:text-white"} relative z-10 duration-300`}>
                Youtube
            </h3>
            {/* <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
                {subtitle}
            </p> */}
        </a>
    );
};

const InstaCard = ({ title, subtitle, Icon, href, toggleInsta, isInstaSelected }) => {
    return (
        <a
            onClick={() => toggleInsta()}
            href={href}
            className="w-[500px] h-[250px] cursor-pointer p-4 self-center rounded-2xl border-[1px] border-slate relative overflow-hidden group bg-white"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ee2a7b] to-[#6228d7] :translate-y-[0%] transition-transform duration-300" />

            <Icon className={`absolute z-10 -top-12 -right-12 text-[14rem] text-slate-100 ${isInstaSelected ? "text-indigo rotate-12" : "group-hover:text-indigo group-hover:rotate-12"} transition-transform duration-300`} />
            <Icon className={`mb-2 text-[3rem] text-violet-600 ${isInstaSelected ? "text-white" : "group-hover:text-white"} transition-colors relative z-10 duration-300`} />
            <h3 className={`font-medium text-[2rem] text-slate-950 ${isInstaSelected ? "text-white" : "group-hover:text-white"} relative z-10 duration-300`}>
                Instagram
            </h3>
            {/* <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
                {subtitle}
            </p> */}
        </a>
    );
};

export default Uploads;