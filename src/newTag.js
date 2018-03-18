import request from 'request'

console.log('env', process.env.GIT_TOKEN)

module.exports = (robot) => {
  robot.respond(/create new\s?(patch|minor|major)?\s?tag\s?(patch|minor|major)?/i, ({match, send}) => {
    const tag  = match[1] || match[2] || 'minor'
    console.log('==== tag', tag);
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
          value: tag,
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

    console.log('curl data', data)

    request(options, () => {
        console.log('post callback');
        // const tagUrl = 'https://anta-semenov:43df8ab557838978806ff430105455582adbc6ba@api.github.com/repos/anta-semenov/hubot/tags'
        // robot.http(tagUrl).get((err, response, body) => {
        //   if (err) return
        //
        //   const tagResponse = JSON.parse(body)
        //
        //   send(`new tag is ${tagResponse[0].name}`)
        // })
      })
  })
}
