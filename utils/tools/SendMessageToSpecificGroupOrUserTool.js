import { AbstractTool } from './AbstractTool.js'
import { convertFaces } from '../face.js'

export class SendMessageToSpecificGroupOrUserTool extends AbstractTool {
  name = 'sendMessage'

  parameters = {
    properties: {
      msg: {
        type: 'string',
        description: 'text to be sent'
      },
      target: {
        type: 'string',
        description: 'target qq or group number'
      }
    },
    required: ['msg', 'target']
  }

  func = async function (opt, e) {
    let { msg, target } = opt
    target = isNaN(target) || !target
      ? e.isGroup ? e.group_id : e.sender.user_id
      : parseInt(target.trim())

    let groupList = await Bot.getGroupList()
    try {
      if (groupList.get(target)) {
        let group = await Bot.pickGroup(target)
        await group.sendMsg(await convertFaces(msg, true, e))
        return 'msg has been sent to group' + target
      } else {
        let user = await Bot.pickFriend(target)
        await user.sendMsg(msg)
        return 'msg has been sent to user' + target
      }
    } catch (err) {
      return `failed to send msg, error: ${JSON.stringify(err)}`
    }
  }

  description = 'Useful when you want to send a text message to specific user or group'
}
