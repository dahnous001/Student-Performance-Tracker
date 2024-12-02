document.addEventListener('DOMContentLoaded', () => {
    // Tab System
    function initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Welcome Screen Setup
    const form = document.getElementById('teacherSetupForm');
    const schoolIcon = document.getElementById('schoolIcon');
    const iconPreview = document.getElementById('iconPreview');
    const welcomeContainer = document.querySelector('.welcome-container');
    const mainHeader = document.querySelector('.main-header');
    const headerSchoolIcon = document.getElementById('headerSchoolIcon');
    const teacherNameDisplay = document.getElementById('teacherNameDisplay');
    const appNameDisplay = document.getElementById('appNameDisplay');
    const mainContent = document.querySelector('.main-content');

    // Handle file upload preview
    schoolIcon.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                iconPreview.src = e.target.result;
                iconPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const teacherName = document.getElementById('teacherName').value;
        const appName = document.getElementById('appName').value;
        const iconFile = schoolIcon.files[0];

        if (teacherName && iconFile && appName) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Update header with school icon, teacher name, and app name
                headerSchoolIcon.src = e.target.result;
                teacherNameDisplay.textContent = teacherName;
                appNameDisplay.textContent = appName;
                document.title = appName;

                // Hide welcome screen and show main header
                welcomeContainer.style.display = 'none';
                mainHeader.style.display = 'block';

                // Store data in localStorage for persistence
                localStorage.setItem('teacherName', teacherName);
                localStorage.setItem('schoolIcon', e.target.result);
                localStorage.setItem('appName', appName);
            };
            reader.readAsDataURL(iconFile);
        }
    });

    // Check if user data exists in localStorage
    const savedTeacherName = localStorage.getItem('teacherName');
    const savedSchoolIcon = localStorage.getItem('schoolIcon');
    const savedAppName = localStorage.getItem('appName');

    if (savedTeacherName && savedSchoolIcon && savedAppName) {
        teacherNameDisplay.textContent = savedTeacherName;
        headerSchoolIcon.src = savedSchoolIcon;
        appNameDisplay.textContent = savedAppName;
        document.title = savedAppName;
        welcomeContainer.style.display = 'none';
        mainHeader.style.display = 'block';
        mainContent.style.display = 'block';
        initializeTabs(); // Initialize tabs after showing main content
    }

    // Grade Management
    const addGradeBtn = document.getElementById('addGradeBtn');
    const gradesList = document.getElementById('gradesList');
    const notification = document.getElementById('notification');
    let grades = JSON.parse(localStorage.getItem('grades')) || [];

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function createGradeCard(grade) {
        const card = document.createElement('div');
        card.className = 'grade-card';
        card.innerHTML = `
            <span class="grade-info">Grade ${grade.number}${grade.class ? ' - ' + grade.class : ''}</span>
            <button class="delete-grade" data-grade="${grade.number}" data-class="${grade.class || ''}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        return card;
    }

    function renderGrades() {
        gradesList.innerHTML = '';
        grades.forEach(grade => {
            gradesList.appendChild(createGradeCard(grade));
        });
    }

    function addGrade(number, gradeClass) {
        const existingGrade = grades.find(g => 
            g.number === number && g.class === (gradeClass || '')
        );

        if (existingGrade) {
            showNotification('This grade already exists!', 'error');
            return;
        }

        const newGrade = {
            number: number,
            class: gradeClass || ''
        };

        grades.push(newGrade);
        localStorage.setItem('grades', JSON.stringify(grades));
        renderGrades();
        showNotification('Grade added successfully!', 'success');
    }

    function deleteGrade(number, gradeClass) {
        grades = grades.filter(g => 
            !(g.number === number && g.class === (gradeClass || ''))
        );
        localStorage.setItem('grades', JSON.stringify(grades));
        renderGrades();
        showNotification('Grade deleted successfully!', 'success');
    }

    addGradeBtn.addEventListener('click', () => {
        const gradeNumber = parseInt(document.getElementById('gradeNumber').value);
        const gradeClass = document.getElementById('gradeClass').value.trim().toUpperCase();

        if (!gradeNumber) {
            showNotification('Please enter a grade number!', 'error');
            return;
        }

        if (gradeNumber < 1 || gradeNumber > 12) {
            showNotification('Grade number must be between 1 and 12!', 'error');
            return;
        }

        if (gradeClass && !/^[A-Z]$/.test(gradeClass)) {
            showNotification('Class must be a single letter (A-Z)!', 'error');
            return;
        }

        addGrade(gradeNumber, gradeClass);
        document.getElementById('gradeNumber').value = '';
        document.getElementById('gradeClass').value = '';
    });

    gradesList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-grade')) {
            const button = e.target.closest('.delete-grade');
            const number = parseInt(button.dataset.grade);
            const gradeClass = button.dataset.class;
            deleteGrade(number, gradeClass);
        }
    });

    // Initial render of grades
    renderGrades();
    initializeTabs(); // Initialize tabs
});
