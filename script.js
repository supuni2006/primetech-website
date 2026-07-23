gsap.registerPlugin(ScrollTrigger);

/* ============ PRELOADER ============ */
const plFill = document.getElementById('pl-fill');
const plPct = document.getElementById('pl-pct');
let progress = 0;
const plInterval = setInterval(()=>{
  progress += Math.random()*18;
  if(progress>=100){progress=100;clearInterval(plInterval);}
  plFill.style.width = progress+'%';
  plPct.textContent = Math.round(progress)+'%';
  if(progress===100){ setTimeout(revealSite, 250); }
},140);

function revealSite(){
  gsap.to('#preloader',{
    yPercent:-100, duration:0.9, ease:'power3.inOut',
    onComplete:()=>{ document.getElementById('preloader').style.display='none'; }
  });
  playHeroIntro();
}

/* ============ CUSTOM CURSOR ============ */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const ringLabel = document.getElementById('cursorLabel');

gsap.set([dot, ring], {xPercent:-50, yPercent:-50});

const qDotX = gsap.quickTo(dot,'x',{duration:0.12,ease:'power3'});
const qDotY = gsap.quickTo(dot,'y',{duration:0.12,ease:'power3'});
const qRingX = gsap.quickTo(ring,'x',{duration:0.45,ease:'power3'});
const qRingY = gsap.quickTo(ring,'y',{duration:0.45,ease:'power3'});

window.addEventListener('mousemove', e=>{
  qDotX(e.clientX); qDotY(e.clientY);
  qRingX(e.clientX); qRingY(e.clientY);
});

function bindCursor(selector, label){
  document.querySelectorAll(selector).forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      ring.classList.add('active'); ringLabel.textContent = label||'';
      dot.classList.add('active');
      gsap.to(dot,{scale:2.4,duration:0.35,ease:'back.out(3)'});
    });
    el.addEventListener('mouseleave',()=>{
      ring.classList.remove('active'); ringLabel.textContent='';
      dot.classList.remove('active');
      gsap.to(dot,{scale:1,duration:0.35,ease:'power3.out'});
    });
  });
}
bindCursor('a, .btn', 'GO');
bindCursor('[data-svc]', 'VIEW');

/* magnetic buttons */
document.querySelectorAll('.magnetic').forEach(el=>{
  const qx = gsap.quickTo(el,'x',{duration:0.4,ease:'power3'});
  const qy = gsap.quickTo(el,'y',{duration:0.4,ease:'power3'});
  el.addEventListener('mousemove', e=>{
    const r = el.getBoundingClientRect();
    qx((e.clientX - r.left - r.width/2)*0.35);
    qy((e.clientY - r.top - r.height/2)*0.35);
  });
  el.addEventListener('mouseleave', ()=>{ qx(0); qy(0); });
});

/* ============ NAV SOLIDIFY ============ */
ScrollTrigger.create({
  start:'top -80', end:99999,
  onUpdate:self=>{ document.getElementById('mainNav').classList.toggle('solid', self.scroll()>80); }
});

/* ============ HERO TEXT INTRO ============ */
function playHeroIntro(){
  const tl = gsap.timeline({delay:0.15});
  tl.from('.hero-card',{opacity:0,y:24,duration:1,ease:'power3.out'})
    .to('#heroKicker',{opacity:1,duration:0.01})
    .from('#heroKicker',{width:0,duration:0.5,ease:'power2.out'},'<')
    .to('.hero-copy h1 .line span',{yPercent:0,duration:1,ease:'power4.out',stagger:0.12},'-=0.2')
    .to('.hero-copy p',{opacity:1,duration:0.7,ease:'power2.out'},'-=0.5')
    .to('.hero-copy .btn',{opacity:1,duration:0.7,ease:'power2.out'},'-=0.45')
    .to('.hero-side',{opacity:1,duration:0.8,ease:'power2.out'},'-=0.5')
    .from('.hero-outline',{opacity:0,duration:1.2,ease:'power2.out'},'-=0.9');
}

/* ============ SCROLL REVEALS ============ */
gsap.utils.toArray('[data-reveal], .stat-panel, .about-copy').forEach(el=>{
  gsap.fromTo(el,{y:40,opacity:0},{
    y:0,opacity:1,duration:1,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 85%'}
  });
});
gsap.utils.toArray('.why-cell').forEach((el,i)=>{
  gsap.fromTo(el,{y:30,opacity:0},{
    y:0,opacity:1,duration:0.8,ease:'power3.out',delay:i*0.06,
    scrollTrigger:{trigger:el,start:'top 90%'}
  });
});
gsap.utils.toArray('.eyebrow, .head-row h2, .head-row .sub, .cta-inner h2, .cta-inner .sub, .cta-btns').forEach(el=>{
  gsap.fromTo(el,{y:24,opacity:0},{
    y:0,opacity:1,duration:0.9,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 88%'}
  });
});
gsap.utils.toArray('.svc-item').forEach((el,i)=>{
  gsap.fromTo(el,{y:34,opacity:0},{
    y:0,opacity:1,duration:0.8,ease:'power3.out',delay:(i%5)*0.05,
    scrollTrigger:{trigger:el,start:'top 92%'}
  });
});

/* counters */
document.querySelectorAll('[data-count]').forEach(el=>{
  const target = parseFloat(el.getAttribute('data-count'));
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter:()=>{
      let obj={v:0};
      gsap.to(obj,{v:target,duration:1.6,ease:'power2.out',onUpdate:()=>{ el.textContent = Math.floor(obj.v); }});
    }
  });
});

/* ============ SERVICE ACCORDION ============ */
document.querySelectorAll('[data-svc]').forEach(item=>{
  item.addEventListener('click', ()=>{
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('[data-svc]').forEach(i=>i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

/* ============ HERO CARD PARALLAX (mouse interaction) ============ */
(function(){
  const card = document.getElementById('heroCard');
  const outline = document.querySelector('.hero-outline');
  if(!card) return;

  const qOutX = gsap.quickTo(outline,'x',{duration:0.9,ease:'power3'});

  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const nx = (e.clientX - r.left)/r.width - 0.5;
    qOutX(nx*-30);
  });
  card.addEventListener('mouseleave', ()=>{
    qOutX(0);
  });

  /* three.js particle drift across the sky layer for subtle depth */
  const skyCanvas = document.createElement('canvas');
  skyCanvas.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
  card.querySelector('.hero-bg').appendChild(skyCanvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1,1,1,-1,0.1,10);
  camera.position.z = 2;
  const renderer = new THREE.WebGLRenderer({canvas:skyCanvas, alpha:true, antialias:true});
  function sizeRenderer(){
    const r = card.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  }
  sizeRenderer();

  const count = 140;
  const positions = new Float32Array(count*3);
  const speeds = [];
  for(let i=0;i<count;i++){
    positions[i*3] = (Math.random()*2-1);
    positions[i*3+1] = (Math.random()*2-1)*0.5 - 0.1;
    positions[i*3+2] = 0;
    speeds.push(0.00025 + Math.random()*0.0005);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const mat = new THREE.PointsMaterial({size:0.006, color:0x8fefff, transparent:true, opacity:0.5});
  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  function animate(){
    requestAnimationFrame(animate);
    const pos = geo.attributes.position;
    for(let i=0;i<count;i++){
      let x = pos.getX(i) + speeds[i];
      if(x > 1) x = -1;
      pos.setX(i,x);
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', sizeRenderer);
})();