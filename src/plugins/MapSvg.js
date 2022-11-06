import labels from "./labels.json"

export function createPiePoint(props) {
    let r
    const total = props.badReview
        + props.closedForLessThan10MinutesWithNoReturnings
        + props.closedTooFast
        + props.closedWithCompletionButWithoutReturningsForSameApplicant
        + props.closedWithoutCompletionForSameApplicant
        + props.deviation
        + props.withReturnings
    switch (total){
        case 1:
            r = 7
            break;
        case 2:
            r = 9
            break;
        case 3:
            r = 11
            break;
        default:
            r = 11
    }
    const w = 2 * r
    let html = `<div style="position: absolute" class="donut">
                    <svg width="${w+2}" height="${w+2}" viewbox="-1 -1 ${w+3} ${w+3}" style="display: block">`;
    ['closedForLessThan10MinutesWithNoReturnings',
        'closedTooFast',
        'closedWithCompletionButWithoutReturningsForSameApplicant',
        'closedWithoutCompletionForSameApplicant',
        'deviation',
        'withReturnings',
        'badReview'].reduce((sum,anomClass)=>{

        const color = labels[anomClass].color //TODO: взять цвета

        html += pieSegment(
            sum / total,
            (sum + props[anomClass]) / total,
            r,
            color ? color : 'rgba(1,1,1,1)',
        )
        return sum + props[anomClass]
    }, 0)
    html += '</svg></div>'
    const el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
}
function pieSegment(start, end, r, color) {
    if(start===end){
        return ''
    }
    if (end - start === 1) {
        return `<circle 
                                stroke="black" stroke-width="1" class="pointsegment" 
                                cx="${r}" cy="${r}" r="${r}" 
                                fill="${color}"
                            />`
    }
    const a0 = 2 * Math.PI * (start - 0.25);
    const a1 = 2 * Math.PI * (end - 0.25);
    const x0 = Math.cos(a0),
        y0 = Math.sin(a0);
    const x1 = Math.cos(a1),
        y1 = Math.sin(a1);
    const largeArc = end - start > 0.5 ? 1 : 0;
    return `<path  stroke="black" stroke-width="1" class="pointsegment" d="
                        M ${r} ${r} 
                        L ${r + r * x0} ${r + r * y0}
                        A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1}
                        L ${r} ${r}"
                fill="${color}" >
                </path>`;
}

export function createDonutChart(props) {
    const {
        cluster,
        cluster_id,
        eventsCount,
        point_count,
        point_count_abbreviated,
        ...countsObj
    } = props
    let total = 0;
    for (const key in countsObj) {
        const count = countsObj[key]
        const label = getters.DICT_LABELS.find(lbl=>lbl.number === +key)
        const labelText = label ? (label.title || label.codename) : null
        countsObj[key] = {
            offset: total,
            label: labelText,
            count,
        }
        total += count;
    }

    let fontSize
    let r
    switch (true){
        case (total >= 10000):
            fontSize = 24
            r = 64
            break;
        case (total >= 1000):
            fontSize = 22
            r = 50
            break;
        case (total >= 100):
            fontSize = 20
            r = 32
            break;
        case (total >= 10):
            fontSize = 18
            r = 24
            break;
        case (total <10):
            fontSize = 16
            r = 18
            break;
        default:
            fontSize = 16
            r = 18
    }

    const r0 = Math.round(r * 0.6);
    const w = r * 2;

    let html = `<div style="position: absolute" class="donut">
                    <svg width="${w+2}" height="${w+2}" viewbox="-1 -1 ${w+3} ${w+3}" text-anchor="middle">
                        <g stroke="black" stroke-width="2">`;
    for(let num in countsObj||{}){
        const obj = countsObj[num]
        if(obj.count){
            const color = getters.MAP_LABELS_COLOR_LIST.find(x=>x[0]===+num)
            html += donutSegment(
                obj.offset / total,
                (obj.offset + obj.count) / total,
                r,
                r0,
                color ? color[1] : 'rgba(1,1,1,1)',
                obj.count,
                obj.label
            )
        }
    }
    const alltext = Object.entries(countsObj)
        .filter(([num, objInfo])=>objInfo.count>0)
        .map(([num, objInfo])=>{
            return `${objInfo.count} - ${objInfo.label}`
        })
        .join('\n')

    html += `</g>
                        <g>
                            <circle cx="${r}" cy="${r}" r="${r0}" fill="white"/>
                            <text class="mainCircleCounter" dominant-baseline="central" transform="translate(${r}, ${r})">
                                ${total.toLocaleString()}
                            </text>
                            <title>${alltext}</title>
                        </g>`;
    html += '</svg></div>'
    const el = document.createElement('div');
    el.innerHTML = html;

    return el.firstChild;
}
function donutSegment(start, end, r, r0, color, count, label) {
    if (end - start === 1) {
        return `<path class="segment" d="
                        M ${r} ${r - r0}
                        A ${r0} ${r0} 0 1 0 ${r} ${r + r0}
                        M ${r} ${r - r0}
                        A ${r0} ${r0} 0 0 1 ${r} ${r + r0}
                        M ${r} 0
                        A ${r0} ${r0} 0 1 0 ${r} ${2*r}
                        M ${r} 0
                        A ${r0} ${r0} 0 0 1 ${r} ${2*r}"
                         fill="${color}" >
                    <title>
                        ${count}: ${label || 'неизвестное нарушение'}
                    </title>
                </path>`;
    }
    const a0 = 2 * Math.PI * (start - 0.25);
    const a1 = 2 * Math.PI * (end - 0.25);
    const x0 = Math.cos(a0),
        y0 = Math.sin(a0);
    const x1 = Math.cos(a1),
        y1 = Math.sin(a1);
    const largeArc = end - start > 0.5 ? 1 : 0;

// draw an SVG path
    return `<path class="segment" d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
        r + r * y0
    } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
        r + r0 * x1
    } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
        r + r0 * y0
    }" fill="${color}" >
                    <title>
                        ${count} - ${label || 'неизвестное нарушение'}
                    </title>
                </path>`;
}