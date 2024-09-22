export function filterObjects(objects, necessaryKeys) {
    return objects.map(object => {
        const sanitizedObject = {}
        necessaryKeys.forEach(key => {
            sanitizedObject[key] = object[key]
        })
        return sanitizedObject
    })
}