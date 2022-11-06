import store from '@/store/store'

import dayjs from "dayjs";
import 'dayjs/locale/ru'

export default (properties)=>{
    const info = JSON.parse(properties.info)
    const events = JSON.parse(properties.events)
    const path = properties.img
    setTimeout(()=>{
        const canvas = document.getElementById(info.uuid)

        canvas.onclick = ()=>{
            const results = events.reduce((acc, cur)=>{
                const labelUuid = cur.labelUuid
                acc[labelUuid] = cur.results
                return acc
            },
            {})
            const violation = {
                id: info.uuid,
                image:{
                    uuid: info.uuid,
                    url: path,
                    width: info.width,
                    height: info.height,
                    createdAt: info.createdAt,
                },
                results,
                keyId: info.uuid,
                gps: info.gps,
                sourceId: info.sourceUuid,
                source: info.source,
                camera: info.camera,
            }
            store.commit('EXPERT_SETVIOLATION', violation)
            store.commit('EXPERT_VIOLATION_SHOW')
        }

        canvas.width = info.width;
        canvas.height = info.height;
        const ctx = canvas.getContext("2d");

        const background = new Image();
        background.src = path;

        background.onload = ()=>{
            ctx.drawImage(background,0,0);
            ctx.beginPath();
            events.forEach(ev=>{
                (ev.results.bBoxes || []).forEach(res=>{
                    if( typeof (res.x0) === "number" && typeof(res.x1) === "number" && typeof(res.y0)==="number" && typeof(res.y1)==="number") {
                                ctx.rect(res.x0, res.y0, res.x1 - res.x0, res.y1 - res.y0);
                            }
                })
            })
            const minsize = Math.min(info.width, info.height)
            ctx.lineWidth = minsize/200
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();
        }

        background.onerror = ()=>{
            ctx.font = "84px Arial";
            ctx.textAlign = "center"
            ctx.fillStyle = "#aaaaaa"
            ctx.fillText('Скриншот удалён в соответствии', info.width/2, info.height/2 - 40)
            ctx.fillText('с политикой хранения данных', info.width/2, info.height/2 + 40)
            ctx.font = "64px Arial";
            const day = dayjs(new Date(info.createdAt)).locale('ru').format('D MMM YYYY')
            ctx.fillText(`Дата скриншота: ${day}`, info.width/2, info.height/2 + 160)
        }


    },0)
    const labelsList = events.reduce((acc, cur)=>{
        acc.add(cur.labelUuid)
        return acc
    }, new Set([]))
    const labelsElem = [...labelsList].map(lbl=>{
        const labelObj = store.getters.DICT_LABELS.find(x=>x.uuid===lbl)
        const label = labelObj?.title || labelObj?.uuid || 'Неизвестное нарушение'
        return `<p class="text-start pl-4">${label}</p>`
    })
    return `
    <div 
        class="pa-2" 
        style="
        max-width: none;
        background-color: var(--col-7);
        border-radius: 4px; 
        width: 416px;"
    >
        <div>
            <canvas style="width: 400px" id="${info.uuid}" />
        </div>
        <div class="d-flex flex-row">
        <p class="text-start">Нарушение:</p>
        <div>
            ${labelsElem.join('')}
        </div>
        </div>
    </div>
`}