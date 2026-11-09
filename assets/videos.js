/* Renders the Videos section from window.VIDEOS (see /videos.js). */
(function(){
  var list=window.VIDEOS||[],grid=document.getElementById('vgrid'),filters=document.getElementById('vfilters');
  if(!grid)return;

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function ytId(s){
    s=String(s||'').trim();
    var m=s.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
    if(m)return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(s)?s:'';
  }
  function vimeoId(s){
    s=String(s||'').trim();
    var m=s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if(m)return m[1];
    return /^\d+$/.test(s)?s:'';
  }

  function media(v){
    var yt=ytId(v.youtube),vm=vimeoId(v.vimeo),poster=v.poster||(yt?'https://i.ytimg.com/vi/'+yt+'/hqdefault.jpg':'');
    if(v.file){
      return '<div class="vshot"><video controls playsinline preload="none"'+(poster?' poster="'+esc(poster)+'"':'')+' aria-label="'+esc(v.title)+'"><source src="'+esc(v.file)+'" type="video/mp4"></video></div>';
    }
    var src=yt?'https://www.youtube-nocookie.com/embed/'+yt+'?autoplay=1&rel=0&modestbranding=1'
           :vm?'https://player.vimeo.com/video/'+vm+'?autoplay=1':'';
    if(!src)return '<div class="vshot"><span class="noimg">'+esc(v.title)+'</span></div>';
    return '<div class="vshot"><button type="button" class="vplay" data-src="'+esc(src)+'" data-title="'+esc(v.title)+'" aria-label="Play video: '+esc(v.title)+'">'+
      (poster?'<img src="'+esc(poster)+'" alt="" loading="lazy">':'<span class="noimg">'+esc(v.title)+'</span>')+
      '<span class="vicon" aria-hidden="true"></span></button></div>';
  }

  function card(v){
    var yt=ytId(v.youtube),
        meta=[v.project,v.category,v.duration].filter(Boolean).map(function(x){return '<span>'+esc(x)+'</span>'}).join('');
    return '<article class="video">'+media(v)+
      '<h3>'+esc(v.title)+'</h3>'+
      (meta?'<div class="meta">'+meta+'</div>':'')+
      (v.description?'<p>'+esc(v.description)+'</p>':'')+
      (yt?'<a class="vlink" href="https://www.youtube.com/watch?v='+yt+'" rel="noopener">Watch on YouTube</a>':'')+
    '</article>';
  }

  function render(filter){
    if(!list.length){
      grid.innerHTML='<div class="soon vsoon"><div><strong>Videos coming soon</strong>Gameplay and project footage will appear here.</div></div>';
      return;
    }
    grid.innerHTML=list.filter(function(v){return filter==='all'||v.category===filter}).map(card).join('');
  }

  var cats=[];
  list.forEach(function(v){if(v.category&&cats.indexOf(v.category)<0)cats.push(v.category)});
  if(cats.length>1){
    filters.innerHTML=['All'].concat(cats).map(function(c,i){return '<button type="button" data-f="'+esc(i?c:'all')+'" aria-pressed="'+(i===0)+'">'+esc(c)+'</button>'}).join('');
    filters.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      [].forEach.call(filters.children,function(x){x.setAttribute('aria-pressed',x===b)});
      render(b.dataset.f);
    });
  }else filters.hidden=true;

  grid.addEventListener('click',function(e){
    var b=e.target.closest('.vplay');if(!b)return;
    var f=document.createElement('iframe');
    f.src=b.dataset.src;f.title=b.dataset.title||'Video';
    f.allow='autoplay; fullscreen; picture-in-picture';f.allowFullscreen=true;
    f.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
    b.parentNode.replaceChild(f,b);
  });

  render('all');
})();
