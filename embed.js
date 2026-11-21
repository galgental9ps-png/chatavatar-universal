'use strict';
JimmyChatAvatar.instance.ready.then(() => {
  if (JimmyChatAvatar.instance.pack) JimmyChatAvatar.instance.open();
  document.getElementById('call-avatar').onclick = () => JimmyChatAvatar.instance.open();
});
