/**
 * Santosh Dhanvade Portfolio Logic
 * Handles dynamic GitHub repository fetching, LeetCode stats, and certificates
 */

document.addEventListener('DOMContentLoaded', function () {
    const githubUsername = "SantoshDhanvade";
    const leetcodeUsername = "Santosh_Dhanvade";

    let allFetchedRepos = []; // Global array to store repos for searching

    // --- Dynamic Global Visitor Counter & Live Viewers ---
    // Creates the badge in the bottom right corner
    const visitorBadge = document.createElement('div');
    visitorBadge.className = 'visitor-badge';
    // Making it 15% smaller as requested
    visitorBadge.style.fontSize = '10.5px'; 
    visitorBadge.style.padding = '4px 10px';
    visitorBadge.innerHTML = `👁️ Loading...`;
    document.body.appendChild(visitorBadge);

    // Fetch and update global visitor count using a free counting API
    async function updateVisitorCount() {
        try {
            // Using a free API to track global visits. 
            // The '/up' endpoint automatically adds 1 to the database every time the page loads.
            const response = await fetch('https://api.counterapi.dev/v1/santoshdhanvade_portfolio/visits/up');
            
            if (!response.ok) throw new Error("Counter API failed");
            
            const data = await response.json();
            
            // Update the badge with the true global count
            visitorBadge.innerHTML = `👁️ ${data.count} Views`;

        } catch (error) {
            console.error("Could not load visitor count:", error);
            // Fallback in case the user has a strict adblocker or the API is down
            visitorBadge.innerHTML = `👁️ Welcome!`; 
        }
    }
    updateVisitorCount();
    // --------------------------------------

    // Helper: Fetch with LocalStorage Caching (Protects you from Rate Limits!)
    async function fetchWithCache(key, url, hours = 12) {
        const cachedData = localStorage.getItem(key);
        const cachedTime = localStorage.getItem(`${key}_time`);
        const now = new Date().getTime();

        // If cache exists and is fresh, use it instantly
        if (cachedData && cachedTime && (now - cachedTime < hours * 60 * 60 * 1000)) {
            console.log(`Loaded ${key} from memory.`);
            return JSON.parse(cachedData);
        }

        // Otherwise, fetch new data from the API
        const response = await fetch(url);
        if (!response.ok) throw new Error("API failed");
        const data = await response.json();
        
        // Save to cache for next time
        localStorage.setItem(key, JSON.stringify(data));
        localStorage.setItem(`${key}_time`, now.toString());
        return data;
    }

    // 1. Fetch GitHub Repositories
    fetchGitHubProjects();

    // 2. Fetch Recent GitHub Activity
    fetchRecentActivity();

    // 3. Fetch LeetCode Statistics
    fetchLeetCodeStats();

    // 4. Render Static Certificates
    renderCertificates();

    // --- Functions --- //

    // Search Bar Event Listener
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredRepos = allFetchedRepos.filter(repo => {
                const nameMatch = repo.name.replace(/-/g, ' ').replace(/_/g, ' ').toLowerCase().includes(searchTerm);
                const techMatch = (repo.language || '').toLowerCase().includes(searchTerm);
                return nameMatch || techMatch;
            });
            renderProjects(filteredRepos);
        });
    }

    async function fetchGitHubProjects() {
        const projectContainer = document.getElementById('projects-container');
        if (!projectContainer) return;

        try {
            // Fetch repos using cache (Saves for 12 hours)
            let repos = await fetchWithCache('github_repos', `https://api.github.com/users/${githubUsername}/repos?per_page=50`);
            
            // Sort repositories dynamically
            repos.sort((a, b) => {
                const getPriority = (repo) => {
                    const lang = (repo.language || '').toLowerCase();
                    const desc = (repo.description || '').toLowerCase();
                    
                    if (lang === 'javascript' || lang === 'typescript' || lang === 'html' || 
                        desc.includes('full stack') || desc.includes('react') || desc.includes('spring boot')) return 1;
                    if (lang === 'java') return 2;
                    if (lang === 'python') return 3;
                    if (lang === 'c++') return 4;
                    if (lang === 'c') return 5;
                    return 6;
                };
                return getPriority(a) - getPriority(b);
            });

            allFetchedRepos = repos; // Save to global array for search
            renderProjects(allFetchedRepos);

        } catch (error) {
            console.error(error);
            projectContainer.innerHTML = `
                <p style="color: var(--muted); grid-column: 1/-1;">
                    Could not load projects from GitHub (Rate limit exceeded or network error). 
                    Please visit my <a href="https://github.com/${githubUsername}" target="_blank">GitHub Profile</a> directly.
                </p>`;
        }
    }

    function renderProjects(repos) {
        const projectContainer = document.getElementById('projects-container');
        projectContainer.innerHTML = ''; // Clear container
        
        if(repos.length === 0) {
            projectContainer.innerHTML = `<p style="color: var(--muted); grid-column: 1/-1;">No projects match your search.</p>`;
            return;
        }

        repos.forEach(repo => {
            let tech = repo.language || 'Documentation / Multiple';
            const description = repo.description || 'A software project by Santosh Dhanvade.';
            const repoNameDisplay = repo.name.replace(/-/g, ' ').replace(/_/g, ' ');

            const repoNameLower = repo.name.toLowerCase();
            const repoDescLower = (repo.description || '').toLowerCase();

            // Override logic
            if (repoNameLower === 'profile' || repoNameLower.includes('portfolio')) {
                tech = 'HTML, CSS, JS';
            } else if (repoDescLower.includes('full stack') || repoNameLower === 'home_services' || repoNameLower === 'agri_equipments' || repoNameLower === 'blood_find') {
                tech = 'Full Stack (React & Spring Boot)';
            } else if (repoNameLower === 'mht-cet-quize-app' || repoNameLower === 'library-management-system' || repoNameLower === 'calculator') {
                tech = 'Java (Swing/AWT)';
            }

            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-body">
                    <div class="project-tech">${tech}</div>
                    <h3 class="card-title">${repoNameDisplay}</h3>
                    <p class="card-text">${description}</p>
                    <div class="project-card-buttons">
                        <a href="project.html?repo=${repo.name}" class="button-secondary">Overview</a>
                        <a href="${repo.html_url}" target="_blank" class="button-primary">GitHub</a>
                    </div>
                </div>
            `;
            projectContainer.appendChild(card);
        });
    }

    async function fetchRecentActivity() {
        const activityEl = document.getElementById('github-activity');
        if(!activityEl) return;
        try {
            // Fetch events, caching for only 2 hours so it stays relatively fresh
            const events = await fetchWithCache('github_events', `https://api.github.com/users/${githubUsername}/events/public`, 2);
            
            if (events && events.length > 0) {
                const latest = events[0];
                let action = "was active in";
                
                if (latest.type === 'PushEvent') action = "pushed code to";
                else if (latest.type === 'CreateEvent') action = "created a new repository";
                else if (latest.type === 'WatchEvent') action = "starred";
                else if (latest.type === 'PullRequestEvent') action = "opened a pull request in";
                
                const repoName = latest.repo.name.split('/')[1] || latest.repo.name;
                
                // Calculate time ago
                const date = new Date(latest.created_at);
                const diffMs = new Date() - date;
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffHours / 24);
                
                let timeAgo = "recently";
                if (diffHours > 0 && diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                else if (diffDays >= 1) timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

                activityEl.innerHTML = `⚡ <strong>Live Update:</strong> Santosh ${action} <a href="https://github.com/${latest.repo.name}" target="_blank" style="color:var(--accent);text-decoration:none;font-weight:600;">${repoName}</a> ${timeAgo}.`;
            } else {
                activityEl.style.display = 'none';
            }
        } catch(e) {
            console.error("Failed to load github events", e);
            activityEl.style.display = 'none';
        }
    }

    async function fetchLeetCodeStats() {
        const container = document.getElementById('leetcode-stats');
        if (!container) return;

        try {
            // Caching LeetCode API for 12 hours
            const data = await fetchWithCache('leetcode_stats', `https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/solved`);

            if (data && data.solvedProblem !== undefined) {
                // Calculate Percentages for Progress Bars
                const total = data.solvedProblem || 1; 
                const easyPct = Math.round((data.easySolved / total) * 100);
                const medPct = Math.round((data.mediumSolved / total) * 100);
                const hardPct = Math.round((data.hardSolved / total) * 100);

                container.innerHTML = `
                    <div class="lc-stat">
                        <span>${data.solvedProblem}</span>
                        <small>Total Solved</small>
                    </div>
                    <div class="lc-stat lc-easy">
                        <span>${data.easySolved}</span>
                        <small>Easy</small>
                        <div class="lc-progress-bg"><div class="lc-progress-fill" style="width: ${easyPct}%; background: #00b8a3;"></div></div>
                    </div>
                    <div class="lc-stat lc-med">
                        <span>${data.mediumSolved}</span>
                        <small>Medium</small>
                        <div class="lc-progress-bg"><div class="lc-progress-fill" style="width: ${medPct}%; background: #ffc01e;"></div></div>
                    </div>
                    <div class="lc-stat lc-hard">
                        <span>${data.hardSolved}</span>
                        <small>Hard</small>
                        <div class="lc-progress-bg"><div class="lc-progress-fill" style="width: ${hardPct}%; background: #ff375f;"></div></div>
                    </div>
                `;
            } else {
                throw new Error("Invalid data format returned");
            }
        } catch (error) {
            console.error("LeetCode API Error:", error);
            container.innerHTML = `
                <p style="color: var(--muted); padding: 10px; font-size: 0.95rem;">
                    Stats API is temporarily resting. <br>
                    <a href="https://leetcode.com/u/${leetcodeUsername}" target="_blank" style="color: var(--accent); font-weight: 600; text-decoration: none; display: inline-block; margin-top: 5px;">View LeetCode Profile directly →</a>
                </p>`;
        }
    }

    function renderCertificates() {
        const certificateData = [
            { id: 1, title: "C, C++, DSA and STL", desc: "Successfully completed LIVE course with the name 'C, C++, DSA and STL' during the period 26-Feb-2024 to 13-Sep-2024.", img: "Certificate/C Cpp STL and DSA.png" },
            { id: 2, title: "Java SE & Data Structures and Algorithms", desc: "Successfully completed the course with the name 'Java SE & Data Structures and Algorithms' of duration 5 months.", img: "Certificate/java SE and DSA.png" },
            { id: 3, title: "Full Stack Web Dev Masterclass (Python & Django)", desc: "Successfully completed the course 'Full Stack Web Development Masterclass using Python & Django' of duration 6 months.", img: "Certificate/Full Stack Web Dev in PY.png" },
            { id: 4, title: "Java Collection API", desc: "In-depth specialization in Java's Collection Framework and related APIs.", img: "Certificate/certificate4.jpg" },
            { id: 5, title: "Advanced DSA (15 Pattern Mastery)", desc: "Advanced problem-solving course mastering 15 essential algorithmic patterns.", img: "Certificate/certificate5.jpg" }
        ];

        const certContainer = document.querySelector('.certificates-grid');
        if (!certContainer) return;

        certContainer.innerHTML = ''; 
        certificateData.forEach(cert => {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <img src="${cert.img}" alt="${cert.title}" onerror="this.src='https://placehold.co/600x400/3b82f6/white?text=${encodeURIComponent(cert.title)}'" />
                <div class="card-body">
                    <h3 class="card-title">${cert.title}</h3>
                    <p class="card-text">${cert.desc}</p>
                    <button class="button-secondary view-credential-btn" data-cert-id="${cert.id}">View Credential</button>
                </div>
            `;
            certContainer.appendChild(card);
        });

        // Add click handlers for View Credential buttons
        const viewButtons = document.querySelectorAll('.view-credential-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const certId = this.getAttribute('data-cert-id');
                window.location.href = `certificates.html?id=${certId}`;
            });
        });
    }
});