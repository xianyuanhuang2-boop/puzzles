const evidence = {
  photo: {tag:'EVIDENCE 01 — SCENE RECONSTRUCTION',title:'203 號房，門從內側反鎖。',body:'桌上有兩只杯子，但只有一只留下唇印。窗戶沒有被撬開，窗框內側卻有一道新鮮的刮痕。現場照片因案件封存未公開，此處為鑑識重建示意。',side:'取證時間：03:12<br>採證人：陳姓鑑識員<br>備註：門鏈未受損',visual:'photo'},
  diary: {tag:'EVIDENCE 02 — PERSONAL EFFECTS',title:'日記停在十一月二日。',body:'「他說那天沒有下雨。每次他說謊，都會先看左邊的窗戶。今晚我會再問一次。這次，我要他親口說出她的名字。」紙頁背面有被水暈開的字跡，無法辨讀。',side:'發現位置：床頭櫃<br>筆跡比對：林以安<br>最後一頁有撕除痕跡',visual:'diary'},
  call: {tag:'EVIDENCE 03 — TELECOM RECORD',title:'兩通電話，一個被刪除的號碼。',body:'01:48，203 房撥出 43 秒，對方是旅館櫃檯。01:52，有一通來電未接，號碼屬於周明哲。02:03，同一號碼再次撥入，通話 11 秒。手機內另有一筆已刪除的 01:36 通話紀錄。',side:'資料來源：電信回函<br>時區：UTC+8<br>完整內容見補充卷宗',visual:'call'},
  autopsy: {tag:'EVIDENCE 04 — MEDICAL EXAMINER',title:'死因確認前，先排除意外。',body:'死者林以安，三十一歲。初步檢視未見明顯外傷，死亡時間估計為 01:30 至 02:30。血液中檢出少量鎮靜劑，劑量不足以致死。報告末頁記載：左手握有一顆潮濕的旅館置物櫃鑰匙。',side:'報告編號：ME-241103<br>相驗醫師：許醫師<br>正式死因：卷宗封存',visual:'autopsy'}
};
const tabs=[...document.querySelectorAll('.evidence-tab')];
function showEvidence(key){const e=evidence[key];document.getElementById('evidenceDetail').innerHTML=`<div class="detail-content"><span class="detail-tag">${e.tag}</span><h3>${e.title}</h3><p>${e.body}</p></div><div class="mini-evidence ${e.visual}" aria-hidden="true"></div><div class="detail-side"><b>鑑識資料</b>${e.side}</div>`;tabs.forEach(t=>{const active=t.dataset.evidence===key;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active))})}
tabs.forEach(t=>t.addEventListener('click',()=>showEvidence(t.dataset.evidence)));showEvidence('photo');

// The first view is intentionally out of order. Click two cards to exchange their positions.
const events=[
 {time:'01:48',kind:'電信紀錄',text:'203 房撥出電話至旅館櫃檯，通話 43 秒。'},
 {time:'02:17',kind:'管理員證詞',text:'聽見走廊傳來一聲巨響，隨後查看總電源。'},
 {time:'01:36',kind:'手機復原資料',text:'一筆已刪除通話：來電者身分未知，通話 2 分 08 秒。'},
 {time:'01:52',kind:'電信紀錄',text:'周明哲來電，未接。四分鐘後再度撥入。'},
 {time:'02:03',kind:'電信紀錄',text:'周明哲與 203 房通話 11 秒。'}
];
const eventGrid=document.getElementById('eventGrid');let firstPick=null;
function renderEvents(){eventGrid.innerHTML='';events.forEach((e,i)=>{const card=document.createElement('button');card.className='event-card';card.type='button';card.setAttribute('aria-label',`${e.time} ${e.kind}。選取後與另一事件交換位置。`);card.innerHTML=`<span class="event-check">＋</span><div class="event-time">${e.time}</div><span class="event-kind">${e.kind}</span><p>${e.text}</p>`;card.addEventListener('click',()=>{if(firstPick===null){firstPick=i;card.classList.add('selected');return}if(firstPick===i){firstPick=null;renderEvents();return}[events[firstPick],events[i]]=[events[i],events[firstPick]];firstPick=null;renderEvents()});eventGrid.append(card)})}
renderEvents();

const answers=[
 '林以安打給旅館管理員，追問三年前車禍的真相。',
 '周明哲先打給林以安，想確認她是否已經離開房間。',
 '旅館管理員打給周明哲，通知他房間已經清理完畢。'
];
const answerList=document.getElementById('answerList');let selectedAnswer=-1;
answers.forEach((answer,i)=>{const button=document.createElement('button');button.className='answer-option';button.type='button';button.innerHTML=`<span class="answer-key">0${i+1}</span><span>${answer}</span>`;button.addEventListener('click',()=>{selectedAnswer=i;[...answerList.children].forEach((el,j)=>el.classList.toggle('selected',j===i));document.getElementById('answerFeedback').textContent=''});answerList.append(button)});
document.getElementById('submitAnswer').addEventListener('click',()=>{const feedback=document.getElementById('answerFeedback');if(selectedAnswer<0){feedback.textContent='請先選擇一項推論。';return}if(selectedAnswer===0){document.getElementById('solution').hidden=false;document.getElementById('solution').scrollIntoView({behavior:'smooth',block:'start'});try{localStorage.setItem('deep-archive-case-07','solved')}catch{}feedback.textContent='推論吻合。卷宗限制已解除。'}else{feedback.textContent='時間與通話方向對不上。回去重新比對證物，再試一次。'}});
document.getElementById('resetCase').addEventListener('click',()=>{selectedAnswer=-1;[...answerList.children].forEach(el=>el.classList.remove('selected'));document.getElementById('answerFeedback').textContent='';document.getElementById('solution').hidden=true;firstPick=null;renderEvents();document.getElementById('question').scrollIntoView({behavior:'smooth'})});

// Optional low-level room tone, synthesized locally so the toggle needs no audio file.
let audioContext=null,noiseSource=null,noiseGain=null;
document.getElementById('soundToggle').addEventListener('click',async function(){const label=document.getElementById('soundText');if(noiseSource){noiseGain.gain.setTargetAtTime(0,audioContext.currentTime,.15);noiseSource.stop(audioContext.currentTime+.6);noiseSource=null;this.classList.remove('on');label.textContent='環境音 關';return}try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();await audioContext.resume();const buffer=audioContext.createBuffer(1,audioContext.sampleRate*2,audioContext.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.14;noiseSource=audioContext.createBufferSource();noiseSource.buffer=buffer;noiseSource.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=230;noiseGain=audioContext.createGain();noiseGain.gain.value=0;noiseSource.connect(filter).connect(noiseGain).connect(audioContext.destination);noiseSource.start();noiseGain.gain.setTargetAtTime(.13,audioContext.currentTime,.3);this.classList.add('on');label.textContent='環境音 開'}catch{label.textContent='環境音 無法播放'}});
