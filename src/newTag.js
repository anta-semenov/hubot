module.exports = (robot) => {
  robot.respond(/create new.?tag (patch|minor|major)/i, ({match, send}) => {
    const data = {
      hook_info: {
        type: 'bitrise',
        api_token: 'p5Zc51N880paoDRI9QKmPg'
      },
      build_params: {
        branch: 'master',
        workflow_id: 'newTag',
        environments: [{
          mapped_to: 'VERSION',
          value: match[1],
          is_expand: true
        }]
      },
      triggered_by: 'curl'
    }

    const options = {
      url: 'https://www.bitrise.io/app/145eef6440650dec/build/start.json',
      method: 'POST',
      body: JSON.stringify(data)
    }

    robot.http('https://www.bitrise.io/app/145eef6440650dec/build/start.json')
    .header('Content-Type', 'application/json')
    .post(JSON.stringify(data), () => {
      const tagUrl = 'https://anta-semenov:43df8ab557838978806ff430105455582adbc6ba@api.github.com/repos/anta-semenov/hubot/tags'
      robot.http(tagUrl).get((err, response, body) => {
        if (err) return

        const tagResponse = JSON.parse(body)

        send(`new tag is ${tagResponse[0].name}`)
      })
    })
  })
}
