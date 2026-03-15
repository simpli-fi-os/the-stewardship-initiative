<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Stewardship Initiative - Unlock Your Community's Potential</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤝</text></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #FFFFFF;
            color: #111827; /* Gray-900 */
        }
        .section {
            padding: 6rem 1rem;
        }
        .stat-card {
            background-color: #F9FAFB; /* Gray-50 */
            border: 1px solid #F3F4F6; /* Gray-100 */
            border-radius: 0.75rem;
            padding: 2rem;
            text-align: center;
        }
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body class="antialiased">

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav class="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">The Stewardship Initiative</h1>
            <a href="#setup" class="bg-gray-800 text-white font-semibold py-2 px-5 rounded-lg shadow-sm hover:bg-gray-700 transition-colors">
                Get Started
            </a>
        </nav>
    </header>

    <main>
        <!-- Hero Section -->
        <section class="section bg-white text-center">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">Your Community's Greatest Resource is Already Here.</h2>
                <p class="mt-6 text-lg md:text-xl text-gray-600">Within your church, there's a wealth of talent, wisdom, and professional skill. Lawyers, doctors, accountants, tradespeople, and counselors sit in your pews every week. The Stewardship Initiative is the bridge to connect them.</p>
                <a href="#setup" class="mt-8 inline-block bg-gray-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                    Onboard Your Community
                </a>
            </div>
        </section>

        <!-- The Problem Section with Stats -->
        <section class="section bg-gray-50">
            <div class="container mx-auto max-w-5xl text-center">
                <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900">The Connection Gap: Unlocking Hidden Potential</h3>
                <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Even in the most vibrant communities, there's a natural gap between those with skills and those with needs. Good intentions get lost in the noise of daily life, and opportunities to serve go unseen.</p>
                <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="stat-card fade-in">
                        <p class="text-5xl font-extrabold text-gray-800">76%</p>
                        <p class="mt-2 font-semibold">of people believe it's important to volunteer their skills.</p>
                        <p class="mt-2 text-sm text-gray-500">Yet, a leading reason they don't is because they aren't aware of specific opportunities where their unique expertise is needed. (Source: Deloitte Volunteerism Survey)</p>
                    </div>
                    <div class="stat-card fade-in" style="transition-delay: 150ms;">
                        <p class="text-5xl font-extrabold text-gray-800">1 in 4</p>
                        <p class="mt-2 font-semibold">churchgoers feel disconnected from their community.</p>
                        <p class="mt-2 text-sm text-gray-500">Facilitating meaningful interactions beyond Sunday service is a primary challenge for church leaders looking to foster deep fellowship. (Source: Barna Group Study)</p>
                    </div>
                    <div class="stat-card fade-in" style="transition-delay: 300ms;">
                        <p class="text-5xl font-extrabold text-gray-800">90%</p>
                        <p class="mt-2 font-semibold">of requests for help in communities happen through informal, word-of-mouth networks.</p>
                        <p class="mt-2 text-sm text-gray-500">This often leaves out newcomers or those less socially connected, preventing them from accessing the full support of their community.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- The Solution Section (WHAT, WHY, HOW) -->
        <section class="section">
             <div class="container mx-auto max-w-5xl text-center">
                <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900">The Bridge: A Beautifully Simple Directory</h3>
                <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">The Stewardship Initiative (TSI) provides an elegant solution. We offer a sophisticated frontend application powered by a simple-to-manage Notion template, creating a private, searchable directory for your church community.</p>
                <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div class="fade-in">
                        <h4 class="text-xl font-bold mb-2">WHAT</h4>
                        <p class="text-gray-600">A clean, private web directory where members can list their professional skills, trades, and willingness to help. Members can easily search for services they need, from legal advice to plumbing help, all within their trusted community.</p>
                    </div>
                    <div class="fade-in" style="transition-delay: 150ms;">
                        <h4 class="text-xl font-bold mb-2">WHY</h4>
                        <p class="text-gray-600">To make the invisible visible. TSI empowers members to serve one another effectively, strengthens community bonds, and ensures that the incredible wealth of talent within your congregation is stewarded for the good of all.</p>
                    </div>
                    <div class="fade-in" style="transition-delay: 300ms;">
                        <h4 class="text-xl font-bold mb-2">HOW</h4>
                        <p class="text-gray-600">Your church administrator manages a simple Notion database. Members access the directory through our beautiful web app, which connects to that database using their personal Notion API key, ensuring data privacy and security.</p>
                    </div>
                </div>
             </div>
        </section>

        <!-- How It Works Section -->
        <section id="setup" class="section bg-gray-50">
            <div class="container mx-auto max-w-3xl text-center">
                <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900">Get Started in Three Simple Steps</h3>
                <p class="mt-4 text-lg text-gray-600">Launch your community's directory in minutes.</p>
                <div class="mt-12 space-y-12">
                    <div class="flex flex-col md:flex-row items-center text-left fade-in">
                        <div class="bg-gray-800 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">1</div>
                        <div class="md:ml-8 mt-4 md:mt-0">
                            <h4 class="text-xl font-bold">Duplicate Our Notion Template</h4>
                            <p class="mt-1 text-gray-600">With one click, you'll get a copy of our pre-built, powerful Notion database template. This becomes the backend for your directory, fully owned and controlled by you.</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row items-center text-left fade-in">
                        <div class="bg-gray-800 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">2</div>
                        <div class="md:ml-8 mt-4 md:mt-0">
                            <h4 class="text-xl font-bold">Connect Your API Key</h4>
                            <p class="mt-1 text-gray-600">Our guided process will show you exactly how to generate your secure Notion API key and connect it to our web app. This ensures your data remains private to your organization.</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row items-center text-left fade-in">
                        <div class="bg-gray-800 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">3</div>
                        <div class="md:ml-8 mt-4 md:mt-0">
                            <h4 class="text-xl font-bold">Invite Your Community</h4>
                            <p class="mt-1 text-gray-600">Share a unique link to your new directory with your church members. They can browse, search, and connect, unlocking the collective power of your community.</p>
                        </div>
                    </div>
                </div>
                <a href="/setup-guide.php" class="mt-16 inline-block bg-gray-800 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                    Start the Setup Process
                </a>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-300">
        <div class="container mx-auto max-w-7xl py-12 px-4 text-center">
             <p>&copy; <?php echo date("Y"); ?> The Stewardship Initiative by Simpli-FI OS. All Rights Reserved.</p>
        </div>
    </footer>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, {
                threshold: 0.1
            });

            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        });
    </script>
</body>
</html>
