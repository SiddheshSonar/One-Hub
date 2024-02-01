import React, { useEffect,useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material';

function AI() {
  const [image, updateImage]= useState()
  const [loading, setLoading] = useState(false)
  const [prompt, updatePrompt]= useState()

  const generate = async () =>{
    if (!prompt) {
      toast.error('Prompt cannot be empty')
      return
    }
    setLoading(true)
    const result = await axios.get(`http://127.0.0.1:8000/?prompt==${prompt}`)
    updateImage(result.data)
    setLoading(false)
  }
  return (
    <div className='relative w-full h-screen flex flex-col items-center justify-start gap-4 mt-4'>
      <div>
        <h1 className='text-3xl font-bold'>Generate Thumbnails/Images with just a single Prompt!</h1>
      </div>
      <input className='border rounded-md p-2 w-1/2' placeholder='Enter a Prompt (Eg: Create a picture of a kid laughing)' value={prompt} onChange={e =>updatePrompt(e.target.value)}></input>
      <button disabled={loading} className={`border p-2 rounded-md font-bold tracking-wide text-lg bg-l-blue text-white ${loading ? "!bg-d-blue" : "hover:bg-d-blue"} active:bg-l-blue`} onClick = {e =>generate()}>{loading ? "Generating...." : "GENERATE"}</button>
      {image ? (<img className='max-w-[500px] w-auto' src={`data:image/png;base64,${image}`} />) : null}
      {loading && <CircularProgress sx={{
        marginTop: "50px"
      }} />}
    </div>
  )
}

export default AI