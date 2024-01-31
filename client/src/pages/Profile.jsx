import React, { useState, useEffect, useRef } from 'react';
// import { GoogleLogin } from 'react-google-oauth';
import { toast } from 'react-toastify';
import Api from '../api';
import Button from '@mui/material/Button';

const Profile = () => {
    const [userInfo, setUserInfo] = useState({});
    const [authorizationCode, setAuthorizationCode] = useState('');
    const [video, setVideo] = useState(null)
    // const signUpWithGoogle = async (res) => {
    //     await axios.get('http://localhost:5000/api/google/auth')
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))
    // }; 

    const sendTokenToBackend = async (data) => {
        await Api.sendTokentoBackend({ email: 'siddheshsonar3000@gmail.com', token: data, social: 'Youtube' })
            .then((res) => {
                console.log(res.data)
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


    const handleFileChange = (e) => {
        const vid = e.target.files[0]
        if (vid.size > 100000000) {
            toast.error('Video size should be less than 100MB')
            return
        }
        if (vid.type !== 'video/mp4') {
            toast.error('Video should be in mp4 format')
            return
        }
        setVideo(vid)
    }

    useEffect(() => {
        console.log(video)
    }, [video])

    const fileInputRef = useRef(null)

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const uploadVideo = async () => {
        const formData = new FormData()
        formData.append('video', video)
        formData.append('title', 'Dummy Video')
        formData.append('description', 'Test Description')
        formData.append('privacy', 'public')
        formData.append('category', '22')
        formData.append('tags', 'test, video')
        formData.append('email', 'sonarsiddhesh105@gmail.com')
        await Api.uploadYoutube(formData)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <div className='w-full h-full'>
            Profile Page
            <button onClick={redirectToGoogleOAuth} className='flex items-center gap-2 p-2 shadow-sm rounded-xl bg-pink hover:bg-smt active:bg-pink'>
                <span className='text-white font-semibold text-lg tracking-wide'>Connect Youtube</span>
                <img
                    src="https://cdn-icons-png.flaticon.com/256/1384/1384060.png"
                    alt="yt"
                    width={30}
                />
            </button>
            <input
                type="file"
                accept=".mp4"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <button variant="contained" className=' bg-pink' onClick={handleUploadClick}>
                Upload Video
            </button>
            <button variant="contained" className='bg-pink' onClick={uploadVideo}>
                Upload
            </button>
        </div>
    );
};

export default Profile;