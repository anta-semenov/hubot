import request from 'request'

module.exports = (robot) => {
  robot.respond(/tech standup/, (robotResponse) => {
    const query = JSON.stringify({
      query: `query {
repository(owner: "languagedrops" name: "drops-react-native") {
  closedIssues: issues(orderBy: {field: UPDATED_AT direction: DESC} first: 100 states: CLOSED) {
    nodes {
      title
      closedAt
      assignees(first: 5) {
        nodes {
          name
          login
        }
      }
    }
  }
  project(number: 6){
    columns(first: 10 after: "Y3Vyc29yOnYyOpIBzgAWTe4=" before: "Y3Vyc29yOnYyOpIEzgAZGZ0="){
      nodes {
        name
        cards(first: 50) {
          nodes {
            content {
              __typename
              ... on Issue {
                title
                assignees(first: 5) {
                  nodes {
                    name
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
}
      `.replace(/\n/g, '')
    })

    const options = {
      url: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${process.env.GIT_TOKEN}`,
        'User-Agent': 'anta-semenov'
      },
      method: 'POST',
      body: query
    }

    const teamMembers = {
      'anta-semenov': {
        name: 'Anton',
        done: [],
        inProgress: []
      },
      fadani: {
        name: 'Fadani',
        done: [],
        inProgress: []
      },
      itchingpixels: {
        name: 'Mark',
        done: [],
        inProgress: []
      }
    }

    const processField = (field) => {
      if (typeof field !== 'object' || field == null) {
        return field
      } else if (Array.isArray(field.nodes)) {
        return processField(field.nodes)
      } else if (Array.isArray(field)) {
        return field.map(processField)
      } else {
        const result = {}
        Object.keys(field).forEach((key) => {
          result[key] = processField(field[key])
        })
        return result
      }
    }

    request(options, (error, response, body) => {
      const data = processField(JSON.parse(body).data)

      // processing done issues
      const last24HoursDate = Date.now() - 24 * 60 * 60 * 1000
      data.repository.closedIssues
        .filter((issue) => (new Date(issue.closedAt)).getTime() >= last24HoursDate)
        .forEach((issue) => {
          issue.assignees.forEach((assignee) => {
            if (teamMembers[assignee.login]) {
              teamMembers[assignee.login].done.push(issue.title)
            }
          })
        })

      // processing progress issues
      const processProgressIssue = ({content: issue}) => {
        issue.assignees.forEach((assignee) => {
          teamMembers[assignee.login].inProgress.push(issue.title)
        })
      }
      data.repository.project.columns.forEach((column) => {
        column.cards.forEach(processProgressIssue)
      })

      const message = Object.values(teamMembers).reduce((result, teamMember) => {
        const inProgress = `- _:point_right: In Progress_: ${teamMember.inProgress.join(', ')}`
        const done = `- _:tada: Yesterday_: ${teamMember.done.join(', ')}`
        return `${result}\n_*${teamMember.name}*_\n${inProgress}\n${done}`
      }, '')

      robotResponse.send(message)
    })
  })
}
