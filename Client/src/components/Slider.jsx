import React from 'react'
import './slider.css'
function Slider() {
  return (
    <div className='top-0 z-50 fixed w-screen h-screen flex justify-center items-center'>
      <span class="z-20 loader"></span>
      <div className='bg-black w-screen h-screen opacity-40 absolute'></div>
    </div>
  )
}

export default Slider
