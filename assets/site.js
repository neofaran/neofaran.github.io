(function(){
  var games=window.GAMES||[],grid=document.getElementById('grid'),filters=document.getElementById('filters');
  var STATUS={live:{label:'On Google Play',cls:''},dev:{label:'In development',cls:'dev'}};
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function card(g){
    var st=STATUS[g.status]||STATUS.dev,
        title=g.page?'<a href="'+esc(g.page)+'">'+esc(g.title)+'</a>':esc(g.title),
        img=g.image?'<img src="'+esc(g.image)+'" alt="'+esc(g.title)+' key art" loading="lazy">':'<span class="noimg">'+esc(g.title)+'</span>';
    return '<article class="game" id="game-'+esc(g.id)+'" data-status="'+esc(g.status)+'">'+
      '<div class="shot">'+img+'</div>'+
      '<h3>'+title+'</h3>'+
      '<p>'+esc(g.description||g.tagline)+'</p>'+
      '<div class="meta"><span class="dot '+st.cls+'">'+st.label+'</span><span>'+esc(g.genre)+'</span><span>'+esc(g.platform)+'</span></div>'+
      (g.play?'<a class="btn main buy" href="'+esc(g.play)+'" rel="noopener">Get it on Google Play</a>':'')+
    '</article>';
  }
  function render(filter){
    var list=games.filter(function(g){return filter==='all'||g.status===filter});
    grid.innerHTML=list.map(card).join('')+(filter==='all'?'<div class="soon"><div><strong>Next game</strong>More games are on the way.</div></div>':'');
  }
  var opts=[['all','All']];
  if(games.some(function(g){return g.status==='live'}))opts.push(['live','On Google Play']);
  if(games.some(function(g){return g.status==='dev'}))opts.push(['dev','In development']);
  if(opts.length>2){
    filters.innerHTML=opts.map(function(o,i){return '<button type="button" data-f="'+o[0]+'" aria-pressed="'+(i===0)+'">'+o[1]+'</button>'}).join('');
    filters.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      [].forEach.call(filters.children,function(x){x.setAttribute('aria-pressed',x===b)});render(b.dataset.f)});
  }else filters.hidden=true;
  render('all');
  document.getElementById('privacy').innerHTML=games.filter(function(g){return g.privacy}).map(function(g){return '<a href="'+esc(g.privacy)+'">'+esc(g.title)+' privacy policy</a>'}).join('');

  var pj=document.getElementById('projects');
  if(pj)pj.innerHTML=(window.PROJECTS||[]).map(function(p){return '<article style="--c:'+esc(p.color||'var(--echo-1)')+'"><h3>'+esc(p.title)+'</h3><div class="meta">'+esc(p.meta)+'</div><p>'+esc(p.description)+'</p><ul>'+(p.points||[]).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></article>'}).join('');

  var bar=document.getElementById('bar');
  function onScroll(){bar.classList.toggle('solid',window.scrollY>40)}
  onScroll();addEventListener('scroll',onScroll,{passive:true});

  window.flashGame=function(id){
    location.hash='#games';
    var el=document.getElementById('game-'+id);
    if(!el){render('all');el=document.getElementById('game-'+id)}
    if(!el)return;
    el.scrollIntoView({behavior:'smooth',block:'center'});
    el.classList.add('flash');setTimeout(function(){el.classList.remove('flash')},1800);
  };
  requestAnimationFrame(function(){document.documentElement.classList.add('ready')});
})();
