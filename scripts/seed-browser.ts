import assert from 'node:assert/strict';
import {db} from '../db';
import {categories,products,productImages,storeSettings} from '../db/schema';
async function main() {
 assert.match(process.env.TURSO_DATABASE_URL || '', /^file:.*\/\.audit\/browser-test\.db$/);
 const now=new Date();
 await db.insert(categories).values({id:'audit-electronics',name:'Electronics',slug:'electronics',createdAt:now,updatedAt:now});
 await db.insert(products).values([
  {id:'audit-esp32',name:'ESP32-WROOM-32D Development Board',slug:'esp32-wroom-32d-development-board-8675',price:450,stock:25,categoryId:'audit-electronics',isFeatured:true,createdAt:now,updatedAt:now},
  {id:'audit-capacitor',name:'Audit Capacitor Kit',slug:'audit-capacitor-kit',price:100,stock:25,categoryId:'audit-electronics',createdAt:now,updatedAt:now},
  {id:'audit-sold-out',name:'Audit Sold Out Board',slug:'audit-sold-out',price:800,stock:0,categoryId:'audit-electronics',createdAt:now,updatedAt:now},
 ]);
 await db.insert(productImages).values({id:'audit-image',productId:'audit-esp32',url:'/placeholder.svg',sortOrder:0});
 await db.insert(storeSettings).values(Object.entries({storeName:'ZiaTech',phone:'01712345678',email:'audit@example.test',whatsapp:'01712345678',address:'Isolated local test shop',bkash_number:'01712345678'}).map(([key,value])=>({key,value,updatedAt:now})));
 console.log('Synthetic browser fixtures ready. External writes are disabled.');
}
main().catch(()=>{console.error('Browser fixture setup failed.');process.exitCode=1;});
