import React, { useEffect, useState } from 'react';
import insights from '../data/dummyData.json';
import ytInsights from '../data/ytDummy.json';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DCenter from '../animated-components/DCenter';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export const ImpressionsChart = ({ data, formatDate }) => {
  return (
    <BarChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <XAxis label={{ value: '', angle: 360, position: 'insideBottom' }} dataKey="end_time" />
      <YAxis />
      <CartesianGrid stroke="#f5f5f5" />
      <Tooltip />
      <Legend />
      {/* <Line type="monotone" dataKey="value" stroke="#8884d8" /> */}
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
};

export const ReachChart = ({ data, formatDate }) => {
  return (
    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <XAxis dataKey="end_time" />
      <YAxis />
      <CartesianGrid stroke="#f5f5f5" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#82ca9d" />
    </LineChart>
  );
};

export const ProfileViewsChart = ({ data, formatDate }) => {
  return (
    <AreaChart width={600} height={300} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <XAxis dataKey="end_time" />
      <YAxis />
      <CartesianGrid strokeDasharray="5 5" />
      <Tooltip />
      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  );
};

const LikesAndDislikesChart = ({ data }) => {
  console.log(data)
  return (
    //  <BarChart width={800} height={400} data={data}>
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis dataKey="video_names" />
    //     <YAxis />
    //     <Tooltip />
    //     <Legend />
    //     <Bar dataKey="likes" fill="#8884d8" name="Likes" />
    //     <Bar dataKey="dislikes" fill="#82ca9d" name="Dislikes" />
    //  </BarChart>
<BarChart width={600} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="likes" fill="#8884d8" />
      <Bar dataKey="dislikes" fill="#82ca9d" />
    </BarChart>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(insights);
  const [app, setApp] = useState('Instagram');
  const token = localStorage.getItem('token');
  // const userInfo 


  const handleChange = (event) => {
    setApp(event.target.value);
  };

  useEffect(() => {
    console.log(ytInsights)
    if (app === 'Instagram') setData(insights);
    else if (app === 'Youtube') setData(ytInsights);
  }, [app]);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return dateObject.toLocaleString('en-US', options);
  };

  return (
    <div className='w-full h-full p-8 flex flex-col gap-8'>
      <DCenter>
        <div className='w-full flex items-center justify-between'>
          <div className='self-start w-1/2 flex flex-col items-start justify-start gap-8'>
            <h1 className='text-4xl font-bold text-char'>Dashboard</h1>
            <div className='w-full flex flex-col items-start gap-4'>
              <div className='w-1/2'>
                <FormControl variant="filled" fullWidth sx={{ m: 1 }}>
                  <InputLabel id="demo-simple-select-filled-label">PlatForm</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={app}
                    onChange={handleChange}
                  >
                    <MenuItem value={'Instagram'}>Instagram</MenuItem>
                    <MenuItem value={'Youtube'}>Youtube</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className='w-1/2 flex items-center justify-center'>
                {/* <Alert severity="info">
                  <AlertTitle>Valuable Insight</AlertTitle>
                  This is an info Alert with an informative title.
                </Alert> */}
                <button className='w-[300px] flex items-center justify-center gap-1 border p-2 rounded-full bg-char text-white hover:bg-gray active:bg-char'>
                  <span>Generate Valuable Insights</span><AutoFixHighIcon />
                </button>
              </div>
            </div>
          </div>
          <div className='relative w-[650px] rounded-xl shadow-lg shadow-p-blue pl-4 pt-2'
            style={{
              boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
            }}>
            {app === 'Instagram' ?
              (<ProfileViewsChart formatDate={formatDate} data={data.data[2].values} />)
              :
              (<LikesAndDislikesChart data={data.data[2].values} />)
            }
            <div className='absolute top-[-15px] left-[-75px] border p-2 rounded-full text-white bg-char'>
              {app === 'Instagram' ? "Profile Views" : "Likes & Dislikes"}
            </div>
          </div>
        </div>
      </DCenter>
      <DCenter>
        <div className='w-full flex items-center justify-between'>
          <div className='relative w-[650px] rounded-xl shadow-lg shadow-p-blue pl-4 pt-2'
            style={{
              boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
            }}>
            {app == 'Instagram' ? 
            (<ReachChart formatDate={formatDate} data={data.data[1].values} />)
          : 
          (<ProfileViewsChart formatDate={formatDate} data={data.data[1].values} />)}
            <div className='absolute top-[-15px] left-[-30px] border p-2 rounded-full text-white bg-char'>
              {app === 'Instagram' ?"Reach" : "Subscribers"}
            </div>
          </div>
          <div className='relative w-[650px] rounded-xl shadow-lg shadow-p-blue pl-4 pt-2'
            style={{
              boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
            }}>
            {app === 'Instagram' ? 
            (<ImpressionsChart formatDate={formatDate} data={data.data[0].values} />) 
          : 
          (<ReachChart data={data.data[0].values} />)}
            <div className={`absolute top-[-15px] ${app =='Instagram' ? "left-[-75px]" : "left-[-40px]"} border p-2 rounded-full text-white bg-char`}>
              {app === 'Instagram' ? "Impressions" : "Views"}
            </div>
          </div>
        </div>
      </DCenter>
    </div>
  );
};

export default Dashboard;