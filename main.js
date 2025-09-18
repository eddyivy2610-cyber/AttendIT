
// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};



// Set active navigation item
let naviLinks = document.querySelectorAll('.navigation ul li a[data-page]');

naviLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.navigation ul li').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to parent li
        this.parentElement.classList.add('active');
    });
});

let navLinks = document.querySelectorAll('.navigation ul li a[data-tooltip]');
let tooltip = document.getElementById('sidebar-tooltip');

navLinks.forEach(link => {
  link.addEventListener('mouseenter', function(e) {
    if (navigation.classList.contains('active')) {
      tooltip.textContent = link.getAttribute('data-tooltip');
      const rect = link.getBoundingClientRect();
      tooltip.style.top = rect.top + window.scrollY + 'px';
      tooltip.classList.add('active');
    }
  });
  link.addEventListener('mouseleave', function(e) {
    tooltip.classList.remove('active');
  });
});

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
  tooltip.classList.remove('active'); // Hide tooltip when toggling
};

//=======================================================================Student Page Script=========================================================//
// View Toggle Functionality
const listViewBtn = document.getElementById('list-view-btn');
const gridViewBtn = document.getElementById('grid-view-btn');
const listView = document.getElementById('students-list-view');
const gridView = document.getElementById('students-grid-view');

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

// Year Pagination
const yearBtns = document.querySelectorAll('.year-btn');

yearBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all year buttons
        yearBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // In a real application, this would filter students by the selected year
        const selectedYear = this.textContent;
        alert(`Showing students from ${selectedYear}`);
    });
});

// Scroll to Bottom Button
const scrollToBottomBtn = document.getElementById('scroll-to-bottom-btn');
const content = document.querySelector('.content');

if (scrollToBottomBtn && content) {
    scrollToBottomBtn.addEventListener('click', function() {
        content.scrollTo({
            top: content.scrollHeight,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll button based on scroll position
    content.addEventListener('scroll', function() {
        if (content.scrollTop > 100) {
            scrollToBottomBtn.style.display = 'flex';
        } else {
            scrollToBottomBtn.style.display = 'none';
        }
    });

    // Initially hide scroll button
    scrollToBottomBtn.style.display = 'none';
}

// Action Button Functions
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const action = this.querySelector('i').className;
        const studentName = this.closest('.student-row, .student-card').querySelector('.student-name').textContent;
        
        if (action.includes('edit')) {
            alert(`Edit student: ${studentName}`);
        } else if (action.includes('trash')) {
            if (confirm(`Are you sure you want to delete ${studentName}?`)) {
                alert(`Deleted student: ${studentName}`);
            }
        } else if (action.includes('file-alt')) {
            alert(`View report for: ${studentName}`);
        }
    });
});

// Export Button
document.querySelector('.export-btn').addEventListener('click', function() {
    alert('Exporting student data...');
});
// Set current date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});



// Handle sign in buttons
document.querySelectorAll('.btn-signin').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const arrivalTimeCell = row.querySelector('td:nth-child(4)');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        arrivalTimeCell.textContent = timeString;
        
        // Check if student is late (after 8:30 AM)
        const lateTime = new Date();
        lateTime.setHours(8, 30, 0, 0); // Set to 8:30 AM
        
        if (now > lateTime) {
            // Student is late
            this.className = 'btn btn-late';
            this.innerHTML = '<i class="fas fa-clock"></i> Late';
            this.disabled = true;
        } else {
            // Student is on time
            this.className = 'btn btn-signed';
            this.innerHTML = '<i class="fas fa-check"></i> Signed In';
            this.disabled = true;
        }
        
        // Enable sign out button
        row.querySelector('.btn-signout').disabled = false;
        
        // Update attendance counts
        updateAttendanceCounts();
    });
});

// Handle sign out buttons
document.querySelectorAll('.btn-signout').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const departTimeCell = row.querySelector('td:nth-child(6)');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        // Update depart time
        departTimeCell.textContent = timeString;
        
        // Update buttons
        this.disabled = true;
        this.className = 'btn btn-signed-out';
        this.innerHTML = '<i class="fas fa-check"></i> Signed Out';
        
        // Disable sign in/late button
        const signInButton = row.querySelector('.btn-signin, .btn-late, .btn-signed');
        signInButton.disabled = true;
        
        // Update attendance counts
        updateAttendanceCounts();
    });
});

function updateAttendanceCounts() {
    const totalStudents = document.querySelectorAll('.students-table tbody tr').length;
    const presentStudents = document.querySelectorAll('.btn-signed').length;
    const lateStudents = document.querySelectorAll('.btn-late').length;
    const absentStudents = totalStudents - presentStudents - lateStudents;
    
    document.querySelector('.summary-card.present h3').textContent = presentStudents;
    document.querySelector('.summary-card.absent h3').textContent = absentStudents;
    document.querySelector('.summary-card.late h3').textContent = lateStudents;
    document.querySelector('.summary-card.expected h3').textContent = totalStudents;
}

// Search functionality
document.querySelector('.search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('.students-table tbody tr');
    
    rows.forEach(row => {
        const studentName = row.querySelector('.student-name').textContent.toLowerCase();
        if (studentName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Sidebar navigation
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.sidebar-menu a').forEach(l => {
            l.classList.remove('active');
        });
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // In a real application, you would load the appropriate content here
        // For this example, we'll just show an alert
        const pageName = this.textContent.trim();
        if (pageName !== 'Attendance') {
            alert(`Navigation to ${pageName} page would happen here`);
        }
    });
});

const ctx = document.getElementById('skillsChart').getContext('2d');
const skillsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Technical Skill', 'Learning Activity', 'Active Contribution'],
        datasets: [{
            label: 'Skill Level',
            data: [75, 85, 65],
            backgroundColor: [
                'rgba(52, 152, 219, 0.7)',
                'rgba(46, 204, 113, 0.7)',
                'rgba(155, 89, 182, 0.7)'
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

// Calendar functionality
let currentMonth = 6; // July (0-indexed)
let currentYear = 2020;
const attendanceData = {
    // Sample attendance data for July 2020
    '2020-7-1': 'present',
    '2020-7-2': 'present',
    '2020-7-3': 'late',
    '2020-7-6': 'present',
    '2020-7-7': 'present',
    '2020-7-8': 'absent',
    '2020-7-9': 'present',
    '2020-7-10': 'present',
    '2020-7-13': 'present',
    '2020-7-14': 'late',
    '2020-7-15': 'present',
    '2020-7-16': 'present',
    '2020-7-17': 'present',
    '2020-7-20': 'present',
    '2020-7-21': 'present',
    '2020-7-22': 'absent',
    '2020-7-23': 'present',
    '2020-7-24': 'present',
    '2020-7-27': 'late',
    '2020-7-28': 'present',
    '2020-7-29': 'present',
    '2020-7-30': 'present',
};

function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendarGrid = document.getElementById('calendar-grid');
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
        
        // Check attendance status (display only)
        const dateStr = `${year}-${month + 1}-${i}`;
        if (attendanceData[dateStr]) {
            day.classList.add(attendanceData[dateStr]);
        }
        
        calendarGrid.appendChild(day);
    }
    
    // Add next month's leading days
    const totalCells = calendarGrid.children.length - 7; // Subtract day headers
    const remainingCells = 35 - totalCells; // 5 rows * 7 days - day headers
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarGrid.appendChild(day);
    }
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

// Initialize calendar
generateCalendar(currentMonth, currentYear);

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

// Update rating display when slider changes
document.getElementById('technical-skill').addEventListener('input', function() {
    document.getElementById('technical-value').textContent = this.value;
});

document.getElementById('learning-activity').addEventListener('input', function() {
    document.getElementById('learning-value').textContent = this.value;
});

document.getElementById('active-contribution').addEventListener('input', function() {
    document.getElementById('contribution-value').textContent = this.value;
});

// Submit rating function
function submitRating() {
    const technicalSkill = document.getElementById('technical-skill').value;
    const learningActivity = document.getElementById('learning-activity').value;
    const activeContribution = document.getElementById('active-contribution').value;
    
    // Update chart with new values
    skillsChart.data.datasets[0].data = [technicalSkill, learningActivity, activeContribution];
    skillsChart.update();
    
    // Show success message
    const button = document.querySelector('.submit-rating-btn');
    const originalText = button.textContent;
    button.textContent = 'Rating Submitted!';
    button.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#3498db';
    }, 2000);
}

// View profile functionality
function viewProfile(studentName) {
    alert(`Viewing profile for ${studentName}`);
}

// Export report functionality
function exportReport() {
    alert('Exporting report...');
    // In a real application, this would generate and download a report file
}

// Send report functionality
function sendReport() {
    alert('Sending report...');
    // In a real application, this would open a dialog to send the report via email
}


// ...existing code...

// Sidebar navigation page switching
document.querySelectorAll('.navigation ul li a[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Get the page id from data-page
        const pageId = this.getAttribute('data-page') + '-page';
        // Hide all page-content sections
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
        });
        // Show the selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = '';
        }
        // Optionally update active class on navigation
        document.querySelectorAll('.navigation ul li').forEach(item => {
            item.classList.remove('active');
        });
        this.parentElement.classList.add('active');
    });
});

// Show dashboard by default on load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    const dashboard = document.getElementById('dashboard-page');
    if (dashboard) dashboard.style.display = '';
});// ...existing code...

// Sidebar navigation page switching
document.querySelectorAll('.navigation ul li a[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Get the page id from data-page
        const pageId = this.getAttribute('data-page') + '-page';
        // Hide all page-content sections
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
        });
        // Show the selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = '';
        }
        // Optionally update active class on navigation
        document.querySelectorAll('.navigation ul li').forEach(item => {
            item.classList.remove('active');
        });
        this.parentElement.classList.add('active');

        // Update header title and visibility
        const pageHeader = document.querySelector('.page-header');
        const pageTitle = document.querySelector('.page-title');
        const currentDate = document.getElementById('currentDate');
        // Map data-page to header title
        const titles = {
            dashboard: 'Dashboard',
            students: 'Students',
            attendance: 'Attendance',
            reports: 'Reports',
            about: 'About'
        };
        // Hide header on settings page, show otherwise
        if (pageId === 'settings-page') {
            if (pageHeader) pageHeader.style.display = 'none';
        } else {
            if (pageHeader) pageHeader.style.display = '';
            if (pageTitle && titles[this.getAttribute('data-page')]) {
                pageTitle.textContent = titles[this.getAttribute('data-page')];
            }
            if (currentDate) {
                currentDate.textContent = new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        }
    });
});

// Show dashboard by default on load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    const dashboard = document.getElementById('dashboard-page');
    if (dashboard) dashboard.style.display = '';
    // Show header for dashboard
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) pageHeader.style.display = '';
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = 'Dashboard';
    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
});