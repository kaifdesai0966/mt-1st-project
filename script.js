// Add click interactions to the brutalist reminder card buttons
const actionBtns = document.querySelectorAll('.action-btn');

actionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const originalText = this.innerText;
        
        // Immediate visual success feedback (Brutalist style)
        this.innerHTML = '<i class="fa-solid fa-check"></i> TAKEN';
        this.style.background = '#4ade80'; // Brutalist bright green
        this.style.color = '#000000';
        
        // Disable temporarily to prevent multiple clicks
        this.style.pointerEvents = 'none';

        // Reset after a delay (simulating state reset for UI demo purposes)
        setTimeout(() => {
            this.innerText = originalText;
            this.style.background = '#ffffff';
            this.style.color = '#000000';
            this.style.pointerEvents = 'auto';
        }, 2000);
    });
});
