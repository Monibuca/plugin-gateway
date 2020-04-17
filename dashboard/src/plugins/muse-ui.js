import Vue from 'vue';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

import Toast from 'muse-ui-toast';
import Message from 'muse-ui-message';
import Loading from 'muse-ui-loading';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import 'muse-ui-message/dist/muse-ui-message.css';
import Helpers from 'muse-ui/lib/Helpers';
import theme from 'muse-ui/lib/theme';
import * as colors from 'muse-ui/lib/theme/colors';

Vue.use(Helpers);
Vue.use(Loading, {
    overlayColor: '#9e9e9e5d',        // 背景色
    size: 48,
    color: 'primary',                           // color
    className: ''                               // loading class name
});
Vue.use(Message);
Vue.use(Toast);

Vue.use(MuseUI);

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
        box-shadow: 0 5px 5px -3px rgba(1, 220, 255, 0.48), 0 8px 10px 1px #00BCD4, 0 3px 14px 2px #03A9F4;
        border-radius: 5px;
    }
    .mu-dialog-title {
        color : ${colors.teal};
    }
    .mu-dialog-body {
        color : ${colors.grey200};
    }
    .mu-button {
        color:  ${colors.teal};
    }
    .mu-button :hover{
        color:  ${colors.tealA200};
        text-shadow: 0px 0px 3px ${colors.cyanA200};
    }
    .mu-table {
        background: #9e9e9e5d;
        box-shadow: 0 0 5px #000;
        border-radius: 5px;
    }
    .mu-table {
        background: #9e9e9e5d;
        box-shadow: 0 0 5px #000;
        border-radius: 5px;
    }
    
    .mu-table th {
        color: ${colors.amber};
    }
    .mu-table tr {
        color: #eeeeee;
    }
    .mu-table tr.is-hover {
        background: #000;
        color: ${colors.cyanA200};
        text-shadow: 0px 0px 3px ${colors.cyanA200};
    }
    .mu-flat-button {
        color: #009688;
    }
    .mu-card {
        background: #9e9e9e1d;
        border: 1px solid #ffffffa8;
    }
    .mu-card-title-container .mu-card-title {
        color: #ffc107;
    }
    .mu-tabs-inverse {
        background: transparent;
        color:${colors.grey200};
    }
    .mu-tab :hover {
        color: ${colors.cyanA200};
    }
    .mu-tab-active.is-inverse {
        color: #009688;
    }
    .mu-tab-active.is-inverse :hover {
        color: ${colors.cyanA200};
        text-shadow: 0px 0px 3px ${colors.cyanA200};
    }
    .mu-tab-link-highlight {
        box-shadow: 0 -2px 5px 1px ${colors.cyanA200};
    }
    .mu-tab-active.is-inverse.hover ~ .mu-tab-link-highlight {
        box-shadow: 0 -2px 5px 3px ${colors.cyanA200};
    }
    .mu-input-line{
        background:${colors.teal};
    }
    .mu-input ,.mu-text-field-input{
        color : ${colors.tealA200};
    }
    .mu-input-help {
        color : ${colors.amber};
    }
    `;
});
theme.use('custom-theme')