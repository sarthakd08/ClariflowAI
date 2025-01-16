
import Link from 'next/link'
import React from 'react'

function Hero({userInfo}: {userInfo: any}) {
  return (
  <div className="relative" id="home">
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
        </div>
        <div>
            <div className="relative mt-12 md:mt36 ml-auto p-6">
                <div className="lg:w-2/3 text-center mx-auto">
                    <h1 className="text-gray-900 dark:text-white font-bold text-3xl md:text-6xl xl:text-7xl">This is where <span className="text-primary dark:text-white">work happens, in sync.</span></h1>
                    <p className="mt-8 text-gray-700 dark:text-gray-300">Clariflow AI is a collaborative workspace that lets teams create, share, and work together on projects seamlessly.</p>
                    <p className="mt-8 text-gray-700 dark:text-gray-300">Create flexible docs, making it easy to stay organized and up-to-date, with yourself and with your team.</p>
                    <p className="mt-8 text-gray-700 dark:text-gray-300">With the power of AI ⚡</p>
                    <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                        <Link
                          href="/dashboard"
                          className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                        >
                          <span className="relative text-base font-semibold text-white"
                            >{userInfo?.id ? 'Go To Dashboard': 'Get started'}</span
                          >
                        </Link>
                        <Link
                          href="#"
                          className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                        >
                          <span
                            className="relative text-base font-semibold text-primary dark:text-white"
                            >Learn more</span>
                        </Link>
                    </div>
                    <div className="hidden py-8 mt-16 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between">
                        <div className="text-left">
                            <h6 className="text-lg font-semibold text-gray-700 dark:text-white">Dynamic Workspaces</h6>
                            <p className="mt-2 text-gray-500">Real time Collaborations and sync</p>
                        </div>
                        <div className="text-left">
                            <h6 className="text-lg font-semibold text-gray-700 dark:text-white">Smarter Collaborations</h6>
                            <p className="mt-2 text-gray-500">Flexible, seamless docs.</p>
                        </div>
                        <div className="text-left">
                            <h6 className="text-lg font-semibold text-gray-700 dark:text-white">Organized & Ahead</h6>
                            <p className="mt-2 text-gray-500"> Streamlined AI assistance.</p>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    </div>
  )
}

export default Hero
