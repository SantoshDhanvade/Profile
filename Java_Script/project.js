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

    // Update header GitHub link to point to specific project repo
    if (repoName) {
        const headerGithubLink = document.getElementById('header-github-link');
        const githubLinkText = document.getElementById('github-link-text');
        if (headerGithubLink && githubLinkText) {
            headerGithubLink.href = `https://github.com/${githubUsername}/${repoName}`;
            githubLinkText.textContent = repoName;
        }
    }

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
            
            // Add "View on GitHub" button after content
            const viewOnGitHubBtn = document.createElement('div');
            viewOnGitHubBtn.innerHTML = `
                <a href="https://github.com/${githubUsername}/${repoName}" target="_blank" class="github-repo-link">
                    <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.12.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.28.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    View on GitHub
                </a>
            `;
            contentContainer.appendChild(viewOnGitHubBtn);
            
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