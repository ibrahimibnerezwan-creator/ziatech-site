import {test,expect,type Page} from '@playwright/test';
if(!process.env.TURSO_DATABASE_URL?.startsWith('file:') || !process.env.TURSO_DATABASE_URL.includes('/.audit/')) throw new Error('Browser tests require the isolated audit database.');
const image='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100';
async function admin(page:Page){
 await page.goto('/admin');
 await page.getByPlaceholder('Enter administrator password...').fill(process.env.ADMIN_PASSWORD!);
 await page.getByRole('button',{name:/unlock|access|sign in|login/i}).click();
 await expect(page.getByRole('button',{name:'Manage Products'})).toBeVisible();
}

test('desktop search, sorting, wishlist persistence and cart',async({page})=>{
 await page.goto('/');
 await page.getByPlaceholder('Search components, kits, modules...').fill('ESP32');
 await page.getByRole('button',{name:'Search',exact:true}).click();
 await expect(page).toHaveURL(/category\/all\?q=ESP32/);
 await expect(page.getByRole('heading',{name:'Results for "ESP32"'})).toBeVisible();
 await page.getByRole('combobox',{name:'Sort products'}).selectOption('price-desc');
 await expect(page.getByRole('combobox',{name:'Sort products'})).toHaveValue('price-desc');
 await page.getByRole('button',{name:'Save to wishlist'}).click();
 await page.getByRole('link',{name:'Wishlist',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Your wishlist'})).toBeVisible();
 await page.reload();
 await expect(page.getByRole('link',{name:/ESP32-WROOM/})).toBeVisible();
 await page.getByRole('link',{name:/ESP32-WROOM/}).click();
 await page.getByRole('button',{name:'কার্টে যোগ করুন',exact:true}).first().click();
 await page.getByRole('link',{name:'Shopping cart',exact:true}).click();
 await expect(page).toHaveURL(/\/cart$/);
 await expect(page.getByRole('link',{name:'ESP32-WROOM-32D Development Board',exact:true})).toBeVisible();
 await page.screenshot({path:'.audit/cart-desktop.png',fullPage:true});
});

test('guest cart checkout and order tracking',async({page})=>{
 await page.goto('/product/esp32-wroom-32d-development-board-8675');
 await page.getByRole('button',{name:'কার্টে যোগ করুন',exact:true}).first().click();
 await page.goto('/checkout');
 await page.getByLabel('Full Name',{exact:true}).fill('AUDIT CART CUSTOMER');
 await page.getByLabel('Phone Number',{exact:true}).fill('01712345678');
 await page.getByLabel('Detailed Address (House, Road, Area)').fill('Isolated local test address');
 await page.getByRole('button',{name:'Continue to Payment'}).click();
 await page.getByRole('button',{name:'Review Order'}).click();
 await page.getByRole('button',{name:/Confirm|Place Order/}).click();
 await expect(page).toHaveURL(/order-confirmation\//);
 const id=page.url().split('/').pop()!;
 await expect(page.getByRole('heading',{name:'Order Confirmed!'})).toBeVisible();
 await expect(page.getByText(id,{exact:true})).toBeVisible();
 await page.goto('/my-orders');
 await page.getByLabel('Full order ID').fill(id);
 await page.getByLabel('Order phone number').fill('+8801712345678');
 await page.getByRole('button',{name:/ট্র্যাক করুন/}).click();
 await expect(page.getByText('AUDIT CART CUSTOMER').first()).toBeVisible();
 await page.screenshot({path:'.audit/order-tracking.png',fullPage:true});
});

test('mobile catalogue and express checkout',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/category/all');
 await expect(page.getByRole('checkbox',{name:'In Stock Only'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await page.getByRole('button',{name:/অর্ডার করুন/}).first().click();
 await expect(page.getByRole('heading',{name:/Express Checkout/})).toBeVisible();
 await page.getByPlaceholder('যেমন: মোঃ সাকিব রহমান').fill('AUDIT EXPRESS CUSTOMER');
 await page.getByPlaceholder('যেমন: 017XXXXXXXX').fill('01712345678');
 await page.getByPlaceholder('যেমন: বাসা ১২, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা').fill('Local express test address');
 await page.screenshot({path:'.audit/express-mobile.png',fullPage:true});
 const form=page.locator('form').filter({has:page.getByPlaceholder('যেমন: মোঃ সাকিব রহমান')});
 await form.locator('button[type="submit"]').click();
 await expect(page.getByText(/সফল|confirmed|successfully/i).first()).toBeVisible();
});

test('admin tabs, settings, order payment, and logout',async({page})=>{
 await admin(page);
 for(const tab of ['Orders','Quick Order','Print Labels','Reviews','Categories','Store Settings']){
  await page.getByRole('button',{name:tab,exact:true}).click();
  await expect(page.locator('main').last()).not.toContainText('Unauthorized');
 }
 await page.getByRole('button',{name:'Orders',exact:true}).click();
 await expect(page.getByText('AUDIT CART CUSTOMER').first()).toBeVisible();
 await page.getByLabel('Payment status for AUDIT CART CUSTOMER').first().selectOption('VERIFIED');
 await page.reload();
 await expect(page.getByLabel('Payment status for AUDIT CART CUSTOMER').first()).toHaveValue('VERIFIED');
 await page.getByRole('button',{name:'Store Settings',exact:true}).click();
 const settingsForm=page.locator('form').filter({has:page.getByRole('button',{name:'Save All Settings'})});
 await settingsForm.locator('input[type="text"]').first().fill('ZiaTech audit shop');
 await page.getByRole('button',{name:'Save All Settings'}).click();
 await expect(page.getByText('Settings saved successfully!',{exact:true})).toBeVisible();
 expect((await (await page.request.get('/api/settings')).json()).storeName).toBe('ZiaTech audit shop');
 await page.screenshot({path:'.audit/admin-settings.png',fullPage:true});
 await page.getByRole('button',{name:'Print Labels',exact:true}).click();
 await expect(page.locator('.shipping-labels')).toContainText('AUDIT CART CUSTOMER');
 await page.emulateMedia({media:'print'});
 await expect(page.locator('.shipping-labels')).toBeVisible();
 await expect(page.getByRole('button',{name:'Manage Products',exact:true})).toBeHidden();
 await page.emulateMedia({media:'screen'});
 await page.getByRole('button',{name:/logout|log out|sign out/i}).click();
 await expect(page.getByPlaceholder('Enter administrator password...')).toBeVisible();
});

test('admin creates and edits a product through the form',async({page})=>{
 await admin(page);
 await page.route('**/api/upload',route=>route.fulfill({json:{url:image,publicUrl:image}}));
 await page.locator('input[type="file"]').first().setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aYJ8AAAAASUVORK5CYII=','base64')});
 const form=page.locator('form').filter({has:page.getByPlaceholder('e.g. ESP32-WROOM-32D Development Board')});
 await form.locator('input[type="text"]').first().fill('AUDIT UI COMPONENT');
 await form.locator('input[type="number"]').first().fill('99');
 await form.getByRole('button',{name:/publish|add product/i}).click();
 await expect(page.getByText('Product added successfully!',{exact:true})).toBeVisible();
 await expect(page.getByText('AUDIT UI COMPONENT',{exact:true})).toBeVisible();
 await page.getByPlaceholder('Search component name, category...').fill('AUDIT UI COMPONENT');
 await page.getByTitle('Edit product specs & price').click();
 const edit=page.locator('form').filter({has:page.getByRole('button',{name:'Save Changes',exact:true})});
 await edit.locator('input[type="text"]').first().fill('AUDIT UI COMPONENT EDITED');
 await edit.locator('input[type="number"]').first().fill('89');
 await edit.getByRole('button',{name:'Save Changes'}).click();
 await expect(page.getByText('AUDIT UI COMPONENT EDITED',{exact:true})).toBeVisible();
 const products=await (await page.request.get('/api/products')).json();
 expect(products.find((p:{name:string})=>p.name==='AUDIT UI COMPONENT EDITED').price).toBe(89);
 page.once('dialog',dialog=>dialog.accept());
 await page.getByTitle('Delete product',{exact:true}).click();
 await expect(page.getByText('AUDIT UI COMPONENT EDITED',{exact:true})).toHaveCount(0);
});

test('chat replies and public navigation have working destinations',async({page,request})=>{
 const chat=await request.post('/api/chat',{data:{message:'ESP32',history:[]}});
 expect(chat.ok()).toBe(true);expect((await chat.json()).reply).toContain('ESP32');
 for(const path of ['/about','/blog','/contact','/shipping','/privacy','/terms','/robots.txt','/sitemap.xml']){
  const response=await request.get(path);expect(response.ok(),path).toBe(true);
 }
 await page.goto('/category/all');
 await page.screenshot({path:'.audit/catalogue-desktop.png',fullPage:true});
});

test('customer registration, logout, login and private order history',async({page})=>{
 await page.goto('/register');
 await page.getByLabel('Full Name',{exact:true}).fill('Audit Account');
 await page.getByLabel('Phone',{exact:true}).fill('01712345678');
 await page.getByLabel('Email',{exact:true}).fill('audit-customer@example.test');
 await page.getByLabel('Password',{exact:true}).fill('Local-audit-password-2026');
 await page.getByLabel('Confirm Password',{exact:true}).fill('Local-audit-password-2026');
 await page.getByRole('button',{name:'Create Account',exact:true}).click();
 await expect(page.getByRole('button',{name:'Audit Account',exact:true})).toBeVisible();
 expect((await page.request.get('/api/admin/orders')).status()).toBe(401);
 const response=await page.request.post('/api/checkout',{data:{requestId:crypto.randomUUID(),customerName:'Audit Account',customerPhone:'01712345678',address:'Local test address',shippingCity:'Dhaka',paymentMethod:'cod',items:[{id:'audit-esp32',quantity:1}]}});
 expect(response.ok()).toBe(true);
 const {orderId}=await response.json();
 await page.goto('/my-orders');
 await expect(page.getByText(orderId,{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'Audit Account',exact:true}).click();
 await page.getByRole('button',{name:'Logout',exact:true}).click();
 await expect(page.getByRole('link',{name:'Sign in',exact:true})).toBeVisible();
 await page.goto('/login?from=https://example.org');
 await page.getByLabel('Email',{exact:true}).fill('audit-customer@example.test');
 await page.getByLabel('Password',{exact:true}).fill('Local-audit-password-2026');
 await page.getByRole('button',{name:'Sign In',exact:true}).click();
 await expect(page.getByRole('button',{name:'Audit Account',exact:true})).toBeVisible();
 expect(new URL(page.url()).host).toBe('127.0.0.1:3187');
});

test('admin creates, edits and deletes a category',async({page})=>{
 await admin(page);
 await page.getByRole('button',{name:'Categories',exact:true}).click();
 await page.getByPlaceholder('e.g. Microcontrollers').fill('AUDIT CATEGORY');
 await page.getByRole('button',{name:'Save Category',exact:true}).click();
 await expect(page.getByText('AUDIT CATEGORY',{exact:true})).toBeVisible();
 const card=page.locator('div.group').filter({has:page.getByText('AUDIT CATEGORY',{exact:true})});
 await card.getByTitle('Edit category').click();
 const form=page.locator('form').filter({has:page.getByRole('button',{name:'Save',exact:true})});
 await form.locator('input[type="text"]').fill('AUDIT CATEGORY EDITED');
 await form.getByRole('button',{name:'Save',exact:true}).click();
 await expect(page.getByText('AUDIT CATEGORY EDITED',{exact:true})).toBeVisible();
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('div.group').filter({has:page.getByText('AUDIT CATEGORY EDITED',{exact:true})}).getByTitle('Delete category').click();
 await expect(page.getByText('AUDIT CATEGORY EDITED',{exact:true})).toHaveCount(0);
});

test('review stays private until moderation and shows the admin reply',async({page,request})=>{
 const response=await request.post('/api/reviews',{data:{productId:'audit-esp32',reviewerName:'AUDIT REVIEWER',rating:4,comment:'Synthetic review for moderation test'}});
 expect(response.ok()).toBe(true);
 expect(await (await request.get('/api/reviews?productId=audit-esp32')).json()).toHaveLength(0);
 await admin(page);
 await page.getByRole('button',{name:'Reviews',exact:true}).click();
 await expect(page.getByText('AUDIT REVIEWER',{exact:true})).toBeVisible();
 await page.getByTitle('Approve & publish').click();
 await page.getByPlaceholder('Write technical response...').fill('AUDIT MERCHANT REPLY');
 await page.getByRole('button',{name:'Reply',exact:true}).click();
 await expect(page.getByText('AUDIT MERCHANT REPLY',{exact:true})).toBeVisible();
 await expect.poll(async()=>await (await request.get('/api/reviews?productId=audit-esp32')).json()).toMatchObject([{reviewerName:'AUDIT REVIEWER',adminReply:'AUDIT MERCHANT REPLY'}]);
 page.once('dialog',dialog=>dialog.accept());
 await page.getByTitle('Delete review').click();
 await expect(page.getByText('AUDIT REVIEWER',{exact:true})).toHaveCount(0);
});

test('admin quick order preserves selected fee and reserves inventory',async({page})=>{
 await admin(page);
 await page.getByRole('button',{name:'Quick Order',exact:true}).click();
 const form=page.locator('form').filter({has:page.getByPlaceholder('e.g. Tanvir Ahmed')});
 await form.locator('select').first().selectOption('audit-esp32');
 await page.getByPlaceholder('e.g. Tanvir Ahmed').fill('AUDIT QUICK ORDER');
 await page.getByPlaceholder('01712345678',{exact:true}).fill('01712345678');
 await page.getByPlaceholder('House #, Road #, Area / Thana').fill('Local manual order test');
 await form.locator('select').nth(1).selectOption('0');
 await page.getByRole('button',{name:'Create Order',exact:true}).click();
 await expect(page.getByText('AUDIT QUICK ORDER',{exact:true})).toBeVisible();
 const rows=await (await page.request.get('/api/admin/orders')).json();
 const order=rows.find((o:{customerName:string})=>o.customerName==='AUDIT QUICK ORDER');
 expect(order.amount).toBe(450);expect(order.trackingCode).toBeNull();
 await page.getByRole('button',{name:'Orders',exact:true}).click();
 await expect(page.getByText('AUDIT QUICK ORDER',{exact:true})).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await page.screenshot({path:'.audit/admin-orders-mobile.png',fullPage:true});
});

test('authorization, origin checks, tracking privacy and cancellation work over HTTP',async({request})=>{
 for(const path of ['/api/admin/orders','/api/admin/settings','/api/admin/reviews','/api/upload/test','/api/cron/sync-orders']) expect((await request.get(path)).status(),path).toBe(401);
 const publicSettings=await (await request.get('/api/settings')).json();
 expect(publicSettings).not.toHaveProperty('steadfast_secret_key');
 const products=await (await request.get('/api/products')).json();
 const before=products.find((p:{id:string})=>p.id==='audit-esp32').stock;
 const payload={requestId:crypto.randomUUID(),customerName:'AUDIT HTTP ORDER',customerPhone:'01712345678',address:'Local API test',shippingCity:'Dhaka',paymentMethod:'cod',items:[{id:'audit-esp32',quantity:1,price:1}],total:1};
 const response=await request.post('/api/checkout',{data:payload});
 expect(response.ok()).toBe(true);
 const order=await response.json();expect(order.total).toBe(510);
 expect((await (await request.post('/api/checkout',{data:payload})).json()).orderId).toBe(order.orderId);
 expect((await request.get(`/api/orders/track?q=${order.orderId}`)).status()).toBe(400);
 expect((await (await request.get(`/api/orders/track?q=${order.orderId}&phone=01812345678`)).json()).orders).toHaveLength(0);
 const matched=(await (await request.get(`/api/orders/track?q=${order.orderId}&phone=01712345678`)).json()).orders[0];
 expect(matched).not.toHaveProperty('address');expect(matched).not.toHaveProperty('transactionId');
 const login=await request.post('/api/admin/login',{data:{password:process.env.ADMIN_PASSWORD}});expect(login.ok()).toBe(true);
 expect((await request.patch('/api/admin/orders',{headers:{Origin:'https://example.org'},data:{id:order.orderId,status:'CANCELLED'}})).status()).toBe(403);
 expect((await request.patch('/api/admin/orders',{data:{id:order.orderId,status:'CANCELLED'}})).ok()).toBe(true);
 expect((await (await request.get('/api/products')).json()).find((p:{id:string})=>p.id==='audit-esp32').stock).toBe(before);
 expect((await request.delete(`/api/admin/orders?id=${order.orderId}`)).ok()).toBe(true);
});
