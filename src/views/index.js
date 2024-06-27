'use client';
import { VW, VH } from '@/phaser/PhaserGame';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState, useEffect } from 'react';

// Dynamically import PhaserGame without SSR
import './index.css'
const PhaserGame = dynamic(() => import('../phaser/PhaserGame'), { ssr: false });

let _globalDebug = true; // initial value of globalDebug

const debugListeners = [];

export const globalDebug = new Proxy({}, {
    get(target, prop) {
        return _globalDebug;
    },
    set(target, prop, value) {
        _globalDebug = value;
        debugListeners.forEach(listener => listener(value));
        return true;
    }
});

const controlsListeners = [];

let _controls = 'Mouse+Keyboard'; // initial value of controls

export const controls = new Proxy({}, {
    get(target, prop) {
        return _controls;
    },
    set(target, prop, value) {
        if (['Mouse+Keyboard', 'Keyboard', 'Mobile'].includes(value)) {
            _controls = value;
            controlsListeners.forEach(listener => listener(value));
            return true;
        }
        return false;
    }
});


export function onGlobalDebugChange(callback) {
    debugListeners.push(callback);
}

const HomeView = () => {
    const [isDebug, setDebug] = useState(true)
    const [isBlurred, setIsBlurred] = useState(false);
    const [currentControl, setCurrentControl] = useState('Mouse+Keyboard');


    useEffect(() => {
        const handleGlobalDebugChange = () => setDebug(globalDebug);

        window.addEventListener('globalDebugChange', handleGlobalDebugChange);

        return () => {
            window.removeEventListener('globalDebugChange', handleGlobalDebugChange);
        };
    }, []);

    useEffect(() => {
        const handleGlobalDebugChange = (newValue) => setDebug(newValue);

        onGlobalDebugChange(handleGlobalDebugChange);

        return () => {
            // Here, we'd ideally remove the specific callback, 
            // but since we're using an array, we won't handle this part.
        };
    }, []);

    const toggleDebug = () => {
        globalDebug.value = !globalDebug.value;
    };
    
    const cycleControls = () => {
        const controlOptions = ['Mouse+Keyboard', 'Keyboard', 'Mobile'];
        const currentIndex = controlOptions.indexOf(currentControl);
        const newIndex = (currentIndex + 1) % controlOptions.length;
        controls.value = controlOptions[newIndex];
        setCurrentControl(controls.value); // update the state with the new control value
    };

    return (
        <>
            <Head>
                <title>My Phaser Game</title>
                <meta name="description" content="A game built with Phaser and Next.js" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
            <h1 style={{ textAlign: 'center', marginBottom:'5px' }}>
                Maze Runner
                <button
                    onClick={toggleDebug}
                    style={{ marginLeft: '20px' }}
                >
                    Turn debug {isDebug ? 'off' : 'on'}
                </button>
                <button
                    onClick={cycleControls}
                    style={{ marginLeft: '20px' }}
                >
                    Controls: {currentControl}
                </button>
            </h1>
                <div style={{
                    display:'flex', 
                    justifyContent:'center',
                    alignItems:'center',
                    position:'relative',
                    height:'100%',
                    padding:'1em'

                }}>
                    <PhaserGame />
                    {isBlurred && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width:VW,
                            height:VH,
                            backgroundColor: 'rgba(128, 128, 128, 0.7)',
                            zIndex: 10,
                            borderRadius:'2.5em', 
                        }}></div>
                    )}
                </div>

            </body>
        </>
    );
};

export default HomeView;

