<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Village Church Directory - The Stewardship Initiative</title>
    
    <!-- Tailwind CSS & Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">

    <script>
        // Replicating The Village Church's brand theme
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'sans': ['Inter', 'sans-serif'],
                        'serif': ['Lora', 'serif'], 
                    },
                    colors: {
                        'tvc-gray': {
                            'dark': '#333333',
                            'medium': '#767676',
                            'light': '#F9F9F9',
                            'border': '#EAEAEA'
                        },
                        'tvc-blue': '#007398',
                        'tvc-banner-blue': '#082A52'
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #F9F9F9;
            color: #333333;
        }
        .card-image-container img {
            transition: filter 0.3s ease-in-out;
            filter: grayscale(100%);
            object-position: top;
        }
        .steward-card:hover .card-image-container img {
            filter: grayscale(0%);
        }
        .form-input:focus {
            outline: none;
            box-shadow: 0 0 0 2px #F9F9F9, 0 0 0 4px #007398;
        }
        .filter-pill.active {
            background-color: #333333 !important;
            color: #F9F9F9 !important;
            font-weight: 600;
        }
        .hero-image-container { height: 300px; }
        
        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(8, 42, 82, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        .modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        .modal-content {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.95);
            transition: transform 0.3s ease;
        }
        .modal-overlay.active .modal-content {
            transform: scale(1);
        }
        /* FIX: Added object-position: top to modal images as well */
        .modal-content img {
            object-position: top;
        }
    </style>
</head>
<body class="font-sans">

    <!-- Top Banner -->
    <div class="bg-tvc-gray-dark text-white text-center py-2 px-4">
        <a href="index.php" class="text-sm font-semibold tracking-wider hover:underline">The Stewardship Initiative</a>
    </div>

    <div class="container mx-auto p-4 sm:p-6 lg:p-8">

        <!-- Header Section -->
        <header class="mb-12">
            <div class="hero-image-container w-full mb-8 rounded-lg overflow-hidden shadow-lg">
                 <img src="https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d027908df-c101-4994-a244-13fcbbc118c9?w=1100&h=550&fit=crop&auto=compress&s=5c0dff85c8f2203030dc6e2f23a12111" alt="The Village Church Community" class="w-full h-full object-cover">
            </div>
            <div class="bg-tvc-banner-blue text-center text-tvc-gray-light p-8 rounded-lg shadow-md">
                <img src="https://www.thevillagechurch.net/Themes/TheVillageChurch/Assets/Images/primary-logo-white.svg" alt="The Village Church Logo" class="h-12 w-auto mx-auto mb-4">
                <h1 class="font-serif text-4xl md:text-5xl font-bold">Member & Skills Directory</h1>
                <p class="mt-2 text-lg opacity-90">Connecting needs with the giftedness of our church family.</p>
            </div>
        </header>

        <!-- Search & Filter Section -->
        <section id="filter-section" class="mb-12 p-6 bg-white rounded-lg shadow-md sticky top-4 z-10">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1">
                    <label for="name-search" class="block text-sm font-semibold text-tvc-gray-medium mb-1">Search by Name</label>
                    <input type="text" id="name-search" placeholder="e.g., Matt Chandler" class="form-input w-full px-4 py-2 border border-tvc-gray-border rounded-md transition">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-tvc-gray-medium mb-2">Filter by Gifting</label>
                    <div id="category-filters" class="flex flex-wrap gap-2"></div>
                </div>
            </div>
        </section>

        <!-- Directory Grid -->
        <main id="directory-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <!-- Steward Cards will be dynamically inserted here -->
        </main>
        
        <div id="no-results" class="hidden text-center py-16">
            <h3 class="font-serif text-2xl font-bold text-tvc-gray-dark">No Members Found</h3>
            <p class="text-tvc-gray-medium mt-2">Try adjusting your search or filter criteria.</p>
        </div>
    </div>

    <!-- Modal Structure -->
    <div id="steward-modal" class="modal-overlay">
        <div id="modal-content" class="modal-content">
            <!-- Dynamic content will be injected here -->
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // --- DATA SOURCE ---
        const stewards = [
            {
                id: 1,
                name: 'Matt Chandler',
                title: 'Elder, Lead Pastor',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3ddc2ef162-0e17-4de5-a0ce-f4c469c53118?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=b7e8c2969ce5548bc49be1b1334d3560',
                description: 'Offering guidance in leadership development, public speaking coaching, and theological resource recommendations.',
                bio: 'Matt Chandler serves as the Lead Pastor of The Village Church in Flower Mound, Texas. He came to The Village in 2002 and has since seen the church grow from 160 to thousands of members. Matt is also the president of the Acts 29 Network, a global family of church-planting churches. He is a frequent conference speaker and the author of several books, including "The Explicit Gospel." He and his wife, Lauren, have three children.',
                skills: ['Leadership', 'Teaching', 'Creative'],
                email: 'mchandler.tsi@example.com'
            },
            {
                id: 2,
                name: 'Maddie Clay',
                title: 'Events Coordinator',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3db723bd3c-6ba8-417f-b5fb-6ee215e1cc0b?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=28a44df9275513b02f5a0cdae60dc27b',
                description: 'Expert in planning and executing large-scale events. Can help with logistics, vendor coordination, and day-of management.',
                bio: 'Maddie Clay coordinates events for The Village Church, ensuring that gatherings run smoothly and effectively to foster community.',
                skills: ['Admin', 'Management'],
                email: 'mclay.tsi@example.com'
            },
            {
                id: 3,
                name: 'Josh Cockrum',
                title: 'High School Associate Minister',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3dd6673b94-aa2a-4652-afaa-5b124693fd17?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=9fd8dfa623e4260c8b1d4ed1db14c707',
                description: 'Passionate about mentoring high school students. Available for discipleship and student leadership training.',
                bio: 'Josh Cockrum serves in the high school ministry, helping students grow in their faith and navigate their teenage years.',
                skills: ['Teaching', 'Counseling'],
                email: 'jcockrum.tsi@example.com'
            },
            {
                id: 4,
                name: 'Kayley Cockrum',
                title: 'Events Coordinator',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d678fef78-0e19-4605-a404-2b7bbd7a1fdf?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=001bafac1a492a789dcfa07ced05f868',
                description: 'Specializes in creating welcoming environments for church events. Can offer advice on decor and hospitality.',
                bio: 'Kayley Cockrum works alongside the events team to create memorable and impactful experiences for the church community.',
                skills: ['Admin', 'Creative'],
                email: 'kcockrum.tsi@example.com'
            },
            {
                id: 5,
                name: 'Frankie Colombo',
                title: 'Facilities Technician I',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d5ddde929-0653-47c7-9f29-751d4d7800ca?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=67a3b1802c55369f1595d4238d376bfb',
                description: 'Skilled in general maintenance and repairs. Can help with basic plumbing, electrical, and carpentry tasks.',
                bio: 'Frankie Colombo helps maintain the church facilities, ensuring a safe and functional environment for ministry.',
                skills: ['Home Repair', 'Tech'],
                email: 'fcolombo.tsi@example.com'
            },
            {
                id: 6,
                name: 'Nick Crawford',
                title: 'Elder, Lead Pastor',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3dcf147e9f-8189-40e2-9866-e810eff9ea84?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=f03a74382a00160c43a3fa6f2c07b298',
                description: 'Experienced in pastoral leadership and church planting strategy. Available for ministry coaching.',
                bio: 'Nick Crawford serves as a lead pastor, focusing on church leadership and the development of new ministry initiatives.',
                skills: ['Leadership', 'Teaching'],
                email: 'ncrawford.tsi@example.com'
            },
            {
                id: 7,
                name: 'Jenni David',
                title: 'Childcare Coordinator',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d02942849-ddc1-465a-86b6-1d1517889943?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=7255059890b51e5c1f2cc84ca07ec4d5',
                description: 'Manages childcare services and volunteers. Can provide resources for family discipleship and parenting.',
                bio: 'Jenni David coordinates the childcare ministry, providing a safe and nurturing environment for the youngest members of the church.',
                skills: ['Admin', 'Counseling'],
                email: 'jdavid.tsi@example.com'
            },
            {
                id: 8,
                name: 'Laura Dunnican',
                title: 'Global Missions Mobilizer',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3deb76d697-53f7-4b18-9cfe-4cd1294cc735?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=4b4067931f7fb6821a7bba71965281bd',
                description: 'Connects members with global missions opportunities. Can offer guidance on cross-cultural ministry and support raising.',
                bio: 'Laura Dunnican mobilizes the church for global missions, equipping and sending members to serve around the world.',
                skills: ['Leadership', 'Admin'],
                email: 'ldunnican.tsi@example.com'
            },
            {
                id: 9,
                name: 'Bryan Eaton',
                title: 'Home Groups Minister',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d99904d02-b677-4f46-903b-7987418f21f4?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=21c01be3492e3e2fa1468cb022d1d5c5',
                description: 'Oversees the Home Groups ministry. Can provide training for group leaders and curriculum resources.',
                bio: 'Bryan Eaton is dedicated to fostering community and spiritual growth through the Home Groups ministry at The Village.',
                skills: ['Teaching', 'Leadership'],
                email: 'beaton.tsi@example.com'
            },
            {
                id: 10,
                name: 'Lindsey Eenigenburg',
                title: 'Executive Director, Engagement',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d5e9aad0f-73ab-4b73-99f2-8a96d1115d36?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=9fa39f9bb998dfae5690d227ec1f08d4',
                description: 'Focuses on connecting members to the church community. Can help with strategic communication and engagement planning.',
                bio: 'Lindsey Eenigenburg leads the engagement team, helping people get connected and involved in the life of the church.',
                skills: ['Management', 'Creative'],
                email: 'leenigenburg.tsi@example.com'
            },
            {
                id: 11,
                name: 'Justin Elafros',
                title: 'Minister, Senior Director, Adult Ministries',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3dcc96b990-ab81-4520-8a9a-6c34abee0e19?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=a490c2637cb02951bc6f794d099b4e72',
                description: 'Directs adult ministries, including classes and discipleship programs. Can offer curriculum development advice.',
                bio: 'Justin Elafros provides leadership to all adult ministries, ensuring there are clear pathways for spiritual growth.',
                skills: ['Leadership', 'Teaching', 'Management'],
                email: 'jelafros.tsi@example.com'
            },
            {
                id: 12,
                name: 'Rachel Ellis',
                title: 'Missions Coordinator',
                imageUrl: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d25bad8d6-cc1a-4c05-a64b-e68b25544632?w=798&h=1000&fit=crop&crop=faces&auto=compress,format&s=c4633105b3b62730caedceedfa1afb33',
                description: 'Coordinates logistics for local and global missions efforts. Can help with trip planning and administrative support.',
                bio: 'Rachel Ellis supports the missions ministry through administrative and logistical coordination, helping to advance the gospel locally and globally.',
                skills: ['Admin', 'Finance'],
                email: 'rellis.tsi@example.com'
            }
        ];

        const grid = document.getElementById('directory-grid');
        const nameSearch = document.getElementById('name-search');
        const categoryFiltersContainer = document.getElementById('category-filters');
        const noResultsMessage = document.getElementById('no-results');
        const modal = document.getElementById('steward-modal');
        const modalContent = document.getElementById('modal-content');

        const skillColors = { 'Leadership': 'bg-red-500', 'Teaching': 'bg-blue-500', 'Creative': 'bg-purple-500', 'Management': 'bg-yellow-500', 'Finance': 'bg-green-500', 'Admin': 'bg-gray-500', 'Home Repair': 'bg-orange-500', 'Counseling': 'bg-teal-500', 'Legal': 'bg-indigo-500', 'Tech': 'bg-pink-500', 'Music': 'bg-sky-500', 'Default': 'bg-slate-500' };

        let activeCategory = 'All';

        function renderCards(filteredStewards) {
            grid.innerHTML = '';
            noResultsMessage.style.display = filteredStewards.length === 0 ? 'block' : 'none';
            
            filteredStewards.forEach(steward => {
                const skillPills = steward.skills.map(skill => `<span class="text-xs font-semibold text-white px-2 py-1 rounded-full ${skillColors[skill] || skillColors.Default}">${skill}</span>`).join('');
                const cardHtml = `
                    <div class="steward-card bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl cursor-pointer" data-id="${steward.id}">
                        <div class="card-image-container overflow-hidden h-64">
                            <img src="${steward.imageUrl}" alt="${steward.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/400x400/F9F9F9/333333?text=Photo+Not+Found';">
                        </div>
                        <div class="p-5 flex-grow flex flex-col">
                            <h3 class="font-serif text-xl font-bold text-tvc-gray-dark">${steward.name}</h3>
                            <p class="text-sm text-tvc-gray-medium mb-3">${steward.title}</p>
                            <p class="text-sm text-tvc-gray-dark flex-grow">${steward.description}</p>
                        </div>
                        <div class="p-5 border-t border-tvc-gray-border bg-tvc-gray-light/50">
                             <div class="flex flex-wrap gap-2">
                                ${skillPills}
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += cardHtml;
            });
        }
        
        function openModal(stewardId) {
            const steward = stewards.find(s => s.id == stewardId);
            if (!steward) return;

            const skillPills = steward.skills.map(skill => `<span class="text-xs font-semibold text-white px-2 py-1 rounded-full ${skillColors[skill] || skillColors.Default}">${skill}</span>`).join('');

            modalContent.innerHTML = `
                <div class="relative">
                    <button id="close-modal" class="absolute top-2 right-4 text-tvc-gray-medium hover:text-tvc-gray-dark text-3xl font-bold">&times;</button>
                    <div class="p-6 md:p-8">
                        <div class="flex flex-col sm:flex-row gap-6 items-start">
                            <img src="${steward.imageUrl}" alt="${steward.name}" class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-md flex-shrink-0" onerror="this.onerror=null;this.src='https://placehold.co/400x400/F9F9F9/333333?text=Photo';">
                            <div>
                                <h2 class="font-serif text-3xl font-bold text-tvc-gray-dark">${steward.name}</h2>
                                <p class="text-md text-tvc-gray-medium">${steward.title}</p>
                                <div class="flex flex-wrap gap-2 mt-3">${skillPills}</div>
                            </div>
                        </div>
                        <div class="mt-6 border-t border-tvc-gray-border pt-6">
                            <h4 class="font-sans text-sm font-bold uppercase text-tvc-gray-medium tracking-wider">About</h4>
                            <p class="mt-2 text-tvc-gray-dark leading-relaxed">${steward.bio}</p>
                            
                            <h4 class="font-sans text-sm font-bold uppercase text-tvc-gray-medium tracking-wider mt-6">Services Offered</h4>
                            <p class="mt-2 text-tvc-gray-dark leading-relaxed">${steward.description}</p>
                        </div>
                    </div>
                    <div class="p-6 bg-tvc-gray-light border-t border-tvc-gray-border flex items-center gap-4">
                        <a href="mailto:${steward.email}" class="flex-1 text-center bg-tvc-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-tvc-blue/80 transition">Contact ${steward.name.split(' ')[0]}</a>
                        <button disabled class="flex-1 text-center bg-tvc-gray-medium/50 text-white px-4 py-2 rounded-md text-sm font-semibold cursor-not-allowed" title="Scheduling Feature Coming Soon">Schedule</button>
                    </div>
                </div>
            `;
            modal.classList.add('active');
            document.getElementById('close-modal').addEventListener('click', closeModal);
        }

        function closeModal() {
            modal.classList.remove('active');
        }

        function applyFilters() {
            const searchTerm = nameSearch.value.toLowerCase();
            const filtered = stewards.filter(steward => {
                const nameMatch = steward.name.toLowerCase().includes(searchTerm);
                const categoryMatch = activeCategory === 'All' || steward.skills.includes(activeCategory);
                return nameMatch && categoryMatch;
            });
            renderCards(filtered);
        }

        function createCategoryFilters() {
            const categories = ['All', ...new Set(stewards.flatMap(s => s.skills))];
            categoryFiltersContainer.innerHTML = categories.map(cat => 
                `<button class="filter-pill ${cat === 'All' ? 'active' : ''} text-sm font-medium text-tvc-gray-medium bg-tvc-gray-light px-3 py-1 rounded-full border border-tvc-gray-border hover:bg-tvc-gray-dark hover:text-white transition" data-category="${cat}">${cat}</button>`
            ).join('');

            document.querySelectorAll('.filter-pill').forEach(pill => {
                pill.addEventListener('click', function() {
                    document.querySelector('.filter-pill.active').classList.remove('active');
                    this.classList.add('active');
                    activeCategory = this.dataset.category;
                    applyFilters();
                });
            });
        }

        // --- Event Listeners ---
        nameSearch.addEventListener('input', applyFilters);
        grid.addEventListener('click', function(e) {
            const card = e.target.closest('.steward-card');
            if (card) {
                openModal(card.dataset.id);
            }
        });
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // --- INITIALIZATION ---
        createCategoryFilters();
        renderCards(stewards);
    });
    </script>
</body>
</html>
