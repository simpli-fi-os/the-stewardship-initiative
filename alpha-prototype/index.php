<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Stewardship Initiative</title>
    
    <!-- Social Media & SEO Tags -->
    <meta name="description" content="Within every community lies a network of trusted skills and generous hearts. We make them visible, connecting member needs with member gifts, and strengthening the entire fellowship from within.">
    <link rel="canonical" href="https://thestewardshipinitiative.org/index.php" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="The Stewardship Initiative" />
    <meta property="og:description" content="Within every community lies a network of trusted skills and generous hearts. We make them visible, connecting member needs with member gifts." />
    <meta property="og:url" content="https://thestewardshipinitiative.org/index.php" />
    <meta property="og:site_name" content="The Stewardship Initiative" />
    <meta property="og:image" content="https://thestewardshipinitiative.org/images/preview-card.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Hunter_Lott_" />
    <meta name="twitter:title" content="The Stewardship Initiative" />
    <meta name="twitter:description" content="Within every community lies a network of trusted skills and generous hearts. We make them visible, connecting member needs with member gifts." />
    <meta name="twitter:image" content="https://thestewardshipinitiative.org/images/preview-card.png" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/images/favicon.png">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&display=swap" rel="stylesheet">
    <script>
        // Customizing Tailwind theme
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
        /* Base styles */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #022C22; /* jungle-green */
            color: #FDFDFF; /* orchid-white */
            overflow-x: hidden;
        }

        /* The canvas is always fixed in the background */
        #constellation-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }

        /* The content-overlay is now just a container */
        .content-overlay {
            position: relative;
            z-index: 1;
        }
        
        /* New rules for staggered fade-in effect */
        .fade-in-headline, .fade-in-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 2s ease-in-out, transform 2s ease-in-out;
        }

        .fade-in-headline.visible, .fade-in-item.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Heartbeat animation */
        .beating-heart {
            display: inline-block;
            animation: heartbeat 2s ease-in-out infinite;
        }
        @keyframes heartbeat {
            0% { transform: scale(1); }
            10% { transform: scale(1.1); }
            20% { transform: scale(1); }
            30% { transform: scale(1.25); }
            45% { transform: scale(1); }
            100% { transform: scale(1); }
        }
    </style>
</head>
<body class="bg-jungle-green">

    <canvas id="constellation-canvas"></canvas>

    <div class="content-overlay flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <!-- Added .fade-in-item class for staggered animation -->
        <header class="w-full max-w-6xl mx-auto fade-in-item">
            <a href="index.php">
                 <h2 class="text-xl font-bold tracking-wider text-marigold-yellow hover:text-yellow-300 transition-colors">The Stewardship Initiative</h2>
            </a>
            <p class="text-sm text-light-gray">A <a href="https://simpli-fi-os.com" target="_blank" rel="noopener noreferrer" class="underline hover:text-white transition-colors">Simpli-FI OS</a> Initiative</p>
        </header>

        <!-- Main Content -->
        <main class="flex-grow flex items-center justify-center text-center">
            <div class="w-full max-w-4xl mx-auto">
                <!-- Added .fade-in-headline class for staggered animation -->
                <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 fade-in-headline">
                    Discover the <span class="font-bold text-hibiscus-pink beating-heart">Heart</span> <br class="hidden sm:block"> of Your Community.
                </h1>
                <!-- Added .fade-in-item class -->
                <p class="text-base sm:text-lg md:text-xl text-orchid-white max-w-2xl mx-auto mb-10 fade-in-item">
                    Within every community lies a network of trusted skills and generous hearts. We make them visible, connecting member needs with member gifts, and strengthening the entire fellowship from within.
                </p>
                <!-- Added .fade-in-item class to the parent div -->
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-item">
                    <a href="find-resources.php" class="w-full sm:w-auto text-center bg-transparent border-2 border-marigold-yellow text-marigold-yellow font-bold py-3 px-8 rounded-lg text-lg hover:bg-marigold-yellow hover:text-jungle-green transition-all duration-300">
                        Find Resources
                    </a>
                    <a href="#" class="w-full sm:w-auto text-center bg-transparent border-2 border-marigold-yellow text-marigold-yellow font-bold py-3 px-8 rounded-lg text-lg hover:bg-marigold-yellow hover:text-jungle-green transition-all duration-300">
                        Share Your Gifts
                    </a>
                </div>
            </div>
        </main>

        <!-- Added .fade-in-item class -->
        <footer class="w-full max-w-6xl mx-auto text-center py-6 fade-in-item">
            <div class="pt-6">
                 <p class="text-light-gray">Is your church or organization ready to connect?</p>
                 <a href="onboard.php" class="text-orchid-white font-semibold hover:text-marigold-yellow underline underline-offset-4 transition-colors">
                      Learn More & Onboard Your Community
                 </a>
            </div>
        </footer>
    </div>

    <script>
        // --- Constellation Loading Sequence Script ---
        const canvas = document.getElementById('constellation-canvas');
        const ctx = canvas.getContext('2d');
        let particlesArray;
        
        let animationStartTime = 0;
        let connectionProgress = 0;
        // UPDATE: Increased delay before connections start.
        const connectionDelay = 3000; // Unconnected dots last for 3 seconds.
        const connectionDuration = 4000;

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor(x, y, directionX, directionY, size) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(253, 253, 255, 0.4)';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX; this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 1.5) + 1;
                let x = (Math.random() * (innerWidth - size * 2)) + size * 2;
                let y = (Math.random() * (innerHeight - size * 2)) + size * 2;
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                particlesArray.push(new Particle(x, y, directionX, directionY, size));
            }
        }
        
        function connect() {
            const maxDistanceSq = ((canvas.width / 7) ** 2);
            const currentDistanceSq = maxDistanceSq * connectionProgress;
            
            if (currentDistanceSq === 0) return;

            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (distance < currentDistanceSq) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(253, 253, 255, ${opacityValue * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate(timestamp) {
            if (!animationStartTime) {
                animationStartTime = timestamp;
            }
            const elapsed = timestamp - animationStartTime;

            if (elapsed > connectionDelay) {
                const progress = (elapsed - connectionDelay) / connectionDuration;
                connectionProgress = Math.min(progress, 1);
            }
            
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particlesArray.forEach(p => p.update());
            connect();
        }

        // --- Orchestration of the loading sequence ---
        window.onload = function() {
            setCanvasSize();
            init();
            requestAnimationFrame(animate);

            // UPDATE: Pushed back the timing for content reveal.
            // STAGE 1: Fade in the main headline after 5 seconds.
            setTimeout(() => {
                document.querySelector('.fade-in-headline').classList.add('visible');
            }, 5000);

            // STAGE 2: Fade in the rest of the items 2 seconds later (at the 7-second mark).
            setTimeout(() => {
                document.querySelectorAll('.fade-in-item').forEach(item => {
                    item.classList.add('visible');
                });
            }, 7000);
        };
        
        window.addEventListener('resize', () => { 
            setCanvasSize(); 
            init(); 
        });
    </script>
</body>
</html>
