require('dotenv').config()
const { Octokit } = require('@octokit/rest') // Requires octokit

const checkInterval = 1000 // ms // Checks stargazer count every second (constant not code)
const milestoneStep = 500 // Puts a different emoji in the repository description every 500 stars (constant not code)
// The list below is the emojis used for the milestone description
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
} // Milestone code

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
}) // The authentication token used for the project

const getRepoStars = () => {
    return octokit.request('GET /repositories/:id', {
        id: process.env.REPO_ID,
    }).then(repo => repo.data.stargazers_count)
} // Check stargazer count GET request code

const renameRepo = (data) => {
    return octokit.request('PATCH /repositories/:id', {
        id: process.env.REPO_ID,
        ...data,
    })
} // Rename repository PATCH request code

let lastStars = 0

const checkAndRenameRepo = async () => {
    try {
        const stars = await getRepoStars()

        if (lastStars !== stars) {
            await renameRepo({
                name: `This-Repo-Has-${stars}-Stars`,
                description: `Yes, it's true ${getMilestone(stars)}`
            }) // This if statement checks if the star count has changed, and if it does, renames the repository

            lastStars = stars
        } // Content of what to rename and re-describe the repository as
    } catch (err) {
        console.log(err)
    } // Catches errors and logs to console

    setTimeout(checkAndRenameRepo, checkInterval)
}
// ^ is done in async
getRepoStars() // Checks repo stars
    .then(stars => {
        lastStars = stars

        checkAndRenameRepo()
    })
    .catch(console.log)
