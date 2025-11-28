// Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar shadow on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 100) {
                nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });

        // Ring Animation Background
        window.addEventListener('load', () => {
            const container = document.getElementById('ring-container');

            // Configuration
            const NUM_RINGS = 10;
            const BASE_SIZE = 1000;
            const SIZE_STEP = 70;

            // Localized Ripple Movement Configuration
            const MAX_SHIFT = 30;
            const INFLUENCE_RADIUS = 150;

            // Color Gradient Configuration (beige tones)
            const START_HUE = 30; // Beige hue
            const START_SATURATION = 20; // Low saturation for beige
            const START_LIGHTNESS = 85; // High lightness
            const LIGHTNESS_STEP = 3; // Smaller step for subtle gradient

            // Dynamic Ring Creation and Styling
            const ringsData = [];
            for (let i = 0; i < NUM_RINGS; i++) {
                const ring = document.createElement('div');
                ring.classList.add('ring');

                const size = BASE_SIZE - (i * SIZE_STEP);
                const lightness = START_LIGHTNESS - (i * LIGHTNESS_STEP);
                const color = `hsl(${START_HUE}, ${START_SATURATION}%, ${lightness}%)`;

                ring.style.width = `${size}px`;
                ring.style.height = `${size}px`;
                ring.style.backgroundColor = color;

                ring.dataset.depth = i;

                container.appendChild(ring);

                ringsData.push({ element: ring, radius: size / 2 });
            }

            // Get the position of the h1 element "Harika Jakka"
            const h1 = document.querySelector('.hero-text h1');
            const h1Rect = h1.getBoundingClientRect();
            const ringsCenterX = h1Rect.left + h1Rect.width / 2;
            const ringsCenterY = h1Rect.top + h1Rect.height / 2;

            const rings = document.querySelectorAll('.ring');

            // Position rings at the h1 center
            rings.forEach(ring => {
                ring.style.top = `${ringsCenterY}px`;
                ring.style.left = `${ringsCenterX}px`;
            });

            // Localized Ripple Effect on Mouse Movement
            document.addEventListener('mousemove', (e) => {
                const cursorX = e.clientX;
                const cursorY = e.clientY;

                const directionX = (cursorX - ringsCenterX);
                const directionY = (cursorY - ringsCenterY);

                const magnitude = Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2));

                const unitDirectionX = magnitude > 0 ? directionX / magnitude : 0;
                const unitDirectionY = magnitude > 0 ? directionY / magnitude : 0;

                ringsData.forEach(ringData => {
                    const ringElement = ringData.element;
                    const ringRadius = ringData.radius;

                    const distCursorToCenter = Math.sqrt(
                        Math.pow(cursorX - ringsCenterX, 2) +
                        Math.pow(cursorY - ringsCenterY, 2)
                    );

                    const distFromRingEdge = Math.abs(distCursorToCenter - ringRadius);

                    let influence = 0;
                    if (distFromRingEdge < INFLUENCE_RADIUS) {
                        influence = 1 - (distFromRingEdge / INFLUENCE_RADIUS);
                        influence = Math.pow(influence, 2);
                    }

                    const shiftX = unitDirectionX * influence * MAX_SHIFT * 0.5;
                    const shiftY = unitDirectionY * influence * MAX_SHIFT * 0.5;

                    ringElement.style.transform = `translate(-50%, -50%) translate3d(${shiftX}px, ${shiftY}px, 0px)`;
                });
            });

            // Cohesion Restore
            document.addEventListener('mouseleave', () => {
                rings.forEach(ring => {
                    ring.style.transform = 'translate(-50%, -50%) translate3d(0px, 0px, 0px)';
                });
            });
        });


