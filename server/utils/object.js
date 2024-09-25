export function filterObjects(objects, necessaryKeys) {
    return objects.map(object => {
        const sanitizedObject = {}
        necessaryKeys.forEach(key => {
            sanitizedObject[key] = object[key]
        })
        return sanitizedObject
    })
}

export function replaceKey(object, oldKey, newKey, newValue) {
    const { [oldKey]: _, ...objectWithoutOldValue } = object
    return Object.assign(objectWithoutOldValue, { [newKey]: newValue })
}