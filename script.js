// State Management for Git Companion
const TOTAL_STEPS = 15;

const gitCommands = {
    1: {
        cmd: "Accéder à https://github.com/new\nNommer le dépôt et sélectionner la visibilité.",
        out: "# Dépôt créé avec succès sur GitHub !"
    },
    2: {
        cmd: "mkdir iffiag-git-project\ncd iffiag-git-project\ngit init",
        out: "Initialized empty Git repository in C:/Users/IFIAG/.gemini/antigravity/scratch/iffiag-git-project/.git/"
    },
    3: {
        cmd: "git config --local user.name \"sadkiyassine271\"\ngit config --local user.email \"sadkiyassine271@iffiag.com\"",
        out: "# Git configuré localement avec succès !"
    },
    4: {
        cmd: "touch index.html style.css script.js secret.txt",
        out: "# Fichiers créés : index.html, style.css, script.js, secret.txt"
    },
    5: {
        cmd: "echo secret.txt > .gitignore",
        out: "# secret.txt a été ajouté au fichier .gitignore"
    },
    6: {
        cmd: "git add .\ngit commit -m \"Premier commit: Structure initiale du projet\"",
        out: "[master (root-commit) a8b3d2f] Premier commit: Structure initiale du projet\n 4 files changed, 250 insertions(+)\n create mode 100644 .gitignore\n create mode 100644 index.html\n create mode 100644 script.js\n create mode 100644 style.css"
    },
    7: {
        cmd: "git checkout -b iffiag-exp",
        out: "Switched to a new branch 'iffiag-exp'"
    },
    8: {
        cmd: "git add .\ngit commit -m \"Mise à jour interactive du dashboard\"",
        out: "[iffiag-exp c7a2f1b] Mise à jour interactive du dashboard\n 2 files changed, 45 insertions(+), 12 deletions(-)"
    },
    9: {
        cmd: "git checkout master\ngit merge iffiag-exp",
        out: "Switched to branch 'master'\nUpdating a8b3d2f..c7a2f1b\nFast-forward\n index.html | 15 ++++++++++-----\n script.js | 42 +++++++++++++++++++++---------\n 2 files changed, 45 insertions(+), 12 deletions(-)"
    },
    10: {
        cmd: "git remote add origin https://github.com/sadkiyassine271-maker/yassine-projet.git\ngit push -u origin master",
        out: "Enumerating objects: 7, done.\nCounting objects: 100% (7/7), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (6/6), done.\nWriting objects: 100% (7/7), 785 bytes | 785.00 KiB/s, done.\nTo https://github.com/sadkiyassine271-maker/yassine-projet.git\n * [new branch]      master -> master\nbranch 'master' set up to track 'origin/master'."
    },
    11: {
        cmd: "# Connectez-vous sur vercel.com\n# Créez un nouveau projet à partir de Git et sélectionnez votre dépôt.",
        out: "# Liaison établie. Déploiement en cours sur Vercel..."
    },
    12: {
        cmd: "curl -I https://yassine-projet-eunvdz97v-ifiag.vercel.app/",
        out: "HTTP/2 200\ncontent-type: text/html; charset=UTF-8\nserver: Vercel\nx-vercel-id: ..."
    },
    13: {
        cmd: "git add .\ngit commit -m \"Correction de style et amélioration CI/CD\"\ngit push origin master",
        out: "To https://github.com/sadkiyassine271-maker/yassine-projet.git\n   c7a2f1b..f2d4e8a  master -> master\n# Vercel va automatiquement redéployer le site !"
    },
    14: {
        cmd: "echo \"# Mon Projet Git Vercel\" > README.md\necho \"Lien Vercel : https://yassine-projet-eunvdz97v-ifiag.vercel.app/\" >> README.md\ngit add README.md\ngit commit -m \"Ajout du README\"\ngit push origin master",
        out: "[master f2d4e8a] Ajout du README\n 1 file changed, 2 insertions(+)\nTo https://github.com/sadkiyassine271-maker/yassine-projet.git\n   f2d4e8a..e8c7b6d  master -> master"
    },
    15: {
        cmd: "git remote -v",
        out: "origin  https://github.com/sadkiyassine271-maker/yassine-projet.git (fetch)\norigin  https://github.com/sadkiyassine271-maker/yassine-projet.git (push)"
    }
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    loadProgress();
    setupCardClickListeners();
});

// Load state from local storage
function loadProgress() {
    const saved = localStorage.getItem("git_companion_progress");
    const progress = saved ? JSON.parse(saved) : {};
    
    let completedCount = 0;
    for (let i = 1; i <= TOTAL_STEPS; i++) {
        const card = document.querySelector(`.exercise-card[data-step="${i}"]`);
        if (card) {
            if (progress[i]) {
                card.classList.add("completed");
                const btn = card.querySelector(".btn-verify");
                if (btn) btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Fait`;
                completedCount++;
            } else {
                card.classList.remove("completed");
                const btn = card.querySelector(".btn-verify");
                if (btn) btn.innerHTML = `<i class="fa-solid fa-check"></i> Marquer comme fait`;
            }
        }
    }
    
    updateProgressBar(completedCount);

    // Update Github URL text if step 10 is completed
    const githubText = document.getElementById("github-url-text");
    if (githubText) {
        if (progress[10] || progress[15]) {
            githubText.innerText = "https://github.com/sadkiyassine271-maker/yassine-projet";
            githubText.style.color = "var(--success-color)";
        } else {
            githubText.innerText = "Non lié (Ajouté à l'étape 10)";
            githubText.style.color = "var(--text-secondary)";
        }
    }
}

// Toggle exercise completed state
function toggleExercise(step) {
    const card = document.querySelector(`.exercise-card[data-step="${step}"]`);
    if (!card) return;
    
    const isCompleted = card.classList.toggle("completed");
    
    const saved = localStorage.getItem("git_companion_progress");
    const progress = saved ? JSON.parse(saved) : {};
    
    if (isCompleted) {
        progress[step] = true;
    } else {
        delete progress[step];
    }
    
    localStorage.setItem("git_companion_progress", JSON.stringify(progress));
    loadProgress();
    showCommandInTerminal(step);
}

// Update progress bar
function updateProgressBar(completedCount) {
    const percent = Math.round((completedCount / TOTAL_STEPS) * 100);
    const bar = document.getElementById("main-progress-bar");
    const label = document.getElementById("progress-percent");
    
    if (bar) bar.style.width = `${percent}%`;
    if (label) label.innerText = `${percent}%`;
    
    const statusBadge = document.querySelector(".status-badge");
    if (statusBadge) {
        if (percent === 100) {
            statusBadge.innerText = "Complété";
            statusBadge.classList.add("complete");
        } else {
            statusBadge.innerText = "En Cours";
            statusBadge.classList.remove("complete");
        }
    }
}

// Click on exercise card to show command
function setupCardClickListeners() {
    document.querySelectorAll(".exercise-card").forEach(card => {
        card.addEventListener("click", (e) => {
            // Avoid triggering when clicking the button itself
            if (e.target.closest("button")) return;
            
            const step = parseInt(card.getAttribute("data-step"));
            showCommandInTerminal(step);
            
            // Scroll to console
            document.getElementById("console").scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Show command in terminal
function showCommandInTerminal(step) {
    const instructions = document.getElementById("terminal-instructions");
    const suggested = document.getElementById("terminal-suggested");
    const commandContent = document.getElementById("terminal-command-content");
    
    const data = gitCommands[step];
    if (data) {
        instructions.innerText = data.out;
        suggested.style.display = "flex";
        commandContent.innerText = data.cmd;
    }
}
