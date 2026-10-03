const products = [
  {id:'popcorn',name:'Popcorn',description:'Light, salty, ready to share.',allergens:'May contain dairy.',category:'crunchy',price:{small:2.5,large:4},image:'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=700&q=85',bg:'bg-yellow',tag:'Crowd favorite'},
  {id:'chips',name:'Kettle Chips',description:'Extra crunchy with sea salt.',allergens:'No major allergens.',nonallergic:true,category:'crunchy',price:{small:2,large:3.5},image:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=700&q=85',bg:'bg-orange',tag:'Best seller'},
  {id:'fruit',name:'Fruit Cup',description:'Fresh, colorful, and juicy.',allergens:'No major allergens.',nonallergic:true,category:'fresh',price:{small:3,large:4.5},image:'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=700&q=85',bg:'bg-green',tag:'Fresh today'},
  {id:'trailmix',name:'Trail Mix',description:'Nuts, raisins, and chocolate bits.',allergens:'Contains peanuts and tree nuts.',category:'fresh',price:{small:2.5,large:4},image:'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=700&q=85',bg:'bg-pink',tag:'Energy boost'},
  {id:'gummies',name:'Sour Gummies',description:'Sweet, tangy, and chewy.',allergens:'May contain gelatin.',category:'sweet',price:{small:2,large:3.5},image:'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=700&q=85',bg:'bg-pink',tag:'Sweet pick'},
  {id:'granola',name:'Granola Bar',description:'Oats, honey, and a little crunch.',allergens:'Contains oats; may contain nuts.',category:'fresh',price:{small:2,large:3},image:'granola-bar.png',bg:'bg-yellow',tag:'Good to go'}
];
let cart = [];
const grid = document.querySelector('#productGrid');
function money(value){return `$${value.toFixed(2)}`}
function renderProducts(category='all'){
  grid.innerHTML = products.filter(p=>category==='all'||(category==='nonallergic'?p.nonallergic===true:p.category===category)).map(p=>`<article class="product-card"><div class="product-image ${p.bg}" data-add="${p.id}" role="button" tabindex="0" aria-label="Choose a size for ${p.name}"><img src="${p.image}" alt="Photo of ${p.name}" loading="lazy"><small>${p.tag}</small></div><div class="product-info"><h3>${p.name}</h3><p>${p.description}</p>${p.nonallergic? '':`<p class="allergen-info"><strong>Allergen info:</strong> ${p.allergens}</p>`}<div class="product-bottom"><span class="price">from ${money(p.price.small)}</span><button class="add-button" data-add="${p.id}" type="button">Choose size +</button></div></div></article>`).join('');
}
function renderCart(){
  const items = document.querySelector('#orderItems');
  const count = cart.reduce((sum,item)=>sum+item.quantity,0);
  document.querySelector('#cartCount').textContent = count;
  if(!cart.length){items.innerHTML='<div class="empty-order">Your order is empty.<br />Pick a snack to get started.</div>';document.querySelector('#orderTotal').textContent='$0.00';return}
  items.innerHTML=cart.map((item,index)=>`<div class="order-row"><div><h3>${item.product.name} · ${item.size}</h3><p>${money(item.product.price[item.sizeKey])} each</p></div><div class="quantity-controls"><button data-change="${index}" data-delta="-1" type="button">−</button><span>${item.quantity}</span><button data-change="${index}" data-delta="1" type="button">+</button></div></div>`).join('');
  document.querySelector('#orderTotal').textContent=money(cart.reduce((sum,item)=>sum+item.product.price[item.sizeKey]*item.quantity,0));
}
function openDrawer(){document.querySelector('#orderDrawer').classList.add('open');document.querySelector('#drawerOverlay').classList.add('open');document.querySelector('#orderDrawer').setAttribute('aria-hidden','false')}
function closeDrawer(){document.querySelector('#orderDrawer').classList.remove('open');document.querySelector('#drawerOverlay').classList.remove('open');document.querySelector('#orderDrawer').setAttribute('aria-hidden','true')}
renderProducts();renderCart();
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));button.classList.add('active');renderProducts(button.dataset.category)}));
let selectedProduct = null;
function closeSizeModal(){document.querySelector('#sizeModal').classList.remove('open');document.querySelector('#sizeModal').setAttribute('aria-hidden','true')}
function addProduct(productId){selectedProduct=products.find(p=>p.id===productId);document.querySelector('#sizeProductName').textContent=`Choose a size for ${selectedProduct.name}.`;document.querySelector('#smallPrice').textContent=money(selectedProduct.price.small);document.querySelector('#largePrice').textContent=money(selectedProduct.price.large);document.querySelector('#sizeModal').classList.add('open');document.querySelector('#sizeModal').setAttribute('aria-hidden','false')}
document.querySelectorAll('.size-option').forEach(button=>button.addEventListener('click',()=>{const size=button.dataset.size;const existing=cart.find(item=>item.product.id===selectedProduct.id&&item.sizeKey===size);if(existing)existing.quantity++;else cart.push({product:selectedProduct,sizeKey:size,size:size[0].toUpperCase()+size.slice(1),quantity:1});closeSizeModal();renderCart();openDrawer()}));
document.querySelector('#closeSizeModal').addEventListener('click',closeSizeModal);
grid.addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(!button)return;addProduct(button.dataset.add)});
grid.addEventListener('keydown',event=>{const image=event.target.closest('.product-image[data-add]');if(image&&(event.key==='Enter'||event.key===' ')){event.preventDefault();addProduct(image.dataset.add)}});
document.querySelector('#orderItems').addEventListener('click',event=>{const button=event.target.closest('[data-change]');if(!button)return;const index=Number(button.dataset.change);cart[index].quantity+=Number(button.dataset.delta);if(cart[index].quantity<=0)cart.splice(index,1);renderCart()});
document.querySelector('#cartButton').addEventListener('click',openDrawer);document.querySelector('#closeDrawer').addEventListener('click',closeDrawer);document.querySelector('#drawerOverlay').addEventListener('click',closeDrawer);
function closeModal(){document.querySelector('#confirmationModal').classList.remove('open');document.querySelector('#confirmationModal').setAttribute('aria-hidden','true')}
document.querySelector('#placeOrder').addEventListener('click',()=>{if(!cart.length){alert('Add a snack before getting a pickup code.');return}document.querySelector('#pickupCode').textContent=`SNK-${Math.floor(100+Math.random()*900)}`;document.querySelector('#confirmationModal').classList.add('open');document.querySelector('#confirmationModal').setAttribute('aria-hidden','false');closeDrawer();cart=[];renderCart()});
document.querySelector('#closeModal').addEventListener('click',closeModal);document.querySelector('#doneButton').addEventListener('click',closeModal);document.querySelector('#confirmationModal').addEventListener('click',event=>{if(event.target.id==='confirmationModal')closeModal()});
