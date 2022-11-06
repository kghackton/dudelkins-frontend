
import dayjs from "dayjs";
import 'dayjs/locale/ru'
import labels from "@/plugins/labels.json"
import defects from "@/assets/defects.json"
import router from "@/router/router"


export default (properties)=>{
    // console.log(properties)
    const events = JSON.parse(properties.events)
    const address = events[0].address

    const rows = events.map(event=>{
        // console.log(event)

        setTimeout(()=>{
            document.getElementById(`${event.rootId}-but`).addEventListener('click', ()=>{
                router.push(`/map/${event.rootId}`)
            })
        },0)

        const labelsList = Object.keys(event.anomalyClasses).map(anCl=>{
            switch (anCl){
                case 'closed for less than 10 minutes with no returnings':
                    return 'closedForLessThan10MinutesWithNoReturnings'
                case 'closed too fast':
                    return 'closedTooFast'
                case 'closed with completion but without returnings for same applicant':
                    return 'closedWithCompletionButWithoutReturningsForSameApplicant'
                case 'closed without completion for same applicant':
                    return 'closedWithoutCompletionForSameApplicant'
                case 'deviation':
                    return 'deviation'
                case 'with returnings':
                    return 'withReturnings'
                case 'bad review':
                    return 'badReview'
                case 'DudelkINS':
                    return 'DudelkINS'
                default:
                    console.error(`UNKNOWN LABEL ${anCl}`)
                    return null
            }
        })
        const labelElements = labelsList.map(label=>{
            return `<div style="border-radius: 10px; background-color: ${labels[label].color}; padding-left: 6px; padding-right: 6px; margin-bottom: 4px">
                        <p>${labels[label].text}</p>
                    </div>`
        })
        const defect = defects[event.defectId]
        return `
        <tr>
            <td>${labelElements.join('')}</td>
            <td>${defect || '<p class="undef">не известен ID дефекта</p>'}</td>
            <td>${dayjs(new Date(event.createdAt)).locale('ru').format('D MMM HH:mm')}</td>
            <td>${dayjs(new Date(event.closedAt)).locale('ru').format('D MMM HH:mm')}</td>
            <td><button id="${event.rootId}-but">Инфо</button></td>
        </tr>
        `
    })

    return `
    <div 
        class="pa-2" 
        style="
        max-width: none;
        background-color: var(--col-1);
        border-radius: 12px; 
        width: 600px;
        overflow-y: scroll;
        max-height: 400px;
        "

    >
    ${address ? `<p style="font-size: 14px; --font-color: white" class="text-start">${address}</p>` : ''}
    <table class="popuptable">
    <thead>
    <tr>
        <th>Категория</th>
        <th>Класс</th>
        <th>Дата открытия</th>
        <th>Дата закрытия</th>
        <th></th>
    </tr>
    </thead>
    <tbody>
        ${rows.join('')}
    </tbody>
</table>
        <td>
            <tr></tr>
        </td>
    </div>
`}