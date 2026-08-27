/* COLD MINIMAL — shared behavior: scroll reveal only, no decoration */
(function(){
  const targets = document.querySelectorAll('.reveal');
  if(!targets.length) return;

  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    targets.forEach(el=>el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const group = el.closest('[data-stagger]');
      if(group){
        const items = [...group.querySelectorAll('.reveal:not(.in)')];
        items.forEach((item,i)=> setTimeout(()=>item.classList.add('in'), i*50));
      }else{
        el.classList.add('in');
      }
      io.unobserve(el);
    });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});

  targets.forEach(el=>io.observe(el));
})();
