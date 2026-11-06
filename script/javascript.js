// NuttyNaj Shop - WHOLE FINAL - WhatsApp Orders + Contact + Tracking + ETA
const firebaseConfig = {
  apiKey: "AIzaSyBHZULA_QcHafTspVzCEWce9HM7We2wF-w",
  authDomain: "nuttynaj-114f7.firebaseapp.com",
  projectId: "nuttynaj-114f7",
  storageBucket: "nuttynaj-114f7.firebasestorage.app",
  messagingSenderId: "947196650287",
  appId: "1:947196650287:web:c36d5e3e6a3f27145df7da"
};
if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const CART_KEY='nuttynaj_cart_v1';
const PRODUCTS_KEY='nuttynaj_products_v3_FINAL';
const ADMIN_WHATSAPP='27728619405';

function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch{return[]}}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c));updateCount();}
function updateCount(){let c=getCart().reduce((s,i)=>s+(i.qty||0),0);document.querySelectorAll('#cart-count').forEach(e=>e.textContent=c);}
function getEffectivePrice(item){
  const f=(item.name||'').toLowerCase();
  if(f.includes('yoghurt')||f.includes('milk')) return 22;
  if(f.includes('pecan')||f.includes('walnut')||f.includes('hazel')||f.includes('pistachio')) return 20;
  return 18;
}
function getDefaultProducts(){
  return [
    {id:'cashew-milkchoc',category:'Cashew Nuts',name:'Cashew - Milk Chocolate Coated',image:'images/cashew-milkchoc.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'cashew-peri',category:'Cashew Nuts',name:'Cashew - Extra Hot Peri-Peri',image:'images/cashew-peri.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'cashew-plain',category:'Cashew Nuts',name:'Cashew - Roasted Plain',image:'images/cashew-plain.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'cashew-raw',category:'Cashew Nuts',name:'Cashew - Raw',image:'images/cashew-raw.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'cashew-roasted-salted',category:'Cashew Nuts',name:'Cashew - Roasted Salted',image:'images/cashew-roasted-salted.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'cashew-yoghurt',category:'Cashew Nuts',name:'Cashew - Yoghurt Coated',image:'images/cashew-yoghurt.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'macadamia-milkchoc',category:'Macadamia Nuts',name:'Macadamia - Milk Chocolate Coated',image:'images/macadamia-milkchoc.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'macadamia-peri',category:'Macadamia Nuts',name:'Macadamia - Extra Hot Peri-Peri',image:'images/macadamia-peri.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'macadamia-plain',category:'Macadamia Nuts',name:'Macadamia - Roasted Plain',image:'images/macadamia-plain.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'macadamia-raw',category:'Macadamia Nuts',name:'Macadamia - Raw',image:'images/macadamia-raw.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'macadamia-roasted-salted',category:'Macadamia Nuts',name:'Macadamia - Roasted Salted',image:'images/macadamia-roasted-salted.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'macadamia-yoghurt',category:'Macadamia Nuts',name:'Macadamia - Yoghurt Coated',image:'images/macadamia-yoghurt.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'pecan-lightly-salted',category:'Pecan Nuts',name:'Pecan Nuts - Lightly Salted',image:'images/pecan-lightly-salted.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'walnut-lightly-salted',category:'Walnut Nuts',name:'Walnut Nuts - Lightly Salted',image:'images/walnut-lightly-salted.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'hazelnut-lightly-salted',category:'Hazelnuts',name:'Hazelnut - Lightly Salted',image:'images/hazelnut-lightly-salted.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'pistachio-lightly-salted',category:'Pistachio Nuts',name:'Pistachio - Lightly Salted',image:'images/pistachio-lightly-salted.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'mixed-salted',category:'Mixed Nuts',name:'Mixed Nuts - Salted',image:'images/mixed-salted.jpg',desc:"50g kraft box, hand-packed in Benoni."},
    {id:'dried-jungle-mix',category:'Dried Fruits',name:'Dried Fruits - Jungle Mix',image:'images/dried-jungle-mix.jpg',desc:"50g kraft box, hand-packed in Benoni."},
  ];
}
function getProducts(){const s=JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'null');if(s&&s.length>0) return s; const d=getDefaultProducts(); localStorage.setItem(PRODUCTS_KEY,JSON.stringify(d)); return d;}
let products=getProducts();
const CATEGORIES=[{id:"all",label:"All"},{id:"Cashew Nuts",label:"Cashew"},{id:"Macadamia Nuts",label:"Macadamia"},{id:"Pecan Nuts",label:"Pecan"},{id:"Walnut Nuts",label:"Walnut"},{id:"Hazelnuts",label:"Hazelnut"},{id:"Pistachio Nuts",label:"Pistachio"},{id:"Mixed Nuts",label:"Mixed"},{id:"Dried Fruits",label:"Dried Fruits"}];
function buildCategoryBar(){const bar=document.getElementById('categoryBar');if(!bar) return;products=getProducts();bar.innerHTML=CATEGORIES.map(c=>{const count=c.id==="all"?products.length:products.filter(p=>p.category===c.id).length;return `<button class="cat-btn ${c.id==="all"?"active":""}" data-cat="${c.id}">${c.label} (${count})</button>`}).join('');bindCategoryButtons();}
function bindCategoryButtons(){document.querySelectorAll('.cat-btn').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.cat);}});}
let selectedProduct=null;
function render(filter='all'){const grid=document.getElementById('productsGrid');if(!grid) return;products=getProducts();grid.innerHTML='';const filtered=filter==='all'?products:products.filter(p=>p.category===filter);filtered.forEach(p=>{const price=getEffectivePrice({name:p.name});grid.innerHTML+=`<div class="prod-card"><img src="${p.image}" class="prod-img" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=NuttyNaj'"><div class="prod-cat">${p.category.toUpperCase()}</div><div class="prod-title">${p.name}</div><div class="prod-desc">${p.desc}</div><div class="prod-price">R ${price}.00</div><button class="btn-sm btn-dark" onclick="openModal('${p.id}')">ADD TO CART</button></div>`;});}
window.openModal=(id)=>{products=getProducts();selectedProduct=products.find(p=>p.id===id);if(!selectedProduct) return;document.getElementById('mTitle').textContent=selectedProduct.name;document.getElementById('mDesc').textContent=selectedProduct.desc;updateModalPrice();document.getElementById('productModal')?.classList.add('open');}
function updateModalPrice(){if(!selectedProduct) return;const eff=getEffectivePrice({name:selectedProduct.name});const el=document.getElementById('mPrice');if(el) el.textContent='R '+eff+'.00';}
function bindModal(){const modal=document.getElementById('productModal');if(!modal) return;document.getElementById('modalClose').onclick=()=>modal.classList.remove('open');modal.onclick=(e)=>{if(e.target===modal) modal.classList.remove('open');};document.getElementById('mFlavour')?.addEventListener('change',updateModalPrice);document.getElementById('mCoating')?.addEventListener('change',updateModalPrice);document.getElementById('modalAddBtn')?.addEventListener('click',()=>{if(!selectedProduct) return;const flavour=document.getElementById('mFlavour').value;const coating=document.getElementById('mCoating').value;let cart=getCart();const key=selectedProduct.id+flavour+coating;let ex=cart.find(i=>i.key===key);if(ex) ex.qty++;else cart.push({key,id:selectedProduct.id,name:selectedProduct.name,category:selectedProduct.category,flavour,coating,qty:1,image:selectedProduct.image});saveCart(cart);modal.classList.remove('open');});}
function renderCartPage(){const container=document.getElementById('cartItems');if(!container) return;const cart=getCart();if(cart.length===0){container.innerHTML=`<div class="empty-cart"><p>Your box is empty.</p><a href="shop.html" class="btn-dark">GO TO SHOP</a></div>`;updateTotals();return;}container.innerHTML='';cart.forEach((item,idx)=>{const eff=getEffectivePrice({name:item.name});container.innerHTML+=`<div class="cart-item"><img src="${item.image}" style="width:60px;height:60px;object-fit:cover"><div class="cart-item-info"><h4>${item.name}</h4><p>${item.category} • R${eff}</p><div class="qty-controls"><button onclick="changeQty(${idx},-1)">-</button><span>${item.qty}</span><button onclick="changeQty(${idx},1)">+</button><button onclick="removeItem(${idx})" style="margin-left:10px;color:red">✕</button></div></div><div class="cart-item-price">R ${(eff*item.qty).toFixed(2)}</div></div>`;});updateTotals();}
function updateTotals(){const cart=getCart();const sub=cart.reduce((s,i)=>s+getEffectivePrice({name:i.name})*i.qty,0);const deliveryFee=sub>=350?0:(sub>0?60:0);const grand=sub+deliveryFee;const needed=350-sub;const fm=document.getElementById('freeMsg');if(fm){if(cart.length===0) fm.textContent='Add items';else if(sub>=350){fm.textContent='🎉 FREE delivery!';fm.className='free-delivery-msg free';}else{fm.textContent=`Add R${needed.toFixed(2)} more for FREE`;}}const subEl=document.getElementById('subTotal');const delEl=document.getElementById('deliveryFee');const grandEl=document.getElementById('grandTotal');const btnEl=document.getElementById('btnTotal');if(subEl) subEl.textContent=`R ${sub.toFixed(2)}`;if(delEl) delEl.textContent=deliveryFee===0?'FREE':`R ${deliveryFee.toFixed(2)}`;if(grandEl) grandEl.textContent=`R ${grand.toFixed(2)}`;if(btnEl) btnEl.textContent=`R ${grand.toFixed(2)}`;return {sub,deliveryFee,grand};}
window.changeQty=(idx,delta)=>{let cart=getCart();cart[idx].qty+=delta;if(cart[idx].qty<=0) cart.splice(idx,1);saveCart(cart);renderCartPage();}
window.removeItem=(idx)=>{let cart=getCart();cart.splice(idx,1);saveCart(cart);renderCartPage();}

document.addEventListener('DOMContentLoaded',()=>{
  updateCount();
  document.getElementById('hamburgerBtn')?.addEventListener('click',()=>document.getElementById('navLinks').classList.toggle('open'));
  if(document.getElementById('productsGrid')){buildCategoryBar();render();bindModal();}

  // CHECKOUT (Shop)
  const checkoutBtn=document.getElementById('checkoutBtn');const checkoutModal=document.getElementById('checkoutModal');const checkoutClose=document.getElementById('checkoutClose');
  if(checkoutBtn) checkoutBtn.onclick=()=>{if(getCart().length===0){alert('Cart empty');return;}updateTotals();checkoutModal.classList.add('open');}
  if(checkoutClose) checkoutClose.onclick=()=>checkoutModal.classList.remove('open');
  if(checkoutModal) checkoutModal.onclick=(e)=>{if(e.target===checkoutModal) checkoutModal.classList.remove('open');};
  const checkoutForm=document.getElementById('checkoutForm');
  if(checkoutForm){
    checkoutForm.addEventListener('submit',async (e)=>{
      e.preventDefault();
      const cart=getCart(); if(cart.length===0) return;
      const {sub,deliveryFee,grand}=updateTotals();
      const orderId='NN-'+Date.now().toString().slice(-6);
      const name=document.getElementById('cName').value.trim();
      const phone=document.getElementById('cPhone').value.trim();
      const address=document.getElementById('cAddress').value.trim();
      const email=document.getElementById('cEmail').value.trim();
      const notes=document.getElementById('cNotes').value.trim();
      const defaultEta=deliveryFee===0?'1-2 days (FREE)':'2-4 days';
      let itemsText=cart.map(i=>`• ${i.name} x${i.qty} = R${(getEffectivePrice({name:i.name})*i.qty).toFixed(2)}`).join('%0A');
      const waMessage=`*NEW ORDER - ${orderId}*%0A%0A*Customer:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A*Email:* ${email}%0A*Notes:* ${notes}%0A%0A*Items:*%0A${itemsText}%0A%0A*Subtotal:* R${sub.toFixed(2)}%0A*Delivery:* ${deliveryFee===0?'FREE':'R'+deliveryFee}%0A*ETA:* ${defaultEta}%0A*TOTAL:* R${grand.toFixed(2)}`;
      const orderData={orderId,name,phone,trackingPhone:phone,address,email,notes,cart:cart.map(c=>({...c,effectivePrice:getEffectivePrice({name:c.name})})),sub,deliveryFee,grand,etaDays:defaultEta,etaUpdated:new Date().toISOString(),date:new Date().toISOString(),status:'Pending',timestamp: firebase.firestore.FieldValue.serverTimestamp()};
      const btn=e.target.querySelector('button'); if(btn){btn.textContent='Placing...'; btn.disabled=true;}
      try{ await db.collection('orders').doc(orderId).set(orderData); }catch(err){ alert('Firebase error: '+err.message); if(btn){btn.textContent='Place Order'; btn.disabled=false;} return; }
      window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${waMessage}`,'_blank');
      localStorage.removeItem(CART_KEY); updateCount();
      alert(`Order ${orderId} placed! ETA: ${defaultEta}`);
      window.location.href='shop.html';
    });
  }

  // CONTACT FORM - FIXED - NOW SENDS TO WHATSAPP
  const whatsappForm = document.getElementById('whatsappForm');
  if(whatsappForm){
    whatsappForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const type = document.getElementById('type').value;
      const message = document.getElementById('message').value.trim();

      const waText = `*NEW CONTACT ENQUIRY - NuttyNaj*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Email:* ${email}%0A*Type:* ${type}%0A%0A*Message:*%0A${message}%0A%0A---%0ASent from nuttynaj.co.za/contact.html`;

      window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${waText}`, '_blank');
      
      // feedback
      const btn = whatsappForm.querySelector('button');
      btn.textContent = '✅ Opening WhatsApp...';
      setTimeout(()=>{ btn.textContent = 'SEND VIA WHATSAPP ↗'; whatsappForm.reset(); }, 2000);
    });
  }

  renderCartPage();
});

// TRACKING - FIXED
async function showTrackedOrders(phoneInput){
  const container=document.getElementById('trackResults');
  container.innerHTML='🔍 Searching Firebase...';
  try{
    const clean = phoneInput.replace(/\D/g,'').slice(-9);
    const snap = await db.collection('orders').get();
    let filtered=[];
    snap.forEach(doc=>{
      const o=doc.data();
      const p=(o.trackingPhone||o.phone||'').replace(/\D/g,'').slice(-9);
      if(p===clean || p.includes(clean) || clean.includes(p)) filtered.push(o);
    });
    if(filtered.length===0){container.innerHTML=`<div class="no-order">No orders found for <b>${phoneInput}</b><br><small>Try last 9 digits</small></div>`; return;}
    filtered.sort((a,b)=> new Date(b.date) - new Date(a.date));
    container.innerHTML='';
    filtered.forEach(o=>{
      const statuses=['Pending','Packed/Ready for Pickup','On the way','Delivered'];
      const statusIndex=statuses.indexOf(o.status||'Pending');
      const etaDisplay=o.etaDays||'2-4 days';
      const statusHtml=statuses.map((s,i)=>{let cls=''; if(i<statusIndex) cls='done'; else if(i===statusIndex) cls='active'; return `<div class="status-step ${cls}">${s}</div>`;}).join('');
      let itemsHtml=o.cart.map(i=>`• ${i.name} x${i.qty} - R${(i.effectivePrice||getEffectivePrice({name:i.name}))*i.qty}`).join('<br>');
      container.innerHTML+=`<div class="order-card"><h4>Order ${o.orderId} - ${o.status}</h4><small>${new Date(o.date).toLocaleString()} • ${o.name} • ${o.address}</small><div class="status-bar">${statusHtml}</div><div class="order-items">${itemsHtml}</div><div class="sum-row total"><span>Total</span><span>R${o.grand.toFixed(2)}</span></div><div class="eta" style="background:#fff7e6;padding:10px;border-radius:8px;margin-top:10px">📦 <b>ETA: ${etaDisplay}</b><br><small>Updated: ${o.etaUpdated?new Date(o.etaUpdated).toLocaleString():'-'}</small></div></div>`;
    });
  }catch(e){
    container.innerHTML=`<div style="color:red">Error: ${e.message}<br>Check Firebase Rules</div>`;
  }
}
document.getElementById('trackBtn')?.addEventListener('click',()=>document.getElementById('trackModal').classList.add('open'));
document.getElementById('trackClose')?.addEventListener('click',()=>document.getElementById('trackModal').classList.remove('open'));
document.getElementById('trackModal')?.addEventListener('click',(e)=>{if(e.target===document.getElementById('trackModal')) document.getElementById('trackModal').classList.remove('open');});
document.getElementById('doTrack')?.addEventListener('click',()=>{const ph=document.getElementById('trackPhone').value.trim(); if(!ph){alert('Enter phone'); return;} showTrackedOrders(ph);});