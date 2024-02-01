import React, { useState, useEffect, useRef } from 'react';
import { FiCreditCard, FiMail, FiUpload, FiYoutube, FiInstagram } from "react-icons/fi";
import { toast } from 'react-toastify';
import VideoInput from '../components/video/VideoInput';
import Checkbox from '@mui/material/Checkbox';
import { Check } from '@mui/icons-material';
import DCenter from '../animated-components/DCenter';
import Backdrop from '@mui/material/Backdrop';
import Api from '../api';

const Uploads = () => {
    const [video, setVideo] = useState(null)
    const [isInstaSelected, setIsInstaSelected] = useState(false)
    const [isYoutubeSelected, setIsYoutubeSelected] = useState(false)
    const user = JSON.parse(localStorage.getItem('user'))
    const [isConnected, setIsConnected] = useState(JSON.parse(localStorage.getItem('user')).is_connected)

    const toggleYt = () => {
        setIsYoutubeSelected(!isYoutubeSelected)
    }

    const toggleInsta = () => {
        setIsInstaSelected(!isInstaSelected)
    }

    const sendTokenToBackend = async (data) => {
        await Api.sendTokentoBackend({ email: user.email, token: data, social: 'Youtube' })
            .then((res) => {
                console.log(res.data)
                const userObj = {
                    ...user,
                    is_connected: true
                }
                localStorage.setItem('user', JSON.stringify(userObj))
                setIsConnected(true)
                toast.success('Google Account Authorized Successfully!')
            })
            .catch(err => {
                console.log(err)
            })
    }

    const redirectToGoogleOAuth = () => {
        const scopes = [
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.channel-memberships.creator',
            // 'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtubepartner',
            'https://www.googleapis.com/auth/youtubepartner-channel-audit',
        ];
        const client_id = '964165625281-7e00821c9k6n2oj25fk1c75347rr8g35.apps.googleusercontent.com';
        const redirect_uri = 'http://localhost:5173/profile';
        const scope = scopes.join(' ');
        const oauth_url = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&access_type=offline`;

        // Redirect the user to the Google OAuth URL
        window.location.href = oauth_url;
    };

    const getTokenWithAuthorizationCode = (code) => {
        console.log('getting token with code:', code)
        const client_id = '964165625281-7e00821c9k6n2oj25fk1c75347rr8g35.apps.googleusercontent.com';
        const client_secret = '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';
        const redirect_uri = 'http://localhost:5173/profile';
        const grant_type = 'authorization_code';

        // Use Fetch API to make the POST request
        fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `code=${code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&grant_type=${grant_type}`,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Token response:', data);
                sendTokenToBackend(data)

                // Extract the refresh token from the response
                const refreshToken = data.refresh_token;
                console.log('Refresh Token:', refreshToken);

                // Handle the token response as needed
            })
            .catch(error => {
                console.error('Error fetching token:', error);
            });
    };

    useEffect(() => {
        // Check if the URL contains the authorization code after redirection
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        console.log(code)

        if (code) {
            setAuthorizationCode(code);
            getTokenWithAuthorizationCode(code);
            // remove the code from the URL
            window.history.replaceState({}, '', '/profile');
        }
    }, []);

    const uploadVideo = async () => {
        const formData = new FormData()
        formData.append('video', video)
        formData.append('title', 'Test Video')
        formData.append('description', 'Test Description')
        formData.append('privacy', 'public')
        formData.append('email', user.email)
        await Api.uploadYoutube(formData)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <DCenter>
            <div className='w-full h-screen flex items-start justify-around'>
                {!isConnected && (<>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000
                    }}
                    className='flex flex-col items-center justify-center gap-4' 
                    >
                        <div className='font-semibold  text-white text-xl'>
                            Please connect your Google Account to continue
                        </div>
                        <button onClick={redirectToGoogleOAuth}
                            className='flex items-center gap-2 p-2 shadow-sm rounded-xl bg-pink hover:bg-smt active:bg-pink'>
                            <img
                                // src="https://cdn-icons-png.flaticon.com/256/1384/1384060.png"
                                src='https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png'
                                alt="yt"
                                width={30}
                            />
                            <span className='text-white font-semibold text-lg tracking-wide'>Connect Google</span>
                        </button>
                    </div>
                    <Backdrop open={!isConnected} sx={{ color: '#fff', zIndex: 999 }} />
                </>)}
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