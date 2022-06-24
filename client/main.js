import Alpine from 'alpinejs';
import './style.css'
import LoveCounter from '/loveCounter';
import Quotes from '/quotes';
import Login from './login';
import './register';
import '/quote.css';

import persist from '@alpinejs/persist'
 
Alpine.plugin(persist)

window.Alpine = Alpine
Alpine.data('loveCounter', LoveCounter);
Alpine.data('login', Login)
Alpine.data('quoteApp', Quotes)
Alpine.start()


