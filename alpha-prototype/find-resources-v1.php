<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Community is Here For You - The Stewardship Initiative</title>
    
    <!-- Social Media Preview Tags -->
    <meta property="og:title" content="Your Community is Here For You | The Stewardship Initiative">
    <meta property="og:description" content="Discover why asking for help is an act of strength that builds a more resilient and connected community for everyone.">
    <meta property="og:image" content="/images/Preview Card.PNG">
    <meta property="og:url" content="https://yourwebsite.com/find-resources.php">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Your Community is Here For You | The Stewardship Initiative">
    <meta name="twitter:description" content="Discover why asking for help is an act of strength that builds a more resilient and connected community for everyone.">
    <meta name="twitter:image" content="/images/Preview Card.PNG">

    <!-- Favicon -->
    <link rel="icon" type="image/jpeg" href="/images/favicon.jpg">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        // Customizing Tailwind theme with our "Garden of Eden" color palette + new colors
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'jungle-green': '#022C22',
                        'hibiscus-pink': '#D90368',
                        'marigold-yellow': '#FDB833',
                        'orchid-white': '#FDFDFF',
                        'lush-teal': '#033F32',
                        'light-gray': '#D1D5DB',
                        'redwood': '#A44A3F',
                        'tidal-teal': '#26A69A'
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #022C22;
            color: #FDFDFF;
        }
        .support-card {
            background-color: #033F32;
            border: 1px solid rgba(253, 184, 51, 0.3); /* marigold-yellow with opacity */
            padding: 2.5rem;
            border-radius: 12px;
        }
        .stat-number {
            font-size: 4.5rem;
            font-weight: 800;
            color: #FDB833; /* marigold-yellow */
            line-height: 1;
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
    </style>
</head>
<body class="bg-jungle-green antialiased">

    <div class="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <!-- Header -->
        <header class="w-full max-w-6xl mx-auto mb-16">
            <a href="index.php">
                 <h2 class="text-xl font-bold tracking-wider text-marigold-yellow hover:text-yellow-300 transition-colors">The Stewardship Initiative</h2>
            </a>
            <p class="text-sm text-light-gray">A <a href="https://simpli-fi-os.com" target="_blank" rel="noopener noreferrer" class="underline hover:text-white transition-colors">Simpli-FI OS</a> Initiative</p>
        </header>

        <!-- Main Content -->
        <main class="w-full max-w-4xl mx-auto">

            <!-- Hero Section -->
            <section class="text-center mb-20 fade-in-section">
                <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-orchid-white mb-6">It's an Act of Strength <br> to Ask for Help.</h1>
                <p class="text-lg sm:text-xl text-light-gray max-w-3xl mx-auto mb-10">We've been taught that asking for help is a sign of weakness. It's not. It's a sign of courage, and it's the very thing that turns a group of people into a true community.</p>
                <a href="#cta" class="inline-block bg-marigold-yellow text-jungle-green font-bold py-4 px-10 rounded-lg text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                    Find Your Community's Directory
                </a>
            </section>

            <!-- Section 1: The Blessing of Giving -->
            <section class="mb-24 fade-in-section">
                <div class="text-center mb-12">
                    <h2 class="text-3xl sm:text-4xl font-bold text-orchid-white">Your Need is Their <span class="text-hibiscus-pink">Purpose</span></h2>
                    <p class="mt-4 text-lg text-light-gray">You are not a burden. By reaching out, you are giving someone else a blessing: the opportunity to serve.</p>
                </div>
                <div class="support-card text-center">
                    <h3 class="text-2xl font-bold text-orchid-white mb-2">The "Helper's High" is Real.</h3>
                    <p class="text-light-gray max-w-2xl mx-auto">Neuroscience shows that helping others triggers the release of oxytocin, serotonin, and dopamine in the brain. These powerful chemicals lower stress and increase feelings of happiness and connection. When you ask for help, you are giving a gift to the person who provides it.</p>
                </div>
            </section>

            <!-- Section 2: Building a Resilient Community -->
            <section class="mb-24 fade-in-section">
                 <div class="text-center mb-12">
                    <h2 class="text-3xl sm:text-4xl font-bold text-orchid-white">Every Request Weaves a <span class="text-tidal-teal">Stronger Web</span></h2>
                    <p class="mt-4 text-lg text-light-gray">A healthy community isn't one where no one has problems. It's one where problems are met with support.</p>
                </div>
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="support-card flex flex-col justify-center items-center text-center">
                        <div class="stat-number">4x</div>
                        <p class="mt-4 text-lg text-light-gray">People with strong social relationships are up to four times more likely to be resilient in the face of life's major stressors.</p>
                    </div>
                     <div class="support-card flex flex-col justify-center items-center text-center">
                        <p class="text-2xl font-semibold text-orchid-white">Each connection made—every ride given, every meal shared, every question answered—strengthens the entire community, making it healthier and more resilient for everyone.</p>
                    </div>
                </div>
            </section>
            
            <!-- Link to Commercial Services -->
            <section class="text-center mb-24 fade-in-section">
                <div class="p-6 bg-lush-teal rounded-lg border border-gray-700/50">
                    <h3 class="font-semibold text-orchid-white">Looking to hire for a business or a paid project?</h3>
                    <p class="text-sm text-light-gray mt-1">For commercial or professional services, our partner platform at <a href="https://simpli-fi-os.com" target="_blank" rel="noopener noreferrer" class="text-marigold-yellow underline">Simpli-FI OS</a> connects you with trusted professionals.</p>
                </div>
            </section>
            
            <!-- Final CTA -->
            <section id="cta" class="text-center my-16 py-16 bg-hibiscus-pink rounded-xl fade-in-section">
                <h2 class="text-3xl sm:text-4xl font-bold text-jungle-green mb-4">Let Your Community In.</h2>
                <p class="text-lg text-orchid-white max-w-2xl mx-auto mb-8">Your community's network of skills, talents, and resources is waiting to help. Take the next step.</p>
                <a href="#" class="inline-block bg-marigold-yellow text-jungle-green font-bold py-4 px-10 rounded-lg text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                    Find Your Community's Directory
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
        // Simple scroll animation script
        const sections = document.querySelectorAll('.fade-in-section');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    </script>

</body>
</html>
