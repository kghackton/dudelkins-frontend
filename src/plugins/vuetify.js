import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import ClusterIcon from "../components/Icons/ClusterIcon";

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        values: {
            cluster: {component: ClusterIcon},
        }
    }
});
