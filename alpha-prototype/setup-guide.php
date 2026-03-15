<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Guide - The Stewardship Initiative</title>
    <!-- Favicon fix: The SVG data is now URL-encoded to ensure it's correctly interpreted by browsers. -->
    <link rel="icon" href="data:image/svg+xml,%3Csvg%20width='256'%20height='256'%20viewBox='0%200%20256%20256'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cpath%20d='M128%2024.5C142.5%2086.5%20219.5%2070%20230%20119C216%20126%20148.5%20142%20128%20231.5C107.5%20142%2040%20126%2026%20119C36.5%2070%20113.5%2086.5%20128%2024.5Z'%20fill='%23D90368'/%3E%3Cpath%20d='M231.5%20128C169.5%20113.5%20186%2036.5%20137%2026C129%2040%20113.5%20107.5%2044.5%20128C113.5%20148.5%20129%20216%20137%20230C186%20219.5%20169.5%20142.5%20231.5%20128Z'%20fill='%23D90368'/%3E%3Ccircle%20cx='128'%20cy='128'%20r='30'%20fill='%23FDB833'/%3E%3C/svg%3E">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        // Customizing Tailwind theme with our "Garden of Eden" color palette
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
                    }
                }
            }
        }
    </script>
    <style>
        /* Base styles for a calm, focused experience */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #022C22; /* jungle-green */
            color: #FDFDFF; /* orchid-white */
        }
        /* Styling for the step-by-step instruction cards */
        .step-card {
            background-color: #033F32; /* lush-teal */
            border: 1px solid rgba(253, 184, 51, 0.2);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .step-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
        }
        /* Large, clear numbers for each step */
        .step-number {
            color: #FDB833; /* marigold-yellow */
            font-weight: 800;
            font-size: 1.875rem; /* text-3xl */
            line-height: 1;
        }
        /* Consistent title styling */
        .step-title {
            color: #FDFDFF; /* orchid-white */
            font-weight: 700;
            font-size: 1.5rem; /* text-2xl */
        }
        /* Callout box for important tips, like handling the API key */
        .pro-tip {
            background-color: rgba(253, 184, 51, 0.05);
            border-left: 4px solid #FDB833; /* marigold-yellow */
            padding: 1rem 1.5rem;
            border-radius: 0 8px 8px 0;
            margin-top: 1.5rem;
        }
        /* Styling for inline code snippets */
        code {
            background-color: #022C22;
            padding: 0.2rem 0.5rem;
            border-radius: 6px;
            font-weight: 500;
            color: #E5E7EB; /* A slightly brighter gray for better visibility */
        }
    </style>
</head>
<body class="bg-jungle-green antialiased">

    <div class="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <!-- Header Section -->
        <header class="w-full max-w-5xl mx-auto mb-12">
            <!-- The H2 element is now wrapped in an anchor tag to link back to the homepage -->
            <a href="index.php">
                <h2 class="text-xl font-bold tracking-wider text-marigold-yellow hover:text-yellow-300 transition-colors">The Stewardship Initiative</h2>
            </a>
            <p class="text-sm text-light-gray">A <a href="https://simpli-fi-os.com" target="_blank" rel="noopener noreferrer" class="underline hover:text-white transition-colors">Simpli-FI OS</a> Initiative</p>
        </header>

        <!-- Main Content Wrapper -->
        <main class="w-full max-w-3xl mx-auto">
            <div class="text-center mb-16">
                <h1 class="text-4xl sm:text-5xl font-bold text-orchid-white mb-4">Let's Connect Your Community</h1>
                <p class="text-lg sm:text-xl text-light-gray max-w-2xl mx-auto">Follow these steps to set up the Notion backend for your private directory. It should only take about 5-7 minutes.</p>
            </div>

            <!-- Step 1: Duplicate Notion Template -->
            <div id="step-1" class="step-card">
                <div class="flex items-start gap-6">
                    <div class="step-number">1</div>
                    <div>
                        <h2 class="step-title mb-4">Duplicate the Master Template</h2>
                        <p class="text-light-gray mb-6">
                            This is the heart of your directory. Click the button below to open our pre-built template in a new tab. Once it loads, click the <strong>"Duplicate"</strong> button in the top-right corner of the Notion page to copy it into your own private workspace.
                        </p>
                        <a href="https://simpli-fi.notion.site/21d42ea8d87680cd9bc7c287b5106980?v=21d42ea8d87681ad8bb7000c54a9ad50" target="_blank" rel="noopener noreferrer" class="inline-block bg-marigold-yellow text-jungle-green font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                            Open Notion Template
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Step 2: Create a Notion Integration & Get API Key -->
            <div id="step-2" class="step-card">
                <div class="flex items-start gap-6">
                    <div class="step-number">2</div>
                    <div>
                        <h2 class="step-title mb-4">Create an Integration & Get Your API Key</h2>
                        <p class="text-light-gray mb-4">
                            Next, you'll create a private "integration" to allow our secure web app to read your directory data.
                        </p>
                        <ol class="list-decimal list-inside text-light-gray space-y-3 mb-6">
                            <li>Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" class="text-marigold-yellow underline">Notion's "My Integrations" page</a>.</li>
                            <li>Click the <strong>"+ New integration"</strong> button.</li>
                            <li>Give it a memorable name, like <code>TSI Church Directory</code>.</li>
                            <li>Select the correct Notion Workspace where you duplicated the template.</li>
                            <li>Under "Capabilities," ensure <strong>"Read content"</strong> is selected. No other permissions are needed.</li>
                            <li>Click <strong>"Submit"</strong>. You will be taken to a page showing your integration's secret token.</li>
                        </ol>

                        <div class="pro-tip">
                            <h3 class="font-bold text-orchid-white mb-2">CRITICAL: Your API Key (Secret Token)</h3>
                            <p class="text-light-gray">On the final screen, Notion will show a secret token that starts with <code>secret_...</code>. This is your API Key. <strong>Treat this key like a password.</strong> Click "Show" and then "Copy". You will need this key later to connect your directory to our web app.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 3: Connect the Database to the Integration -->
            <div id="step-3" class="step-card">
                <div class="flex items-start gap-6">
                    <div class="step-number">3</div>
                    <div>
                        <h2 class="step-title mb-4">Connect Your New Database</h2>
                        <p class="text-light-gray mb-4">
                           The final step is to give your new, private integration permission to access the directory you just duplicated.
                        </p>
                        <ol class="list-decimal list-inside text-light-gray space-y-3 mb-6">
                            <li>Go back to the duplicated <strong>"TSI Master Directory"</strong> page in your Notion workspace.</li>
                            <li>Click the three-dots menu (<code>...</code>) in the top-right corner of the page.</li>
                            <li>Near the bottom of the menu, click <strong>"+ Add connections"</strong>.</li>
                            <li>Find and select the integration you just created (e.g., <code>TSI Church Directory</code>) from the list.</li>
                            <li>Click <strong>"Confirm"</strong>.</li>
                        </ol>
                        <!-- NEW SECTION: Added a pro-tip about using Notion Forms -->
                        <div class="pro-tip">
                            <h3 class="font-bold text-orchid-white mb-2">Pro-Tip: Use a Notion Form for Submissions</h3>
                            <p class="text-light-gray">Instead of giving every member access to the full database, you can create a <a href="https://www.notion.so/help/forms" target="_blank" class="text-marigold-yellow underline">Notion Form</a> from your "Skills & Services" database view. Simply share the link to this form. Members can submit their information easily, and it will automatically populate your directory without them ever needing to see the full backend.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Step 4: Next Steps & Inviting Members -->
             <div class="text-center my-16 p-8 bg-lush-teal rounded-xl border border-marigold-yellow/20">
                <h2 class="text-3xl font-bold text-orchid-white mb-4">Setup Complete! What's Next?</h2>
                <p class="text-lg text-light-gray max-w-3xl mx-auto mb-6">
                    Your directory backend is now ready. The next crucial step is to connect it to the TSI web application by providing your API Key. This will generate a beautiful, private, and searchable directory page exclusively for your community.
                </p>
                <p class="text-lg text-light-gray max-w-3xl mx-auto mb-6">
                    Once your directory is live, you can invite your members. They will go to our website, find your organization, and be able to browse the skills and services available within your trusted community.
                </p>
                <a href="#" class="inline-block bg-marigold-yellow text-jungle-green font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                    Connect Your API Key & Launch Your Directory
                </a>
             </div>
        </main>
        
        <!-- Footer -->
        <footer class="w-full max-w-6xl mx-auto text-center py-6 mt-auto">
            <div class="pt-6 border-t border-gray-700/50">
                 <a href="index.php" class="text-orchid-white font-semibold hover:text-marigold-yellow underline underline-offset-4 transition-colors">
                      &larr; Back to Home
                 </a>
            </div>
        </footer>
    </div>

</body>
</html>
