(()=>{
  const $=id=>document.getElementById(id);
  const levels=[
    {v:20,label:'20 % — Standard'},
    {v:30,label:'30 % — Contraintes modérées'},
    {v:40,label:'40 % — Contraintes importantes / risques'},
    {v:50,label:'50 % — Risques élevés / pollution / santé'}
  ];
  function init(){
    const m=$('margin'); if(!m)return;
    if(m.value===''||Number(m.value)===0)m.value='20';
    let box=$('v27Margin');
    if(box)return;
    box=document.createElement('div');box.id='v27Margin';box.className='card eco';
    box.innerHTML='<h3>📈 Niveau de marge</h3><p class="muted">20 % est la base. Choisissez un niveau supérieur lorsque le chantier présente davantage de contraintes ou de risques.</p><div id="v27Buttons" class="actions"></div><small id="v27Reason" class="muted"></small>';
    m.parentNode?.appendChild(box);
    const b=$('v27Buttons');
    levels.forEach(x=>{const btn=document.createElement('button');btn.type='button';btn.textContent=x.label;btn.dataset.margin=x.v;btn.onclick=()=>{m.value=x.v;update();m.dispatchEvent(new Event('input',{bubbles:true}));};b.appendChild(btn)});
    function update(){
      const val=Number(m.value)||20;
      b.querySelectorAll('button').forEach(x=>x.classList.toggle('primary',Number(x.dataset.margin)===val));
      const r=$('v27Reason');
      r.textContent=val===20?'Niveau standard.':val===30?'À envisager pour contraintes modérées ou imprévus.':val===40?'À envisager pour évacuation, déchets importants, difficulté ou risques.':'À réserver aux situations à risques élevés, pollution potentielle, déchets particuliers ou risques pour la santé/sécurité.';
    }
    m.addEventListener('input',update);update();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();