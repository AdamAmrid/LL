import { AbsoluteFill, Sequence, Video, staticFile, interpolate, Easing, useCurrentFrame, useVideoConfig, Freeze, Audio } from 'remotion';

const TRANSITION_DURATION = 30; // 1 second overlap

const VideoClip = ({ src, index, duration }) => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();

    // ------------------------------------------------------------------
    // Transition Logic: PARALLAX SLIDE
    // ------------------------------------------------------------------

    // Custom "Pro" Easing: Snappy intro, smooth landing
    const transitionEase = Easing.bezier(0.22, 1, 0.36, 1);

    // Entrance: Slide fully in from right to center
    // Only applies if it's NOT the first clip
    const entranceProgress = index === 0 ? 1 : interpolate(
        frame,
        [0, TRANSITION_DURATION],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: transitionEase }
    );

    // Calculate entrance X position: Starts at width, ends at 0
    const entranceX = interpolate(entranceProgress, [0, 1], [width, 0]);


    // Exit: Slide partially out to left (Parallax effect)
    // Only applies if it's NOT the last clip we are viewing as a background
    const exitProgress = interpolate(
        frame,
        [duration, duration + TRANSITION_DURATION],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: transitionEase }
    );

    // Parallax exit: Move only 25% of width to the left, and darken slightly
    const exitX = interpolate(exitProgress, [0, 1], [0, -width * 0.25]);
    const brightness = interpolate(exitProgress, [0, 1], [1, 0.6]); // Darken as it goes back

    // Combine transforms
    const currentX = index === 0 ? exitX : (frame < TRANSITION_DURATION ? entranceX : exitX);

    // Shadow execution
    // Shadow is strong when entrance is starting, fades as it settles

    const content = (
        <Video
            src={staticFile(src)}
            volume={0}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: `brightness(${brightness})`,
            }}
        />
    );

    return (
        <AbsoluteFill style={{
            transform: `translateX(${currentX}px)`,
            boxShadow: index === 0 ? 'none' : '-20px 0 50px rgba(0,0,0,0.5)', // Shadow on left edge
        }}>
            {frame > duration ? (
                // In tail phase: Freeze the last frame so we have something to animate out
                <Freeze frame={duration} src={staticFile(src)}>
                    {content}
                </Freeze>
            ) : (
                content
            )}
        </AbsoluteFill>
    );
};

export const WebsiteWalkthrough = () => {
    // Durations synchronized with audio timestamps (30fps)
    // Durations synchronized with audio timestamps (30fps)
    const clips = [
        // { file: "1.mp4", duration: 270, label: "Home" },         // Removed
        // { file: "2.mp4", duration: 242, label: "About" },        // Removed
        // { file: "3.mp4", duration: 155, label: "Team" },         // Removed
        { file: "4.mp4", duration: 177, label: "Signup" },       // 22.21s -> 28.11s
        { file: "5.mp4", duration: 88, label: "Login" },         // 28.11s -> 31.05s
        { file: "6.mp4", duration: 180, label: "Request Help" }, // 31.05s -> 37.06s
        { file: "7.mp4", duration: 120, label: "Seekers" },      // ~4s (fallback)
        { file: "8.mp4", duration: 150, label: "My Requests" },  // ~5s (fallback)
        { file: "9.mp4", duration: 180, label: "Chat" },         // ~6s (fallback)
    ];

    let currentStartFrame = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Audio track removed as requested */}

            {clips.map((clip, index) => {
                const start = currentStartFrame;
                currentStartFrame += clip.duration; // Sequential

                const isLast = index === clips.length - 1;
                const sequenceDuration = clip.duration + (isLast ? 0 : TRANSITION_DURATION);

                return (
                    <Sequence
                        key={index}
                        from={start}
                        durationInFrames={sequenceDuration}
                        name={clip.label}
                        style={{ zIndex: index }}
                    >
                        <VideoClip
                            src={clip.file}
                            index={index}
                            duration={clip.duration}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
