import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
// Note: Ensure you have installed react-tsparticles and @tsparticles/slim

const ParticalBG = () => {
    const [init, setInit] = useState(false);

    // 1. Initialization: Load the particles engine
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log("Particles engine loaded:", container);
    };

    // 2. Configuration: Insert your detailed JSON here
    const options = useMemo(
        () => ({
            // --- BASE CONFIGURATION (Copied from your JSON) ---
            autoPlay: true,
            background: {
                color: {
                    // Use a subtle color or ensure it's transparent if you want to see the page gradient
                    // Setting it to a transparent or light color works best with the glass effect
                    value: "transparent",
                },
                opacity: 1
            },
            fullScreen: {
                enable: true,
                zIndex: 0
            },
            detectRetina: true,
            fpsLimit: 120,
            interactivity: {
                detectsOn: "window",
                events: {
                    onClick: {
                        enable: true,
                        mode: "push"
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse",
                        parallax: {
                            enable: false,
                            force: 2,
                            smooth: 20
                        }
                    },
                    resize: {
                        delay: 0.5,
                        enable: true
                    }
                },
                modes: {
                    push: {
                        default: true,
                        quantity: 4
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                        factor: 100,
                        speed: 1,
                        maxSpeed: 50,
                        easing: "ease-out-quad",
                    },
                    // ... (many other modes are listed but truncated for brevity)
                }
            },
            particles: {
                bounce: {
                    horizontal: { value: 1 },
                    vertical: { value: 1 }
                },
                collisions: {
                    enable: false, // Keeping collisions off for a cleaner, non-intrusive flow
                    maxSpeed: 50,
                },
                color: {
                    value: "#4caf50ff",
                    animation: {
                        // Removed color animation to lock the color to green/white
                        enable: false,
                    }
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "out" },
                    random: false,
                    speed: 2, // Adjusted speed for a more subtle BG effect
                    straight: false,
                },
                number: {
                    density: { enable: true },
                    value: 50 // Number of particles
                },
                opacity: {
                    value: 0.5,
                },
                shape: { type: "circle" },
                size: {
                    value: { min: 3, max: 5 },
                },
                links: {
                    // 🟢 CRITICAL CHANGE: Linking color to match the particles
                    color: { value: "#4CAF50" },
                    distance: 150,
                    enable: true,
                    opacity: 0.6,
                    width: 1,
                },
            },
            motion: {
                disable: false,
            }
            // --- END OF BASE CONFIGURATION ---
        }),
        [],
    );

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
            />
        );
    }

    return <></>;
};

export default ParticalBG;