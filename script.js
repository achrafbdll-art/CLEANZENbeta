:root {
    --accent: #E31E24;
    --primary: #1B365D;
}

html {
    scroll-behavior: smooth;
}

/* Custom Styles for CLEARZEN Classic Version */

@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

.animate-marquee {
    animation: marquee 25s linear infinite;
}

@keyframes backgroundScroll {
    0% { background-position: 0 0; }
    100% { background-position: 300px 300px; }
}

.animate-bg-scroll {
    animation: backgroundScroll 20s linear infinite;
}

.zellig-bg {
    background-image: url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(-15 75 75)'%3E%3Cpath d='M40 55a30 30 0 1 1 60 0c0 28-28 28-28 48a12 12 0 1 1-24 0' fill='none' stroke='%2300B4D8' stroke-width='6' stroke-opacity='0.1' transform='translate(2, 2)'/%3E%3Cpath d='M40 55a30 30 0 1 1 60 0c0 28-28 28-28 48a12 12 0 1 1-24 0' fill='none' stroke='%231B365D' stroke-width='6' stroke-opacity='0.15'/%3E%3C/g%3E%3C/svg%3E");
    background-repeat: repeat;
}

.zellig-white-bg {
    background-image: url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(-15 75 75)'%3E%3Cpath d='M40 55a30 30 0 1 1 60 0c0 28-28 28-28 48a12 12 0 1 1-24 0' fill='none' stroke='%23FFFFFF' stroke-width='6' stroke-opacity='0.05' transform='translate(2, 2)'/%3E%3Cpath d='M40 55a30 30 0 1 1 60 0c0 28-28 28-28 48a12 12 0 1 1-24 0' fill='none' stroke='%23FFFFFF' stroke-width='6' stroke-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E");
    background-repeat: repeat;
}

.zellig-text-bg {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z' fill='%231B365D' fill-opacity='0.05'/%3E%3C/svg%3E");
    background-repeat: repeat;
}

.zellig-solutions-bg {
    background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z' fill='%231B365D' fill-opacity='0.08'/%3E%3C/svg%3E");
    background-repeat: repeat;
}

.zellig-logo-bg {
    background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z' fill='%23E31E24' fill-opacity='0.4'/%3E%3C/svg%3E");
    background-repeat: repeat;
}

.animate-bounce-slow {
    animation: bounce 4s infinite;
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(-5%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}

/* Wave Animation */
.wave-bar {
    perspective: 1000px;
    transform: rotateX(35deg);
    box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
    transition: height 1.5s ease-in-out, opacity 1.5s ease-in-out;
}

/* Navbar Base */
#navbar {
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, background-color, padding, box-shadow;
}

.nav-container {
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.group.cursor-pointer {
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link {
    transition: color 0.3s ease, transform 0.3s ease;
}

#nav-logo-text-top, #nav-logo-line, #nav-logo-text-bottom, #nav-logo-bubble-blue {
    transition: all 0.4s ease;
}

/* Navbar Scrolled State */
.navbar-scrolled {
    @apply py-2;
}

.navbar-scrolled .nav-container {
    @apply bg-white/90 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(27,54,93,0.2)] border border-white/60 rounded-[3rem] px-10 py-2 mx-4 md:mx-auto max-w-6xl;
}

.navbar-scrolled #nav-logo-text-top {
    @apply text-primary;
}

.navbar-scrolled #nav-logo-line {
    @apply bg-primary;
}

.navbar-scrolled #nav-logo-text-bottom {
    @apply text-primary/60;
}

.navbar-scrolled #nav-logo-bubble-blue {
    @apply bg-primary;
}

.navbar-scrolled #nav-logo-bubble-blue svg {
    @apply text-white;
}

.navbar-scrolled .nav-link {
    @apply text-primary/70 hover:text-accent;
}

.navbar-scrolled #mobile-menu-btn {
    @apply text-primary bg-primary/5;
}

/* Active Nav Link */
.active-nav-link {
    @apply text-accent !important scale-105;
}

.active-nav-link::after {
    content: '';
    @apply absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full transform scale-x-100 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link {
    @apply transition-all duration-300 relative;
}

.nav-link::after {
    content: '';
    @apply absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full transform scale-x-0 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-left;
}

.nav-link:hover::after {
    @apply scale-x-100;
}

/* Mobile Menu Active State */
.mobile-nav-link.active-nav-link {
    @apply text-accent translate-x-2;
}

.mobile-nav-link.active-nav-link i {
    @apply opacity-100 translate-x-0;
}

/* Mobile Optimization & Touch Targets */
@media (max-width: 768px) {
    .navbar-scrolled .nav-container {
        @apply px-4 py-2 mx-2 rounded-2xl;
    }

    #nav-logo-text-top { font-size: 14px !important; }
    #nav-logo-text-bottom { font-size: 8px !important; }

    button, 
    a.btn,
    .mobile-nav-link,
    .mobile-taskbar-link {
        min-height: 48px; /* Standard mobile touch target */
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    input, 
    select, 
    textarea {
        font-size: 16px !important; /* Prevent iOS zoom on focus */
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
    }

    h1 { @apply text-3xl leading-tight !important; }
    h2 { @apply text-2xl leading-tight !important; }
    h3 { @apply text-xl leading-snug !important; }
    
    section {
        @apply py-12 !important; /* Slightly reduced padding for mobile */
    }

    .hero-img {
        object-position: 70% center; /* Better focus on mobile */
    }
}

/* Mobile Taskbar Active State */
.mobile-taskbar-link {
    @apply transition-all duration-200 active:scale-90;
}

.mobile-taskbar-link.active-nav-link i {
    @apply text-accent scale-110;
}

.mobile-taskbar-link.active-nav-link span {
    @apply text-primary opacity-100;
}

.mobile-taskbar-link.active-nav-link div {
    @apply scale-100 opacity-100;
}

/* Safe area for modern devices */
#mobile-taskbar {
    padding-bottom: env(safe-area-inset-bottom, 0);
}

/* 3D Button Style */
.btn-3d {
    position: relative;
    display: inline-block;
    padding: 1.25rem 2.5rem;
    background: var(--accent);
    color: white;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    border-radius: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 8px 0 #991b1b, 0 15px 20px rgba(0, 0, 0, 0.2);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    transform: translateY(-4px);
}

.btn-3d:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #991b1b, 0 10px 15px rgba(0, 0, 0, 0.2);
}

.btn-3d:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #991b1b, 0 5px 10px rgba(0, 0, 0, 0.2);
}

/* Floating 3D Button Animation */
@keyframes float-3d {
    0%, 100% { transform: translateY(-4px) rotateX(0deg); }
    50% { transform: translateY(-8px) rotateX(5deg); }
}

.animate-float-3d {
    animation: float-3d 3s ease-in-out infinite;
}

@keyframes icon-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
}

.group-hover\:animate-icon-bounce {
    animation: icon-bounce 1.2s ease-in-out infinite;
}

/* Global Icon Style Refinement (Duotone & Modern) */
i[data-lucide] svg, 
svg.lucide {
    stroke-width: 1.6px !important;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: currentColor;
    fill-opacity: 0.1; /* Subtle Duotone effect */
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
}

/* Interactive hover effects for icons */
.group:hover i[data-lucide] svg,
.group:hover svg.lucide,
a:hover i[data-lucide] svg,
button:hover i[data-lucide] svg {
    fill-opacity: 0.25;
    transform: scale(1.15) rotate(5deg);
    filter: drop-shadow(0 0 12px currentColor);
}

/* Custom Scrollbar for Premium Feel */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
}

/* Reveal Animations */
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
}

.reveal.active {
    opacity: 1;
    transform: translateY(0);
}

.reveal-left {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-right {
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-left.active, .reveal-right.active {
    opacity: 1;
    transform: translateX(0);
}

/* Staggered Delay Classes */
.delay-100 { transition-delay: 100ms; }
.delay-200 { transition-delay: 200ms; }
.delay-300 { transition-delay: 300ms; }
.delay-400 { transition-delay: 400ms; }
.delay-500 { transition-delay: 500ms; }

/* Premium Card Hover Effect */
.premium-card {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.premium-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 60px -15px rgba(27, 54, 93, 0.15);
}

/* Form Validation Styles */
.form-input-error {
    @apply border-red-500 focus:ring-red-500/20 !important;
}

.form-error-msg {
    @apply text-red-500 text-[10px] font-bold uppercase mt-1 ml-1;
}

/* Floating Animation for Icons */
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Specific glow for accent icons and containers */
.text-accent i[data-lucide] svg,
.bg-accent i[data-lucide] svg,
.bg-accent\/30 i[data-lucide] svg,
.bg-accent\/10 i[data-lucide] svg {
    filter: drop-shadow(0 0 8px rgba(227, 30, 36, 0.4));
    fill-opacity: 0.2;
}

/* Icon container pulse effect on hover */
.group:hover .bg-accent\/30,
.group:hover .bg-primary\/30,
.group:hover .bg-white\/10 {
    box-shadow: 0 0 20px currentColor;
    border-color: currentColor;
}

/* Mobile Nav Active */
.mobile-nav-link.active-nav-link {
    @apply text-accent translate-x-2;
}

.mobile-nav-link.active-nav-link span {
    @apply opacity-100 scale-125;
}

/* Mobile Menu Open */
#mobile-menu.open {
    display: flex;
    transform: translateX(0);
}

/* Popup Visible */
#cta-popup.visible {
    display: flex;
    opacity: 1;
}

#cta-popup.visible > div {
    transform: scale(1);
}

/* Sticky CTA Visible */
#sticky-cta.visible {
    display: block;
    opacity: 1;
    transform: translateY(0);
}
