import { Sequence, Audio } from 'remotion';
import { Intro } from './scenes/Intro';
import { Mission } from './scenes/Mission';
import { HowItWorks } from './scenes/HowItWorks';
import { JoinUs } from './scenes/JoinUs';
import { COLORS } from './constants';

export const Video = () => {
    return (
        <div style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <Sequence from={0} durationInFrames={150}>
                <Intro />
            </Sequence>
            <Sequence from={150} durationInFrames={150}>
                <Mission />
            </Sequence>
            <Sequence from={300} durationInFrames={240}>
                <HowItWorks />
            </Sequence>
            <Sequence from={540} durationInFrames={210}>
                <JoinUs />
            </Sequence>
        </div>
    );
};
