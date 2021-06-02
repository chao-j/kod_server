const PostDB = require('../utils/database/posts');
const UserDB = require('../utils/database/users');
const MSG_TYPE = {
  CALL_BACK: 0, // 客户端发送消息后 给予响应 如果客户端一段时间内没收到响应 视为超时
  SIGNAL: 1, // 信号 双端之间发送信号 用于同步状态
  MSG: 2, // 消息 可能是转发 也可能是系统消息
};

const CONTENT_TYPE = {
  USER_OFFLINE: 0, // 目标不在线
  TEXT: 1,
  IMG: 2,
  SUCCESS: 3, // 发送成功
};

let userSockets = {};

function startSocket(io) {
  // 在线用户列表
  /*
   * {socket, count: {id, nickname, avatar}}
   */

  // 客户端连接
  io.on('connection', (socket) => {
    const {
      conn: {
        id,
        server: { clientsCount },
      },
    } = socket;
    console.log('用户连===', id, clientsCount);

    // 用户上线
    socket.on('online', (userInfo, cb) => {
      userSockets[userInfo.id] = { socket, count: userInfo };
      console.log('用户上线', userInfo, Object.keys(userSockets));
      // 推送离线消息
      onlinePush(userSockets[userInfo.id]);
      cb && cb({ code: MSG_TYPE.CALL_BACK, data: { msg: userInfo.id + '上线' } });
    });

    // 用户下线
    socket.on('offline', (info, cb) => {
      console.log('用户请求下线', info.id);
      if (userSockets[info.id]) {
        delete userSockets[info.id];
        console.log('用户下线', info.id, Object.keys(userSockets));
        cb && cb({ code: MSG_TYPE.CALL_BACK, data: { msg: info.id + '下线' } });
      }
    });

    // 前后端消息交互
    socket.on('toServer', (data, cb) => {
      // ...
      // 处理逻辑后响应前端
      console.log(data);
      // 一对一
      // socket.emit('toClient', '收到你的消息了');
      // 使用回调的方式进行消息响应
      cb && cb({ code: MSG_TYPE.CALL_BACK, data: {} });
      // 广播
      // io.emit('toClient', '收到你的消息了')
    });

    // 消息转发
    socket.on('requireTransmit', (msgData, cb) => {
      const { toID, content, type, count } = msgData;
      // 接收者socket
      const target = userSockets[toID]?.socket;
      // 发送者信息
      let selfcount = userSockets[count.id]?.count;
      if (!selfcount) {
        // 自己不在线
        userSockets[id] = { count, socket };
        selfcount = userSockets[id]?.count;
        socket.emit('toClient', { code: MSG_TYPE.SIGNAL, data: { msg: '客户端重连' } });
      }
      const date = new Date();
      UserDB.insertMsg(count.id, toID, type, content, date);
      if (target) {
        target.emit('doTransmit', {
          code: MSG_TYPE.MSG,
          data: {
            from: selfcount,
            content,
            type: type,
            date,
          },
        });
        cb({ code: MSG_TYPE.CALL_BACK, data: { type: CONTENT_TYPE.SUCCESS, msg: '转发成功' } });
      } else {
        cb({ code: MSG_TYPE.CALL_BACK, data: { type: CONTENT_TYPE.USER_OFFLINE, msg: '对方不在线' } });
      }
    });
  });

  // 在线检查心跳包 更新在线用户
  function sendOnlineCheck() {
    console.log('更新前在线列表', Object.keys(userSockets));
    const tempUsers = {};
    for (let key in userSockets) {
      const item = userSockets[key];
      item.socket.emit('onlineCheck', item.count, (res) => {
        tempUsers[key] = item;
        userSockets = tempUsers;
      });
    }
    setTimeout(sendOnlineCheck, 60000);
  }
  sendOnlineCheck();
}

function sendCommentMsg(id) {
  const user = userSockets[id];
  if (user) {
    onlinePush(user);
  }
}

// 处理用户上线后需要推送的消息
async function onlinePush(user) {
  const { socket, count } = user;
  const comments = await PostDB.getUnreadComment(count.id);
  // const chat = await UserDB.getUnreadComment(count.id);
  socket.emit('onlinePush', { comments });
}

module.exports = { startSocket, sendCommentMsg };
