require('dotenv').config()
const { Octokit } = require('@octokit/rest')

const checkInterval = 5000 // ms

// emoji
const milestone = [
    ":broken_heart:",
    ":heart:",
    ":orange_heart:",
    ":purple_heart:",
    ":yellow_heart:",
    ":heartpulse:",
    ":sparkling_heart:",
    ":gift_heart:",
    ":heartbeat:",
    ":two_hearts:",
    ":revolving_hearts:" 
]

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const getRepoStars = () => {
    return octokit.request('GET /repositories/:id', {
        id: process.env.REPO_ID
    }).then(repo => repo.data.stargazers_count)
}

const renameRepo = ({ name, description }) => {
    return octokit.request('PATCH /repositories/:id', {
        id: process.env.REPO_ID,
        name,
        description
    })
}

let lastStars = 0

const checkAndRenameRepo = async () => {
    try {
        const stars = await getRepoStars()

        if (lastStars !== stars) {
            await renameRepo({
                name: `This-Repo-Has-${stars}-Stars`,
                description: `Yes, it's true ${getMilestone(starts)}`
            })

            lastStars = stars
        }
    } catch (err) {
        console.log(err)
    }

    setTimeout(checkAndRenameRepo, checkInterval)
}

const getMilestone = (stars) => {
    let emojiIndex = parseInt(parseInt(stars) / 500);
    return milestone[emojiIndex >= milestone.length ? milestone.length - 1 : emojiIndex ];
}

getRepoStars()
    .then(stars => {
        lastStars = stars

        setTimeout(checkAndRenameRepo, checkInterval)
    })
    .catch(console.log)
