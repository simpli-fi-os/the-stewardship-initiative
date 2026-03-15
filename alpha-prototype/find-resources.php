<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Community is Here For You - The Stewardship Initiative</title>
    
    <!-- Social Media Preview Tags -->
    <meta property="og:title" content="Your Community is Here For You | The Stewardship Initiative for The Village Church">
    <meta property="og:description" content="See how we're helping The Village Church live out its mission to love people and bear one another's burdens.">
    <meta property="og:image" content="https://placehold.co/1200x630/022C22/FDB833?text=The+Stewardship+Initiative">
    <meta property="og:url" content="https://www.thevillagechurch.net/tsi/find-resources">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Your Community is Here For You | The Stewardship Initiative for The Village Church">
    <meta name="twitter:description" content="See how we're helping The Village Church live out its mission to love people and bear one another's burdens.">
    <meta name="twitter:image" content="https://placehold.co/1200x630/022C22/FDB833?text=The+Stewardship+Initiative">

    <!-- Favicon -->
    <link rel="icon" type="image/jpeg" href="/images/favicon.jpg">
    
    <!-- Tailwind CSS via Play CDN -->
    <!-- DEVELOPER NOTE: This is for rapid prototyping. A PostCSS build step is required for production to optimize performance. -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    
    <script>
        // Customizing Tailwind theme with our "Garden of Eden" color palette
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'sans': ['Inter', 'sans-serif'],
                        'serif': ['Playfair Display', 'serif'],
                    },
                    colors: {
                        'jungle-green': '#022C22',
                        'hibiscus-pink': '#D90368',
                        'marigold-yellow': '#FDB833',
                        'orchid-white': '#FDFDFF',
                        'lush-teal': '#033F32',
                        'light-gray': '#D1D5DB',
                        'tidal-teal': '#26A69A'
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #022C22; /* jungle-green */
            color: #FDFDFF; /* orchid-white */
        }
        .support-card {
            background-color: #033F32; /* lush-teal */
            border: 1px solid rgba(253, 184, 51, 0.3); /* marigold-yellow with opacity */
            padding: 2.5rem;
            border-radius: 12px;
        }
        blockquote {
            border-left: 4px solid #FDB833; /* marigold-yellow */
            padding-left: 1.5rem;
            font-style: italic;
            color: #D1D5DB; /* light-gray */
        }
        /* Style for the interactive cards */
        .interactive-card {
            transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
        }
        .interactive-card:hover {
            transform: translate(-8px, -8px);
            box-shadow: 8px 8px 24px rgba(0, 0, 0, 0.3);
        }
        /* For scroll animations */
        .fade-in-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in-section.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        /* Ripple effect styles */
        .ripple-text span {
            display: inline-block;
            opacity: 0;
            animation: ripple 0.5s forwards;
        }
        .interactive-card:not(:hover) .ripple-text span {
            opacity: 1;
            animation: none;
        }
        @keyframes ripple {
            from {
                transform: translateY(10px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    </style>
</head>
<body class="bg-jungle-green antialiased">

    <div class="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <!-- Header -->
        <header class="w-full max-w-6xl mx-auto mb-16">
            <a href="index.php">
                <h2 class="text-xl font-bold tracking-wider text-marigold-yellow hover:text-yellow-300 transition-colors">The Stewardship Initiative</h2>
            </a>
            <p class="text-sm text-light-gray">An Alpha Project for The Village Church</p>
        </header>

        <!-- Main Content -->
        <main class="w-full max-w-4xl mx-auto">

            <!-- Hero Section -->
            <section class="text-center mb-20 fade-in-section">
                <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-orchid-white mb-6">Actively Participate in the<br>Body of Christ.</h1>
                <p class="text-lg sm:text-xl text-light-gray max-w-3xl mx-auto mb-10">Connecting with others is how we live as the body of Christ. This is an invitation to engage the skills and resources within our church family, strengthening the entire community.</p>
                <a href="village-directory.php" class="inline-block bg-marigold-yellow text-jungle-green font-bold py-4 px-10 rounded-lg text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                    Access The Village Directory
                </a>
            </section>

            <!-- Section 1: The Mission -->
            <section class="mb-24 fade-in-section">
                <div class="text-center mb-12">
                    <h2 class="font-serif text-3xl sm:text-4xl font-bold text-orchid-white">An Opportunity to <span class="text-hibiscus-pink">Love People</span></h2>
                    <p class="mt-4 text-lg text-light-gray">At The Village, our mission is to love God, love people, and make disciples. Engaging with this directory is a practical way to live out that mission.</p>
                </div>
                <div class="support-card interactive-card">
                    <blockquote class="mb-4">
                        <p class="text-xl ripple-text">"Bear one another's burdens, and so fulfill the law of Christ."</p>
                        <footer class="text-right mt-2 text-marigold-yellow">- Galatians 6:2 (ESV)</footer>
                    </blockquote>
                    <p class="text-light-gray mt-6">Your need for a helping hand, a professional skill, or simple advice is the very thing that allows another member to be a good steward of the gifts God has given them. This is how we build a true gospel-centered community—by actively meeting needs together.</p>
                </div>
            </section>

            <!-- Section 2: Building a Resilient Community -->
            <section class="mb-24 fade-in-section">
                 <div class="text-center mb-12">
                    <h2 class="font-serif text-3xl sm:text-4xl font-bold text-orchid-white">Stewards of God's <span class="text-tidal-teal">Varied Grace</span></h2>
                    <p class="mt-4 text-lg text-light-gray">Every connection made strengthens our church family for God's glory.</p>
                </div>
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="support-card interactive-card flex flex-col justify-center">
                        <blockquote class="mb-4">
                           <p class="text-xl ripple-text">"As each has received a gift, use it to serve one another, as good stewards of God's varied grace."</p>
                           <footer class="text-right mt-2 text-marigold-yellow">- 1 Peter 4:10 (ESV)</footer>
                        </blockquote>
                        <p class="mt-4 text-light-gray">This directory helps uncover the incredible gifts—legal advice, plumbing, graphic design, financial planning—that already exist right here within our church body.</p>
                    </div>
                     <div class="support-card interactive-card flex flex-col justify-center bg-gray-900/20">
                        <h3 class="font-serif text-2xl font-bold text-orchid-white mb-4">From The Village's Vision:</h3>
                        <p class="text-light-gray">"We desire to see the gospel not only be proclaimed but also be demonstrated through our lives. We want to be a people who are not only hearers of the Word but also doers of it."</p>
                    </div>
                </div>
            </section>
            
            <!-- Final CTA -->
            <section id="cta" class="text-center my-16 py-16 bg-hibiscus-pink rounded-xl fade-in-section">
                <h2 class="font-serif text-3xl sm:text-4xl font-bold text-jungle-green mb-4">Let Your Church Family In.</h2>
                <p class="text-lg text-orchid-white max-w-2xl mx-auto mb-8">The skills, talents, and resources of your brothers and sisters at The Village are waiting to help. Take the next step to connect.</p>
                <a href="village-directory.php" class="inline-block bg-marigold-yellow text-jungle-green font-bold py-4 px-10 rounded-lg text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                    Access The Village Directory
                </a>
            </section>

        </main>
        
        <!-- Footer -->
        <footer class="w-full max-w-6xl mx-auto text-center py-6 mt-auto">
            <div class="pt-8 mt-8 border-t border-gray-700/50">
                 <a href="index.php" class="text-orchid-white font-semibold hover:text-marigold-yellow underline underline-offset-4 transition-colors">
                      &larr; Back to Home
                 </a>
            </div>
        </footer>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // --- Scroll Animation Script ---
            const sections = document.querySelectorAll('.fade-in-section');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { threshold: 0.1 });
            sections.forEach(section => observer.observe(section));

            // --- Ripple Effect Script ---
            const rippleTexts = document.querySelectorAll('.ripple-text');
            rippleTexts.forEach(textContainer => {
                const text = textContainer.textContent;
                textContainer.innerHTML = ''; // Clear original text
                text.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    // Use a non-breaking space for actual spaces to maintain layout
                    if (char === ' ') {
                        span.innerHTML = '&nbsp;';
                    }
                    textContainer.appendChild(span);
                });

                const spans = textContainer.querySelectorAll('span');
                textContainer.closest('.interactive-card').addEventListener('mouseenter', () => {
                    spans.forEach((span, index) => {
                        span.style.animationDelay = `${index * 30}ms`;
                    });
                });
            });
        });
    </script>

</body>
</html>
