import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import PhaserGame without SSR
const PhaserGame = dynamic(() => import('../phaser/PhaserGame'), { ssr: false });

const HomeView = () => {
    return (
        <>
            <Head>
                <title>My Phaser Game</title>
                <meta name="description" content="A game built with Phaser and Next.js" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1 style={{textAlign:'center'}}>Maze Runner</h1>
                <div style={{
                    display:'flex', 
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <PhaserGame />

                </div>

            </main>
        </>
    );
};

export default HomeView;

