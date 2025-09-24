// Global variables for calendar
let calendarCurrentMonth = new Date().getMonth();
let calendarCurrentYear = 2025;

// Global function for changing month - this will be accessible from HTML onclick handlers
window.changeMonth = function(direction) {
    calendarCurrentMonth += direction;
    if (calendarCurrentMonth < 0) {
        calendarCurrentMonth = 11;
        calendarCurrentYear--;
    } else if (calendarCurrentMonth > 11) {
        calendarCurrentMonth = 0;
        calendarCurrentYear++;
    }
    
    // Call the calendar generation function
    if (window.generateCalendar) {
        window.generateCalendar(calendarCurrentMonth, calendarCurrentYear);
    }
};

// Global function for generating calendar
window.generateCalendar = function(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(day);
    }
    
    // Add current month's days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        // Check if this is today
        if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
            day.classList.add('today');
        }
        
        // Check attendance status
        const dateStr = `${year}-${month + 1}-${i}`;
        if (window.attendanceData && window.attendanceData[dateStr]) {
            day.classList.add(window.attendanceData[dateStr]);
        }
        
        calendarGrid.appendChild(day);
    }
    
    // Add next month's leading days
    const totalCells = calendarGrid.children.length - 7; // Subtract day headers
    const remainingCells = 35 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarGrid.appendChild(day);
    }
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthElement = document.querySelector('.reports-card .card-title span');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    }
};

// Global attendance data
window.attendanceData = {
    '2025-1-1': 'present',
    '2025-1-2': 'present',
    '2025-1-3': 'late',
    '2025-1-6': 'present',
    '2025-1-7': 'present',
    '2025-1-8': 'absent',
    '2025-1-9': 'present',
    '2025-1-10': 'present',
 
};
function initCalendar() {
    // Initialize calendar with global variables
    window.generateCalendar(calendarCurrentMonth, calendarCurrentYear);
    
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => window.changeMonth(-1));
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => window.changeMonth(1));
    }
}
// Main Application Module
const AttendanceApp = (function() {
    // Private state
    const state = {
        currentPage: 'dashboard',
        students: [],
        attendanceData: {}
    };

    // DOM Cache
    const elements = {
        toggle: document.querySelector(".toggle"),
        navigation: document.querySelector(".navigation"),
        main: document.querySelector(".main"),
        tooltip: document.getElementById('sidebar-tooltip'),
        currentDate: document.getElementById('currentDate'),
        pageContents: document.querySelectorAll('.page-content'),
        pageHeader: document.querySelector('.page-header'),
        pageTitle: document.querySelector('.page-title')
    };

    // Initialize app
    function init() {
        setupEventListeners();
        showPage('dashboard');
        updateCurrentDate();
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Menu toggle
        if (elements.toggle) {
            elements.toggle.addEventListener('click', toggleMenu);
        }

        // Navigation links
        document.querySelectorAll('.navigation ul li a[data-page]').forEach(link => {
            link.addEventListener('click', handleNavigation);
        });

        // Tooltip functionality
        setupTooltips();

        // Student page functionality
        setupStudentPage();

        // Attendance page functionality
        setupAttendancePage();

        // Profile page functionality
        setupProfilePage();
    }

    // Toggle menu
    function toggleMenu() {
        elements.navigation.classList.toggle("active");
        elements.main.classList.toggle("active");
        if (elements.tooltip) {
            elements.tooltip.classList.remove("active");
        }
    }

    // Handle navigation
    function handleNavigation(e) {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page');
        showPage(page);
    }

    // Show specific page
    function showPage(page) {
        // Hide all pages
        elements.pageContents.forEach(content => {
            content.style.display = 'none';
        });

        // Show selected page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.style.display = '';
            state.currentPage = page;
            updatePageHeader(page);
        }

        // Update active navigation
        document.querySelectorAll('.navigation ul li').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.navigation ul li a[data-page="${page}"]`)?.parentElement?.classList.add('active');
    }

    // Update page header
    function updatePageHeader(page) {
        const titles = {
            dashboard: 'Dashboard',
            students: 'Students',
            attendance: 'Attendance',
            reports: 'Reports',
            about: 'About'
        };

        if (elements.pageHeader) {
            elements.pageHeader.style.display = page === 'settings' ? 'none' : '';
        }

        if (elements.pageTitle && titles[page]) {
            elements.pageTitle.textContent = titles[page];
        }
    }

    // Update current date
    function updateCurrentDate() {
        if (elements.currentDate) {
            elements.currentDate.textContent = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    // Setup tooltips
    function setupTooltips() {
        const navLinks = document.querySelectorAll('.navigation ul li a[data-tooltip]');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function(e) {
                if (elements.navigation && elements.navigation.classList.contains('active') && elements.tooltip) {
                    elements.tooltip.textContent = this.getAttribute('data-tooltip');
                    const rect = this.getBoundingClientRect();
                    elements.tooltip.style.top = rect.top + window.scrollY + 'px';
                    elements.tooltip.classList.add('active');
                }
            });
            
            link.addEventListener('mouseleave', function() {
                if (elements.tooltip) {
                    elements.tooltip.classList.remove('active');
                }
            });
        });
    }

    // Setup student page functionality
    function setupStudentPage() {
        // View toggle
        const listViewBtn = document.getElementById('list-view-btn');
        const gridViewBtn = document.getElementById('grid-view-btn');
        const listView = document.getElementById('students-list-view');
        const gridView = document.getElementById('students-grid-view');

        if (listViewBtn && gridViewBtn && listView && gridView) {
            listViewBtn.addEventListener('click', function() {
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
                listView.style.display = 'block';
                gridView.style.display = 'none';
            });

            gridViewBtn.addEventListener('click', function() {
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
                gridView.style.display = 'grid';
                listView.style.display = 'none';
            });
        }

        // Year pagination
        const yearBtns = document.querySelectorAll('.year-btn');
        yearBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                yearBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                showToast(`Showing students from ${this.textContent}`);
            });
        });

        // Scroll to bottom button
        const scrollToBottomBtn = document.getElementById('scroll-to-bottom-btn');
        const content = document.querySelector('.content');

        if (scrollToBottomBtn && content) {
            scrollToBottomBtn.addEventListener('click', function() {
                content.scrollTo({
                    top: content.scrollHeight,
                    behavior: 'smooth'
                });
            });

            content.addEventListener('scroll', function() {
                scrollToBottomBtn.style.display = content.scrollTop > 100 ? 'flex' : 'none';
            });

            scrollToBottomBtn.style.display = 'none';
        }

        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', handleStudentAction);
        });

        // Export button
        const exportBtn = document.querySelector('.export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                showToast('Exporting student data...');
            });
        }
    }

    // Handle student actions
    function handleStudentAction(e) {
        const action = e.currentTarget.querySelector('i').className;
        const studentElement = e.currentTarget.closest('.student-row, .student-card');
        const studentName = studentElement?.querySelector('.student-name')?.textContent;
        
        if (!studentName) return;
        
        if (action.includes('edit')) {
            showToast(`Edit student: ${studentName}`);
        } else if (action.includes('trash')) {
            if (confirm(`Are you sure you want to delete ${studentName}?`)) {
                showToast(`Deleted student: ${studentName}`);
            }
        } else if (action.includes('file-alt')) {
            showToast(`View report for: ${studentName}`);
        }
    }

    // Setup attendance page functionality
    function setupAttendancePage() {
        // Sign in buttons
        document.querySelectorAll('.btn-signin').forEach(button => {
            button.addEventListener('click', handleSignIn);
        });

        // Sign out buttons
        document.querySelectorAll('.btn-signout').forEach(button => {
            button.addEventListener('click', handleSignOut);
        });

        // Search functionality
        const searchInput = document.querySelector('.search');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

        // Initialize calendar
        initCalendar();
    }

    // Handle sign in
    function handleSignIn(e) {
        const button = e.currentTarget;
        const row = button.closest('tr');
        if (!row) return;
        
        const arrivalTimeCell = row.querySelector('td:nth-child(4)');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        if (arrivalTimeCell) {
            arrivalTimeCell.textContent = timeString;
        }
        
        // Check if student is late (after 8:30 AM)
        const lateTime = new Date();
        lateTime.setHours(8, 30, 0, 0);
        
        if (now > lateTime) {
            button.className = 'btn btn-late';
            button.innerHTML = '<i class="fas fa-clock"></i> Late';
        } else {
            button.className = 'btn btn-signed';
            button.innerHTML = '<i class="fas fa-check"></i> Signed In';
        }
        
        button.disabled = true;
        
        // Enable sign out button
        const signOutButton = row.querySelector('.btn-signout');
        if (signOutButton) {
            signOutButton.disabled = false;
        }
        
        updateAttendanceCounts();
    }

    // Handle sign out
    function handleSignOut(e) {
        const button = e.currentTarget;
        const row = button.closest('tr');
        if (!row) return;
        
        const departTimeCell = row.querySelector('td:nth-child(6)');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        if (departTimeCell) {
            departTimeCell.textContent = timeString;
        }
        
        button.disabled = true;
        button.className = 'btn btn-signed-out';
        button.innerHTML = '<i class="fas fa-check"></i> Signed Out';
        
        // Disable sign in/late button
        const signInButton = row.querySelector('.btn-signin, .btn-late, .btn-signed');
        if (signInButton) {
            signInButton.disabled = true;
        }
        
        updateAttendanceCounts();
    }

    // Update attendance counts
    function updateAttendanceCounts() {
        const totalStudents = document.querySelectorAll('.students-table tbody tr').length;
        const presentStudents = document.querySelectorAll('.btn-signed').length;
        const lateStudents = document.querySelectorAll('.btn-late').length;
        const absentStudents = totalStudents - presentStudents - lateStudents;
        
        const updateElement = (selector, value) => {
            const element = document.querySelector(selector);
            if (element) element.textContent = value;
        };
        
        updateElement('.summary-card.present h3', presentStudents);
        updateElement('.summary-card.absent h3', absentStudents);
        updateElement('.summary-card.late h3', lateStudents);
        updateElement('.summary-card.expected h3', totalStudents);
    }

    // Handle search
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.students-table tbody tr');
        
        rows.forEach(row => {
            const studentName = row.querySelector('.student-name')?.textContent.toLowerCase();
            row.style.display = studentName?.includes(searchTerm) ? '' : 'none';
        });
    }

    // Function to submit attendance report
function submitAttendanceReport() {
    // Collect attendance data from the table
    const attendanceData = [];
    const rows = document.querySelectorAll('#attendance-page .students-table tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const studentName = cells[2].textContent.trim();
        const arrivalTime = cells[3].textContent.trim();
        const departTime = cells[5].textContent.trim();
        
        // Determine status based on the buttons
        let status = 'Absent'; // default
        const signInButton = row.querySelector('.btn-signin, .btn-late, .btn-signed');
        if (signInButton) {
            if (signInButton.classList.contains('btn-signed')) {
                status = 'Present';
            } else if (signInButton.classList.contains('btn-late')) {
                status = 'Late';
            }
        }
        
        attendanceData.push({
            name: studentName,
            arrivalTime: arrivalTime,
            departTime: departTime,
            status: status
        });
    });
    
    // Here you would send the data to the server
    console.log('Submitting attendance report:', attendanceData);
    
    // For demonstration, we'll just show a success message
    showToast('Attendance report submitted successfully!', 'success');
    
    // In a real application, you would send the data to your server:
    /*
    fetch('https://your-server-endpoint.com/api/attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date: new Date().toISOString().split('T')[0], // Today's date
            attendance: attendanceData
        })
    })
    .then(response => response.json())
    .then(data => {
        showToast('Attendance report submitted successfully!', 'success');
    })
    .catch(error => {
        showToast('Error submitting attendance: ' + error.message, 'error');
    });
    */
}

// Add event listener for the submit button
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-attendance-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitAttendanceReport);
    }
});

    // Setup profile page functionality
    function setupProfilePage() {
        // Profile tab switching
        const profileTabs = document.querySelectorAll('.profile-tab');
        profileTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                if (!tabName) return;
                
                profileTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                this.classList.add('active');
                const tabContent = document.getElementById(`${tabName}-info`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });

        // Rating sliders
        const technicalSkill = document.getElementById('technical-skill');
        const learningActivity = document.getElementById('learning-activity');
        const activeContribution = document.getElementById('active-contribution');
        
        if (technicalSkill) {
            technicalSkill.addEventListener('input', function() {
                const valueElement = document.getElementById('technical-value');
                if (valueElement) valueElement.textContent = this.value;
            });
        }
        
        if (learningActivity) {
            learningActivity.addEventListener('input', function() {
                const valueElement = document.getElementById('learning-value');
                if (valueElement) valueElement.textContent = this.value;
            });
        }
        
        if (activeContribution) {
            activeContribution.addEventListener('input', function() {
                const valueElement = document.getElementById('contribution-value');
                if (valueElement) valueElement.textContent = this.value;
            });
        }

        // Submit rating button
        const submitRatingBtn = document.querySelector('.submit-rating-btn');
        if (submitRatingBtn) {
            submitRatingBtn.addEventListener('click', submitRating);
        }

        // Initialize skills chart
        initSkillsChart();
    }

    // Submit rating
    function submitRating() {
        const technicalSkill = document.getElementById('technical-skill')?.value;
        const learningActivity = document.getElementById('learning-activity')?.value;
        const activeContribution = document.getElementById('active-contribution')?.value;
        
        if (!technicalSkill || !learningActivity || !activeContribution) return;
        
        // Update chart with new values
        if (window.skillsChart) {
            window.skillsChart.data.datasets[0].data = [technicalSkill, learningActivity, activeContribution];
            window.skillsChart.update();
        }
        
        // Show success message
        const button = document.querySelector('.submit-rating-btn');
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Rating Submitted!';
            button.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '#3498db';
            }, 2000);
        }
    }

    // Initialize skills chart
    function initSkillsChart() {
        const ctx = document.getElementById('skillsChart');
        if (!ctx) return;
        
        window.skillsChart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Technical Skill', 'Learning Activity', 'Active Contribution'],
                datasets: [{
                    label: 'Skill Level',
                    data: [75, 85, 65],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.9)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.9)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(155, 89, 182, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

        // Profile tab switching
function switchProfileTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(tabName + '-info').classList.add('active');
}

// View student profile function
function viewStudentProfile(studentName) {
    alert(`Viewing profile for ${studentName}`);
    // In a real application, this would load the student's data
}


    // Toast notification system
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3000);
    }

    // Public API
    return {
        init: init,
        showToast: showToast
    };
})();

// Theme Toggle Functionality
function initThemeToggle() {
    const themeSelect = document.getElementById('theme-select');
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Set the select value to match the current theme
    if (themeSelect) {
        themeSelect.value = savedTheme;
        
        // Add event listener for theme change
        themeSelect.addEventListener('change', function() {
            const selectedTheme = this.value;
            applyTheme(selectedTheme);
            localStorage.setItem('theme', selectedTheme);
            showToast(`Theme changed to ${selectedTheme}`, 'info');
        });
    }
}

// Apply the selected theme
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-theme');
    } else if (theme === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
});

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', AttendanceApp.init);