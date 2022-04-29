import App from './App'
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia';
import { createUnistorage } from './uni_modules/pinia-plugin-unistorage'


export function createApp() {
  const app = createSSRApp(App)
  
  const store = Pinia.createPinia()
  
  store.use(createUnistorage())
  
  app.use(store);
  
  return {
    app,
	Pinia
  }
}