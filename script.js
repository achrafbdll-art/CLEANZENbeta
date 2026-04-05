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
        }, 1500);
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
        const isScrolled = currentScroll > CONFIG.SCROLL_THRESHOLD_NAV;
        if (navbar.classList.contains('navbar-scrolled') !== isScrolled) {
            navbar.classList.toggle('navbar-scrolled', isScrolled);
            navbar.classList.toggle('py-3', isScrolled);
            navbar.classList.toggle('py-6', !isScrolled);
            if (navLogo) navLogo.style.transform = isScrolled ? 'scale(0.92)' : 'scale(1)';
        }
        
        // Show/Hide Mobile Taskbar
        if (mobileTaskbar) {
            const shouldShowTaskbar = currentScroll > CONFIG.SCROLL_THRESHOLD_TASKBAR;
            if (mobileTaskbar.classList.contains('opacity-100') !== shouldShowTaskbar) {
                mobileTaskbar.classList.toggle('translate-y-0', shouldShowTaskbar);
                mobileTaskbar.classList.toggle('opacity-100', shouldShowTaskbar);
                mobileTaskbar.classList.toggle('translate-y-20', !shouldShowTaskbar);
                mobileTaskbar.classList.toggle('opacity-0', !shouldShowTaskbar);
            }
        }

        // 2b. Navbar Appearance Transition (Sticky & Persistent)
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
                    if (link.classList.contains('active-nav-link') !== isActive) {
                        link.classList.toggle('active-nav-link', isActive);
                        if (isActive) link.setAttribute('aria-current', 'page');
                        else link.removeAttribute('aria-current');
                    }
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
                        if (link.classList.contains('active-nav-link') !== isActive) {
                            link.classList.toggle('active-nav-link', isActive);
                            if (isActive) {
                                link.setAttribute('aria-current', 'page');
                            } else {
                                link.removeAttribute('aria-current');
                            }
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
                    const otherButton = otherItem.querySelector('button');
                    if (otherContent) otherContent.classList.add('hidden');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    content.classList.remove('hidden');
                    icon.style.transform = 'rotate(180deg)';
                    button.setAttribute('aria-expanded', 'true');
                } else {
                    button.setAttribute('aria-expanded', 'false');
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

    // 13. AI Chatbot Logic (Advanced Parameters & History)
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatIconOpen = document.getElementById('chat-icon-open');
    const chatIconClose = document.getElementById('chat-icon-close');

    let isChatOpen = false;
    let chatSession = null; // Store the chat history session
    let aiClient = null;

    const toggleChat = () => {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatWindow.classList.remove('hidden');
            setTimeout(() => chatWindow.classList.add('active'), 10);
            chatIconOpen.style.opacity = '0';
            chatIconOpen.style.transform = 'scale(0) rotate(90deg)';
            chatIconClose.style.opacity = '1';
            chatIconClose.style.transform = 'scale(1) rotate(0deg)';
            chatInput.focus();
        } else {
            chatWindow.classList.remove('active');
            chatIconOpen.style.opacity = '1';
            chatIconOpen.style.transform = 'scale(1) rotate(0deg)';
            chatIconClose.style.opacity = '0';
            chatIconClose.style.transform = 'scale(0) rotate(-90deg)';
            setTimeout(() => chatWindow.classList.add('hidden'), 400);
        }
    };

    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (closeChat) closeChat.addEventListener('click', toggleChat);

    // Advanced System Parameters
    const SYSTEM_INSTRUCTION = `You are the expert hearing assistant for Clearzen Casablanca.
    
    TONE: Professional, empathetic, reassuring, and high-end.
    CONTEXT: Clearzen is the leader in hearing aids in Casablanca, Morocco.
    
    SERVICES:
    - Complete and FREE hearing assessment (Bilan auditif).
    - Invisible and high-tech hearing aids (global brands like Signia, Starkey, Phonak, Widex, Oticon, Resound).
    - 30-day free trial with no obligation.
    - Unlimited follow-up and 4-year warranty.
    
    PRACTICAL INFO:
    - Address: 5 rue Chatila, Quartier Palmier, Casablanca.
    - Hours: Mon-Fri (09:00-18:30), Sat (09:00-13:00).
    - Contact: 05 20 14 42 62 / WhatsApp: 06 23 86 17 93.
    
    RESPONSE ALGORITHM:
    1. LANGUAGE: Respond in the SAME language as the user (French or English).
    2. CALL TO ACTION: If the user mentions hearing loss or difficulty, ALWAYS suggest the free assessment.
    3. PRICING: If asked about price, explain it depends on the assessment but solutions start with a free trial.
    4. CONCISENESS: Be concise (max 3 sentences). Use 'vous' in French.
    5. UNCERTAINTY: If you don't know, invite them to call the center or visit.
    6. FAQ:
       - Duration: 45 minutes for a full assessment.
       - Visibility: We have 100% invisible models.
       - Payment: Up to 12 installments with no fees.
    `;

    const addMessage = (text, isUser = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'chat-message-user' : 'chat-message-bot';
        
        const avatar = isUser ? '' : `
            <div class="w-8 h-8 rounded-full bg-[#1B365D]/10 flex items-center justify-center flex-shrink-0">
                <i data-lucide="bot" size="16" class="text-[#1B365D]"></i>
            </div>
        `;

        messageDiv.innerHTML = `
            ${avatar}
            <div class="${isUser ? 'bg-[#1B365D] text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'} p-3 rounded-2xl shadow-sm">
                <p class="text-sm leading-relaxed">${text}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (window.lucide) window.lucide.createIcons();
    };

    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'chat-message-bot';
        indicator.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-[#1B365D]/10 flex items-center justify-center flex-shrink-0">
                <i data-lucide="bot" size="16" class="text-[#1B365D]"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (window.lucide) window.lucide.createIcons();
        return indicator;
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';
        
        const indicator = showTypingIndicator();

        try {
            // Initialize AI and Chat Session if not exists
            if (!aiClient) {
                const { GoogleGenAI } = await import("@google/genai");
                aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                chatSession = aiClient.chats.create({
                    model: "gemini-3-flash-preview",
                    config: {
                        systemInstruction: SYSTEM_INSTRUCTION,
                        temperature: 0.7,
                        topP: 0.9,
                        topK: 40
                    }
                });
            }

            // Use sendMessage for persistent history (ChatGPT-like algorithm)
            const result = await chatSession.sendMessage({ message: message });
            
            indicator.remove();
            addMessage(result.text || "Je n'ai pas pu générer de réponse. Veuillez réessayer.");
        } catch (error) {
            console.error('Chatbot Error:', error);
            indicator.remove();
            addMessage("Désolé, une erreur technique est survenue. Vous pouvez nous contacter directement au 05 20 14 42 62.");
        }
    };

    if (chatForm) chatForm.addEventListener('submit', handleChatSubmit);

    // 10. Language Switching Logic
    const translations = {
        fr: {
            nav_home: "Accueil",
            nav_mission: "Notre Mission",
            nav_services: "Services",
            nav_solutions: "Solutions",
            nav_engagements: "Engagements",
            nav_team: "Équipe",
            nav_contact: "Contact",
            nav_appointment: "Prendre RDV",
            nav_call: '<i data-lucide="phone" size="18" class="mr-3"></i> Appeler',
            hero_badge: "Expertise Auditive Premium à Casablanca",
            hero_title: "Votre audition, <br><span class=\"text-accent italic\">notre priorité.</span>",
            hero_subtitle: "Clearzen Audition vous accompagne vers une meilleure qualité de vie avec une prise en charge complète, précise et profondément humaine.",
            hero_cta_test: 'Bilan Auditif Gratuit <i data-lucide="activity" class="ml-2 group-hover:animate-pulse transition-transform"></i>',
            hero_stats: "93% de satisfaction patient",
            footer_copyright: "&copy; 2026 Clearzen Audition. Tous droits réservés.",
            footer_nav_title: "Navigation",
            footer_openings_title: "Ouvertures 2026",
            footer_follow_title: "Suivez-nous",
            // Mission
            mission_badge: "Notre Mission",
            mission_title: "Redonner vie à vos sens.",
            mission_vision_label: "Notre Vision",
            mission_vision_text: "Une approche holistique de l'audition.",
            mission_description: "Chez Clearzen, nous croyons que bien entendre est essentiel pour rester connecté au monde. Nous combinons expertise médicale et technologies de pointe pour vous offrir une solution sur mesure.",
            mission_trust_label: "Confiance",
            mission_trust_count: "5000+",
            mission_trust_quote: "\"Une expertise qui change la vie.\"",
            // Engagements
            engagements_badge: "Nos Engagements",
            engagements_title: "L'excellence au service de votre audition.",
            engagement_1: "Expertise Médicale",
            engagement_2: "Technologie de Pointe",
            engagement_3: "Accompagnement Humain",
            engagement_4: "Suivi Illimité",
            engagement_5: "Transparence Totale",
            engagement_6: "Innovation Continue",
            // Values
            valeurs_badge: "L'Esprit Clearzen",
            valeurs_title: "Nos Valeurs Fondamentales",
            valeur_1_title: "Expertise",
            valeur_1_text: "Excellence audiologique et méthodes internationales.",
            valeur_2_title: "Humanité",
            valeur_2_text: "Écoute, douceur, empathie et respect.",
            valeur_3_title: "Transparence",
            valeur_3_text: "Clarté totale sur les choix et les solutions.",
            valeur_4_title: "Modernité",
            valeur_4_text: "Appareils discrets, rechargeables et connectés.",
            valeur_5_title: "Éthique",
            valeur_5_text: "Des conseils honnêtes et transparents.",
            valeur_6_title: "Qualité",
            valeur_6_text: "Sélection rigoureuse des meilleurs fabricants mondiaux.",
            valeur_7_title: "Passion",
            valeur_7_text: "Dévouement total pour améliorer votre quotidien.",
            valeur_8_title: "Excellence",
            valeur_8_text: "Standard de soin supérieur pour chaque patient.",
            // Education
            education_badge: "Comprendre l'Audition",
            education_title: "Votre audition est précieuse.",
            education_description: "La perte auditive peut impacter votre vie sociale et cognitive. Agir tôt, c'est préserver votre capital santé.",
            education_point_1_title: "Impact Social",
            education_point_1_text: "Évitez l'isolement et restez connecté à vos proches.",
            education_point_2_title: "Santé Cognitive",
            education_point_2_text: "Stimulez votre cerveau pour prévenir le déclin cognitif.",
            // Services
            services_badge: "Nos Services",
            services_title: "Une prise en charge complète.",
            services_subtitle: "De la prévention à l'appareillage de haute technologie.",
            service_1_title: "Bilan Auditif Complet",
            service_1_text: "Tests audiométriques précis réalisés par nos experts.",
            service_1_tag_1: "Gratuit",
            service_1_tag_2: "45 min",
            service_2_title: "Appareillage Sur-Mesure",
            service_2_text: "Sélection et adaptation de la solution idéale pour vous.",
            service_2_tag_1: "Invisible",
            service_2_tag_2: "Bluetooth",
            service_3_title: "Suivi & Réglages",
            service_3_text: "Ajustements réguliers pour une performance optimale.",
            service_3_tag_1: "Illimité",
            service_3_tag_2: "À vie",
            service_4_title: "Entretien & Réparation",
            service_4_text: "Maintenance de vos appareils toutes marques.",
            service_4_tag_1: "Rapide",
            service_4_tag_2: "Expert",
            service_5_title: "Accessoires Connectés",
            service_5_text: "Solutions pour TV, téléphone et environnements bruyants.",
            service_5_tag_1: "Smart",
            service_5_tag_2: "Confort",
            // Stats
            stats_1: "Amélioration de la compréhension",
            stats_2: "Suivi personnalisé & illimité",
            stats_3: "Pression commerciale",
            stats_4: "Ouvertures : Marrakech, Agadir, Rabat...",
            // Brands
            brands_title: "Partenaires Technologiques Mondiaux",
            brands_desc: "Nous travaillons exclusivement avec les leaders mondiaux de l'audioprothèse pour vous garantir une technologie de pointe et une fiabilité absolue.",
            // Products
            products_badge: "Nos Solutions",
            products_title: 'Une technologie adaptée à <span class="text-accent italic">chaque besoin.</span>',
            products_tag_1: "Bienveillant",
            products_tag_2: "Intelligent",
            products_tag_3: "Serein",
            products_desc: "Nous sélectionnons les meilleures aides auditives du marché pour garantir discrétion, puissance et confort.",
            product_1_badge: "Puissant & Robuste",
            product_1_title: "Contours d’oreille (BTE)",
            product_1_desc: "Idéal pour les pertes sévères à profondes. Manipulation facile et grande autonomie.",
            product_benefits_label: "Avantages",
            product_1_benefit_1: "Puissance",
            product_1_benefit_2: "Robustesse",
            product_1_benefit_3: "Autonomie",
            product_1_benefit_4: "Facilité",
            product_for_whom_label: "Pour qui ?",
            product_1_for_whom: "Pertes sévères à profondes, besoin de manipulation simplifiée.",
            product_2_badge: "Le plus populaire",
            product_2_title: "Micro-contours (RIC)",
            product_2_desc: "Discrétion maximale et son naturel. Parfait pour les personnes actives.",
            product_2_benefit_1: "Discrétion",
            product_2_benefit_2: "Son Naturel",
            product_2_benefit_3: "Confort",
            product_2_benefit_4: "Bluetooth",
            product_2_for_whom: "Pertes légères à sévères, personnes actives, premier appareillage.",
            product_3_badge: "100% Invisible",
            product_3_title: "Intra-auriculaires (ITE/CIC)",
            product_3_desc: "Moulés sur mesure pour se loger directement dans votre conduit auditif.",
            product_3_benefit_1: "Invisibilité",
            product_3_benefit_2: "Son Naturel",
            product_3_benefit_3: "Sur-mesure",
            product_3_benefit_4: "Discrétion",
            product_3_for_whom: "Pertes légères à moyennes, discrétion absolue recherchée.",
            // Team
            team_badge: "Notre Équipe",
            team_title: "Des experts à votre écoute.",
            team_desc: "Nos audioprothésistes diplômés vous accompagnent avec expertise et bienveillance pour vous offrir la meilleure expérience auditive.",
            team_1_quote: "\"Votre confort est ma priorité absolue.\"",
            team_1_name: "Dr. Sarah Mansouri",
            team_1_role: "Audioprothésiste D.E.",
            team_1_desc: "Spécialiste en appareillage pédiatrique et acouphènes.",
            team_2_quote: "\"La technologie au service de l'humain.\"",
            team_2_name: "M. Yassine Benani",
            team_2_role: "Audioprothésiste D.E.",
            team_2_desc: "Expert en solutions connectées et réglages de haute précision.",
            team_3_quote: "\"Un accueil chaleureux pour chaque patient.\"",
            team_3_name: "Mme. Leila Kadiri",
            team_3_role: "Responsable Accueil",
            team_3_desc: "À votre disposition pour toute question administrative et prise de rendez-vous.",
            // Process
            process_badge: "Le Parcours",
            process_title: "Votre retour à une audition claire en 4 étapes.",
            process_step_1_title: "Consultation & Bilan",
            process_step_1_desc: "Échange sur vos besoins et réalisation d'un test auditif complet gratuit.",
            process_step_2_title: "Essai Gratuit",
            process_step_2_desc: "Testez vos aides auditives dans votre environnement réel pendant 30 jours.",
            process_step_3_title: "Adaptation",
            process_step_3_desc: "Réglages fins et personnalisés pour un confort d'écoute optimal.",
            process_step_4_title: "Suivi Illimité",
            process_step_4_desc: "Accompagnement à vie pour l'entretien et l'ajustement de vos appareils.",
            // FAQ
            faq_badge: "FAQ",
            faq_title: "Questions Fréquentes",
            faq_q1: "Combien de temps dure un bilan auditif ?",
            faq_a1: "Un bilan auditif complet dure environ 45 minutes. Il comprend une anamnèse, une otoscopie et des tests audiométriques précis pour évaluer votre audition.",
            faq_q2: "Les appareils auditifs sont-ils vraiment visibles ?",
            faq_a2: "Aujourd'hui, la technologie permet une discrétion absolue. Nous proposons des modèles intra-auriculaires totalement invisibles qui se logent au fond du conduit auditif.",
            faq_q3: "Quelles sont les garanties sur les appareils ?",
            faq_a3: "Tous nos appareils auditifs bénéficient d'une garantie constructeur de 4 ans couvrant les pannes et les défauts de fabrication.",
            faq_q4: "Proposez-vous des facilités de paiement ?",
            faq_a4: "Oui, nous proposons des solutions de financement flexibles, incluant le paiement jusqu'à 12 fois sans frais pour faciliter l'accès à une meilleure audition.",
            // Contact
            contact_phone_label: "Téléphone",
            contact_mobile_label: "Mobile : 06 23 86 17 93",
            contact_hours_label: "Horaires",
            contact_hours_value: "Lun - Ven : 09:00 - 18:30<br />Sam : 09:00 - 13:00",
            contact_form_title: "Demander un rappel",
            contact_form_name_label: "Nom Complet",
            contact_form_name_placeholder: "Votre nom",
            contact_form_phone_label: "Téléphone",
            contact_form_phone_placeholder: "06 XX XX XX XX",
            contact_form_subject_label: "Sujet",
            contact_form_opt_1: "Bilan auditif gratuit",
            contact_form_opt_2: "Réparation appareil",
            contact_form_opt_3: "Information remboursement",
            contact_form_opt_4: "Autre",
            contact_form_submit: "Envoyer ma demande",
            contact_form_success_title: "Demande Envoyée !",
            contact_form_success_desc: "Nous vous rappellerons très prochainement.",
            footer_desc: "Votre centre d'excellence auditive à Casablanca. Nous allions expertise médicale, technologies de pointe et accompagnement personnalisé pour redonner vie à vos sens.",
            // Test Modal
            test_intro_title: "Évaluez votre audition en 30 secondes.",
            test_intro_desc: "Répondez à quelques questions simples pour obtenir une première évaluation de votre santé auditive.",
            test_intro_btn: "Commencer le test",
            test_q1_label: "Question 1/3",
            test_q1_title: "Avez-vous du mal à suivre une conversation dans un environnement bruyant ?",
            test_q1_opt_1: "Oui, souvent",
            test_q1_opt_2: "Parfois",
            test_q1_opt_3: "Non, jamais",
            test_q2_label: "Question 2/3",
            test_q2_title: "Vos proches remarquent-ils que vous montez trop fort le volume de la télévision ?",
            test_q2_opt_1: "Oui, régulièrement",
            test_q2_opt_2: "De temps en temps",
            test_q2_opt_3: "Non",
            test_q3_label: "Question 3/3",
            test_q3_title: "Ressentez-vous des sifflements ou des bourdonnements dans vos oreilles ?",
            test_q3_opt_1: "Oui, souvent",
            test_q3_opt_2: "Rarement",
            test_q3_opt_3: "Non",
            test_result_title: "Test terminé !",
            test_result_desc: "Votre profil suggère qu'un bilan complet serait bénéfique. Laissez vos coordonnées pour être rappelé par un expert.",
            test_form_name_placeholder: "Votre nom complet",
            test_form_phone_placeholder: "Votre numéro de téléphone",
            test_form_submit: "Demander mon bilan gratuit",
            test_success_title: "C'est noté !",
            test_success_desc: "Un audioprothésiste Clearzen vous contactera dans les plus brefs délais pour fixer votre rendez-vous.",
            // Popups
            popup_special_offer: "Offre Spéciale",
            popup_title: "Votre bilan auditif est offert !",
            popup_desc: "Prenez rendez-vous aujourd'hui pour un test complet gratuit.",
            popup_cta: "Prendre RDV",
            exit_popup_title: "Ne partez pas si vite !",
            exit_popup_desc: "Profitez d'une remise de 10% sur vos accessoires pour votre première visite.",
            exit_popup_cta: "En profiter maintenant",
            scroll_popup_title: "Besoin d'aide ?",
            scroll_popup_desc: "Nos experts sont disponibles pour répondre à vos questions.",
            scroll_popup_call: "Appeler",
            // Chatbot
            chatbot_name: "Assistant Clearzen",
            chatbot_status: "En ligne",
            chatbot_welcome: "Bonjour ! Je suis l'assistant Clearzen. Comment puis-je vous aider aujourd'hui ?",
            chatbot_placeholder: "Posez votre question...",
            // Cookie Banner
            cookie_title: "Respect de votre vie privée",
            cookie_desc: "Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En continuant à naviguer, vous acceptez notre utilisation des cookies.",
            cookie_accept: "Accepter",
            cookie_decline: "Refuser",
            // Mobile Taskbar
            taskbar_home: "Accueil",
            taskbar_services: "Services",
            taskbar_whatsapp: "WhatsApp",
            taskbar_menu: "Menu",
            // Floating WhatsApp
            whatsapp_float_text: "Besoin d'aide ? Discutons !"
        },
        en: {
            nav_home: "Home",
            nav_mission: "Our Mission",
            nav_services: "Services",
            nav_solutions: "Solutions",
            nav_engagements: "Commitments",
            nav_team: "Team",
            nav_contact: "Contact",
            nav_appointment: "Book Appointment",
            nav_call: '<i data-lucide="phone" size="18" class="mr-3"></i> Call',
            hero_badge: "Premium Audiology Expertise in Casablanca",
            hero_title: "Your hearing, <br><span class=\"text-accent italic\">our priority.</span>",
            hero_subtitle: "Clearzen Audition accompanies you towards a better quality of life with complete, precise, and deeply human care.",
            hero_cta_test: 'Free Hearing Test <i data-lucide="activity" class="ml-2 group-hover:animate-pulse transition-transform"></i>',
            hero_stats: "93% patient satisfaction",
            footer_copyright: "&copy; 2026 Clearzen Audition. All rights reserved.",
            footer_nav_title: "Navigation",
            footer_openings_title: "2026 Openings",
            footer_follow_title: "Follow Us",
            // Mission
            mission_badge: "Our Mission",
            mission_title: "Bringing your senses back to life.",
            mission_vision_label: "Our Vision",
            mission_vision_text: "A holistic approach to hearing.",
            mission_description: "At Clearzen, we believe that hearing well is essential to staying connected to the world. We combine medical expertise and cutting-edge technology to offer you a tailor-made solution.",
            mission_trust_label: "Trust",
            mission_trust_count: "5000+",
            mission_trust_quote: "\"Life-changing expertise.\"",
            // Engagements
            engagements_badge: "Our Commitments",
            engagements_title: "Excellence at the service of your hearing.",
            engagement_1: "Medical Expertise",
            engagement_2: "Cutting-Edge Technology",
            engagement_3: "Human Support",
            engagement_4: "Unlimited Follow-up",
            engagement_5: "Total Transparency",
            engagement_6: "Continuous Innovation",
            // Values
            valeurs_badge: "The Clearzen Spirit",
            valeurs_title: "Our Core Values",
            valeur_1_title: "Expertise",
            valeur_1_text: "Audiological excellence and international methods.",
            valeur_2_title: "Humanity",
            valeur_2_text: "Listening, gentleness, empathy, and respect.",
            valeur_3_title: "Transparency",
            valeur_3_text: "Total clarity on choices and solutions.",
            valeur_4_title: "Modernity",
            valeur_4_text: "Discreet, rechargeable, and connected devices.",
            valeur_5_title: "Ethics",
            valeur_5_text: "Honest and transparent advice.",
            valeur_6_title: "Quality",
            valeur_6_text: "Rigorous selection of the best global manufacturers.",
            valeur_7_title: "Passion",
            valeur_7_text: "Total dedication to improving your daily life.",
            valeur_8_title: "Excellence",
            valeur_8_text: "Superior standard of care for every patient.",
            // Education
            education_badge: "Understanding Hearing",
            education_title: "Your hearing is precious.",
            education_description: "Hearing loss can impact your social and cognitive life. Acting early means preserving your health capital.",
            education_point_1_title: "Social Impact",
            education_point_1_text: "Avoid isolation and stay connected to your loved ones.",
            education_point_2_title: "Cognitive Health",
            education_point_2_text: "Stimulate your brain to prevent cognitive decline.",
            // Services
            services_badge: "Our Services",
            services_title: "Complete care.",
            services_subtitle: "From prevention to high-tech hearing aids.",
            service_1_title: "Complete Hearing Assessment",
            service_1_text: "Precise audiometric tests carried out by our experts.",
            service_1_tag_1: "Free",
            service_1_tag_2: "45 min",
            service_2_title: "Custom Hearing Aids",
            service_2_text: "Selection and adaptation of the ideal solution for you.",
            service_2_tag_1: "Invisible",
            service_2_tag_2: "Bluetooth",
            service_3_title: "Follow-up & Adjustments",
            service_3_text: "Regular adjustments for optimal performance.",
            service_3_tag_1: "Unlimited",
            service_3_tag_2: "Lifetime",
            service_4_title: "Maintenance & Repair",
            service_4_text: "Maintenance of your hearing aids of all brands.",
            service_4_tag_1: "Fast",
            service_4_tag_2: "Expert",
            service_5_title: "Connected Accessories",
            service_5_text: "Solutions for TV, telephone, and noisy environments.",
            service_5_tag_1: "Smart",
            service_5_tag_2: "Comfort",
            // Stats
            stats_1: "Improvement in understanding",
            stats_2: "Personalized & unlimited follow-up",
            stats_3: "Commercial pressure",
            stats_4: "Openings: Marrakech, Agadir, Rabat...",
            // Brands
            brands_title: "Global Technology Partners",
            brands_desc: "We work exclusively with the world leaders in hearing aids to guarantee you cutting-edge technology and absolute reliability.",
            // Products
            products_badge: "Our Solutions",
            products_title: 'Technology adapted to <span class="text-accent italic">every need.</span>',
            products_tag_1: "Caring",
            products_tag_2: "Intelligent",
            products_tag_3: "Serene",
            products_desc: "We select the best hearing aids on the market to guarantee discretion, power, and comfort.",
            product_1_badge: "Powerful & Robust",
            product_1_title: "Behind-the-Ear (BTE)",
            product_1_desc: "Ideal for severe to profound losses. Easy handling and long battery life.",
            product_benefits_label: "Advantages",
            product_1_benefit_1: "Power",
            product_1_benefit_2: "Robustness",
            product_1_benefit_3: "Autonomy",
            product_1_benefit_4: "Ease",
            product_for_whom_label: "For whom?",
            product_1_for_whom: "Severe to profound losses, need for simplified handling.",
            product_2_badge: "Most popular",
            product_2_title: "Receiver-in-Canal (RIC)",
            product_2_desc: "Maximum discretion and natural sound. Perfect for active people.",
            product_2_benefit_1: "Discretion",
            product_2_benefit_2: "Natural Sound",
            product_2_benefit_3: "Comfort",
            product_2_benefit_4: "Bluetooth",
            product_2_for_whom: "Mild to severe losses, active people, first fitting.",
            product_3_badge: "100% Invisible",
            product_3_title: "In-the-Ear (ITE/CIC)",
            product_3_desc: "Custom-molded to fit directly into your ear canal.",
            product_3_benefit_1: "Invisibility",
            product_3_benefit_2: "Natural Sound",
            product_3_benefit_3: "Custom-made",
            product_3_benefit_4: "Discretion",
            product_3_for_whom: "Mild to moderate losses, absolute discretion sought.",
            // Team
            team_badge: "Our Team",
            team_title: "Experts at your service.",
            team_desc: "Our qualified audiologists accompany you with expertise and kindness to offer you the best hearing experience.",
            team_1_quote: "\"Your comfort is my absolute priority.\"",
            team_1_name: "Dr. Sarah Mansouri",
            team_1_role: "Audiologist D.E.",
            team_1_desc: "Specialist in pediatric fitting and tinnitus.",
            team_2_quote: "\"Technology at the service of humans.\"",
            team_2_name: "M. Yassine Benani",
            team_2_role: "Audiologist D.E.",
            team_2_desc: "Expert in connected solutions and high-precision adjustments.",
            team_3_quote: "\"A warm welcome for every patient.\"",
            team_3_name: "Mme. Leila Kadiri",
            team_3_role: "Reception Manager",
            team_3_desc: "At your disposal for any administrative questions and appointments.",
            // Process
            process_badge: "The Journey",
            process_title: "Your return to clear hearing in 4 steps.",
            process_step_1_title: "Consultation & Assessment",
            process_step_1_desc: "Discussion about your needs and realization of a free complete hearing test.",
            process_step_2_title: "Free Trial",
            process_step_2_desc: "Test your hearing aids in your real environment for 30 days.",
            process_step_3_title: "Adaptation",
            process_step_3_desc: "Fine and personalized adjustments for optimal listening comfort.",
            process_step_4_title: "Unlimited Follow-up",
            process_step_4_desc: "Lifetime support for the maintenance and adjustment of your devices.",
            // FAQ
            faq_badge: "FAQ",
            faq_title: "Frequently Asked Questions",
            faq_q1: "How long does a hearing assessment take?",
            faq_a1: "A complete hearing assessment takes about 45 minutes. It includes a history, an otoscopy, and precise audiometric tests to evaluate your hearing.",
            faq_q2: "Are hearing aids really visible?",
            faq_a2: "Today, technology allows for absolute discretion. We offer totally invisible in-the-ear models that fit deep in the ear canal.",
            faq_q3: "What are the guarantees on the devices?",
            faq_a3: "All our hearing aids benefit from a 4-year manufacturer's warranty covering breakdowns and manufacturing defects.",
            faq_q4: "Do you offer payment facilities?",
            faq_a4: "Yes, we offer flexible financing solutions, including payment in up to 12 installments without fees to facilitate access to better hearing.",
            // Contact
            contact_phone_label: "Phone",
            contact_mobile_label: "Mobile: 06 23 86 17 93",
            contact_hours_label: "Hours",
            contact_hours_value: "Mon - Fri: 09:00 - 18:30<br />Sat: 09:00 - 13:00",
            contact_form_title: "Request a callback",
            contact_form_name_label: "Full Name",
            contact_form_name_placeholder: "Your name",
            contact_form_phone_label: "Phone",
            contact_form_phone_placeholder: "06 XX XX XX XX",
            contact_form_subject_label: "Subject",
            contact_form_opt_1: "Free hearing test",
            contact_form_opt_2: "Device repair",
            contact_form_opt_3: "Reimbursement information",
            contact_form_opt_4: "Other",
            contact_form_submit: "Send my request",
            contact_form_success_title: "Request Sent!",
            contact_form_success_desc: "We will call you back very soon.",
            footer_desc: "Your center of hearing excellence in Casablanca. We combine medical expertise, cutting-edge technologies, and personalized support to bring your senses back to life.",
            // Test Modal
            test_intro_title: "Assess your hearing in 30 seconds.",
            test_intro_desc: "Answer a few simple questions to get an initial assessment of your hearing health.",
            test_intro_btn: "Start the test",
            test_q1_label: "Question 1/3",
            test_q1_title: "Do you have trouble following a conversation in a noisy environment?",
            test_q1_opt_1: "Yes, often",
            test_q1_opt_2: "Sometimes",
            test_q1_opt_3: "No, never",
            test_q2_label: "Question 2/3",
            test_q2_title: "Do your loved ones notice that you turn up the TV volume too high?",
            test_q2_opt_1: "Yes, regularly",
            test_q2_opt_2: "From time to time",
            test_q2_opt_3: "No",
            test_q3_label: "Question 3/3",
            test_q3_title: "Do you experience ringing or buzzing in your ears?",
            test_q3_opt_1: "Yes, often",
            test_q3_opt_2: "Rarely",
            test_q3_opt_3: "No",
            test_result_title: "Test completed!",
            test_result_desc: "Your profile suggests that a full assessment would be beneficial. Leave your details to be called back by an expert.",
            test_form_name_placeholder: "Your full name",
            test_form_phone_placeholder: "Your phone number",
            test_form_submit: "Request my free assessment",
            test_success_title: "Noted!",
            test_success_desc: "A Clearzen hearing aid specialist will contact you as soon as possible to schedule your appointment.",
            // Popups
            popup_special_offer: "Special Offer",
            popup_title: "Your hearing assessment is free!",
            popup_desc: "Book an appointment today for a full free test.",
            popup_cta: "Book Appointment",
            exit_popup_title: "Don't leave so soon!",
            exit_popup_desc: "Enjoy a 10% discount on your accessories for your first visit.",
            exit_popup_cta: "Enjoy now",
            scroll_popup_title: "Need help?",
            scroll_popup_desc: "Our experts are available to answer your questions.",
            scroll_popup_call: "Call",
            // Chatbot
            chatbot_name: "Clearzen Assistant",
            chatbot_status: "Online",
            chatbot_welcome: "Hello! I am the Clearzen assistant. How can I help you today?",
            chatbot_placeholder: "Ask your question...",
            // Cookie Banner
            cookie_title: "Respect for your privacy",
            cookie_desc: "We use cookies to improve your experience, analyze traffic, and personalize content. By continuing to browse, you accept our use of cookies.",
            cookie_accept: "Accept",
            cookie_decline: "Decline",
            // Mobile Taskbar
            taskbar_home: "Home",
            taskbar_services: "Services",
            taskbar_whatsapp: "WhatsApp",
            taskbar_menu: "Menu",
            // Floating WhatsApp
            whatsapp_float_text: "Need help? Let's chat!"
        }
    };

    window.setLanguage = (lang) => {
        localStorage.setItem('preferred_language', lang);
        applyTranslations(lang);
        // Optional: reload to ensure all dynamic elements are updated if needed
        // window.location.reload(); 
    };

    const applyTranslations = (lang) => {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update active state of language buttons
        document.querySelectorAll('.lang-btn-fr, .lang-btn-fr-mobile, .lang-btn-fr-footer').forEach(btn => {
            btn.classList.toggle('text-white', lang === 'fr');
            btn.classList.toggle('text-white/50', lang !== 'fr');
            btn.classList.toggle('bg-white/10', lang === 'fr');
        });
        document.querySelectorAll('.lang-btn-en, .lang-btn-en-mobile, .lang-btn-en-footer').forEach(btn => {
            btn.classList.toggle('text-white', lang === 'en');
            btn.classList.toggle('text-white/50', lang !== 'en');
            btn.classList.toggle('bg-white/10', lang === 'en');
        });

        // Re-initialize icons for translated elements
        if (window.lucide) window.lucide.createIcons();
    };

    // 12. Lazy Loading for Background Images and Images
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                if (lazyImage.dataset.src) {
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.removeAttribute('data-src');
                }
                if (lazyImage.dataset.bg) {
                    lazyImage.style.backgroundImage = `url(${lazyImage.dataset.bg})`;
                    lazyImage.removeAttribute('data-bg');
                }
                lazyImage.classList.remove('lazy');
                observer.unobserve(lazyImage);
            }
        });
    });

    document.querySelectorAll('.lazy').forEach(img => lazyImageObserver.observe(img));

    // Initialize language
    const savedLang = localStorage.getItem('preferred_language') || 'fr';
    applyTranslations(savedLang);
});
