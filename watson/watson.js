const AssistantV2 = require('ibm-watson/assistant/v2')
const { IamAuthenticator } = require('ibm-watson/auth')

let session_id = ''

const assistant = new AssistantV2({
    version: '2019-02-28',
    authenticator: new IamAuthenticator({
        apikey: process.env.ASSISTANT_IAM_APIKEY
    }),
    url: process.env.ASSISTANT_URL
})

const payload = {
    assistantId: '',
    sessionId: '',
    input: {
        message_type: 'text',
        text: ''
    }
}

exports.sendMessage = async (message) => {
    let assistant_response = ''
    if (!session_id) {
        session_id = await startSession()
    }

    let assistantId = process.env.ASSISTANT_ID
    let userInputMessage = message

    payload.assistantId = assistantId
    payload.sessionId = session_id
    payload.input.text = userInputMessage

    await assistant.message(payload, async (err, data) => {
        let intent = ''
        if (err) {
            assistant_response =
                'Ups,something went wrong. Please, refresh the page and try again'
            intent = 'Session_error'
            if (isInvalidId(err.message, err.headers.connection, err.code)) {
                assistant_response =
                    'Wait a second please. I have to restart the session.'
                intent = 'Session_restart'
            }
        }

        intent = await checkIntent(data.result.output.intents[0])
        assistant_response = data.result.output.generic[0].text
        //console.log('assistant_response', assistant_response)

    })

    return assistant_response
}

const checkIntent = intents_first_element => {
    let intent = ''
    if (intents_first_element === undefined) {
        intent = 'Irrelevant'
    } else {
        intent = intents_first_element.intent
    }
    return intent
}

const isInvalidId = (message, connection, code) => {
    if (
        message === 'Invalid Session' &&
        connection === 'close' &&
        code === 404
    ) {
        return true
    }
    return false
}

const startSession = async () => {
    let SESSION_ID
    await assistant
        .createSession({
            assistantId: process.env.ASSISTANT_ID || '{assistant_id}'
        })
        .then(res => {
            console.log('Watson Assistant Session started')
            SESSION_ID = res.result.session_id
        })
        .catch(err => {
            console.log(err)
        })
    return SESSION_ID
}

const endSession = (sessionId, assistantId) => {
    assistant
        .deleteSession({
            assistantId,
            sessionId
        })
        .then(res => {
            console.log('Session closed')
            //console.log(JSON.stringify(res, null, 2))
        })
        .catch(err => {
            console.log(err)
        })
}