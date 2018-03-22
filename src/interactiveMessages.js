module.exports = (robot) => {
  robot.router.post('/hubot/action_buttons', (request, response) => {
    console.log('action button', request)
  })
  robot.router.post('/hubot/options', (request, response) => {
    console.log('option', request)
  })
}
