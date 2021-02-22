require('dotenv').config()
const { Octokit } = require('@octokit/rest')

const checkInterval = 500 // ms

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const getRepoStars = () => {
    return octokit.request('GET /repositories/:id', {
        id: process.env.REPO_ID
    }).then(repo => repo.data.stargazers_count)
}

const renameRepo = (name) => {
    return octokit.request('PATCH /repositories/:id', {
        id: process.env.REPO_ID,
        name,
    })
}

let lastStars = 0

const checkAndRenameRepo = async () => {
    try {
        const stars = await getRepoStars()

        if (lastStars !== stars) {
            await renameRepo(`This-Repo-Has-${stars}-Stars`)

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
