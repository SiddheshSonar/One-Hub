import React, { useEffect,useState } from 'react'
import axios from "axios"

function AI() {
    const [image, updateImage]= useState()
  const [prompt, updatePrompt]= useState()

  const generate = async () =>{
    const result = await axios.get(`http://127.0.0.1:8000/?prompt==${prompt}`)
    updateImage(result.data)
  }
  return (
    <div className='relative w-full h-screen bg-zinc-800'>
      <input value={prompt} onChange={e =>updatePrompt(e.target.value)}></input>
      <button onClick = {e =>generate()}>GENERATE</button>
      {image ? (<img src={`data:image/png;base64,${image}`} />) : null}
    </div>
  )
}

export default AI