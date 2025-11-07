// ============================================
// Pragatix - Data Protection & Review Platform
// Vanilla JavaScript Implementation
// ============================================

(function() {
    'use strict';

    // ============================================
    // State Management
    // ============================================

    const state = {
        reviews: [],
        filteredReviews: [],
        currentPage: 1,
        itemsPerPage: 10,
        searchQuery: '',
        statusFilter: 'all',
        nextReviewId: 1
    };

    // Sample data for reviews
    const sampleReviews = [
        {
            id: 'REV-001',
            dataSource: 'Customer Database',
            status: 'completed',
            priority: 'high',
            created: '2024-01-15',
            description: 'Quarterly customer data review completed successfully'
        },
        {
            id: 'REV-002',
            dataSource: 'Financial Records',
            status: 'in-progress',
            priority: 'critical',
            created: '2024-01-16',
            description: 'Monthly financial records audit in progress'
        },
        {
            id: 'REV-003',
            dataSource: 'Employee Files',
            status: 'pending',
            priority: 'medium',
            created: '2024-01-17',
            description: 'Annual employee file review scheduled'
        },
        {
            id: 'REV-004',
            dataSource: 'Transaction Logs',
            status: 'flagged',
            priority: 'critical',
            created: '2024-01-18',
            description: 'Suspicious activity detected in transaction logs'
        },
        {
            id: 'REV-005',
            dataSource: 'Backup Systems',
            status: 'completed',
            priority: 'high',
            created: '2024-01-19',
            description: 'Backup system integrity check completed'
        },
        {
            id: 'REV-006',
            dataSource: 'API Endpoints',
            status: 'in-progress',
            priority: 'medium',
            created: '2024-01-20',
            description: 'Security review of API endpoints'
        },
        {
            id: 'REV-007',
            dataSource: 'Cloud Storage',
            status: 'pending',
            priority: 'low',
            created: '2024-01-21',
            description: 'Cloud storage access review pending'
        },
        {
            id: 'REV-008',
            dataSource: 'Network Traffic',
            status: 'completed',
            priority: 'medium',
            created: '2024-01-22',
            description: 'Network traffic analysis completed'
        },
        {
            id: 'REV-009',
            dataSource: 'User Permissions',
            status: 'in-progress',
            priority: 'high',
            created: '2024-01-23',
            description: 'User permission audit in progress'
        },
        {
            id: 'REV-010',
            dataSource: 'Compliance Reports',
            status: 'pending',
            priority: 'medium',
            created: '2024-01-24',
            description: 'GDPR compliance review scheduled'
        },
        {
            id: 'REV-011',
            dataSource: 'Security Logs',
            status: 'completed',
            priority: 'high',
            created: '2024-01-25',
            description: 'Security log analysis completed'
        },
        {
            id: 'REV-012',
            dataSource: 'Data Retention',
            status: 'flagged',
            priority: 'critical',
            created: '2024-01-26',
            description: 'Data retention policy violation detected'
        }
    ];

    // Sample activity data
    const sampleActivities = [
        {
            type: 'info',
            title: 'New review created',
            time: '2 minutes ago',
            icon: 'info'
        },
        {
            type: 'success',
            title: 'Data backup completed',
            time: '15 minutes ago',
            icon: 'success'
        },
        {
            type: 'warning',
            title: 'High priority review flagged',
            time: '1 hour ago',
            icon: 'warning'
        },
        {
            type: 'info',
            title: 'System update installed',
            time: '2 hours ago',
            icon: 'info'
        },
        {
            type: 'success',
            title: 'Security scan completed',
            time: '3 hours ago',
            icon: 'success'
        }
    ];

    // ============================================
    // DOM Elements (will be initialized after DOM is ready)
    // ============================================

    let elements = {};

    // ============================================
    // Utility Functions
    // ============================================

    /**
     * Format date to readable string
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    /**
     * Generate unique review ID
     */
    function generateReviewId() {
        const num = state.nextReviewId++;
        return `REV-${String(num).padStart(3, '0')}`;
    }

    /**
     * Show loading spinner
     */
    function showLoading() {
        if (elements.loadingSpinner) {
            elements.loadingSpinner.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Hide loading spinner
     */
    function hideLoading() {
        if (elements.loadingSpinner) {
            elements.loadingSpinner.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Debounce function for search
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // Navigation Functions
    // ============================================

    /**
     * Initialize mobile menu toggle
     */
    function initMobileMenu() {
        if (!elements.mobileMenuToggle || !elements.navMenu) return;

        elements.mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            elements.navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        elements.navLinks.forEach(link => {
            link.addEventListener('click', function() {
                elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
                elements.navMenu.classList.remove('active');
            });
        });
    }

    /**
     * Initialize smooth scrolling for navigation links
     */
    function initSmoothScroll() {
        if (!elements.navLinks || elements.navLinks.length === 0) return;
        
        elements.navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 72; // Account for navbar height
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * Update active navigation link based on scroll position
     */
    function initActiveNavLink() {
        if (!elements.navLinks || elements.navLinks.length === 0) return;
        
        const sections = document.querySelectorAll('section[id]');
        
        function updateActiveLink() {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    elements.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', debounce(updateActiveLink, 100));
        updateActiveLink(); // Initial call
    }

    // ============================================
    // Statistics Animation
    // ============================================

    /**
     * Animate statistics numbers
     */
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseFloat(element.getAttribute('data-target'));
                    animateNumber(element, target);
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    /**
     * Animate number from 0 to target
     */
    function animateNumber(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number based on target
            if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString();
            } else if (target < 1) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ============================================
    // Reviews Management
    // ============================================

    /**
     * Initialize reviews data
     */
    function initReviews() {
        state.reviews = [...sampleReviews];
        state.filteredReviews = [...state.reviews];
        state.nextReviewId = state.reviews.length + 1;
        renderReviews();
        renderPagination();
    }

    /**
     * Filter and search reviews
     */
    function filterReviews() {
        let filtered = [...state.reviews];

        // Apply search filter
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(review => 
                review.id.toLowerCase().includes(query) ||
                review.dataSource.toLowerCase().includes(query) ||
                review.description.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (state.statusFilter !== 'all') {
            filtered = filtered.filter(review => review.status === state.statusFilter);
        }

        state.filteredReviews = filtered;
        state.currentPage = 1;
        renderReviews();
        renderPagination();
    }

    /**
     * Render reviews table
     */
    function renderReviews() {
        if (!elements.reviewsTbody) return;

        const start = (state.currentPage - 1) * state.itemsPerPage;
        const end = start + state.itemsPerPage;
        const pageReviews = state.filteredReviews.slice(start, end);

        if (pageReviews.length === 0) {
            elements.reviewsTbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">
                        No reviews found matching your criteria.
                    </td>
                </tr>
            `;
            return;
        }

        elements.reviewsTbody.innerHTML = pageReviews.map(review => `
            <tr>
                <td><strong>${escapeHtml(review.id)}</strong></td>
                <td>${escapeHtml(review.dataSource)}</td>
                <td>
                    <span class="review-status ${review.status}">
                        ${formatStatus(review.status)}
                    </span>
                </td>
                <td>
                    <span class="review-priority ${review.priority}">
                        ${formatPriority(review.priority)}
                    </span>
                </td>
                <td>${formatDate(review.created)}</td>
                <td>
                    <div class="review-actions">
                        <button class="action-btn" aria-label="View ${review.id}" title="View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="action-btn" aria-label="Edit ${review.id}" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="action-btn" aria-label="Delete ${review.id}" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners to action buttons
        const actionButtons = elements.reviewsTbody.querySelectorAll('.action-btn');
        actionButtons.forEach((btn, index) => {
            const actionIndex = index % 3;
            const reviewIndex = Math.floor(index / 3);
            const review = pageReviews[reviewIndex];

            btn.addEventListener('click', () => {
                if (actionIndex === 0) {
                    viewReview(review);
                } else if (actionIndex === 1) {
                    editReview(review);
                } else if (actionIndex === 2) {
                    deleteReview(review);
                }
            });
        });
    }

    /**
     * Format status text
     */
    function formatStatus(status) {
        const statusMap = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'flagged': 'Flagged'
        };
        return statusMap[status] || status;
    }

    /**
     * Format priority text
     */
    function formatPriority(priority) {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Render pagination
     */
    function renderPagination() {
        if (!elements.pagination) return;

        const totalPages = Math.ceil(state.filteredReviews.length / state.itemsPerPage);
        
        if (totalPages <= 1) {
            elements.pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button class="pagination-btn" 
                    ${state.currentPage === 1 ? 'disabled' : ''} 
                    data-page="${state.currentPage - 1}"
                    aria-label="Previous page">
                Previous
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= state.currentPage - 1 && i <= state.currentPage + 1)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === state.currentPage ? 'active' : ''}" 
                            data-page="${i}"
                            aria-label="Page ${i}"
                            ${i === state.currentPage ? 'aria-current="page"' : ''}>
                        ${i}
                    </button>
                `;
            } else if (i === state.currentPage - 2 || i === state.currentPage + 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Next button
        paginationHTML += `
            <button class="pagination-btn" 
                    ${state.currentPage === totalPages ? 'disabled' : ''} 
                    data-page="${state.currentPage + 1}"
                    aria-label="Next page">
                Next
            </button>
        `;

        elements.pagination.innerHTML = paginationHTML;

        // Add event listeners
        const paginationButtons = elements.pagination.querySelectorAll('.pagination-btn:not([disabled])');
        paginationButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                if (page && page !== state.currentPage) {
                    state.currentPage = page;
                    renderReviews();
                    renderPagination();
                    // Scroll to reviews section
                    const reviewsSection = document.getElementById('reviews');
                    if (reviewsSection) {
                        const offsetTop = reviewsSection.offsetTop - 72;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    /**
     * View review details
     */
    function viewReview(review) {
        alert(`Review Details:\n\nID: ${review.id}\nSource: ${review.dataSource}\nStatus: ${formatStatus(review.status)}\nPriority: ${formatPriority(review.priority)}\nCreated: ${formatDate(review.created)}\n\nDescription: ${review.description}`);
    }

    /**
     * Edit review
     */
    function editReview(review) {
        // For now, just show an alert
        // In a real application, this would open an edit modal
        alert(`Edit functionality for ${review.id} would open here.`);
    }

    /**
     * Delete review
     */
    function deleteReview(review) {
        if (confirm(`Are you sure you want to delete review ${review.id}?`)) {
            state.reviews = state.reviews.filter(r => r.id !== review.id);
            filterReviews();
            addActivity('info', `Review ${review.id} deleted`);
        }
    }

    // ============================================
    // Modal Functions
    // ============================================

    /**
     * Initialize modal
     */
    function initModal() {
        if (!elements.reviewModal) return;

        // Open modal
        if (elements.newReviewBtn) {
            elements.newReviewBtn.addEventListener('click', () => {
                openModal();
            });
        }

        // Close modal
        function closeModal() {
            elements.reviewModal.setAttribute('aria-hidden', 'true');
            elements.reviewForm.reset();
        }

        if (elements.modalClose) {
            elements.modalClose.addEventListener('click', closeModal);
        }

        if (elements.cancelReviewBtn) {
            elements.cancelReviewBtn.addEventListener('click', closeModal);
        }

        // Close on overlay click
        const overlay = elements.reviewModal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.reviewModal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });

        // Handle form submission
        if (elements.reviewForm) {
            elements.reviewForm.addEventListener('submit', handleFormSubmit);
        }
    }

    /**
     * Open modal
     */
    function openModal() {
        if (elements.reviewModal) {
            elements.reviewModal.setAttribute('aria-hidden', 'false');
            // Focus on first input
            const firstInput = elements.reviewForm.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(elements.reviewForm);
        const newReview = {
            id: generateReviewId(),
            dataSource: formData.get('data-source'),
            priority: formData.get('priority'),
            status: 'pending',
            created: new Date().toISOString().split('T')[0],
            description: formData.get('description') || ''
        };

        // Add to reviews
        state.reviews.unshift(newReview);
        filterReviews();

        // Close modal
        elements.reviewModal.setAttribute('aria-hidden', 'true');
        elements.reviewForm.reset();

        // Show success message
        addActivity('success', `New review ${newReview.id} created`);
        
        // Scroll to reviews section
        const reviewsSection = document.getElementById('reviews');
        if (reviewsSection) {
            reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ============================================
    // Activity Feed
    // ============================================

    /**
     * Initialize activity feed
     */
    function initActivityFeed() {
        if (!elements.activityList) return;

        // Render initial activities
        renderActivities();

        // Simulate new activities
        setInterval(() => {
            if (Math.random() > 0.7) {
                const activities = [
                    { type: 'info', title: 'System check completed', icon: 'info' },
                    { type: 'success', title: 'Data review in progress', icon: 'success' },
                    { type: 'warning', title: 'New review requires attention', icon: 'warning' }
                ];
                const activity = activities[Math.floor(Math.random() * activities.length)];
                addActivity(activity.type, activity.title, activity.icon);
            }
        }, 30000); // Every 30 seconds
    }

    /**
     * Render activities
     */
    function renderActivities() {
        if (!elements.activityList) return;

        const activitiesToShow = sampleActivities.slice(0, 5);
        
        elements.activityList.innerHTML = activitiesToShow.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${getActivityIcon(activity.icon || activity.type)}
                    </svg>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${escapeHtml(activity.title)}</div>
                    <div class="activity-time">${escapeHtml(activity.time)}</div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Add new activity
     */
    function addActivity(type, title, icon) {
        if (!elements.activityList) return;

        const activity = {
            type: type,
            title: title,
            time: 'Just now',
            icon: icon || type
        };

        // Add to beginning of list
        const activityHTML = `
            <div class="activity-item activity-item-new">
                <div class="activity-icon ${activity.type}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${getActivityIcon(activity.icon)}
                    </svg>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${escapeHtml(activity.title)}</div>
                    <div class="activity-time">${escapeHtml(activity.time)}</div>
                </div>
            </div>
        `;

        elements.activityList.insertAdjacentHTML('afterbegin', activityHTML);

        // Remove animation class after animation completes
        const newActivityItem = elements.activityList.querySelector('.activity-item-new');
        if (newActivityItem) {
            setTimeout(() => {
                newActivityItem.classList.remove('activity-item-new');
            }, 300);
        }

        // Remove last item if more than 5
        const items = elements.activityList.querySelectorAll('.activity-item');
        if (items.length > 5) {
            items[items.length - 1].remove();
        }

        // Update time after 1 minute for the newly added item
        if (newActivityItem) {
            setTimeout(() => {
                const timeElement = newActivityItem.querySelector('.activity-time');
                if (timeElement) {
                    timeElement.textContent = '1 minute ago';
                }
            }, 60000);
        }
    }

    /**
     * Get activity icon SVG
     */
    function getActivityIcon(type) {
        const icons = {
            info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
            success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
            warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
        };
        return icons[type] || icons.info;
    }

    // ============================================
    // Search and Filter
    // ============================================

    /**
     * Initialize search and filter
     */
    function initSearchAndFilter() {
        // Search input
        if (elements.reviewSearch) {
            const debouncedSearch = debounce((e) => {
                state.searchQuery = e.target.value;
                filterReviews();
            }, 300);

            elements.reviewSearch.addEventListener('input', debouncedSearch);
        }

        // Status filter
        if (elements.statusFilter) {
            elements.statusFilter.addEventListener('change', (e) => {
                state.statusFilter = e.target.value;
                filterReviews();
            });
        }
    }

    // ============================================
    // Hero Actions
    // ============================================

    /**
     * Initialize hero action buttons
     */
    function initHeroActions() {
        const getStartedBtn = document.querySelector('.hero-actions .btn-primary');
        const learnMoreBtn = document.querySelector('.hero-actions .btn-secondary');

        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                const reviewsSection = document.getElementById('reviews');
                if (reviewsSection) {
                    reviewsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // ============================================
    // Mobile Menu Styles (Dynamic)
    // ============================================

    /**
     * Add mobile menu styles dynamically
     */
    function addMobileMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 767px) {
                .nav-menu {
                    position: fixed;
                    top: var(--navbar-height);
                    left: 0;
                    right: 0;
                    background-color: white;
                    flex-direction: column;
                    padding: var(--spacing-lg);
                    box-shadow: var(--shadow-lg);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all var(--transition-base);
                    border-bottom: 1px solid var(--gray-200);
                }

                .nav-menu.active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }

                .nav-menu li {
                    width: 100%;
                }

                .nav-link {
                    display: block;
                    padding: var(--spacing-md);
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // Performance Optimizations
    // ============================================

    /**
     * Lazy load images (if any are added in the future)
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ============================================
    // Accessibility Enhancements
    // ============================================

    /**
     * Initialize keyboard navigation
     */
    function initKeyboardNavigation() {
        // Trap focus in modal
        document.addEventListener('keydown', (e) => {
            if (elements.reviewModal && elements.reviewModal.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'Tab') {
                    const focusableElements = elements.reviewModal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // ============================================
    // Initialize Application
    // ============================================

    /**
     * Initialize progress bars from data attributes
     */
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill[data-width]');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width) {
                bar.style.width = width + '%';
            }
        });
    }

    /**
     * Initialize DOM elements
     */
    function initElements() {
        elements = {
            mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
            navMenu: document.querySelector('.nav-menu'),
            navLinks: document.querySelectorAll('.nav-link'),
            reviewSearch: document.getElementById('review-search'),
            statusFilter: document.getElementById('status-filter'),
            newReviewBtn: document.getElementById('new-review-btn'),
            reviewModal: document.getElementById('review-modal'),
            reviewForm: document.getElementById('review-form'),
            cancelReviewBtn: document.getElementById('cancel-review'),
            modalClose: document.querySelector('.modal-close'),
            reviewsTbody: document.getElementById('reviews-tbody'),
            pagination: document.getElementById('pagination'),
            activityList: document.getElementById('activity-list'),
            loadingSpinner: document.getElementById('loading-spinner')
        };
    }

    /**
     * Initialize all functionality
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize DOM elements first
        initElements();

        // Initialize all modules
        addMobileMenuStyles();
        initMobileMenu();
        initSmoothScroll();
        initActiveNavLink();
        initHeroActions();
        initReviews();
        initSearchAndFilter();
        initModal();
        initActivityFeed();
        animateStats();
        initLazyLoading();
        initKeyboardNavigation();
        initProgressBars();

        // Hide loading spinner if visible
        hideLoading();

        console.log('Pragatix application initialized successfully');
    }

    // Start the application
    init();

})();

