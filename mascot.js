/* Complete illustrated frames for the centrally selected character set. */
(function () {
  'use strict';
  const source = document.currentScript;
  const base = new URL('.', source.src).href;
  const catalog = window.UniversalAvatarAssets, asset = catalog.active;
  const images = Object.fromEntries(Object.entries(asset.sheets).map(([key,sheet])=>[key,base+sheet.file]));
  const decoded = {};
  let loaded;
  function prepare(image,spec){
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const ctx=canvas.getContext('2d');if(!ctx?.getImageData)return {image,anchors:null};
    ctx.drawImage(image,0,0);
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),p=pixels.data;
    // Remove weak extraction matte, preserving the generated RGB colors.
    for(let i=3;i<p.length;i+=4)p[i]=Math.round(Math.max(0,Math.min(1,(p[i]-48)/174))*255);
    ctx.putImageData(pixels,0,0);
    const cw=canvas.width/spec.columns,ch=canvas.height/spec.rows,anchors=[];
    for(let index=0;index<spec.columns*spec.rows;index++){
      const ox=index%spec.columns*cw,oy=Math.floor(index/spec.columns)*ch;
      let top=ch,bottom=0;
      for(let y=0;y<Math.floor(ch);y++){
        let count=0;
        for(let x=0;x<Math.floor(cw);x++)if(p[(Math.floor(oy+y)*canvas.width+Math.floor(ox+x))*4+3]>128)count++;
        if(count>=Math.max(2,cw*.008)){top=Math.min(top,y);bottom=y+1;}
      }
      if(bottom<=top){top=ch*.06;bottom=ch*.94;}
      let sum=0,mass=0;
      for(let y=Math.ceil(top);y<Math.min(ch,top+(bottom-top)*.22);y++)for(let x=0;x<Math.floor(cw);x++){
        const alpha=p[(Math.floor(oy+y)*canvas.width+Math.floor(ox+x))*4+3];
        if(alpha>128){sum+=x*alpha;mass+=alpha;}
      }
      anchors.push({top:top/ch,bottom:bottom/ch,head:mass?sum/mass/cw:.52});
    }
    return {image:canvas,anchors};
  }
  function paint(element, state = 'idle', frame = 0, facing = 1, details = {}) {
    const selection=catalog.frameFor(asset,state,frame,details),sheet=selection.sheet,index=selection.index,spec=asset.sheets[sheet];
    element.dataset.sheet=sheet;element.dataset.frame=String(index);element.dataset.pose=state;element.dataset.asset=asset.id;
    element.style.scale=(facing<0?-1:1)+' 1';
    if(asset.renderer==='background'){
      element.style.backgroundImage='url("'+images[sheet]+'")';
      element.style.backgroundSize=(spec.columns*100)+'% '+(spec.rows*100)+'%';
      element.style.backgroundPosition=(index%spec.columns)*100/(spec.columns-1)+'% '+Math.floor(index/spec.columns)*100/(spec.rows-1)+'%';
      return;
    }
    const key=[sheet,index,facing].join(':');if(element._frameKey===key||!decoded[sheet])return;
    const source=decoded[sheet],image=source.image,ctx=element.getContext('2d');if(!ctx)return;
    const width=element.width,cw=image.width/spec.columns,ch=image.height/spec.rows;
    let scale=1,dx=0,dy=0;
    if(source.anchors){
      const ref=source.anchors[spec.reference||0],anchor=source.anchors[index];
      scale=spec.height/Math.max(.3,ref.bottom-ref.top);
      dx=(sheet==='spin'||sheet==='jump'?.5-.5*scale:.52-anchor.head*scale)*width;
      dy=(.945-anchor.bottom*scale)*width;
    }
    ctx.clearRect(0,0,width,width);ctx.globalAlpha=1;ctx.filter='none';ctx.imageSmoothingQuality='high';
    ctx.drawImage(image,index%spec.columns*cw,Math.floor(index/spec.columns)*ch,cw,ch,dx,dy,width*scale,width*scale);
    element._frameKey=key;
  }
  window.JimmyMascot = {
    images, asset,
    preload() {
      if (!loaded) loaded = Promise.all(Object.entries(images).map(([key,url]) => new Promise((resolve,reject) => {
        const image = new Image(),timeout=setTimeout(()=>reject(Error('Die Figur konnte nicht geladen werden.')),20000);
        image.onload = () => {try{decoded[key]=asset.renderer==='canvas'?prepare(image,asset.sheets[key]):{image};clearTimeout(timeout);resolve();}catch(error){clearTimeout(timeout);reject(error);}};
        image.onerror = () => {clearTimeout(timeout);reject(Error('Die Figur konnte nicht geladen werden.'));};
        if(/^https?:/.test(url))image.crossOrigin='anonymous';image.src = url;
      })));
      return loaded;
    },
    create() {
      const element = document.createElement(asset.renderer==='canvas'?'canvas':'span');
      if(asset.renderer==='canvas')element.width=element.height=Math.round(218*Math.min(2,window.devicePixelRatio||1));
      element.className = 'jimmy-frame';
      element.setAttribute('aria-hidden','true');
      paint(element);
      return element;
    },
    paint
  };
})();
