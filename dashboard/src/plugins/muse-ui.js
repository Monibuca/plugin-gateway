import Vue from 'vue';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

import Toast from 'muse-ui-toast';
import Message from 'muse-ui-message';
import Loading from 'muse-ui-loading';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import 'muse-ui-message/dist/muse-ui-message.css';
import Helpers from 'muse-ui/lib/Helpers';

Vue.use(Helpers);
Vue.use(Loading);
Vue.use(Message);
Vue.use(Toast);

Vue.use(MuseUI);