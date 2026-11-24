/* Complete illustrated frames for the centrally selected character set. */
(function () {
  'use strict';
  const source = document.currentScript;
  const base = new URL('.', source.src).href;
  const catalog = window.UniversalAvatarAssets, renderers = new Map();
  function forAsset(id = catalog.active.id) {
    const asset = catalog.get(id);
    if (!renderers.has(asset.id)) renderers.set(asset.id, createRenderer(asset));
    return renderers.get(asset.id);
  }
  function createRenderer(asset) {
    const images = Object.fromEntries(Object.entries(asset.sheets).map(([key,sheet])=>[key,base+sheet.file]));
    const decoded = {};
    let loaded, masterImage,actorImages,actorVariants={};
    function removeFragments(p,stride,ox,oy,w,h,labels,queue){
      labels.fill(0);const parts=[null];let largest=0;
      const alpha=index=>p[((oy+Math.floor(index/w))*stride+ox+index%w)*4+3];
      for(let start=0;start<w*h;start++){
        if(labels[start]||alpha(start)<32)continue;
        const id=parts.length,part={area:0,left:w,right:0,top:h,bottom:0};let read=0,tail=1;
        labels[start]=id;queue[0]=start;
        const visit=index=>{if(!labels[index]&&alpha(index)>=32){labels[index]=id;queue[tail++]=index;}};
        while(read<tail){
          const index=queue[read++],x=index%w,y=Math.floor(index/w);part.area++;
          part.left=Math.min(part.left,x);part.right=Math.max(part.right,x);part.top=Math.min(part.top,y);part.bottom=Math.max(part.bottom,y);
          if(x)visit(index-1);if(x+1<w)visit(index+1);if(y)visit(index-w);if(y+1<h)visit(index+w);
        }
        parts.push(part);if(!largest||part.area>parts[largest].area)largest=id;
      }
      if(!largest)return;
      const body=parts[largest],discard=new Set();
      for(let id=1;id<parts.length;id++){
        const part=parts[id],gapX=Math.max(0,body.left-part.right-1,part.left-body.right-1),gapY=Math.max(0,body.top-part.bottom-1,part.top-body.bottom-1);
        // Reject isolated slivers from a neighboring cell. Keep fine blades and
        // hair details near the body, even when anti-aliasing separates them.
        if(part.area<body.area*.1&&Math.max(gapX,gapY)>3)discard.add(id);
      }
      if(discard.size)for(let index=0;index<w*h;index++)if(discard.has(labels[index]))p[((oy+Math.floor(index/w))*stride+ox+index%w)*4+3]=0;
    }
    function prepare(image,spec){
      const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
      const ctx=canvas.getContext('2d');if(!ctx?.getImageData)return {image,anchors:null};
      ctx.drawImage(image,0,0);
      const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),p=pixels.data;
      // Remove weak extraction matte, preserving the generated RGB colors.
      for(let i=3;i<p.length;i+=4)p[i]=Math.round(Math.max(0,Math.min(1,(p[i]-48)/174))*255);
      const cw=canvas.width/spec.columns,ch=canvas.height/spec.rows,anchors=[];
      const labels=new Int32Array(Math.floor(cw)*Math.floor(ch)),queue=new Int32Array(labels.length);
      for(let index=0;index<spec.columns*spec.rows;index++){
        const ox=index%spec.columns*cw,oy=Math.floor(index/spec.columns)*ch;
        removeFragments(p,canvas.width,Math.floor(ox),Math.floor(oy),Math.floor(cw),Math.floor(ch),labels,queue);
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
      ctx.putImageData(pixels,0,0);
      return {image:canvas,anchors};
    }
    function fitCanvas(element) {
      // Render straight from the source cell into the final device-pixel bitmap.
      // The hero and the moving character have different CSS sizes.
      const cssWidth = element.getBoundingClientRect?.().width || asset.motion.desktop || 192;
      const pixels = Math.max(1, Math.round(cssWidth * Math.min(3, window.devicePixelRatio || 1)));
      if (element.width !== pixels || element.height !== pixels) {
        element.width = element.height = pixels;
        element._frameKey = null;
      }
    }
    function prepareActions(image,spec,atlas){
      if(!atlas.normalize)return {image};
      const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
      const ctx=canvas.getContext('2d');if(!ctx?.getImageData)return {image};
      ctx.drawImage(image,0,0);
      const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),p=pixels.data;
      // The same extraction-matte cleanup as the existing Lumi renderer, once
      // at decode time. Complete illustrated people remain indivisible frames.
      for(let i=3;i<p.length;i+=4)p[i]=Math.round(Math.max(0,Math.min(1,(p[i]-48)/174))*255);
      const rects=[],anchors=[];
      for(let cell=0;cell<atlas.columns*atlas.rows;cell++){
        const col=cell%atlas.columns,row=Math.floor(cell/atlas.columns);
        const x=Math.round(col*canvas.width/atlas.columns),right=Math.round((col+1)*canvas.width/atlas.columns);
        const y=spec.rowBounds?.[row]??Math.round(row*canvas.height/atlas.rows);
        const bottom=spec.rowBounds?.[row+1]??Math.round((row+1)*canvas.height/atlas.rows);
        const w=right-x,h=bottom-y,labels=new Int32Array(w*h),queue=new Int32Array(w*h);
        removeFragments(p,canvas.width,x,y,w,h,labels,queue);
        let top=h,feet=0;
        for(let py=0;py<h;py++){
          let count=0;for(let px=0;px<w;px++)if(p[((y+py)*canvas.width+x+px)*4+3]>128)count++;
          if(count>=2){top=Math.min(top,py);feet=py+1;}
        }
        if(feet<=top){top=h*.1;feet=h*.94;}
        let sum=0,mass=0;
        for(let py=Math.ceil(top);py<Math.min(h,top+(feet-top)*.18);py++)for(let px=0;px<w;px++){
          const a=p[((y+py)*canvas.width+x+px)*4+3];if(a>128){sum+=px*a;mass+=a;}
        }
        rects.push({x,y,w,h});anchors.push({top,feet,head:mass?sum/mass:w/2});
      }
      ctx.putImageData(pixels,0,0);
      const ref=anchors[spec.reference||0];
      const unitScale=(spec.heightRatio||.84)/Math.max(1,ref.feet-ref.top);
      const unitScales=anchors.map((_,cell)=>{
        const group=spec.scaleGroups?.find(g=>cell>=g.from&&cell<=g.to);
        if(!group)return unitScale;
        const standing=anchors[group.reference];
        return (spec.heightRatio||.84)/Math.max(1,standing.feet-standing.top);
      });
      return {image:canvas,rects,anchors,unitScale,unitScales};
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
      fitCanvas(element);
      if(actorImages){
        const variant=selection.atlas&&asset.master.variants?.[selection.atlas],atlas=variant||asset.master;
        const sources=variant?actorVariants[selection.atlas]:actorImages,actor=details.actor;
        const individual=actor===0||actor===1,key='actors:'+(selection.atlas||'main')+':'+sheet+':'+index+':'+facing+':'+(individual?actor:'preview');
        const mirrored=id=>{
          const spec=atlas.actors[id],cell=(spec.frames||atlas.frames)[sheet][index];
          return spec.mirrorCells?.includes(cell)||spec.mirrorFrames?.[sheet]?.includes(index);
        };
        // Reflect a complete illustrated view only where the generated atlas
        // repeats a right-side view in the left half of a full axial turn.
        // Apply it before the cache check so repeated paints retain the view.
        if(individual){element.style.scale=((facing<0?-1:1)*(mirrored(actor)?-1:1))+' 1';element.dataset.viewMirror=String(!!mirrored(actor));}
        if(element._frameKey===key)return;
        const ctx=element.getContext('2d');if(!ctx)return;
        const w=element.width;ctx.clearRect(0,0,w,w);ctx.globalAlpha=1;ctx.filter='none';ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
        const draw=(id,x,y,size)=>{
          const prepared=sources[id],source=prepared.image,spec=atlas.actors[id],cell=(spec.frames||atlas.frames)[sheet][index];
          const reflect=!individual&&mirrored(id);
          if(reflect){ctx.save();ctx.translate(x+size,y);ctx.scale(-1,1);x=0;y=0;}
          // Each source cell contains exactly one complete person. Never crop
          // halves of a paired illustration or compose separate body parts.
          if(prepared.rects){
            const r=prepared.rects[cell],a=prepared.anchors[cell],scale=size*(prepared.unitScales?.[cell]??prepared.unitScale);
            ctx.drawImage(source,r.x,r.y,r.w,r.h,x+size*.5-a.head*scale,y+size*.945-a.feet*scale,r.w*scale,r.h*scale);
          }else{
            const cw=source.naturalWidth/atlas.columns,ch=source.naturalHeight/atlas.rows;
            ctx.drawImage(source,cell%atlas.columns*cw,Math.floor(cell/atlas.columns)*ch,cw,ch,x,y,size,size);
          }
          if(reflect)ctx.restore();
        };
        if(individual){draw(actor,0,0,w);element.dataset.sourceFile=atlas.actors[actor].file;}
        else{draw(0,0,w*.25,w*.66);draw(1,w*.34,w*.25,w*.66);element.dataset.sourceFile=atlas.actors.map(a=>a.file).join(' ');}
        element.dataset.atlas=selection.atlas||'main';
        element.dataset.actor=individual?String(actor):'preview';element._frameKey=key;return;
      }
      if(masterImage){
        const cell=asset.master.frames[sheet][index],key='master:'+cell+':'+facing;
        if(element._frameKey===key)return;
        const ctx=element.getContext('2d');if(!ctx)return;
        const w=element.width,cw=masterImage.naturalWidth/asset.master.columns,ch=masterImage.naturalHeight/asset.master.rows;
        ctx.clearRect(0,0,w,w);ctx.globalAlpha=1;ctx.filter='none';ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
        // The source has already been cleaned and aligned to a common baseline.
        const sx=(cell%asset.master.columns)*cw,sy=Math.floor(cell/asset.master.columns)*ch;
        ctx.drawImage(masterImage,sx,sy,cw,ch,0,0,w,w);
        element._frameKey=key;return;
      }
      const key=[sheet,index,facing].join(':');if(element._frameKey===key||!decoded[sheet])return;
      const source=decoded[sheet],image=source.image,ctx=element.getContext('2d');if(!ctx)return;
      const width=element.width,cw=image.width/spec.columns,ch=image.height/spec.rows;
      const anchors=Object.fromEntries(Object.entries(decoded).map(([key,value])=>[key,value.anchors]));
      const layout=catalog.layoutFor(asset,sheet,index,width,anchors);
      ctx.clearRect(0,0,width,width);ctx.globalAlpha=1;ctx.filter='none';ctx.imageSmoothingQuality='high';
      ctx.drawImage(image,index%spec.columns*cw,Math.floor(index/spec.columns)*ch,cw,ch,layout.x,layout.y,layout.width,layout.height);
      element._frameKey=key;
    }
    return {
      images, asset,
      preload() {
        if (!loaded) {
          if(asset.master?.actors){
            const atlases={main:asset.master,...asset.master.variants};
            const loadActor=(spec,atlas)=>new Promise((resolve,reject)=>{
              const image=new Image(),timer=setTimeout(()=>reject(Error('Action-PNG nicht verfügbar.')),12000);
              image.onload=()=>{clearTimeout(timer);if(image.naturalWidth!==spec.width||image.naturalHeight!==spec.height){reject(Error('Ungültiges Action-Raster.'));return;}try{resolve(prepareActions(image,spec,atlas));}catch(error){reject(error);}};
              image.onerror=()=>{clearTimeout(timer);reject(Error('Action-PNG nicht verfügbar.'));};
              const url=base+spec.file;if(/^https?:/.test(url))image.crossOrigin='anonymous';image.src=url;
            });
            loaded=Promise.all(Object.entries(atlases).map(async([key,atlas])=>{
              const actors=await Promise.all(atlas.actors.map(spec=>loadActor(spec,atlas)));
              return [key,actors];
            })).then(entries=>{const all=Object.fromEntries(entries);actorImages=all.main;actorVariants=all;})
              .catch(error=>{loaded=undefined;throw error;});
            return loaded;
          }
          const legacy=()=>Promise.all(Object.entries(images).map(([key,url]) => new Promise((resolve,reject) => {
          const image = new Image(),timeout=setTimeout(()=>reject(Error('Die Figur konnte nicht geladen werden.')),20000);
          image.onload = () => {try{decoded[key]=asset.renderer==='canvas'?prepare(image,asset.sheets[key]):{image};clearTimeout(timeout);resolve();}catch(error){clearTimeout(timeout);reject(error);}};
          image.onerror = () => {clearTimeout(timeout);reject(Error('Die Figur konnte nicht geladen werden.'));};
          if(/^https?:/.test(url))image.crossOrigin='anonymous';image.src = url;
        })));
          loaded=(asset.master?new Promise((resolve,reject)=>{
            const image=new Image(),url=base+asset.master.file,timeout=setTimeout(()=>reject(Error('Master-Atlas nicht verfügbar.')),8000);
            image.onload=()=>{clearTimeout(timeout);if(image.naturalWidth!==(asset.master.width||1536)||image.naturalHeight!==(asset.master.height||1536)){reject(Error('Ungültiges Master-Raster.'));return;}masterImage=image;resolve();};
            image.onerror=()=>{clearTimeout(timeout);reject(Error('Master-Atlas nicht verfügbar.'));};
            if(/^https?:/.test(url))image.crossOrigin='anonymous';image.src=url;
          }).catch(error=>{if(asset.master.required)throw error;return legacy();}):legacy()).catch(error=>{loaded=undefined;throw error;});
        }
        return loaded;
      },
      create(actor) {
        const element = document.createElement(asset.renderer==='canvas'?'canvas':'span');
        element.className = 'jimmy-frame';
        element.setAttribute('aria-hidden','true');
        paint(element,'idle',0,1,{actor});
        return element;
      },
      paint
    };
  }
  window.JimmyMascot = Object.assign(forAsset(), {forAsset});
})();

