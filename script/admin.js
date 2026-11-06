// NuttyNaj Admin - WHOLE FINAL - ETA + STATUS FIXED - 18 Products
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
const auth = firebase.auth();

const STATUS_FLOW=['Pending','Packed/Ready for Pickup','On the way','Delivered'];
const PRODUCTS_KEY='nuttynaj_products_v3_FINAL';

function showAdmin(){
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('adminWrap').style.display='block';
  renderOrders(); renderStock();
}
function showLogin(){
  document.getElementById('loginScreen').style.display='flex';
  document.getElementById('adminWrap').style.display='none';
}
function getEffectivePrice(item){
  const f=(item.name||'').toLowerCase();
  if(f.includes('yoghurt')||f.includes('milk')) return 22;
  if(f.includes('pecan')||f.includes('walnut')||f.includes('hazel')||f.includes('pistachio')) return 20;
  return 18;
}
function getProducts(){
  try{
    let saved=JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'null');
    if(saved && saved.length>0) return saved;
  }catch(e){}
  const fullCatalog = [
    {id:'cashew-milkchoc',category:'Cashew Nuts',name:'Cashew - Milk Chocolate Coated',image:'images/cashew-milkchoc.jpg'},
    {id:'cashew-peri',category:'Cashew Nuts',name:'Cashew - Extra Hot Peri-Peri',image:'images/cashew-peri.jpg'},
    {id:'cashew-plain',category:'Cashew Nuts',name:'Cashew - Roasted Plain',image:'images/cashew-plain.jpg'},
    {id:'cashew-raw',category:'Cashew Nuts',name:'Cashew - Raw',image:'images/cashew-raw.jpg'},
    {id:'cashew-roasted-salted',category:'Cashew Nuts',name:'Cashew - Roasted Salted',image:'images/cashew-roasted-salted.jpg'},
    {id:'cashew-yoghurt',category:'Cashew Nuts',name:'Cashew - Yoghurt Coated',image:'images/cashew-yoghurt.jpg'},
    {id:'macadamia-milkchoc',category:'Macadamia Nuts',name:'Macadamia - Milk Chocolate Coated',image:'images/macadamia-milkchoc.jpg'},
    {id:'macadamia-peri',category:'Macadamia Nuts',name:'Macadamia - Extra Hot Peri-Peri',image:'images/macadamia-peri.jpg'},
    {id:'macadamia-plain',category:'Macadamia Nuts',name:'Macadamia - Roasted Plain',image:'images/macadamia-plain.jpg'},
    {id:'macadamia-raw',category:'Macadamia Nuts',name:'Macadamia - Raw',image:'images/macadamia-raw.jpg'},
    {id:'macadamia-roasted-salted',category:'Macadamia Nuts',name:'Macadamia - Roasted Salted',image:'images/macadamia-roasted-salted.jpg'},
    {id:'macadamia-yoghurt',category:'Macadamia Nuts',name:'Macadamia - Yoghurt Coated',image:'images/macadamia-yoghurt.jpg'},
    {id:'pecan-lightly-salted',category:'Pecan Nuts',name:'Pecan Nuts - Lightly Salted',image:'images/pecan-lightly-salted.jpg'},
    {id:'walnut-lightly-salted',category:'Walnut Nuts',name:'Walnut Nuts - Lightly Salted',image:'images/walnut-lightly-salted.jpg'},
    {id:'hazelnut-lightly-salted',category:'Hazelnuts',name:'Hazelnut - Lightly Salted',image:'images/hazelnut-lightly-salted.jpg'},
    {id:'pistachio-lightly-salted',category:'Pistachio Nuts',name:'Pistachio - Lightly Salted',image:'images/pistachio-lightly-salted.jpg'},
    {id:'mixed-salted',category:'Mixed Nuts',name:'Mixed Nuts - Salted',image:'images/mixed-salted.jpg'},
    {id:'dried-jungle-mix',category:'Dried Fruits',name:'Dried Fruits - Jungle Mix',image:'images/dried-jungle-mix.jpg'},
  ];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(fullCatalog));
  return fullCatalog;
}
function saveProducts(p){localStorage.setItem(PRODUCTS_KEY,JSON.stringify(p));}

auth.onAuthStateChanged(user=>{ if(user) showAdmin(); else showLogin(); });

async function renderOrders(){
  const list=document.getElementById('ordersList');
  const countEl=document.getElementById('orderCount');
  if(!list) return;
  list.innerHTML='<div class="admin-card">🔒 Loading orders...</div>';
  try{
    const snap = await db.collection('orders').orderBy('date','desc').get();
    let orders=[]; snap.forEach(d=>orders.push({docId:d.id,...d.data()}));
    if(countEl) countEl.textContent=orders.length;
    if(orders.length===0){list.innerHTML='<div class="admin-card">No orders yet</div>';return;}
    list.innerHTML=orders.map(o=>{
      const items=o.cart.map(i=>`• ${i.name} x${i.qty} - R${(i.effectivePrice||getEffectivePrice(i))*i.qty}`).join('<br>');
      const opts=STATUS_FLOW.map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('');
      const etaVal=o.etaDays||'2-4 days';
      return `<div class="admin-card">
        <div class="order-head">
          <div><b>${o.orderId}</b> - ${new Date(o.date).toLocaleString()}<br><small>${o.name} | ${o.phone} | ${o.address}</small></div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <select class="status-select" onchange="updateStatus('${o.docId}',this.value)">${opts}</select>
            <button class="btn-del" onclick="deleteOrder('${o.docId}')">Delete</button>
          </div>
        </div>
        <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
          <input class="input" style="max-width:200px" id="eta-${o.docId}" value="${etaVal}" placeholder="ETA eg 2 days">
          <button class="btn-small" onclick="updateEta('${o.docId}')">Save ETA</button>
          ${o.etaUpdated?`<small style="color:#888">Updated: ${new Date(o.etaUpdated).toLocaleString()}</small>`:''}
        </div>
        <div style="margin-top:10px;font-size:13px;line-height:1.6">${items}</div>
        <div style="margin-top:8px"><b>Total: R${o.grand}</b> | Delivery: ${o.deliveryFee===0?'FREE':'R'+o.deliveryFee} | <b>ETA: ${etaVal}</b></div>
      </div>`;
    }).join('');
  }catch(e){
    list.innerHTML=`<div class="admin-card" style="color:red">Error: ${e.message}<br>Check Firebase Rules</div>`;
  }
}

function renderStock(){
  const sl=document.getElementById('stockList');
  const sc=document.getElementById('stockCount');
  if(!sl) return;
  const products=getProducts();
  if(sc) sc.textContent=products.length;
  sl.innerHTML=products.map((p,i)=>`<div class="admin-card prod-row"><img src="${p.image}" style="width:50px;height:50px;object-fit:cover;border-radius:6px"><div style="flex:1"><b>${p.name}</b><br><small>${p.category}</small></div><button class="btn-del" onclick="deleteStock(${i})">Delete</button></div>`).join('');
}

window.updateStatus=async (docId,s)=>{
  try{
    let u={status:s, etaUpdated:new Date().toISOString()};
    if(s==='Delivered') u.etaDays='Delivered';
    await db.collection('orders').doc(docId).update(u);
    alert('Status updated to '+s);
    renderOrders();
  }catch(e){ alert('Error: '+e.message); }
}
window.updateEta=async (docId)=>{
  const el=document.getElementById(`eta-${docId}`);
  if(!el) return;
  const val=el.value.trim();
  if(!val){alert('Enter ETA'); return;}
  try{
    await db.collection('orders').doc(docId).update({etaDays:val, etaUpdated:new Date().toISOString()});
    alert('✅ ETA updated: '+val);
    renderOrders();
  }catch(e){ alert('Error: '+e.message); }
}
window.deleteOrder=async (docId)=>{if(!confirm('Delete order?')) return; await db.collection('orders').doc(docId).delete(); renderOrders();}
window.deleteStock=(idx)=>{if(!confirm('Delete product?')) return;let p=getProducts();p.splice(idx,1);saveProducts(p);renderStock();}

let uploadedImageData=null;
document.addEventListener('DOMContentLoaded',()=>{
  const loginBtn=document.getElementById('loginBtn');
  const logoutBtn=document.getElementById('logoutBtn');
  const emailEl=document.getElementById('loginEmail');
  const passEl=document.getElementById('loginPass');
  const errEl=document.getElementById('loginError');

  loginBtn?.addEventListener('click',()=>{
    const email=emailEl.value.trim();
    const pass=passEl.value.trim();
    if(!email||!pass){errEl.style.display='block'; return;}
    errEl.style.display='none';
    loginBtn.textContent='Checking...';
    auth.signInWithEmailAndPassword(email, pass)
      .then(()=>{loginBtn.textContent='Unlock Dashboard →';})
      .catch(()=>{errEl.style.display='block'; loginBtn.textContent='Unlock Dashboard →';});
  });
  passEl?.addEventListener('keydown',e=>{if(e.key==='Enter') loginBtn.click();});
  logoutBtn?.addEventListener('click',()=>auth.signOut());

  const fileInput=document.getElementById('newImageFile');
  const preview=document.getElementById('previewImg');
  fileInput?.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>{uploadedImageData=ev.target.result; preview.src=uploadedImageData; preview.style.display='block';}; r.readAsDataURL(f);
  });

  document.getElementById('addStockBtn')?.addEventListener('click',()=>{
    const cat=document.getElementById('newCat').value.trim();
    const name=document.getElementById('newName').value.trim();
    if(!name||!uploadedImageData){alert('Name + Image required');return;}
    let pr=getProducts(); pr.push({id:Date.now().toString(),category:cat||'General',name:name,image:uploadedImageData}); saveProducts(pr);
    document.getElementById('newName').value=''; document.getElementById('newCat').value=''; fileInput.value=''; uploadedImageData=null; preview.style.display='none'; renderStock();
  });

  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-pane').forEach(p=>p.style.display='none');
      const tab=document.getElementById('tab-'+btn.dataset.tab);
      if(tab) tab.style.display='block';
    });
  });
});