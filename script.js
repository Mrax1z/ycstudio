// PhotoBooking System - Main JavaScript File
// Ini adalah sistem booking fotografi dan videografi dengan live chat dan WhatsApp integration

class PhotoBookingSystem {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeBookingSystem();
        this.initializeTestimonials();
        this.checkAdminStatus();
        this.initializeAnimations();
        this.initializePortfolioFilters(); // Tambah inisialisasi filter portfolio baru
        this.initializeVideoControls(); // Tambah kontrol video
        this.currentStep = 1;
        this.selectedPackage = 'professional';
        this.currentSlide = 0;
        this.isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    }

    initializeElements() {
        // DOM Elements
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navLinks = document.getElementById('nav-links');
        this.header = document.getElementById('header');
        
        // Booking System Elements
        this.steps = document.querySelectorAll('.step');
        this.bookingForms = document.querySelectorAll('.booking-form');
        this.packageOptions = document.querySelectorAll('.package-option');
        this.btnSelectPackage = document.querySelectorAll('.btn-select-package');
        
        // Testimonial Slider Elements
        this.testimonialSlides = document.querySelectorAll('.testimonial-slide');
        this.sliderDots = document.querySelectorAll('.slider-dot');

        // Portfolio items
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        
        // Admin Access
        this.adminAccessBtn = document.getElementById('admin-access-btn');
        this.adminLoginModal = document.getElementById('admin-login-modal');
        this.adminLoginClose = document.getElementById('admin-login-close');
        this.adminLoginBtn = document.getElementById('admin-login-btn');
        
        // Payment elements
        this.paymentOptions = document.querySelectorAll('.payment-option');
    }

    // Inisialisasi filter portfolio berdasarkan kategori
    initializePortfolioFilters() {
        // Portfolio filter elements berdasarkan kategori
        this.filterAllBtn = document.getElementById('filter-all');
        this.filterWeddingBtn = document.getElementById('filter-wedding');
        this.filterProductBtn = document.getElementById('filter-product');
        this.filterEventBtn = document.getElementById('filter-event');
        this.filterPortraitBtn = document.getElementById('filter-portrait');
        
        // Setup portfolio filter event listeners
        this.setupPortfolioFilterListeners();
    }

    setupPortfolioFilterListeners() {
        // Portfolio filter events berdasarkan kategori
        if (this.filterAllBtn) {
            this.filterAllBtn.addEventListener('click', () => this.filterPortfolioByCategory('all'));
        }
        if (this.filterWeddingBtn) {
            this.filterWeddingBtn.addEventListener('click', () => this.filterPortfolioByCategory('wedding'));
        }
        if (this.filterProductBtn) {
            this.filterProductBtn.addEventListener('click', () => this.filterPortfolioByCategory('product'));
        }
        if (this.filterEventBtn) {
            this.filterEventBtn.addEventListener('click', () => this.filterPortfolioByCategory('event'));
        }
        if (this.filterPortraitBtn) {
            this.filterPortraitBtn.addEventListener('click', () => this.filterPortfolioByCategory('portrait'));
        }
    }

    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && this.navLinks) {
                const isOpen = this.navLinks.classList.contains('active') || this.navLinks.classList.contains('open');
                if (!isOpen) return;
                const clickedInside = this.navLinks.contains(e.target) || (this.mobileMenuBtn && this.mobileMenuBtn.contains(e.target));
                if (!clickedInside) this.closeMobileMenu();
            }
        });
        
        // Admin access button
        this.adminAccessBtn.addEventListener('click', () => this.showAdminLogin());
        this.adminLoginClose.addEventListener('click', () => this.hideAdminLogin());
        this.adminLoginBtn.addEventListener('click', () => this.handleAdminLogin());
        
        // Close modal when clicking outside
        this.adminLoginModal.addEventListener('click', (e) => {
            if (e.target === this.adminLoginModal) {
                this.hideAdminLogin();
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e, anchor));
        });
        
        // Initialize animations on load
        window.addEventListener('load', () => this.initializeOnLoad());
    }

    // Method untuk filter portfolio berdasarkan kategori
    filterPortfolioByCategory(category) {
        if (!this.portfolioItems) return;
        
        // Toggle active class on buttons
        const setActive = (btn) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
        };
        
        // Set active button based on category
        if (category === 'all') setActive(this.filterAllBtn);
        if (category === 'wedding') setActive(this.filterWeddingBtn);
        if (category === 'product') setActive(this.filterProductBtn);
        if (category === 'event') setActive(this.filterEventBtn);
        if (category === 'portrait') setActive(this.filterPortraitBtn);
        
        // Filter portfolio items by category
        this.portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category') || 'all';
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                // Add fade-in animation
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Inisialisasi kontrol video untuk portfolio
    initializeVideoControls() {
        // Portfolio video play/pause handlers
        if (this.portfolioItems && this.portfolioItems.length) {
            this.portfolioItems.forEach(item => {
                const videoEl = item.querySelector('video');
                const playIcon = item.querySelector('.play-icon');
                
                if (videoEl && playIcon) {
                    // Update onclick to use the new method
                    playIcon.onclick = (e) => {
                        e.stopPropagation();
                        this.toggleVideo(videoEl, playIcon);
                    };
                    
                    videoEl.onclick = (e) => {
                        e.stopPropagation();
                        this.toggleVideo(videoEl, playIcon);
                    };
                    
                    videoEl.addEventListener('play', () => {
                        if (playIcon) {
                            playIcon.innerHTML = '<i class="fas fa-pause"></i>';
                            playIcon.style.opacity = '0.7';
                        }
                        // Pause other videos
                        this.pauseOtherVideos(videoEl);
                    });
                    
                    videoEl.addEventListener('pause', () => {
                        if (playIcon) {
                            playIcon.innerHTML = '<i class="fas fa-play"></i>';
                            playIcon.style.opacity = '1';
                        }
                    });
                    
                    videoEl.addEventListener('ended', () => {
                        if (playIcon) {
                            playIcon.innerHTML = '<i class="fas fa-play"></i>';
                            playIcon.style.opacity = '1';
                        }
                        videoEl.currentTime = 0;
                    });
                    
                    // Show controls on hover for desktop
                    if (window.innerWidth > 768) {
                        item.addEventListener('mouseenter', () => {
                            playIcon.style.opacity = '1';
                        });
                        
                        item.addEventListener('mouseleave', () => {
                            if (!videoEl.paused) {
                                playIcon.style.opacity = '0.7';
                            } else {
                                playIcon.style.opacity = '1';
                            }
                        });
                    }
                }
            });
        }
    }

    // Method untuk pause video lainnya
    pauseOtherVideos(currentVideo) {
        document.querySelectorAll('.portfolio-item video').forEach(video => {
            if (video !== currentVideo) {
                video.pause();
                const playIcon = video.closest('.portfolio-item')?.querySelector('.play-icon');
                if (playIcon) {
                    playIcon.innerHTML = '<i class="fas fa-play"></i>';
                    playIcon.style.opacity = '1';
                }
            }
        });
    }

    // Update toggleVideo method
    toggleVideo(videoEl, iconEl) {
        if (!videoEl) return;
        
        if (videoEl.paused) {
            videoEl.play();
            if (iconEl) {
                iconEl.innerHTML = '<i class="fas fa-pause"></i>';
            }
            // Pause other videos
            this.pauseOtherVideos(videoEl);
        } else {
            videoEl.pause();
            if (iconEl) {
                iconEl.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }

    // Metode-metode lainnya tetap sama...
    initializeBookingSystem() {
        // Package selection
        this.packageOptions.forEach(option => {
            option.addEventListener('click', () => this.selectPackage(option));
        });
        
        // Package selection buttons in pricing section
        this.btnSelectPackage.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const packageType = btn.getAttribute('data-package');
                this.selectPackageFromButton(packageType);
                // Scroll to booking section
                document.getElementById('booking-flow').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Step navigation
        document.getElementById('next-to-step-2')?.addEventListener('click', () => this.goToStep(2));
        document.getElementById('next-to-step-3')?.addEventListener('click', () => this.goToStep(3));
        document.getElementById('next-to-step-4')?.addEventListener('click', () => this.goToStep(4));
        document.getElementById('next-to-step-5')?.addEventListener('click', () => this.goToStep(5));
        document.getElementById('back-to-step-1')?.addEventListener('click', () => this.goToStep(1));
        document.getElementById('back-to-step-2')?.addEventListener('click', () => this.goToStep(2));
        document.getElementById('back-to-step-3')?.addEventListener('click', () => this.goToStep(3));
        document.getElementById('back-to-step-4')?.addEventListener('click', () => this.goToStep(4));
        
        // Submit booking
        document.getElementById('submit-booking')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitBooking();
        });
        
        // Payment method selection
        this.paymentOptions.forEach(option => {
            option.addEventListener('click', () => this.selectPaymentMethod(option));
        });
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const eventDateInput = document.getElementById('event-date');
        if (eventDateInput) {
            eventDateInput.min = today;
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            eventDateInput.value = tomorrow.toISOString().split('T')[0];
        }
    }

    initializeTestimonials() {
        // Testimonial slider functionality
        this.sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showSlide(index));
        });
        
        // Auto-advance slides every 5 seconds
        setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.testimonialSlides.length;
            this.showSlide(this.currentSlide);
        }, 5000);
    }

    initializeAnimations() {
        // Initialize elements with animation
        document.querySelectorAll('.service-card, .portfolio-item, .pricing-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }

    handleScroll() {
        // Header scroll effect
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Add fade-in animation on scroll
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    toggleMobileMenu() {
        if (!this.navLinks) return;
        this.navLinks.classList.toggle('active');
        this.navLinks.classList.toggle('open');
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.innerHTML = (this.navLinks.classList.contains('open') || this.navLinks.classList.contains('active'))
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        }
    }

    closeMobileMenu() {
        if (!this.navLinks) return;
        this.navLinks.classList.remove('active');
        this.navLinks.classList.remove('open');
        if (this.mobileMenuBtn) this.mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }

    showAdminLogin() {
        this.adminLoginModal.classList.add('active');
        document.getElementById('admin-username').focus();
    }

    hideAdminLogin() {
        this.adminLoginModal.classList.remove('active');
    }

    handleAdminLogin() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        // Demo credentials
        if (username === 'admin' && password === 'password123') {
            localStorage.setItem('isAdminLoggedIn', 'true');
            this.isAdminLoggedIn = true;
            this.hideAdminLogin();
            window.location.href = 'admin.html';
        } else {
            alert('Invalid credentials. Use admin / password123 for demo.');
        }
    }

    handleSmoothScroll(e, anchor) {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        }
    }

    selectPackage(option) {
        this.packageOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedPackage = option.getAttribute('data-package');
        this.updatePaymentSummary();
    }

    selectPaymentMethod(option) {
        this.paymentOptions.forEach(opt => {
            opt.classList.remove('selected');
            opt.querySelector('.payment-radio i').className = 'far fa-circle';
        });
        option.classList.add('selected');
        option.querySelector('.payment-radio i').className = 'fas fa-check-circle';
        
        // Show corresponding payment instructions
        const method = option.getAttribute('data-method');
        document.querySelectorAll('.payment-instructions').forEach(instruction => {
            instruction.classList.remove('active');
        });
        const instructionElement = document.getElementById(`${method}-instructions`);
        if (instructionElement) {
            instructionElement.classList.add('active');
        }
        
        this.updatePaymentSummary();
    }

    selectPackageFromButton(packageType) {
        // Find and select the corresponding package option
        this.packageOptions.forEach(option => {
            if (option.getAttribute('data-package') === packageType.toLowerCase()) {
                option.classList.add('selected');
                this.selectedPackage = packageType.toLowerCase();
            } else {
                option.classList.remove('selected');
            }
        });
        
        this.updatePaymentSummary();
        this.goToStep(1);
    }

    goToStep(step) {
        // Validate current step before proceeding
        if (step > 1 && !this.validateStep(step - 1)) {
            return;
        }
        
        // Special validation for step 5 (payment confirmation)
        if (step === 5) {
            const paymentConfirm = document.getElementById('payment-confirm');
            if (paymentConfirm && !paymentConfirm.checked) {
                alert('Please confirm that you have made the payment');
                return;
            }
        }
        
        // Update steps
        this.steps.forEach(s => {
            s.classList.remove('active', 'completed');
        });
        
        for (let i = 0; i < step; i++) {
            if (this.steps[i]) {
                this.steps[i].classList.add('completed');
            }
        }
        
        if (this.steps[step-1]) {
            this.steps[step-1].classList.add('active');
        }
        
        // Update forms
        this.bookingForms.forEach(form => form.classList.remove('active'));
        const formStep = document.getElementById(`form-step-${step}`);
        if (formStep) {
            formStep.classList.add('active');
        }
        
        this.currentStep = step;
        
        // Update summary on step 5
        if (step === 5) {
            this.updateBookingSummary();
        }
        
        // Update payment summary on step 4
        if (step === 4) {
            this.updatePaymentSummary();
        }
        
        // Scroll to top of booking form
        document.querySelector('.booking-form-container')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    validateStep(step) {
        if (step === 1) {
            // Step 1 validation - package selected
            if (!this.selectedPackage) {
                alert('Please select a package before proceeding.');
                return false;
            }
            return true;
        } else if (step === 2) {
            // Step 2 validation - client details
            const name = document.getElementById('client-name')?.value;
            const email = document.getElementById('client-email')?.value;
            const phone = document.getElementById('client-phone')?.value;
            const eventType = document.getElementById('event-type')?.value;
            
            if (!name || !email || !phone || !eventType) {
                alert('Please fill in all required fields.');
                return false;
            }
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return false;
            }
            
            return true;
        } else if (step === 3) {
            // Step 3 validation - date and time
            const date = document.getElementById('event-date')?.value;
            const time = document.getElementById('event-time')?.value;
            const location = document.getElementById('event-location')?.value;
            
            if (!date || !time || !location) {
                alert('Please fill in all required fields.');
                return false;
            }
            
            return true;
        }
        
        return true;
    }

    updatePaymentSummary() {
        // Get selected package
        const selectedPackage = document.querySelector('.package-option.selected');
        if (!selectedPackage) return;
        
        const packageName = selectedPackage.querySelector('h4').textContent;
        const packagePrice = selectedPackage.querySelector('.package-price').textContent;
        
        // Get selected payment method
        const selectedPayment = document.querySelector('.payment-option.selected');
        const paymentMethod = selectedPayment?.querySelector('h5')?.textContent || 'Bank Transfer';
        
        // Update payment summary
        const paymentPackageEl = document.getElementById('payment-package');
        const paymentTotalEl = document.getElementById('payment-total');
        const paymentAmountEl = document.getElementById('payment-amount');
        
        if (paymentPackageEl) paymentPackageEl.textContent = `${packageName} - ${packagePrice}`;
        if (paymentTotalEl) paymentTotalEl.textContent = packagePrice;
        if (paymentAmountEl) paymentAmountEl.textContent = packagePrice;
        
        // Update amounts in payment instructions
        const bankAmountEl = document.getElementById('bank-amount');
        const qrisAmountEl = document.getElementById('qris-amount');
        const danaAmountEl = document.getElementById('dana-amount');
        const gopayAmountEl = document.getElementById('gopay-amount');
        
        if (bankAmountEl) bankAmountEl.textContent = packagePrice;
        if (qrisAmountEl) qrisAmountEl.textContent = packagePrice;
        if (danaAmountEl) danaAmountEl.textContent = packagePrice;
        if (gopayAmountEl) gopayAmountEl.textContent = packagePrice;
    }

    updateBookingSummary() {
        // Get selected package
        const selectedPackage = document.querySelector('.package-option.selected');
        let packageText = 'Professional - $800';
        let packagePrice = '$800';
        
        if (selectedPackage) {
            packageText = `${selectedPackage.querySelector('h4').textContent} - ${selectedPackage.querySelector('.package-price').textContent}`;
            packagePrice = selectedPackage.querySelector('.package-price').textContent;
        }
        
        // Update summary elements
        const summaryPackageEl = document.getElementById('summary-package');
        const summaryNameEl = document.getElementById('summary-name');
        const summaryEmailEl = document.getElementById('summary-email');
        const summaryPhoneEl = document.getElementById('summary-phone');
        const summaryDateEl = document.getElementById('summary-date');
        const summaryTimeEl = document.getElementById('summary-time');
        const summaryLocationEl = document.getElementById('summary-location');
        const summaryPaymentMethodEl = document.getElementById('summary-payment-method');
        
        if (summaryPackageEl) summaryPackageEl.textContent = packageText;
        if (summaryNameEl) summaryNameEl.textContent = document.getElementById('client-name')?.value || 'Not provided';
        if (summaryEmailEl) summaryEmailEl.textContent = document.getElementById('client-email')?.value || 'Not provided';
        if (summaryPhoneEl) summaryPhoneEl.textContent = document.getElementById('client-phone')?.value || 'Not provided';
        
        // Format date
        const dateValue = document.getElementById('event-date')?.value;
        let formattedDate = 'Not selected';
        if (dateValue) {
            const date = new Date(dateValue);
            formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        if (summaryDateEl) summaryDateEl.textContent = formattedDate;
        
        // Get time text
        const timeSelect = document.getElementById('event-time');
        const timeText = timeSelect?.options[timeSelect.selectedIndex]?.text || 'Not selected';
        if (summaryTimeEl) summaryTimeEl.textContent = timeText;
        
        if (summaryLocationEl) summaryLocationEl.textContent = document.getElementById('event-location')?.value || 'Not provided';
        
        // Get payment method
        const selectedPayment = document.querySelector('.payment-option.selected');
        const paymentMethod = selectedPayment?.querySelector('h5')?.textContent || 'Bank Transfer';
        if (summaryPaymentMethodEl) summaryPaymentMethodEl.textContent = paymentMethod;
    }

    saveBookingToStorage(packageText, packagePrice) {
        const bookingData = {
            id: Date.now(),
            package: packageText,
            price: packagePrice,
            clientName: document.getElementById('client-name')?.value,
            clientEmail: document.getElementById('client-email')?.value,
            clientPhone: document.getElementById('client-phone')?.value,
            eventType: document.getElementById('event-type')?.options[document.getElementById('event-type').selectedIndex]?.text,
            eventDate: document.getElementById('event-date')?.value,
            eventTime: document.getElementById('event-time')?.options[document.getElementById('event-time').selectedIndex]?.text,
            eventLocation: document.getElementById('event-location')?.value,
            eventNotes: document.getElementById('event-notes')?.value,
            status: 'pending',
            timestamp: new Date().toISOString()
        };
        
        // Get existing bookings from localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        
        // Add new booking
        bookings.push(bookingData);
        
        // Save back to localStorage
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Also add to recent bookings for admin dashboard
        let recentBookings = JSON.parse(localStorage.getItem('recentBookings')) || [];
        recentBookings.unshift(bookingData);
        
        // Keep only last 10 bookings
        if (recentBookings.length > 10) {
            recentBookings = recentBookings.slice(0, 10);
        }
        
        localStorage.setItem('recentBookings', JSON.stringify(recentBookings));
    }

    submitBooking() {
        // Validate all fields
        if (!this.validateStep(1) || !this.validateStep(2) || !this.validateStep(3)) {
            alert('Please complete all required fields correctly.');
            return;
        }
        
        // Send to WhatsApp
        this.sendBookingToWhatsApp();
        
        // Save to localStorage for admin
        const packageText = document.getElementById('summary-package')?.textContent || 'Professional - $800';
        const packagePrice = document.querySelector('.package-option.selected .package-price')?.textContent || '$800';
        this.saveBookingToStorage(packageText, packagePrice);
        
        // Show success message
        alert('Booking confirmed! Thank you for choosing YV STUDIO. We will contact you shortly to confirm details.');
        
        // Reset form and go back to step 1
        this.goToStep(1);
        
        // Clear form fields
        document.getElementById('booking-form')?.reset();
        
        // Reset package selection
        this.packageOptions.forEach(opt => opt.classList.remove('selected'));
        const defaultPackage = document.querySelector('.package-option[data-package="professional"]');
        if (defaultPackage) defaultPackage.classList.add('selected');
        this.selectedPackage = 'professional';
        
        // Reset payment selection
        this.paymentOptions.forEach(opt => {
            opt.classList.remove('selected');
            const radioIcon = opt.querySelector('.payment-radio i');
            if (radioIcon) radioIcon.className = 'far fa-circle';
        });
        const defaultPayment = document.querySelector('.payment-option[data-method="bank"]');
        if (defaultPayment) {
            defaultPayment.classList.add('selected');
            const radioIcon = defaultPayment.querySelector('.payment-radio i');
            if (radioIcon) radioIcon.className = 'fas fa-check-circle';
        }
        
        // Show notification in admin chat if admin is online
        this.notifyAdminOfNewBooking();
    }

    sendBookingToWhatsApp() {
        // Collect all booking data
        const bookingData = {
            name: document.getElementById('client-name')?.value || 'Tidak diisi',
            email: document.getElementById('client-email')?.value || 'Tidak diisi',
            phone: document.getElementById('client-phone')?.value || 'Tidak diisi',
            package: document.getElementById('summary-package')?.textContent || 'Professional - $800',
            eventType: document.getElementById('event-type')?.options[document.getElementById('event-type').selectedIndex]?.text || 'Tidak diisi',
            date: document.getElementById('event-date')?.value || 'Tidak diisi',
            time: document.getElementById('event-time')?.options[document.getElementById('event-time').selectedIndex]?.text || 'Tidak diisi',
            location: document.getElementById('event-location')?.value || 'Tidak diisi',
            notes: document.getElementById('event-notes')?.value || 'Tidak ada catatan',
            paymentMethod: document.getElementById('summary-payment-method')?.textContent || 'Bank Transfer',
            bookingId: 'YV-' + Date.now().toString().slice(-6)
        };

        // Format the message
        const message = `*BOOKING CONFIRMATION - YV STUDIO*

*Detail Booking:*
====================
*Nama:* ${bookingData.name}
*Email:* ${bookingData.email}
*No. Telepon:* ${bookingData.phone}

*Paket yang Dipilih:* ${bookingData.package}
*Jenis Event:* ${bookingData.eventType}

*Tanggal:* ${bookingData.date}
*Waktu:* ${bookingData.time}
*Lokasi:* ${bookingData.location}

*Catatan Tambahan:*
${bookingData.notes}

*Metode Pembayaran:* ${bookingData.paymentMethod}
*Status Pembayaran:* Menunggu Konfirmasi Admin

*Booking ID:* ${bookingData.bookingId}
*Waktu Booking:* ${new Date().toLocaleString('id-ID')}
==========================

_Pesanan ini dikirim melalui website YV STUDIO_`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // WhatsApp number
        const phoneNumber = '62895704403389';
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');
    }

    notifyAdminOfNewBooking() {
        // Get client name for notification
        const clientName = document.getElementById('client-name')?.value;
        
        // Create notification for admin
        const notification = {
            type: 'new_booking',
            clientName: clientName,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Save to localStorage for admin to see
        let adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        adminNotifications.push(notification);
        localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
        
        // Update admin notification count
        this.updateAdminNotificationCount();
    }

    updateAdminNotificationCount() {
        const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        // Update badge in admin interface if we're on admin page
        if (window.location.pathname.includes('admin.html')) {
            const notificationBadge = document.getElementById('admin-notification-badge');
            if (notificationBadge) {
                if (unreadCount > 0) {
                    notificationBadge.textContent = unreadCount;
                    notificationBadge.style.display = 'flex';
                } else {
                    notificationBadge.style.display = 'none';
                }
            }
        }
    }

    showSlide(index) {
        this.testimonialSlides.forEach(slide => slide.classList.remove('active'));
        this.sliderDots.forEach(dot => dot.classList.remove('active'));
        
        if (this.testimonialSlides[index]) this.testimonialSlides[index].classList.add('active');
        if (this.sliderDots[index]) this.sliderDots[index].classList.add('active');
        this.currentSlide = index;
    }

    checkAdminStatus() {
        if (this.isAdminLoggedIn) {
            if (!window.location.pathname.includes('admin.html')) {
                this.adminAccessBtn.innerHTML = '<button class="btn-primary" style="padding: 10px 20px;"><i class="fas fa-tachometer-alt"></i> Admin Panel</button>';
                this.adminAccessBtn.querySelector('button').addEventListener('click', () => {
                    window.location.href = 'admin.html';
                });
            }
        }
    }

    initializeOnLoad() {
        window.dispatchEvent(new Event('scroll'));
        this.showSlide(0);
        this.updateAdminNotificationCount();
    }
}

// Search System tetap sama...
class SearchSystem {
    constructor() {
        this.searchToggle = document.getElementById('search-toggle');
        this.searchBox = document.getElementById('search-box');
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.searchModal = document.getElementById('search-modal');
        this.searchModalClose = document.getElementById('search-modal-close');
        this.searchResults = document.getElementById('search-results');

        this.init();
    }

    init() {
        // Toggle search box
        this.searchToggle.addEventListener('click', () => this.toggleSearch());

        // Search button click
        this.searchBtn.addEventListener('click', () => this.performSearch());

        // Search on Enter key
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Close search modal
        this.searchModalClose.addEventListener('click', () => this.closeSearchModal());

        // Close modal when clicking outside
        this.searchModal.addEventListener('click', (e) => {
            if (e.target === this.searchModal) {
                this.closeSearchModal();
            }
        });

        // Close search box when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (!this.searchBox.contains(e.target) &&
                !this.searchToggle.contains(e.target) &&
                window.innerWidth <= 768) {
                this.searchBox.classList.remove('active');
            }
        });
    }

    toggleSearch() {
        if (window.innerWidth <= 768) {
            if (this.searchModal) {
                this.searchModal.classList.add('active');
                if (this.searchInput) this.searchInput.focus();
            } else if (this.searchBox) {
                this.searchBox.classList.toggle('active');
                if (this.searchBox.classList.contains('active') && this.searchInput) this.searchInput.focus();
            }
        } else {
            if (this.searchBox) {
                this.searchBox.classList.toggle('active');
                if (this.searchBox.classList.contains('active') && this.searchInput) this.searchInput.focus();
            }
        }
    }

    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();

        if (!query) {
            this.showNoResults("Please enter a search term");
            return;
        }

        // Clear previous results
        this.searchResults.innerHTML = '';

        // Perform search
        const results = this.searchContent(query);

        // Show results
        this.displayResults(results, query);

        // Clear input
        this.searchInput.value = '';

        // Close search box on mobile
        if (window.innerWidth <= 768) {
            this.searchBox.classList.remove('active');
        }
    }

    searchContent(query) {
        const results = [];

        // Search in services
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            const searchData = card.getAttribute('data-search') || '';
            const title = card.querySelector('h3')?.textContent || '';
            const description = card.querySelector('p')?.textContent || '';

            const allText = (searchData + ' ' + title + ' ' + description).toLowerCase();

            if (allText.includes(query)) {
                results.push({
                    type: 'service',
                    title: title,
                    description: description,
                    element: card,
                    section: '#services'
                });
            }
        });

        // Search in portfolio
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            const searchData = item.getAttribute('data-search') || '';
            const title = item.querySelector('h3')?.textContent || '';
            const description = item.querySelector('p')?.textContent || '';

            const allText = (searchData + ' ' + title + ' ' + description).toLowerCase();

            if (allText.includes(query)) {
                results.push({
                    type: 'portfolio',
                    title: title,
                    description: description,
                    element: item,
                    section: '#portfolio'
                });
            }
        });

        // Search in pricing
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach(card => {
            const searchData = card.getAttribute('data-search') || '';
            const title = card.querySelector('h3')?.textContent || '';
            const price = card.querySelector('.pricing-price')?.textContent || '';

            const allText = (searchData + ' ' + title + ' ' + price).toLowerCase();

            if (allText.includes(query)) {
                results.push({
                    type: 'pricing',
                    title: title,
                    description: `Package: ${price}`,
                    element: card,
                    section: '#pricing'
                });
            }
        });

        // Search in testimonials
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        testimonialSlides.forEach(slide => {
            const searchData = slide.getAttribute('data-search') || '';
            const feedback = slide.querySelector('.client-feedback')?.textContent || '';
            const name = slide.querySelector('.client-name')?.textContent || '';

            const allText = (searchData + ' ' + feedback + ' ' + name).toLowerCase();

            if (allText.includes(query)) {
                results.push({
                    type: 'testimonial',
                    title: `Testimonial from ${name}`,
                    description: feedback.substring(0, 100) + '...',
                    element: slide,
                    section: '#testimonials'
                });
            }
        });

        // Search in navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            if (text.includes(query)) {
                const href = link.getAttribute('href');
                results.push({
                    type: 'navigation',
                    title: text.charAt(0).toUpperCase() + text.slice(1),
                    description: `Go to ${text} section`,
                    element: link,
                    section: href
                });
            }
        });

        return results;
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.showNoResults(`No results found for "${query}"`);
            return;
        }

        // Create results list
        const resultsList = document.createElement('div');
        resultsList.className = 'results-list';

        // Add results count
        const countElement = document.createElement('div');
        countElement.className = 'results-count';
        countElement.textContent = `${results.length} results found for "${query}"`;
        resultsList.appendChild(countElement);

        // Add each result
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
                <div class="result-type">${result.type}</div>
                <h4 class="result-title">${result.title}</h4>
                <p class="result-description">${result.description}</p>
                <button class="result-action" data-section="${result.section}">View</button>
            `;

            // Add click event to result action button
            const actionBtn = resultElement.querySelector('.result-action');
            actionBtn.addEventListener('click', () => {
                this.navigateToSection(result.section);
                this.closeSearchModal();
            });

            // Also make the whole result item clickable
            resultElement.addEventListener('click', (e) => {
                if (!e.target.classList.contains('result-action')) {
                    this.navigateToSection(result.section);
                    this.closeSearchModal();
                }
            });

            resultsList.appendChild(resultElement);
        });

        this.searchResults.appendChild(resultsList);
        this.searchModal.classList.add('active');
    }

    showNoResults(message) {
        this.searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search fa-3x"></i>
                <h4>${message}</h4>
                <p>Try searching for: wedding, event, product, cinematic, basic, professional, portfolio</p>
            </div>
        `;
        this.searchModal.classList.add('active');
    }

    navigateToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 100,
                behavior: 'smooth'
            });

            // Add highlight effect
            section.style.boxShadow = '0 0 0 3px var(--accent)';
            setTimeout(() => {
                section.style.boxShadow = '';
            }, 2000);
        }
    }

    closeSearchModal() {
        this.searchModal.classList.remove('active');
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize flatpickr if available
    if (typeof flatpickr !== 'undefined') {
        try {
            flatpickr("#event-date", { 
                dateFormat: "Y-m-d", 
                minDate: "today", 
                allowInput: true 
            });
        } catch (e) {
            console.warn('flatpickr init failed:', e);
        }
    }
    
    // Initialize systems
    window.bookingSystem = new PhotoBookingSystem();
    window.searchSystem = new SearchSystem();
});

// Expose a global function for video toggling
window.toggleVideo = function(videoEl, iconEl) {
    const bs = window.bookingSystem;
    if (bs && typeof bs.toggleVideo === 'function') {
        bs.toggleVideo(videoEl, iconEl);
    } else if (videoEl) {
        // fallback
        if (videoEl.paused) videoEl.play(); else videoEl.pause();
    }
};