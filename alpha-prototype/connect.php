<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connect Your Directory - The Stewardship Initiative</title>
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
        body {
            font-family: 'Inter', sans-serif;
            background-color: #022C22;
            color: #FDFDFF;
        }
        .form-input {
            background-color: #033F32;
            border: 1px solid rgba(253, 184, 51, 0.3);
            color: #FDFDFF;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            width: 100%;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
            outline: none;
            border-color: #FDB833;
            box-shadow: 0 0 0 3px rgba(253, 184, 51, 0.3);
        }
        .info-box {
            background-color: rgba(3, 63, 50, 0.7);
            border-left: 4px solid #FDB833;
            padding: 1rem 1.5rem;
            border-radius: 0 8px 8px 0;
        }
    </style>
</head>
<body class="bg-jungle-green antialiased">

    <div class="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <!-- Header Section -->
        <header class="w-full max-w-5xl mx-auto mb-12">
            <a href="index.php">
                <h2 class="text-xl font-bold tracking-wider text-marigold-yellow hover:text-yellow-300 transition-colors">The Stewardship Initiative</h2>
            </a>
            <p class="text-sm text-light-gray">A <a href="https://simpli-fi-os.com" target="_blank" rel="noopener noreferrer" class="underline hover:text-white transition-colors">Simpli-FI OS</a> Initiative</p>
        </header>

        <!-- Main Content Wrapper -->
        <main class="w-full max-w-xl mx-auto">
            <div class="text-center mb-12">
                <h1 class="text-4xl sm:text-5xl font-bold text-orchid-white mb-4">The Final Step</h1>
                <p class="text-lg sm:text-xl text-light-gray">Connect your directory to generate your private, beautiful, and searchable community page.</p>
            </div>

            <!-- Connection Form -->
            <!-- The 'action' attribute points to a backend script that will process the data. -->
            <form action="process_connection.php" method="POST" class="space-y-8">
                
                <!-- API Key Input -->
                <div>
                    <label for="notion_api_key" class="block text-lg font-semibold text-orchid-white mb-2">Notion API Key</label>
                    <p class="text-sm text-light-gray mb-3">This is the 'Internal Integration Token' you copied in Step 2. It starts with <code>secret_</code>.</p>
                    <input type="password" id="notion_api_key" name="notion_api_key" class="form-input" placeholder="secret_..." required>
                </div>

                <!-- Database ID Input -->
                <div>
                    <label for="database_id" class="block text-lg font-semibold text-orchid-white mb-2">Notion Database ID</label>
                     <div class="info-box mb-4">
                        <h4 class="font-bold text-marigold-yellow">How to find your Database ID:</h4>
                        <p class="text-sm text-light-gray mt-2">
                            1. Go to your duplicated Notion template page.<br>
                            2. Look at the URL in your browser's address bar.<br>
                            3. The Database ID is the long string of letters and numbers after your workspace name and before the question mark (?).
                        </p>
                        <p class="text-xs text-gray-400 mt-2">Example: <code>https://www.notion.so/your-workspace/</code><strong class="text-marigold-yellow">21d42ea8d87680cd9bc7c287b5106980</strong><code>?v=...</code></p>
                    </div>
                    <input type="text" id="database_id" name="database_id" class="form-input" placeholder="Paste your Database ID here" required>
                </div>

                <!-- Security Note -->
                <div class="flex items-start gap-3 p-4 bg-lush-teal rounded-lg border border-gray-700/50">
                    <div>
                        <svg class="h-6 w-6 text-marigold-yellow mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-bold text-orchid-white">Your Security is Our Priority</h4>
                        <p class="text-sm text-light-gray mt-1">Your API key will be handled with encryption and is only used to establish a secure, read-only connection to your directory. It is not stored in a recoverable format.</p>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-4">
                    <button type="submit" class="w-full bg-marigold-yellow text-jungle-green font-bold py-4 px-8 rounded-lg text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50">
                        Generate My Directory
                    </button>
                </div>
            </form>
        </main>
        
        <!-- Footer -->
        <footer class="w-full max-w-6xl mx-auto text-center py-6 mt-auto">
            <div class="pt-8 mt-8 border-t border-gray-700/50">
                 <a href="setup-guide.php" class="text-orchid-white font-semibold hover:text-marigold-yellow underline underline-offset-4 transition-colors">
                      &larr; Back to Setup Guide
                 </a>
            </div>
        </footer>
    </div>

</body>
</html>
