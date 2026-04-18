/**
 * Santosh Dhanvade Portfolio Logic
 * Handles dynamic project injection, certificates, and toggle effects
 */

document.addEventListener('DOMContentLoaded', function () {
    const githubBase = "https://github.com/SantoshDhanvade/";
    
    // Project database extracted from user image
    const projectData = [
        { id: 1, name: "TicTacToe", desc: "Classic console-based game with a focus on logic.", tech: "C" },
        { id: 2, name: "HangMan", desc: "Console-based educational word game developed to practice logic flow.", tech: "C++" },
        { id: 3, name: "MHT-CET-QUIZE-App", desc: "Interactive desktop quiz platform for MHT-CET preparation.", tech: "Java Swing/AWT" },
        { id: 4, name: "Library-Management-System", desc: "Desktop solution for cataloging and tracking books.", tech: "Java Swing/AWT" },
        { id: 5, name: "Calculator", desc: "Desktop calculator application with a graphical interface.", tech: "Java Swing/AWT" },
        { id: 6, name: "Blood_Find", desc: "Full-stack community app connecting blood donors and recipients.", tech: "React & Spring Boot" },
        { id: 7, name: "Home_Services", desc: "Full-stack on-demand home maintenance service platform.", tech: "React & Spring Boot" },
        { id: 8, name: "Agri_Equipments", desc: "Full-stack e-commerce platform for agricultural tools.", tech: "React & Spring Boot" },
        { id: 9, name: "Profile", desc: "Personal portfolio website (current project).", tech: "HTML, CSS, JS" }
    ];

    // Certificate database based on user input
    const certificateData = [
        { id: 1, title: "C, C++, STL & DSA", desc: "Comprehensive training in core C/C++ programming, Standard Template Library, and Data Structures & Algorithms.", img: "Certificate/certificate1.jpg" },
        { id: 2, title: "Java SE with DSA", desc: "Mastery of Java Standard Edition combined with Data Structures and Algorithms.", img: "Certificate/certificate2.jpg" },
        { id: 3, title: "Full Stack Web Dev (Python & React)", desc: "End-to-end web development utilizing Python for the backend and React for the frontend.", img: "Certificate/certificate3.jpg" },
        { id: 4, title: "Java Collection API", desc: "In-depth specialization in Java's Collection Framework and related APIs.", img: "Certificate/certificate4.jpg" },
        { id: 5, title: "Advanced DSA (15 Pattern Mastery)", desc: "Advanced problem-solving course mastering 15 essential algorithmic patterns.", img: "Certificate/certificate5.jpg" }
    ];

    const projectContainer = document.getElementById('projects-container');
    const certContainer = document.querySelector('.certificates-grid');

    // Dynamically generate project cards
    if (projectContainer) {
        projectData.forEach(p => {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-body">
                    <div style="font-size: 0.7rem; font-weight: bold; color: var(--accent); margin-bottom: 5px; text-transform: uppercase;">${p.tech}</div>
                    <h3 class="card-title">${p.name.replace(/-/g, ' ')}</h3>
                    <p class="card-text">${p.desc}</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="button-secondary" style="flex: 1; padding: 10px;" data-action="toggle-overview" data-target="overview-${p.id}">Overview</button>
                        <a href="${githubBase}${p.name}" target="_blank" class="button-primary" style="flex: 1; padding: 10px;">GitHub</a>
                    </div>
                    <div id="overview-${p.id}" class="project-overview">
                        This project is hosted on GitHub. It demonstrates my ability to handle ${p.tech} while maintaining a focus on user experience and efficient problem-solving.
                    </div>
                </div>
            `;
            projectContainer.appendChild(card);
        });
    }

    // Dynamically generate certificate cards
    if (certContainer) {
        certContainer.innerHTML = ''; // Clears the hardcoded HTML certificates
        certificateData.forEach(cert => {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <img src="${cert.img}" alt="${cert.title}" onerror="this.src='https://placehold.co/600x400/3b82f6/white?text=${encodeURIComponent(cert.title)}'" />
                <div class="card-body">
                    <h3 class="card-title">${cert.title}</h3>
                    <p class="card-text">${cert.desc}</p>
                    <button class="button-secondary" style="margin-top: auto;">View Credential</button>
                </div>
            `;
            certContainer.appendChild(card);
        });
    }

    // Toggle Overview behavior
    const projectButtons = document.querySelectorAll('[data-action="toggle-overview"]');
    projectButtons.forEach(button => {
        button.addEventListener('click', function () {
            const overviewId = button.getAttribute('data-target');
            const overview = document.getElementById(overviewId);
            
            if (overview) {
                const isActive = overview.classList.toggle('active');
                button.textContent = isActive ? 'Hide' : 'Overview';
                // Adjust styling for visual feedback
                button.style.backgroundColor = isActive ? '#dbeafe' : '#f1f5f9';
            }
        });
    });
});