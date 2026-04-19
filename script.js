// Sidebar Menu Active State Toggle
const menuItems = document.querySelectorAll('.sidebar-menu li');

menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        // Remove active class from all items
        menuItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        this.classList.add('active');
    });
});

// Simulate Action Button Dropdowns in the Table
const actionBtns = document.querySelectorAll('.action-btn');

actionBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        alert("This would open a context menu to Edit, Reschedule, or Delete the reminder.");
    });
});

// Search Bar Interaction
const searchInput = document.querySelector('.search-bar input');

if (searchInput) {
    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-bar').style.boxShadow = "0px 18px 40px rgba(67, 24, 255, 0.15)";
    });
    
    searchInput.addEventListener('blur', () => {
        document.querySelector('.search-bar').style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.02)";
    });
}
