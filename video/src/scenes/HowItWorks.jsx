import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { ArrowRight, HeartHandshake, HelpCircle } from 'lucide-react';
import { COLORS, FONTS } from '../constants';

const Card = ({ title, subtitle, color, icon: Icon, direction, delay }) => {
    const frame = useCurrentFrame();
    const { fps, width } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: { damping: 15 },
    });

    const xOffset = direction === 'left'
        ? (1 - entrance) * -width / 2
        : (1 - entrance) * width / 2;

    return (
        <div
            style={{
                flex: 1,
                backgroundColor: 'white',
                margin: 40,
                borderRadius: 40,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                transform: `translateX(${xOffset}px)`,
                opacity: entrance,
                borderTop: `20px solid ${color}`,
                height: '80%'
            }}
        >
            <div style={{ backgroundColor: `${color}20`, padding: 50, borderRadius: '50%', marginBottom: 40 }}>
                <Icon size={120} color={color} />
            </div>
            <h3 style={{ fontFamily: FONTS.heading, fontSize: 60, color: COLORS.dark, margin: 0, marginBottom: 20 }}>{title}</h3>
            <p style={{ fontFamily: FONTS.main, fontSize: 35, color: COLORS.gray, margin: 0 }}>{subtitle}</p>
        </div>
    );
};

export const HowItWorks = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.secondary, flexDirection: 'row', alignItems: 'center', padding: 100 }}>
            <Card
                title="Request Help"
                subtitle="Need support? Just ask."
                color={COLORS.accent}
                icon={HelpCircle}
                direction="left"
                delay={0}
            />
            <Card
                title="Offer Help"
                subtitle="Help others thrive."
                color={COLORS.orange}
                icon={HeartHandshake}
                direction="right"
                delay={10}
            />
        </AbsoluteFill>
    );
};
