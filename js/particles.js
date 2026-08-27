/* Dala signature imagery — animated constellation of tiny outlined
   triangles forming an organic cloud, plus sparse ambient particles.
   Canvas-based so it stays crisp and lightweight at any viewport. */
(function(){
  const canvas = document.getElementById('constellation');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = ['#8052ff','#a78bfa','#ffb829','#2dd4bf','#15846e','#e879f9','#4c6fff'];

  let w = 0, h = 0, dpr = 1, particles = [];

  function build(){
    particles = [];
    const dense = Math.max(220, Math.min(900, Math.floor((w*h)/700)));
    const cx = w*0.5, cy = h*0.48;
    const radius = Math.min(w,h)*0.46;

    for(let i=0;i<dense;i++){
      const angle = Math.random()*Math.PI*2;
      const r = Math.pow(Math.random(),1.7)*radius;
      const wobble = (Math.random()-0.5)*radius*0.18;
      particles.push({
        x: cx + Math.cos(angle)*r + wobble*Math.sin(angle*3),
        y: cy + Math.sin(angle)*r*0.9 + wobble*Math.cos(angle*2),
        size: 1 + Math.random()*2.6,
        color: colors[(Math.random()*colors.length)|0],
        rot: Math.random()*Math.PI*2,
        speed: .2 + Math.random()*.4,
        driftX: (Math.random()-0.5)*.5,
        driftY: (Math.random()-0.5)*.5,
        phase: Math.random()*Math.PI*2,
        alpha: .55 + Math.random()*.4
      });
    }

    const ambient = Math.floor(dense*0.4);
    for(let i=0;i<ambient;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        size: 1 + Math.random()*1.8,
        color: colors[(Math.random()*colors.length)|0],
        rot: Math.random()*Math.PI*2,
        speed: .1 + Math.random()*.25,
        driftX: (Math.random()-0.5)*.35,
        driftY: (Math.random()-0.5)*.35,
        phase: Math.random()*Math.PI*2,
        alpha: .18 + Math.random()*.22
      });
    }
  }

  function resize(){
    dpr = Math.min(window.devicePixelRatio||1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, w*dpr);
    canvas.height = Math.max(1, h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    build();
  }

  function drawTriangle(p, t){
    const wob = Math.sin(t*0.0006*p.speed + p.phase) * 5;
    const x = p.x + wob*p.driftX;
    const y = p.y + wob*p.driftY;
    const s = p.size*3;
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(p.rot + t*0.00004*p.speed);
    ctx.beginPath();
    ctx.moveTo(0,-s);
    ctx.lineTo(s*.87, s*.5);
    ctx.lineTo(-s*.87, s*.5);
    ctx.closePath();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function frame(t){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<particles.length;i++) drawTriangle(particles[i], t);
    if(!reduceMotion) requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  if(reduceMotion){ frame(0); } else { requestAnimationFrame(frame); }
})();
