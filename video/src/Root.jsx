import { Composition } from 'remotion';
import { Video } from './Video';
import { WebsiteWalkthrough } from './scenes/WebsiteWalkthrough';

export const RemotionRoot = () => {
    // Total duration for the walkthrough based on estimated clip lengths
    // 300 + 210 + 210 + 150 + 150 + 210 + 210 + 210 + 210 = 1860 frames
    // + Intro Video (750 frames) = Total is separate compositions

    return (
        <>
            <Composition
                id="SolidarityNetworkIntro"
                component={Video}
                durationInFrames={750}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="WebsiteWalkthrough"
                component={WebsiteWalkthrough}
                durationInFrames={895}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
