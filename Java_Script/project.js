/**
 * Project Display Logic
 * Dynamically fetches the README.md file of a specified GitHub repository
 * and parses it into HTML using Marked.js.
 */

document.addEventListener('DOMContentLoaded', async function () {
    const githubUsername = "SantoshDhanvade";
    
    // Get project repository name from URL parameter (e.g., project.html?repo=TicTacToe)
    const urlParams = new URLSearchParams(window.location.search);
    const repoName = urlParams.get('repo');
    
    const contentContainer = document.getElementById('project-content');

    if (!repoName) {
        contentContainer.innerHTML = getNotFoundHTML("No repository name provided in the URL.");
        return;
    }

    try {
        // Fetch the README directly from GitHub API
        // Using application/vnd.github.v3.raw gets us plain text markdown instead of encoded JSON
        const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/readme`, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw'
            }
        });

        if (response.ok) {
            const markdownText = await response.text();
            
            // Parse Markdown to HTML using Marked.js
            contentContainer.innerHTML = marked.parse(markdownText);
            
        } else if (response.status === 404) {
            // README doesn't exist
            contentContainer.innerHTML = `
                <div style="text-align:center; padding: 40px;">
                    <h2 style="margin-bottom:10px;">README Not Found</h2>
                    <p style="color: #64748b; margin-bottom: 20px;">
                        This repository (${repoName}) doesn't have a README.md file yet.
                    </p>
                    <a href="https://github.com/${githubUsername}/${repoName}" target="_blank" class="button-primary">
                        View directly on GitHub
                    </a>
                </div>
            `;
        } else {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching README:", error);
        contentContainer.innerHTML = getNotFoundHTML("Could not load the project details due to a network error or rate limit.");
    }

    /**
     * Generate HTML for error/not found state
     */
    function getNotFoundHTML(message) {
        return `
            <div style="text-align:center; padding: 40px;">
                <h2 style="margin-bottom:10px;">Oops!</h2>
                <p style="color: #64748b; margin-bottom: 20px;">${message}</p>
                <a href="index.html#projects" class="button-primary">Return to Projects</a>
            </div>
        `;
    }
});