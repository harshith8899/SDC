const repos = [
    {
        name: 'Incognito',
        visibility: 'Public',
        language: 'HTML',
        languageColor: '#e34c26',
        stars: 2,
        forks: 4,
        url: 'https://github.com/HimaTeju/Incognito'
    },
    {
        name: 'Project-E',
        visibility: 'Public',
        language: 'Python',
        languageColor: '#3572A5',
        forks: 7,
        url: 'https://github.com/HimaTeju/Project-E'
    },
    {
        name: 'SDC',
        visibility: 'Public',
        language: 'CSS',
        languageColor: '#563d7c',
        //forkedFrom: 'harshith8899/SDC',
        url: 'https://github.com/harshith8899/SDC'
    },
    {
        name: 'workshop-registration',
        visibility: 'Public',
        language: 'HTML',
        languageColor: '#e34c26',
        //forkedFrom: 'harshith8899/workshop-registration',
        //description: 'registration webpage',
        url: 'https://github.com/harshith8899/workshop-registration'
    }
];

function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.onclick = () => window.location.href = repo.url;

    card.innerHTML = `
        <div class="repo-header">
            <svg class="repo-icon" viewBox="0 0 16 16" fill="#586069">
                <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
            </svg>
            <a href="${repo.url}" class="repo-name">${repo.name}</a>
            <span class="repo-visibility">${repo.visibility}</span>
        </div>
        ${repo.description ? `<p>${repo.description}</p>` : ''}
        ${repo.forkedFrom ? `<p class="forked-info">Forked from ${repo.forkedFrom}</p>` : ''}
        <div class="repo-meta">
            ${repo.language ? `
                <div class="repo-meta-item">
                    <span class="language-dot" style="background-color: ${repo.languageColor}"></span>
                    ${repo.language}
                </div>
            ` : ''}
            ${repo.stars ? `
                <div class="repo-meta-item">
                    <svg aria-label="stars" height="16" viewBox="0 0 16 16" width="16" fill="#586069">
                        <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
                    </svg>
                    ${repo.stars}
                </div>
            ` : ''}
            ${repo.forks ? `
                <div class="repo-meta-item">
                    <svg aria-label="forks" height="16" viewBox="0 0 16 16" width="16" fill="#586069">
                        <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                    </svg>
                    ${repo.forks}
                </div>
            ` : ''}
        </div>
    `;
    return card;
}

const repoGrid = document.getElementById('repoGrid');
repos.forEach(repo => {
    repoGrid.appendChild(createRepoCard(repo));
});