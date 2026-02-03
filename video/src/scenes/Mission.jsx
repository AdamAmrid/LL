import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { BookOpen, GraduationCap, Smile, Heart } from 'lucide-react';
import { COLORS, FONTS } from '../constants';

const features = [
    { icon: BookOpen, text: 'Academic Resources', color: COLORS.accent },
    { icon: GraduationCap, text: 'Tutoring & Help', color: COLORS.orange },
    { icon: Smile, text: 'Emotional Support', color: COLORS.accent },
];

export const Mission = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.cream,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 60,
            }}
        >
            {features.map((item, index) => {
                const delay = index * 10;
                const progress = spring({
                    frame: frame - delay,
                    fps,
                    config: { damping: 12 },
                });

                const scale = progress;
                const opacity = progress;

                return (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity,
                            transform: `scale(${scale})`,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                padding: 40,
                                borderRadius: '50%',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                marginBottom: 20,
                                border: `4px solid ${item.color}`,
                            }}
                        >
                            <item.icon size={80} color={item.color} />
                        </div>
                        <span
                            style={{
                                fontFamily: FONTS.heading,
                                fontSize: 32,
                                fontWeight: 'bold',
                                color: COLORS.dark,
                                textAlign: 'center',
                            }}
                        >
                            {item.text}
                        </span>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
