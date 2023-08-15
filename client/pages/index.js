'use client'

import Image from 'next/image'
import Particles from 'react-tsparticles'
import 'react-particles'
import particlesConfig from '@/components/config/particlesConfig'
import { loadFull } from 'tsparticles'

export default function Home() {
  const particlesInit = async (main) => {
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

  return (
    <>
      <Particles init={particlesInit} options={particlesConfig}></Particles>
      <div>
        <div className='flex flex-col justify-center items-center h-screen'>
          <h1 className='text-lighter font-links font-black text-7xl w-81'>The future is in YOUR hands.</h1>
          <h1 className='text-lighter font-links font-normal text-xl py-12'>Use powerful AI to help you make the best trading decisions</h1>
            <div className=''>
                <a href='/predict' className='text-lighter text-xl bg-main hover:bg-hoverMain font-links font-semibold mx-2 py-3 rounded-md px-5'>Make a prediction</a>
            </div>
        </div>
      </div>
    </>
  )
}
