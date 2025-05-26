import {reactive, ref} from 'vue'

export const showModal = reactive({ //parmainit uz templateref
    visible: false
});

export const selectedStatsId = reactive({
    id: null
})

export const expSidebar = reactive({
    expanded: false
})
