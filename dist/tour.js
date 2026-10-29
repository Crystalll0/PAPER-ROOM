'use strict';
// This practice sheet never reads or writes the user's project state.
(() => {
  const dialog = $('tourDialog'), surface = $('tourCanvas'), pen = surface.getContext('2d');
  const seenKey = 'paper-room-introduction-v1';
  const labels = {
    help: ['教程 / 帮助', '教學 / 說明', 'Tutorial / Help'],
    title: ['先练习一次折叠', '先練習一次摺疊', 'Try your first fold'],
    privacy: ['这是独立练习纸，不会改变你的作品。可随时关闭，之后从“教程 / 帮助”重新打开。', '這是獨立練習紙，不會改變你的作品。可隨時關閉，之後從「教學 / 說明」重新開啟。', 'This separate practice sheet will not change your project. Close at any time and return through Tutorial / Help.'],
    steps: [
      ['1 / 4 · 从右侧圆点拖到左侧圆环，然后松开。先看预览，不会留下折痕。', '1 / 4 · 從右側圓點拖到左側圓環，然後放開。先看預覽，不會留下摺痕。', '1 / 4 · Drag the dot on the right to the ring on the left, then release. This is a preview, not a saved fold.'],
      ['2 / 4 · 再拖动一次，然后点击“确认折叠”或按空格。松开鼠标不等于确认。', '2 / 4 · 再拖動一次，然後點擊「確認摺疊」或按空格。放開滑鼠不等於確認。', '2 / 4 · Drag again, then click Confirm fold or press Space. Releasing the mouse does not confirm.'],
      ['3 / 4 · 折叠已确认！现在点击“展开”，看看保存的折痕。', '3 / 4 · 摺疊已確認！現在點擊「展開」，看看儲存的摺痕。', '3 / 4 · Fold confirmed! Click Unfold to see the saved crease.'],
      ['4 / 4 · 完成！虚线是预览；确认后才留下折痕。现在可以回到作品自由尝试。', '4 / 4 · 完成！虛線是預覽；確認後才留下摺痕。現在可以回到作品自由嘗試。', '4 / 4 · Done! Dashed lines preview a fold; confirmation saves the crease. Return to your project to explore.']
    ],
    cancelPrompt: ['先点击“取消预览”或按 Esc，练习不留折痕地返回。', '先點擊「取消預覽」或按 Esc，練習不留摺痕地返回。', 'First click Cancel preview or press Esc to return without leaving a crease.'],
    confirmPrompt: ['预览还没有保存。点击“确认折叠”或按空格继续。', '預覽還沒有儲存。點擊「確認摺疊」或按空格繼續。', 'Your preview is not saved yet. Click Confirm fold or press Space to continue.'],
    retry: ['从纸张右侧圆点开始，向左侧圆环多拖一点。', '從紙張右側圓點開始，向左側圓環多拖一點。', 'Start at the dot on the right and drag farther toward the ring on the left.'],
    cancel: ['取消预览 · Esc', '取消預覽 · Esc', 'Cancel preview · Esc'],
    confirm: ['确认折叠 · Space', '確認摺疊 · Space', 'Confirm fold · Space'],
    unfold: ['展开', '展開', 'Unfold'], finish: ['返回作品', '返回作品', 'Back to project'],
    restart: ['重新练习', '重新練習', 'Restart practice'], close: ['关闭指引', '關閉指引', 'Close tutorial']
  };
  let sheet, plan = null, start = null, step = 0;
  const tr = key => labels[key][lang];
  const screen = v => ({x:300 + v.x, y:170 + v.y});
  function point(event) {
    const r = surface.getBoundingClientRect();
    return {x:(event.clientX-r.left)*600/r.width-300, y:(event.clientY-r.top)*340/r.height-170};
  }
  function draw() {
    pen.clearRect(0,0,600,340);
    for (const face of plan ? E.foldedFaces(sheet, plan) : sheet.faces) {
      pen.beginPath();
      face.p.forEach((v,i) => {const q=screen(v); i ? pen.lineTo(q.x,q.y) : pen.moveTo(q.x,q.y)});
      pen.closePath(); pen.fillStyle=face.back ? '#dac4ae' : '#fff9ed'; pen.fill();
      pen.strokeStyle='#526b5c'; pen.lineWidth=1.3; pen.stroke();
    }
    const marks = plan ? [{a:{x:plan.m.x-plan.n.y*230,y:plan.m.y+plan.n.x*230},b:{x:plan.m.x+plan.n.y*230,y:plan.m.y-plan.n.x*230}}] : E.clippedMarks(sheet.creases,sheet.faces);
    pen.save(); pen.setLineDash(plan ? [6,5] : []); pen.strokeStyle='#987142';
    for (const mark of marks) { const a=screen(mark.a), b=screen(mark.b);pen.beginPath();pen.moveTo(a.x,a.y);pen.lineTo(b.x,b.y);pen.stroke() }
    pen.restore();
    if(step<2&&!plan){
      for(const [x,fill] of [[395,true],[205,false]]){pen.beginPath();pen.arc(x,170,10,0,Math.PI*2);pen.strokeStyle='#395f50';pen.lineWidth=3;pen.stroke();if(fill){pen.fillStyle='#395f50';pen.fill()}}
      pen.beginPath();pen.moveTo(370,170);pen.lineTo(230,170);pen.lineTo(240,163);pen.moveTo(230,170);pen.lineTo(240,177);pen.strokeStyle='#395f50';pen.stroke();
    }
  }
  function update(message='') {
    $('learn').textContent=tr('help');
    $('tourEyebrow').textContent='PAPER ROOM / FIRST STEPS';
    $('tourTitle').textContent=tr('title');$('tourPrivacy').textContent=tr('privacy');
    $('tourInstruction').textContent=labels.steps[step][lang];
    $('tourFeedback').textContent=message || (plan ? tr(step===0?'cancelPrompt':'confirmPrompt') : '');
    for(const [id,key] of [['tourCancel','cancel'],['tourConfirm','confirm'],['tourUnfold','unfold'],['tourFinish','finish'],['tourRestart','restart']])$(id).textContent=tr(key);
    $('tourClose').setAttribute('aria-label',tr('close'));surface.setAttribute('aria-label',tr('title'));
    $('tourCancel').hidden=!plan; $('tourConfirm').hidden=step!==1||!plan;
    $('tourUnfold').hidden=step!==2; $('tourFinish').hidden=step!==3;
    draw();
  }
  function reset(){sheet=E.makePiece('square');plan=null;start=null;step=0;update()}
  function open(){reset();dialog.showModal();$('tourClose').focus()}
  function close(){plan=null;start=null;dialog.close();try{localStorage.setItem(seenKey,'true')}catch{}$('learn').focus()}
  function cancelPreview(){if(!plan)return;plan=null;start=null;if(step===0)step=1;update()}
  function confirmPreview(){if(step!==1||!plan)return;E.fold(sheet,plan);plan=null;start=null;step=2;update();$('tourUnfold').focus()}
  surface.addEventListener('pointerdown',event=>{
    if(event.button!==0||step>1||plan)return;
    const p=point(event); if(!sheet.faces.some(f=>E.inside(p,f.p)))return;
    start=p;surface.setPointerCapture(event.pointerId);event.preventDefault();surface.focus();
  });
  surface.addEventListener('pointermove',event=>{if(!start)return;plan=E.foldPlan(sheet,start,point(event),8);update()});
  surface.addEventListener('pointerup',()=>{if(!start)return;start=null;update(plan?'':tr('retry'));if(plan)$(step===0?'tourCancel':'tourConfirm').focus()});
  surface.addEventListener('pointercancel',()=>{start=null;plan=null;update(tr('retry'))});
  dialog.addEventListener('keydown',event=>{
    if(event.code==='Space'&&event.target===surface){event.preventDefault();confirmPreview()}
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();if(plan)cancelPreview();else close()}
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();if(plan)cancelPreview();else close()});
  $('tourCancel').onclick=cancelPreview;$('tourConfirm').onclick=confirmPreview;
  $('tourUnfold').onclick=()=>{if(step!==2)return;E.unfold(sheet);step=3;update();$('tourFinish').focus()};
  $('tourClose').onclick=close;$('tourFinish').onclick=close;$('tourRestart').onclick=reset;
  $('learn').onclick=open;
  $('language').addEventListener('change',()=>update());
  reset();
  let seen=false;try{seen=localStorage.getItem(seenKey)==='true'}catch{}
  if(!seen)open();
})();
