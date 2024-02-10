import { TwitterApi } from "twitter-api-v2"

const authTokenMap = {}
const loggedClients = {} // tried storing in session but session is losing some data

const login =  async (req, res) => {
    try {
        const client = new TwitterApi({appKey: process.env.CONSUMER_KEY, appSecret: process.env.CONSUMER_SECRET})
        const authLink = await client.generateAuthLink(process.env.CALLBACK_URL, { linkMode: 'authorize' })
        const { url, oauth_token, oauth_token_secret } = authLink
        // store oauth_token and oauth_token_secret in a map
        authTokenMap[oauth_token] = oauth_token_secret
        // redirect user to authorization link
        res.redirect(url)
    } catch (error) {
        console.log(error)
        throw error
    }
}

const onCallback = async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query
    const oauth_token_secret = authTokenMap[oauth_token]
    delete authTokenMap[oauth_token]

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
        return res.status(400).send('You denied the app or your session expired!');
    }

    try {
        const client = new TwitterApi({
            appKey: process.env.CONSUMER_KEY, 
            appSecret: process.env.CONSUMER_SECRET, 
            accessToken: oauth_token, 
            accessSecret: oauth_token_secret
        })
        const { client: loggedClient } = await client.login(oauth_verifier)
        console.log("Logged in client for token", oauth_token, loggedClient);
        // store accessToken and accessSecret in a map
        loggedClients[oauth_token] = loggedClient
        res.cookie("token", oauth_token, { httpOnly: true, overwrite: true })
        res.redirect("/")
    } catch (error) {
        console.log(error)
        res.status(403).send('Invalid verifier or access tokens!')
    }
}

const post = async (req, res) => {
    const { postBody, oauth_token } = req.body
    const client = loggedClients[oauth_token]

    if (!client)
        return res.status(403).json({ error: "Logged client not found for token" })

    try {
        const response = await client.v2.tweet(postBody)
        console.log("Tweet posted successfully", response)
        res.json({ data: response });
    } catch (error) {
        console.log(error)
        res.status(403).send('Invalid verifier or access tokens!')
    }
}

export { login, onCallback, post }
