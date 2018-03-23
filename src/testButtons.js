module.exports = (robot) => {
  robot.respond(/test buttons/, (response) => {
    response.send({
      text: 'test action buttons',
      attachments: [
        {
          text: 'available actions',
          callback_id: 'test_action_buttons',
          color: '#20be4a',
          attachment_type: 'default',
          actions: [
            {
              name: 'test1',
              text: 'test1',
              value: 'test1',
              type: 'button'
            },
            {
              name: 'test2',
              text: 'test2',
              value: 'test2',
              type: 'button',
              style: 'danger'
            }
          ]
        }
      ]
    })
  })
}
