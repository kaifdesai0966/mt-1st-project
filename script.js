// Add click interactions to the reminder card buttons
const actionBtns = document.querySelectorAll('.action-btn');

actionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const originalText = this.innerText;
        const isHighlight = this.classList.contains('highlight-btn');
        const card = this.closest('.glass-card');
        
        // Provide immediate visual success feedback
        this.innerHTML = '<i class="fa-solid fa-check"></i> Done';
        this.style.background = 'rgba(16, 185, 129, 0.2)'; // Success green tint
        this.style.color = '#10b981';
        this.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        
        if (isHighlight) {
            this.style.boxShadow = 'none';
        }

        // Fade out card slightly to indicate completion
        card.style.opacity = '0.6';
        card.style.transform = 'scale(0.98)';
        
        // Reset after a delay (simulating state reset for UI demo purposes)
        setTimeout(() => {
            this.innerText = originalText;
            this.style.background = '';
            this.style.color = '';
            this.style.borderColor = '';
            card.style.opacity = '1';
            card.style.transform = '';
            
            // Restore special styling for highlight button
            if (isHighlight) {
                this.style.background = 'linear-gradient(135deg, #00d2ff, #3a7bd5)';
                this.style.boxShadow = '0 4px 15px rgba(0, 210, 255, 0.3)';
                this.style.color = 'white';
            }
        }, 2500);
    });
});

// Subtle Parallax effect for background shapes on mouse move
// Adds depth to the glassmorphism aesthetic
document.addEventListener('mousemove', (e) => {
    // Only run parallax on desktop screens to save mobile performance
    if (window.innerWidth > 768) {
        const shapes = document.querySelectorAll('.bg-shape');
        
        shapes.forEach((shape, index) => {
            // Different speed for different shapes creates 3D depth
            const speed = (index + 1) * 15; 
            const xPos = (window.innerWidth / 2 - e.pageX * speed) / 100;
            const yPos = (window.innerHeight / 2 - e.pageY * speed) / 100;
            
            // Combine with existing float animation transform
            shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    }
});
