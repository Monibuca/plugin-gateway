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

import theme from 'muse-ui/lib/theme';
import * as colors from 'muse-ui/lib/theme/colors';

theme.add('custom-theme', {
    primary: colors.teal,
    secondary: colors.amber,
    text: {
        primary: colors.grey200,
        secondary: 'rgba(255, 255, 255, 0.7)',
        alternate: '#303030',
        disabled: 'rgba(255, 255, 255, 0.3)',
        hint: 'rgba(255, 255, 255, 0.3)' // 提示文字颜色
    },
}, 'dark');
theme.addCreateTheme(() => {
    return `
    .mu-item {
        color : ${colors.teal}
    }
    .mu-item:hover {
        color : ${colors.tealA200}
    }
    .mu-item.is-selected>.mu-item-title{
        color:  ${colors.tealA200};
        text-shadow: 0px 0px 3px ${colors.cyanA200};
    }
    .mu-badge {
        color : ${colors.amber};
        background : #ffffff0f;
    }
    .mu-paper {
        background: #ffffff09;
    }
    .mu-appbar{
        background: #00695cAF;
        color :${colors.grey200};
    }
    .mu-dialog{
        background: #222222Af;
    }
    .mu-dialog-body {
        color : ${colors.grey200};
    }
    .mu-button :hover{
        color:  ${colors.tealA200};
        text-shadow: 0px 0px 3px ${colors.cyanA200};
    }
    .mu-table {
        background: #00695c0d;
        box-shadow: 0 0 5px #000;
        border-radius: 5px;
    }
    .mu-table th {
        color : ${colors.amber};
    }
    .mu-table tr {
        color : ${colors.grey200};
    }
    `;
});
theme.use('custom-theme')