import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONTS } from '../constants';

export const Intro = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const titleScale = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },
    });

    const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const subtitleY = interpolate(frame, [30, 60], [20, 0], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
            <h1
                style={{
                    fontFamily: FONTS.heading,
                    fontSize: 80,
                    fontWeight: 'bold',
                    color: COLORS.dark,
                    opacity: titleOpacity,
                    transform: `scale(${titleScale})`,
                    margin: 0,
                    textAlign: 'center',
                }}
            >
                UM6P Solidarity Network
            </h1>
            <h2
                style={{
                    fontFamily: FONTS.main,
                    fontSize: 40,
                    color: COLORS.accent,
                    opacity: subtitleOpacity,
                    transform: `translateY(${subtitleY}px)`,
                    marginTop: 20,
                    fontWeight: 'normal',
                }}
            >
                Building a Culture of Mutual Support
            </h2>
        </AbsoluteFill>
    );
};
