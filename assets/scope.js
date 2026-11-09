/* Hero radar: weather echoes drift across a sweeping scope. Each game in games.js is a marker on it. */
(function(){
  var hero=document.getElementById('hero'),cv=document.getElementById('scope');
  if(!hero||!cv||!cv.getContext)return;
  var ctx=cv.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TAU=Math.PI*2,W=0,H=0,dpr=1,cx=0,cy=0,R=0,theta=-1.2,OMEGA=0.85,running=false,last=0;
  var mouse={x:0,y:0,on:false},hover=-1;
  var RAMP=[[63,208,255],[66,224,140],[255,194,51],[255,90,74],[230,76,255]];
  var games=(window.GAMES||[]).map(function(g,i){
    var a=g.bearing!=null?g.bearing:(i*2.39996+0.9)%TAU,r=g.range!=null?g.range:0.42+((i*0.19)%0.46);
    return {g:g,x:Math.cos(a)*r,y:Math.sin(a)*r,ang:(Math.atan2(Math.sin(a),Math.cos(a))+TAU)%TAU,glow:0};
  });

  function rnd(a,b){return a+Math.random()*(b-a)}
  function gauss(){return (Math.random()+Math.random()+Math.random()-1.5)/1.5}
  function ramp(t){var s=t*(RAMP.length-1),i=Math.min(RAMP.length-2,Math.floor(s)),f=s-i,a=RAMP[i],b=RAMP[i+1];
    return [a[0]+(b[0]-a[0])*f|0,a[1]+(b[1]-a[1])*f|0,a[2]+(b[2]-a[2])*f|0]}

  var cells=[];
  function build(){
    cells=[];
    var storms=[];
    for(var s=0;s<6;s++)storms.push({x:rnd(-.7,.7),y:rnd(-.7,.7),sp:rnd(.12,.26),n:rnd(16,26)|0});
    storms.forEach(function(st){
      for(var i=0;i<st.n;i++){
        var dx=gauss()*st.sp,dy=gauss()*st.sp,d=Math.hypot(dx,dy)/st.sp;
        var x=st.x+dx,y=st.y+dy;if(Math.hypot(x,y)>0.97)continue;
        cells.push({x:x,y:y,vx:rnd(.006,.014),vy:rnd(-.003,.003),sz:rnd(.035,.085)*(1.1-Math.min(d,1)*.4),
          lvl:Math.max(0,Math.min(1,.78-d*.62+rnd(-.1,.1))),glow:reduce?.8:0,ang:0});
      }
    });
  }

  function layout(){
    var r=hero.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);
    W=r.width;H=r.height;cv.width=W*dpr|0;cv.height=H*dpr|0;
    if(W<900){R=Math.min(W*.42,210);cx=W*.5;cy=H-R-46}
    else{cx=W*.7;cy=H*.52;R=Math.min(H*.44,W*.3)}
  }

  function bearingText(mx,my){
    var dx=mx-cx,dy=my-cy,b=(Math.atan2(dx,-dy)*180/Math.PI+360)%360,rg=Math.hypot(dx,dy)/R*80;
    return ('00'+Math.round(b)).slice(-3)+'°   '+Math.round(rg)+' nm';
  }

  function frame(now){
    if(!running)return;
    var dt=Math.min(.05,(now-last)/1000||0.016);last=now;
    update(dt);draw();requestAnimationFrame(frame);
  }
  function update(dt){
    var step=OMEGA*dt;theta=(theta+step)%TAU;
    var mx=(mouse.x-cx)/R,my=(mouse.y-cy)/R;
    for(var i=0;i<cells.length;i++){
      var c=cells[i];
      c.x+=c.vx*dt;c.y+=c.vy*dt;
      if(c.x>1.02){c.x=-1.0;c.y=rnd(-.8,.8)}
      if(mouse.on){var ddx=c.x-mx,ddy=c.y-my,d=Math.hypot(ddx,ddy);
        if(d<.22&&d>.001){var f=(.22-d)/.22*.5*dt;c.x+=ddx/d*f;c.y+=ddy/d*f;c.glow=Math.max(c.glow,.55)}}
      c.ang=(Math.atan2(c.y,c.x)+TAU)%TAU;
      var delta=(theta-c.ang+TAU)%TAU;
      if(delta<step*1.6)c.glow=1;else c.glow*=Math.exp(-dt/1.7);
    }
    for(var j=0;j<games.length;j++){var g=games[j],dl=(theta-g.ang+TAU)%TAU;
      if(dl<step*1.6)g.glow=1;else g.glow*=Math.exp(-dt/1.4)}
  }

  function draw(){
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    // range rings and bearing lines
    ctx.lineWidth=1;ctx.strokeStyle='rgba(120,165,230,.16)';
    for(var k=1;k<=4;k++){ctx.beginPath();ctx.arc(cx,cy,R*k/4,0,TAU);ctx.stroke()}
    ctx.strokeStyle='rgba(120,165,230,.09)';
    for(var a=0;a<12;a++){var an=a*TAU/12;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(an)*R,cy-Math.cos(an)*R);ctx.stroke()}
    ctx.strokeStyle='rgba(120,165,230,.35)';
    for(var t=0;t<72;t++){var ta=t*TAU/72,len=t%6===0?14:6;ctx.beginPath();
      ctx.moveTo(cx+Math.sin(ta)*R,cy-Math.cos(ta)*R);ctx.lineTo(cx+Math.sin(ta)*(R-len),cy-Math.cos(ta)*(R-len));ctx.stroke()}
    ctx.fillStyle='rgba(139,153,182,.75)';ctx.font='500 12px "Instrument Sans",system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    for(var b=0;b<12;b++){var ba=b*TAU/12,rr=R+18;ctx.fillText(('00'+(b*30)).slice(-3),cx+Math.sin(ba)*rr,cy-Math.cos(ba)*rr)}
    ctx.textAlign='left';
    for(var q=1;q<=4;q++)ctx.fillText(String(q*20),cx+4+Math.SQRT1_2*R*q/4,cy-4-Math.SQRT1_2*R*q/4);

    // echoes
    ctx.globalCompositeOperation='lighter';
    for(var i=0;i<cells.length;i++){
      var c=cells[i],al=.07+c.glow*.78,col=ramp(c.lvl),px=cx+c.x*R,py=cy+c.y*R,rad=c.sz*R;
      var gr=ctx.createRadialGradient(px,py,0,px,py,rad);
      gr.addColorStop(0,'rgba('+col[0]+','+col[1]+','+col[2]+','+al+')');
      gr.addColorStop(.55,'rgba('+col[0]+','+col[1]+','+col[2]+','+al*.55+')');
      gr.addColorStop(1,'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(px,py,rad,0,TAU);ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';

    // sweep wedge
    if(ctx.createConicGradient){
      var start=theta-Math.PI/2-1.25,cg=ctx.createConicGradient(start,cx,cy),f=1.25/TAU;
      cg.addColorStop(0,'rgba(63,208,255,0)');cg.addColorStop(f,'rgba(63,208,255,.26)');cg.addColorStop(Math.min(.999,f+.0008),'rgba(63,208,255,0)');cg.addColorStop(1,'rgba(63,208,255,0)');
      ctx.fillStyle=cg;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
    }
    var sx=cx+Math.sin(theta)*R,sy=cy-Math.cos(theta)*R;
    var lg=ctx.createLinearGradient(cx,cy,sx,sy);lg.addColorStop(0,'rgba(63,208,255,0)');lg.addColorStop(1,'rgba(160,235,255,.95)');
    ctx.strokeStyle=lg;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(sx,sy);ctx.stroke();
    ctx.strokeStyle='rgba(63,208,255,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke();

    // own position
    ctx.fillStyle='#ffb02e';ctx.beginPath();ctx.arc(cx,cy,3.5,0,TAU);ctx.fill();

    // game markers
    ctx.font='600 14px "Instrument Sans",system-ui,sans-serif';ctx.textBaseline='middle';
    for(var m=0;m<games.length;m++){
      var g=games[m],gx=cx+g.x*R,gy=cy+g.y*R,on=m===hover,glow=Math.max(g.glow,on?1:0);
      var ring=6+(1-g.glow)*16;
      ctx.strokeStyle='rgba(255,176,46,'+(g.glow*.8)+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(gx,gy,ring,0,TAU);ctx.stroke();
      ctx.save();ctx.translate(gx,gy);ctx.rotate(Math.PI/4);
      ctx.fillStyle=on?'#fff':'#ffb02e';ctx.shadowColor='#ffb02e';ctx.shadowBlur=8+glow*14;
      ctx.fillRect(-4.5,-4.5,9,9);ctx.restore();ctx.shadowBlur=0;
      var tw=ctx.measureText(g.g.title).width,lx=gx+(gx+tw+22>W?-(tw+14):14);
      ctx.fillStyle='rgba(232,237,247,'+(.45+glow*.55)+')';ctx.textAlign='left';ctx.fillText(g.g.title,lx,gy-14);
      ctx.fillStyle='rgba(139,153,182,'+(.35+glow*.5)+')';ctx.font='400 12px "Instrument Sans",system-ui,sans-serif';
      ctx.fillText(on?'Select to open':g.g.genre+(g.g.status==='live'?', on Google Play':', in development'),lx,gy+4);
      ctx.font='600 14px "Instrument Sans",system-ui,sans-serif';
    }

    // cursor
    if(mouse.on){
      var dx=mouse.x-cx,dy=mouse.y-cy;
      if(Math.hypot(dx,dy)<R+30){
        ctx.strokeStyle='rgba(255,176,46,.55)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(mouse.x-14,mouse.y);ctx.lineTo(mouse.x+14,mouse.y);ctx.moveTo(mouse.x,mouse.y-14);ctx.lineTo(mouse.x,mouse.y+14);ctx.stroke();
        ctx.fillStyle='rgba(255,176,46,.95)';ctx.font='500 13px "Instrument Sans",system-ui,sans-serif';ctx.textAlign='left';
        ctx.fillText(bearingText(mouse.x,mouse.y),mouse.x+18,mouse.y-18);
      }
    }
  }

  function pick(){
    hover=-1;if(!mouse.on)return;
    for(var i=0;i<games.length;i++){var gx=cx+games[i].x*R,gy=cy+games[i].y*R;
      if(Math.hypot(mouse.x-gx,mouse.y-gy)<22){hover=i;break}}
  }
  hero.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch')return;
    var r=hero.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.on=true;pick();
    var overUi=e.target.closest&&e.target.closest('a,button');
    hero.style.cursor=(hover>-1&&!overUi)?'pointer':'';
    if(!running&&reduce)draw();
  });
  hero.addEventListener('pointerleave',function(){mouse.on=false;hover=-1;hero.style.cursor='';if(!running&&reduce)draw()});
  hero.addEventListener('click',function(e){
    if(e.target.closest&&e.target.closest('a,button'))return;
    var r=hero.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.on=true;pick();
    if(hover>-1&&window.flashGame)window.flashGame(games[hover].g.id);
  });

  function start(){if(running||reduce)return;running=true;last=performance.now();requestAnimationFrame(frame)}
  function stop(){running=false}
  if('ResizeObserver' in window)new ResizeObserver(function(){layout();if(reduce)draw()}).observe(hero);else addEventListener('resize',function(){layout();if(reduce)draw()});
  if('IntersectionObserver' in window)new IntersectionObserver(function(en){en[0].isIntersecting?start():stop()},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});

  layout();build();
  if(reduce){games.forEach(function(g){g.glow=.7});theta=1.0;draw()}else start();
})();
