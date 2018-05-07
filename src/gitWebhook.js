import fetch from 'node-fetch'

const makeFetch = (query, url, method) => fetch(
    url || 'https://api.github.com/graphql',
    {
      headers: {
        'Authorization': `Bearer beb30383e46e21cc54eaab2be78fad45254a59bd`,
        'User-Agent': 'anta-semenov',
        'Content-Type': 'application/json'
      },
      method: method || 'POST',
      body: query,
    },
  )

module.exports = (robot) => {
  robot.router.post('/hubot/git_webhook', (request, respond) => {
    respond.send('ok')
    const body = request.body
    // console.log('git web hook', body)

    if (body.action && body.action === 'moved' && body.project_card && body.project_card.content_url) {
      // const issueID = (/issues\/(\d*)/.exec() || [])[1]
      // if (!issueID) {
      //   return
      // }
      if (body.changes && body.changes.column_id && body.changes.column_id.from == 2477021) {
        // remove from milestone
        const query = JSON.stringify({
          milestone: null
        })
        makeFetch(query, body.project_card.content_url, 'PATCH')
      }

      if (body.project_card.column_id === 2477021) {
        const query = JSON.stringify({
          milestone: 1
        })
        makeFetch(query, body.project_card.content_url, 'PATCH')
      }
    }
  })
}
