import {name, version} from '@/../package'

export function lsset(key, valueobj){
    if(valueobj === null){
        localStorage.removeItem(`${name}_v${version}:${key}`)
    }
    else{
        localStorage.setItem(`${name}_v${version}:${key}`, JSON.stringify(
            {
                ...JSON.parse(localStorage.getItem(`${name}_v${version}:${key}`)),
                ...valueobj
            }
        ))
    }

}

export function lsget(key, attribute){
    const content = JSON.parse(localStorage.getItem(`${name}_v${version}:${key}`))
    if(content){
        return content[attribute]
    }
    else return null
}