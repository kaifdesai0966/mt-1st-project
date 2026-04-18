// Bottom Navigation Screen Switching Logic
const navItems = document.querySelectorAll('.nav-item');
const screens = document.querySelectorAll('.screen');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to the clicked nav item
        item.classList.add('active');

        // Hide all screens
        screens.forEach(screen => screen.classList.remove('active'));
        
        // Show target screen corresponding to the nav item
        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// Reminder Check Button Logic (Home Screen)
const checkBtns = document.querySelectorAll('.check-btn');
checkBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent the click from bubbling up to the card
        
        this.classList.toggle('checked');
        
        const item = this.closest('.reminder-item');
        // Visually fade the item when checked
        if(this.classList.contains('checked')) {
            item.style.opacity = '0.5';
        } else {
            item.style.opacity = '1';
        }
    });
});

// Color Picker Logic (Add Screen)
const colorOpts = document.querySelectorAll('.color-opt');
colorOpts.forEach(opt => {
    opt.addEventListener('click', () => {
        // Remove active state from all color options
        colorOpts.forEach(c => c.classList.remove('active'));
        // Add active state to selected color
        opt.classList.add('active');
    });
});

// Form Submission Simulation (Add Screen)
const addForm = document.getElementById('add-form');
if (addForm) {
    addForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent real form submission
        
        const submitBtn = addForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerText;
        
        // Loading state
        submitBtn.innerText = 'Saving...';
        submitBtn.style.opacity = '0.8';
        
        // Simulate delay
        setTimeout(() => {
            // Success state
            submitBtn.innerText = 'Added Successfully!';
            submitBtn.style.background = '#10b981'; // Success Green
            submitBtn.style.opacity = '1';
            
            setTimeout(() => {
                // Reset form and UI
                addForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.style.background = 'var(--text-dark)';
                
                // Automatically switch back to Home screen after adding
                const homeNavBtn = document.querySelector('.nav-item[data-target="screen-home"]');
                if(homeNavBtn) homeNavBtn.click();
                
            }, 1200);
        }, 800);
    });
}
