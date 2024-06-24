'use client';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';

// Dynamically import PhaserGame without SSR
const PhaserGame = dynamic(() => import('../phaser/PhaserGame'), { ssr: false });

const HomeView = () => {
    const [isDebug, setDebug] = useState(true)
    return (
        <>
            <Head>
                <title>My Phaser Game</title>
                <meta name="description" content="A game built with Phaser and Next.js" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
            <h1 style={{ textAlign: 'center' }}>
                Maze Runner
                <button
                    onClick={() => setDebug(p => !p)}
                    style={{ marginLeft: '20px' }}
                >
                    Turn debug {isDebug ? 'off' : 'on'}
                </button>
            </h1>
                <div style={{
                    display:'flex', 
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <PhaserGame key={isDebug} debug = {isDebug}/>

                </div>

            </main>
        </>
    );
};

export default HomeView;

