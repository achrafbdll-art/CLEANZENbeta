/* CLEARZEN Classic Version - script.js */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 0. Configuration
    const CONFIG = {
        SCROLL_THRESHOLD_NAV: 60,
        SCROLL_THRESHOLD_TASKBAR: 100,
        SCROLL_THRESHOLD_BACK_TO_TOP: 800,
        SCROLL_THRESHOLD_FLOATING_CTA: 400,
        NAV_OFFSET: 80,
        ANIMATION_DURATION: 500
    };

    // 1. Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 800); // Reduced from 1500ms for faster mobile feel
    }

    // 1b. Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.className = 'fixed top-0 left-0 h-1 bg-accent z-[1001] transition-all duration-300 ease-out pointer-events-none opacity-0';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    // 2. Navbar Scroll Effects
    const navbar = document.getElementById('navbar');
    const mobileTaskbar = document.getElementById('mobile-taskbar');
    const navLogo = document.querySelector('.group.cursor-pointer'); 
    let lastScrollTop = 0;
    const scrollThreshold = 120;
    let isScrolling = false;

    const updateNavbarAndProgress = () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (currentScroll / height) * 100;
        
        // Update Progress Bar
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
            progressBar.style.opacity = currentScroll < 20 ? '0' : '1';
        }

        // 2a. Background, Padding and Logo Scale Transition
        if (currentScroll > CONFIG.SCROLL_THRESHOLD_NAV) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('py-3', 'md:py-6');
            navbar.classList.add('py-2');
            if (navLogo) navLogo.style.transform = 'scale(0.92)';
            
            // Show Mobile Taskbar
            if (mobileTaskbar) {
                mobileTaskbar.classList.remove('translate-y-20', 'opacity-0');
                mobileTaskbar.classList.add('translate-y-0', 'opacity-100');
            }
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.classList.remove('py-2');
            navbar.classList.add('py-3', 'md:py-6');
            if (navLogo) navLogo.style.transform = 'scale(1)';

            // Hide Mobile Taskbar near top
            if (mobileTaskbar) {
                mobileTaskbar.classList.add('translate-y-20', 'opacity-0');
                mobileTaskbar.classList.remove('translate-y-0', 'opacity-100');
            }
        }

        // 2b. Navbar Appearance Transition (Sticky & Persistent)
        // We removed the hide-on-scroll-down logic to keep it sticky as requested.
        navbar.style.transform = 'translateY(0)';
        if (progressBar) progressBar.style.transform = 'translateY(0)';
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        isScrolling = false;
    };

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(updateNavbarAndProgress);
            isScrolling = true;
        }
    }, { passive: true });

    updateNavbarAndProgress(); // Initial call

    // 2c. Active Link Highlighting (Intersection Observer)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileTaskbarLinks = document.querySelectorAll('.mobile-taskbar-link');

    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        // Special case: if we are at the very top, highlight 'home'
        if (window.scrollY < 100) {
            const updateLinkState = (links) => {
                links.forEach(link => {
                    const isActive = link.getAttribute('href') === '#home';
                    link.classList.toggle('active-nav-link', isActive);
                    if (isActive) link.setAttribute('aria-current', 'page');
                    else link.removeAttribute('aria-current');
                });
            };
            updateLinkState(navLinks);
            updateLinkState(mobileNavLinks);
            updateLinkState(mobileTaskbarLinks);
            return;
        }

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                const updateLinkState = (links) => {
                    links.forEach(link => {
                        const isActive = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('active-nav-link', isActive);
                        if (isActive) {
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                };

                updateLinkState(navLinks);
                updateLinkState(mobileNavLinks);
                updateLinkState(mobileTaskbarLinks);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Initial check for active link
    observerCallback([]);

    // Scroll listener for top of page active state
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            observerCallback([]);
        }
    });

    // Ensure smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = CONFIG.NAV_OFFSET;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    if (mobileMenuBtn && mobileMenu && mobileMenuOverlay) {
        const openMenu = () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            setTimeout(() => {
                mobileMenu.style.transform = 'translateX(0)';
                mobileMenuOverlay.style.opacity = '1';
                
                // Staggered animation for links
                mobileNavLinks.forEach((link, index) => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        link.style.transition = 'all 0.4s ease-out';
                        link.style.opacity = '1';
                        link.style.transform = 'translateX(0)';
                    }, 100 + (index * 50));
                });
            }, 10);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        };

        const closeMenu = () => {
            mobileMenu.style.transform = 'translateX(100%)';
            mobileMenuOverlay.style.opacity = '0';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                mobileMenuOverlay.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scrolling
            }, 500);
        };

        mobileMenuBtn.addEventListener('click', openMenu);
        if (mobileMenuTrigger) mobileMenuTrigger.addEventListener('click', openMenu);
        if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
        mobileMenuOverlay.addEventListener('click', closeMenu);
        mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // 3. Hero Slider
    const heroImages = [
        "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
    ];
    let currentHeroIndex = 0;
    const heroImageElement = document.getElementById('hero-image');

    if (heroImageElement) {
        setInterval(() => {
            currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
            heroImageElement.style.opacity = '0';
            setTimeout(() => {
                heroImageElement.src = heroImages[currentHeroIndex];
                heroImageElement.style.opacity = '0.4'; // Maintain opacity from CSS
            }, 500);
        }, 5000);
    }

    // 4. Brands Marquee
    // Logic removed as content is now hardcoded in index.html for better performance in classic version.

    // 5. 3D Wave Animation
    const waveBarsContainer = document.getElementById('wave-bars');
    if (waveBarsContainer) {
        const barCount = 40;
        const bars = [];

        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            // Change gradient from primary/accent to red/blue
            bar.className = 'wave-bar w-1 sm:w-2 bg-gradient-to-t from-[#E31E24] to-[#1B365D] rounded-full opacity-60 transition-all duration-1000';
            bar.style.height = '20%';
            waveBarsContainer.appendChild(bar);
            bars.push(bar);
        }

        setInterval(() => {
            const time = Date.now() / 1000;
            bars.forEach((bar, i) => {
                const height = 30 + Math.sin(time * 2 + i * 0.2) * 25 + Math.cos(time * 1.5 + i * 0.3) * 15;
                const opacity = 0.6 + Math.sin(time + i * 0.1) * 0.4;
                bar.style.height = `${height}%`;
                bar.style.opacity = opacity;
            });
        }, 100);
    }

    // 6. FAQ Accordion
    // Since FAQ is injected by JS in React version but hardcoded here, we need to handle it differently if it's hardcoded.
    // Let's assume it's hardcoded in index.html now.
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');

        if (button && content && icon) {
            button.addEventListener('click', () => {
                const isOpen = !content.classList.contains('hidden');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    const otherContent = otherItem.querySelector('.faq-content');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherContent) otherContent.classList.add('hidden');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                });

                if (!isOpen) {
                    content.classList.remove('hidden');
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        }
    });

    // 7. Contact Form
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            console.log('Form submitted:', Object.fromEntries(formData));
            
            contactForm.classList.add('hidden');
            formSuccess.classList.remove('hidden');
            
            setTimeout(() => {
                formSuccess.classList.add('hidden');
                contactForm.classList.remove('hidden');
                contactForm.reset();
            }, 5000);
        });
    }

    // 8. CTA Popups
    const ctaPopup = document.getElementById('cta-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popupCtaBtn = document.getElementById('popup-cta-btn');

    const exitPopup = document.getElementById('exit-popup');
    const closeExitBtn = document.getElementById('close-exit-btn');
    const exitCtaBtn = document.getElementById('exit-cta-btn');

    const scrollPopup = document.getElementById('scroll-popup');
    const closeScrollBtn = document.getElementById('close-scroll-btn');

    // Global function to open the test modal
    window.openTestModal = () => {
        const testModal = document.getElementById('test-modal');
        if (testModal) {
            testModal.classList.remove('hidden');
            testModal.classList.add('flex');
            // Reset to step 1
            window.nextTestStep(1);
            setTimeout(() => {
                testModal.style.opacity = '1';
                const innerDiv = testModal.querySelector('div');
                if (innerDiv) innerDiv.style.transform = 'scale(1)';
            }, 10);
        }
    };

    window.closeTestModal = () => {
        const testModal = document.getElementById('test-modal');
        if (testModal) {
            testModal.style.opacity = '0';
            const innerDiv = testModal.querySelector('div');
            if (innerDiv) innerDiv.style.transform = 'scale(0.9)';
            setTimeout(() => {
                testModal.classList.add('hidden');
                testModal.classList.remove('flex');
            }, 300);
        }
    };

    window.nextTestStep = (step) => {
        const steps = document.querySelectorAll('.test-step');
        steps.forEach(s => s.classList.add('hidden'));
        const nextStep = document.getElementById(`test-step-${step}`);
        if (nextStep) {
            nextStep.classList.remove('hidden');
            // Re-initialize icons for dynamic content
            if (window.lucide) window.lucide.createIcons();
        }
    };

    const testForm = document.getElementById('test-form');
    if (testForm) {
        testForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const steps = document.querySelectorAll('.test-step');
            steps.forEach(s => s.classList.add('hidden'));
            const success = document.getElementById('test-success');
            if (success) success.classList.remove('hidden');
            
            setTimeout(() => {
                window.closeTestModal();
            }, 4000);
        });
    }

    // Time-based Popup
    if (ctaPopup) {
        const hasShownPopup = sessionStorage.getItem('hasShownPopup');
        if (!hasShownPopup) {
            setTimeout(() => {
                ctaPopup.classList.remove('hidden');
                ctaPopup.classList.add('flex');
                setTimeout(() => {
                    ctaPopup.style.opacity = '1';
                    const innerDiv = ctaPopup.querySelector('div');
                    if (innerDiv) innerDiv.style.transform = 'scale(1)';
                }, 10);
                sessionStorage.setItem('hasShownPopup', 'true');
            }, 5000);
        }

        const closePopup = () => {
            ctaPopup.style.opacity = '0';
            const innerDiv = ctaPopup.querySelector('div');
            if (innerDiv) innerDiv.style.transform = 'scale(0.9)';
            setTimeout(() => {
                ctaPopup.classList.add('hidden');
                ctaPopup.classList.remove('flex');
            }, 300);
        };

        if (closePopupBtn) closePopupBtn.addEventListener('click', closePopup);
        if (popupCtaBtn) popupCtaBtn.addEventListener('click', closePopup);
        ctaPopup.addEventListener('click', (e) => {
            if (e.target === ctaPopup) closePopup();
        });
    }

    // Exit Intent Popup
    if (exitPopup) {
        const hasShownExit = sessionStorage.getItem('hasShownExit');
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0 && !sessionStorage.getItem('hasShownExit')) {
                exitPopup.classList.remove('hidden');
                exitPopup.classList.add('flex');
                setTimeout(() => {
                    exitPopup.style.opacity = '1';
                    const innerDiv = exitPopup.querySelector('div');
                    if (innerDiv) innerDiv.style.transform = 'scale(1)';
                }, 10);
                sessionStorage.setItem('hasShownExit', 'true');
            }
        });

        const closeExit = () => {
            exitPopup.style.opacity = '0';
            const innerDiv = exitPopup.querySelector('div');
            if (innerDiv) innerDiv.style.transform = 'scale(0.9)';
            setTimeout(() => {
                exitPopup.classList.add('hidden');
                exitPopup.classList.remove('flex');
            }, 300);
        };

        if (closeExitBtn) closeExitBtn.addEventListener('click', closeExit);
        if (exitCtaBtn) exitCtaBtn.addEventListener('click', closeExit);
    }

    // Scroll-triggered Popup
    if (scrollPopup) {
        let hasShownScroll = false;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 70 && !hasShownScroll) {
                scrollPopup.classList.remove('hidden');
                setTimeout(() => {
                    scrollPopup.style.opacity = '1';
                    scrollPopup.style.transform = 'translateX(0)';
                }, 10);
                hasShownScroll = true;
            }
        });

        const closeScroll = () => {
            scrollPopup.style.opacity = '0';
            scrollPopup.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                scrollPopup.classList.add('hidden');
            }, 300);
        };

        if (closeScrollBtn) closeScrollBtn.addEventListener('click', closeScroll);
    }

    // 9. Sticky CTA Visibility
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const isMobile = window.innerWidth < 768;
            
            // Back to Top logic
            if (backToTop) {
                if (scrollY > CONFIG.SCROLL_THRESHOLD_BACK_TO_TOP) {
                    backToTop.classList.remove('pointer-events-none');
                    backToTop.style.opacity = '1';
                    backToTop.style.transform = 'translateY(0)';
                } else {
                    backToTop.classList.add('pointer-events-none');
                    backToTop.style.opacity = '0';
                    backToTop.style.transform = 'translateY(10px)';
                }
            }
        }, { passive: true });

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // 10. Social Sharing
    const shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.getAttribute('data-platform');
            const text = encodeURIComponent(btn.getAttribute('data-text'));
            const url = encodeURIComponent(window.location.href);
            let shareUrl = '';

            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'copy':
                    const fullText = `${decodeURIComponent(text)} ${window.location.href}`;
                    navigator.clipboard.writeText(fullText).then(() => {
                        const originalIcon = btn.innerHTML;
                        btn.innerHTML = '<i data-lucide="check" size="14"></i>';
                        if (window.lucide) window.lucide.createIcons();
                        btn.classList.add('text-green-500');
                        setTimeout(() => {
                            btn.innerHTML = originalIcon;
                            if (window.lucide) window.lucide.createIcons();
                            btn.classList.remove('text-green-500');
                        }, 2000);
                    });
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // 11. Cookie Consent Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && acceptCookies && declineCookies) {
        // Check if user has already made a choice
        const cookieChoice = localStorage.getItem('cookie-consent');
        
        if (!cookieChoice) {
            // Show banner after a short delay
            setTimeout(() => {
                cookieBanner.classList.remove('translate-y-full');
                cookieBanner.classList.add('translate-y-0');
            }, 2000);
        }

        const hideBanner = () => {
            cookieBanner.classList.remove('translate-y-0');
            cookieBanner.classList.add('translate-y-full');
        };

        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'accepted');
            hideBanner();
        });

        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'declined');
            hideBanner();
        });
    }

    // 12. Mobile Taskbar Haptic Feedback & Interaction
    const taskbarLinks = document.querySelectorAll('.mobile-taskbar-link, #mobile-taskbar a, #mobile-taskbar button');
    taskbarLinks.forEach(link => {
        link.addEventListener('touchstart', () => {
            link.style.transform = 'scale(0.9)';
        }, { passive: true });
        
        link.addEventListener('touchend', () => {
            link.style.transform = 'scale(1)';
        }, { passive: true });
        
        link.addEventListener('touchcancel', () => {
            link.style.transform = 'scale(1)';
        }, { passive: true });
    });

});
