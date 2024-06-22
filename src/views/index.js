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
                <PhaserGame />
            </main>
        </>
    );
};

export default HomeView;
