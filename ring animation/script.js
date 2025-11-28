document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ring-container');
    
    // --- Configuration ---
    const NUM_RINGS = 10;
    const BASE_SIZE = 400; 
    const SIZE_STEP = 35; 
    
    // --- Localized Ripple Movement Configuration ---
    // Max magnitude of the shift (how far a ring directly under the cursor can move)
    const MAX_SHIFT = 30; 
    // Max radius (in pixels) of the cursor's influence. 
    // Rings outside this distance will not move.
    const INFLUENCE_RADIUS = 150; 
    
    // --- Color Gradient Configuration (Unchanged) ---
    const START_HUE = 15; 
    const START_SATURATION = 60; 
    const START_LIGHTNESS = 90; 
    const LIGHTNESS_STEP = 6; 

    // --- 1. Dynamic Ring Creation and Styling (Unchanged) ---
    const ringsData = []; // Store ring data for easy access to computed size
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
        
        // Store the ring element and its size for accurate calculations
        ringsData.push({ element: ring, radius: size / 2 });
    }

    const rings = document.querySelectorAll('.ring');
    
    // Get the position of the ring container (the center of the rings) only once
    const rect = container.getBoundingClientRect();
    const ringsCenterX = rect.left + rect.width / 2;
    const ringsCenterY = rect.top + rect.height / 2;
    
    // --- 2. Localized Ripple Effect on Mouse Movement ---
    
    document.addEventListener('mousemove', (e) => {
        const cursorX = e.clientX;
        const cursorY = e.clientY;
        
        // --- Calculate Cursor Direction Vector (for the "push" direction) ---
        // This vector points from the center of the rings to the cursor.
        const directionX = (cursorX - ringsCenterX);
        const directionY = (cursorY - ringsCenterY);
        
        // Calculate the magnitude (length) of the direction vector
        const magnitude = Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2));

        // Normalize the vector to get a unit direction (length 1), if magnitude is not zero
        const unitDirectionX = magnitude > 0 ? directionX / magnitude : 0;
        const unitDirectionY = magnitude > 0 ? directionY / magnitude : 0;
        
        
        // --- Apply Localized Movement to Each Ring ---
        ringsData.forEach(ringData => {
            const ringElement = ringData.element;
            const ringRadius = ringData.radius;

            // --- 1. Find the Closest Point on the Ring's Circumference to the Cursor ---
            
            // The ring center is fixed at (ringsCenterX, ringsCenterY).
            // We need the distance between the cursor (cursorX, cursorY) and the ring's edge.
            
            // Distance from cursor to the center of the ring cluster
            const distCursorToCenter = Math.sqrt(
                Math.pow(cursorX - ringsCenterX, 2) + 
                Math.pow(cursorY - ringsCenterY, 2)
            );
            
            // Distance from the cursor to the nearest point on the ring's circumference
            // (The closest a "point of contact" can be is at the edge)
            const distFromRingEdge = Math.abs(distCursorToCenter - ringRadius);

            // --- 2. Calculate the Localized Influence (Inverse Distance Weighting) ---
            
            let influence = 0;
            if (distFromRingEdge < INFLUENCE_RADIUS) {
                // influence is 1 (max) when cursor is exactly on the ring's edge, 
                // and 0 when it reaches INFLUENCE_RADIUS away.
                influence = 1 - (distFromRingEdge / INFLUENCE_RADIUS);
                // Squaring makes the falloff sharper/more localized (inverse square law feel)
                influence = Math.pow(influence, 2); 
            }
            
            // --- 3. Final Shift Calculation ---
            
            // The rings should be pushed along the calculated unit direction,
            // scaled by the MAX_SHIFT and the localized influence.
            const shiftX = unitDirectionX * influence * MAX_SHIFT * 0.5; // 0.5 dampens the total shift
            const shiftY = unitDirectionY * influence * MAX_SHIFT * 0.5; 
            
            ringElement.style.transform = `translate(-50%, -50%) translate3d(${shiftX}px, ${shiftY}px, 0px)`;
        });
    });

    // --- Cohesion Restore (Unchanged) ---
    document.addEventListener('mouseleave', () => {
        rings.forEach(ring => {
            ring.style.transform = 'translate(-50%, -50%) translate3d(0px, 0px, 0px)';
        });
    });

});