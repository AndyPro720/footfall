
// Wrapper class to manage the global loader or create new instances
export class Loader {
    constructor() {
        this.overlay = document.getElementById('loader-overlay');
        this.tl = null;
        this.shouldStop = false;
    }

    // Initialize logic if it's already in the DOM (e.g. initial load)
    init() {
        if (!this.overlay) return;
        
        // Wait for fonts to load before showing the animation to prevent FOUT
        document.fonts.ready.then(() => {
            this.runAnimation();
        });
    }

    // Programmatically show the loader (mostly for testing or re-runs)
    show() {
        if (!this.overlay) return;
        
        // Make visible
        this.overlay.classList.remove('hidden');
        this.overlay.style.pointerEvents = 'all';
        this.overlay.style.opacity = '1';
        this.shouldStop = false;

        // Restart animation
        this.runAnimation();
    }

    hide() {
        if (!this.overlay) return;
        
        // Signal the timeline to stop after current cycle
        this.shouldStop = true;
        
        // Failsafe: If timeline is not active or somehow stuck, force hide after a max duration (e.g. 5s)
        // Adjust timeout to be longer than the longest possible animation cycle
        setTimeout(() => {
             if (!this.overlay.classList.contains('hidden')) {
                 this.fadeOut();
             }
        }, 8000);
    }

    runAnimation() {
        if (!window.gsap) {
            console.warn('GSAP not loaded yet');
            return;
        }

        const gsap = window.gsap;
        const statusEl = document.getElementById('status-text');
        const percentEl = document.getElementById('percent-text');
        const fillEl = document.querySelector('.progress-fill');

        if (!statusEl || !percentEl || !fillEl) return; // Guard clause

        // Kill existing if any
        if (this.tl) this.tl.kill();

        function setStatus(text, pct) {
            gsap.fromTo(statusEl,
                { color: "#15803d" },
                { color: "#64748b", duration: 0.6 }
            );

            statusEl.innerText = text;

            gsap.to(percentEl, {
                innerText: pct,
                duration: 0.8,
                snap: { innerText: 1 },
                onUpdate: function () {
                    this.targets()[0].innerText = Math.ceil(this.targets()[0].innerText) + "%";
                }
            });

            gsap.to(fillEl, {
                width: pct + "%",
                duration: 0.8,
                ease: "power2.out"
            });
        }

        // Create the main timeline
        // Loop logic: We restart manually in onComplete to allow graceful exit checking at end of cycle.
        const startTimeline = () => {
             this.tl = gsap.timeline({
                defaults: { duration: 1 },
                onComplete: () => {
                    if (this.shouldStop) {
                        this.fadeOut();
                    } else {
                        // Restart loop
                        startTimeline();
                    }
                }
            }).timeScale(1.0);

            // Function to reset the UI at the start of each loop
            const resetUI = () => {
                 // reset logic
                gsap.set(fillEl, { width: "0%" });
                percentEl.innerText = "0%";
                statusEl.innerText = "System Idle";
                statusEl.style.color = "#64748b";
    
                // Explicitly reset elements to ensure clean loop start
                gsap.set([
                    ".final-letter", ".l1-custom-shape", ".l2-forklift-mechanism",
                    ".f-scanner-box", ".map-block-container", ".graph-group", ".network-group",
                    ".pin-shape", ".pin-shadow", ".match-flash", ".p1", ".p2", ".t1-static", ".t2-static"
                ], { clearProps: "all", opacity: 0 });
    
                gsap.set(".l2-forks", { width: "40px" });
                gsap.set(".shop-block", { opacity: 1, scale: 1 });
            };
    
            // 1. SCANNING (F)
            this.tl.call(resetUI) // Reset at start
                .add(() => setStatus("Scanning Urban Footprints", 15))
                .to(".f-scanner-box", { opacity: 1, duration: 0.1 })
                .fromTo(".scan-line", { top: "0%" }, { top: "100%", duration: 0.6, ease: "linear" })
                .to(".f-outline", { opacity: 1, duration: 0.3 }, "<0.1")
                .to(".f-scanner-box", { opacity: 0, duration: 0.2 })
                .to(".slot-f .final-letter", { opacity: 1, duration: 0.2 }, "<");
    
            // 2. CONNECTING PEOPLE (OO)
            this.tl.add(() => setStatus("Scanning Trade Areas", 30))
                .to([".p1", ".p2"], { opacity: 1, duration: 0.2 })
                .to(".p1", { x: 15, duration: 0.4, ease: "back.in(1.5)" })
                .to(".p2", { x: -15, duration: 0.4, ease: "back.in(1.5)" }, "<")
                .to(".match-flash", { opacity: 1, scale: 1.2, duration: 0.1 })
                .to([".p1", ".p2"], { opacity: 0, scale: 0.5, duration: 0.1 }, "<")
                .to(".match-flash", { scale: 2, opacity: 0, duration: 0.2 })
                .to([".slot-o1 .final-letter", ".slot-o2 .final-letter"], {
                    opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.5)"
                }, "-=0.1");
    
            // 3. MAPPING TRADE AREAS (TT)
            this.tl.add(() => setStatus("Mapping Brandscape", 45))
                .to(".map-block-container", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" })
                .set([".t1-static", ".t2-static"], { y: 100, opacity: 1 })
                .to([".t1-static", ".t2-static"], { y: 0, duration: 0.5, ease: "power2.out" }, "+=0.3")
                .to(".map-block-container", { y: -100, opacity: 0, duration: 0.5, ease: "power2.out" }, "<");
    
            // 4. FETCHING ANALYTICS (FA)
            this.tl.add(() => setStatus("Decoding Trade Area Intelligence", 60))
                .to(".slot-f2 .final-letter", { opacity: 0, duration: 0.1 })
                .to([".graph-group", ".network-group"], { opacity: 1, duration: 0.3 }, "<")
                .to(".g-bar", { height: (i) => [55, 60, 25, 45][i] + "px", duration: 0.6, stagger: 0.05, ease: "back.out(1.2)" }, "-=0.2")
                .from(".n-node", { scale: 0, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)" }, "<")
                .from(".n-line", { scaleX: 0, duration: 0.5, stagger: 0.05 }, "<")
                .to([".graph-group", ".network-group"], { opacity: 0, scale: 1.1, duration: 0.3, ease: "power2.inOut", delay: 0.2 })
                .to([".slot-f2 .final-letter", ".slot-a .final-letter"], { opacity: 1, scale: 1, startAt: { scale: 0.9 }, duration: 0.3, ease: "power2.out" }, "<");
    
            // 5. GATHERING LOCATION (L1) & CURATING DATA (L2)
            this.tl.add(() => setStatus("Matching Profiles", 75))
                .set(".l1-custom-shape", { opacity: 1 })
                .set(".l1-v-bar", { opacity: 0 })
                .set(".l1-h-bar", { width: 0 })
                .to(".pin-shape", { opacity: 1, y: 0, startAt: { y: -80 }, duration: 0.4, ease: "bounce.out" })
                .to(".pin-shadow", { opacity: 1, scale: 1, duration: 0.3 }, "-=0.3")
                .to(".pin-dot", { opacity: 0, duration: 0.2 }, "+=0.1")
                .to(".pin-shadow", { opacity: 0, duration: 0.2 }, "<")
                .to(".pin-shape", {
                    left: "14px",
                    bottom: "22px",
                    width: "13px",
                    height: "52px",
                    duration: 0.4,
                    ease: "power2.inOut"
                }, "<")
                .to(".pin-head", {
                    rotation: 0,
                    borderRadius: "0%",
                    width: "13px",
                    height: "52px",
                    boxShadow: "none",
                    duration: 0.4,
                    ease: "power2.inOut"
                }, "<")
                .to(".l1-h-bar", { width: "100%", duration: 0.3, ease: "power2.out" })
                .set(".l1-v-bar", { opacity: 1 })
                .set(".pin-shape", { opacity: 0 });
    
            // 6. SCORING LOCATION OPPORTUNITY
            this.tl.add(() => setStatus("Scoring Location Opportunity", 90))
                .fromTo(".l2-forklift-mechanism",
                    { y: -150, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.2")
                .to(".l2-forks", { width: 0, duration: 0.4, ease: "power2.in" }, "+=0.2")
                .to(".shop-block", { opacity: 0, scale: 0.8, duration: 0.3 }, "<")
                .call(() => setStatus("Intelligence Engine Ready", 100));
    
            // Final Pulse
            this.tl.to([".final-letter", ".l1-custom-shape", ".l2-vertical-stem"], {
                scale: 1.05,
                duration: 0.8,
                yoyo: true,
                repeat: 1,
                ease: "sine.inOut",
                stagger: 0.05
            }, "+=0.2");
        };

        // Start the first cycle
        startTimeline();
    }
    
    fadeOut() {
         if(!this.overlay) return;
         this.overlay.classList.add('hidden');
         // We can kill the timeline after the transition if we want, or leave it.
         setTimeout(() => {
             if(this.tl) this.tl.kill(); 
             this.tl = null;
         }, 1000);
    }
}
