import { AbsoluteFill } from 'remotion';

export const HelloWorld = () => {
    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 100,
                backgroundColor: 'white',
            }}
        >
            Hello Remotion!
        </AbsoluteFill>
    );
};
