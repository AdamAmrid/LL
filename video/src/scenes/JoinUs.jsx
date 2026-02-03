import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONTS } from '../constants';

export const JoinUs = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = 1 + Math.sin(frame / 10) * 0.05;
    const opacity = interpolate(frame, [0, 20], [0, 1]);

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.accent,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h1
                style={{
                    fontFamily: FONTS.heading,
                    fontSize: 120,
                    color: 'white',
                    fontWeight: 900,
                    transform: `scale(${scale})`,
                    opacity,
                    textAlign: 'center'
                }}
            >
                Join the Community
            </h1>
            <p style={{
                fontFamily: FONTS.main,
                color: 'white',
                fontSize: 40,
                marginTop: 40,
                opacity: interpolate(frame, [20, 40], [0, 1])
            }}>
                um6p-solidarity-network.vercel.app
            </p>
        </AbsoluteFill>
    );
};
