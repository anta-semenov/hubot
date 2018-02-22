import request from 'request'

module.exports = (robot) => {
  robot.respond(/create new.?tag (patch|minor|major)/i, ({match}) => {
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

    request(options)
  })
}
