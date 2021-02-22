require('dotenv').config()
const { Octokit } = require('@octokit/rest')

const checkInterval = 1000 // ms
const milestoneStep = 500

const emojis = [
    ':broken_heart:',
    ':heart:',
    ':orange_heart:',
    ':purple_heart:',
    ':yellow_heart:',
    ':heartpulse:',
    ':sparkling_heart:',
    ':gift_heart:',
    ':heartbeat:',
    ':two_hearts:',
    ':revolving_hearts:' 
]

const getMilestone = (stars) => {
    const emojiIndex = Math.floor(stars / milestoneStep)

    return emojis[emojiIndex >= emojis.length ? emojis.length - 1 : emojiIndex]
}

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const getRepoStars = () => {
    return octokit.request('GET /repositories/:id', {
        id: process.env.REPO_ID,
    }).then(repo => repo.data.stargazers_count)
}

const renameRepo = (data) => {
    return octokit.request('PATCH /repositories/:id', {
        id: process.env.REPO_ID,
        ...data,
    })
}

let lastStars = 0

const checkAndRenameRepo = async () => {
    try {
        const stars = await getRepoStars()

        if (lastStars !== stars) {
            await renameRepo({
                name: `This-Repo-Has-${stars}-Stars`,
                description: `Yes, it's true ${getMilestone(stars)}`
            })

            lastStars = stars
        }
    } catch (err) {
        console.log(err)
    }

    setTimeout(checkAndRenameRepo, checkInterval)
}

getRepoStars()
    .then(stars => {
        lastStars = stars

        checkAndRenameRepo()
    })
    .catch(console.log)
