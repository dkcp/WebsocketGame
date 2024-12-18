import { CLIENT_VERSION } from './Constants.js';
import { setStageClear, setStageInfo, unlockEnemy, unlockItem } from './index.js';
import Score from './Score.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
  switch(data.handlerId){
    case 2: //start game
      setStageInfo(data.stageInfo); 
      break;
    case 3: //end game
      break;
    case 11: //move stage, set score.js, unlock enemy&item
      setStageClear();
      setStageInfo(data.stageInfo);
      unlockEnemy(data.unlockEnemyDatas);
      unlockItem(data.unlockItemDatas);
      break;
    case 12: //all clear
      console.log('올클리어 이벤트(서버콜)');
      setStageClear();
    default:
      break;
  }
});

socket.on('connection', (data) => {
  const user = window.localStorage.getItem('client');
  if(user){
    console.log('connection: ', data);
    console.log(`로컬 유저 확인 완료. ${user}`);
    userId = user;
  }else{
    console.log('connection: ', data);
    userId = data.uuid;
    window.localStorage.setItem('client', userId);
    console.log(`로컬에 유저가 없습니다. ${userId}`);
  }

  if(data.highRecord){
    console.log('최고점수:', data.highRecord);
  }
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

socket.on('broadcast', (data)=>{
  Score.setHighScore(data.broadcase[1]);
  if(data.highRecord){
    console.log('최고점수:', data.highRecord);
  }
})

export { sendEvent };
