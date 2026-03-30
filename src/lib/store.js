import { writable } from 'svelte/store';

/** @type {any[]} */
const defaultData = []

function createMailStore() {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('mails') : null
    const initial = stored ? JSON.parse(stored) : defaultData

    const { subscribe, set, update } = writable(initial)

    /** @param {any[]} next */
    function save(next) {
        localStorage.setItem('mails', JSON.stringify(next))
        return next
    }

    return {
        subscribe,
        /** @param {any} mail */
        add(mail) {
            update(mails => save([...mails, mail]))
        },
        /** @param {any} id */
        remove(id) {
            update(mails => save(mails.filter(/** @type {function(any): boolean} */ m => m.id !== id)))
        },
        /** @param {string} mailId @param {any} service */
        addService(mailId, service) {
            update(mails => save(mails.map(/** @type {function(any): any} */ m => {
                if (m.id !== mailId) return m
                return { ...m, services: [...(m.services || []), service] }
            })))
        },
        /** @param {string} mailId @param {string} serviceId */
        removeService(mailId, serviceId) {
            update(mails => save(mails.map(/** @type {function(any): any} */ m => {
                if (m.id !== mailId) return m
                return { ...m, services: m.services.filter(/** @type {function(any):boolean} */ s => s.id !== serviceId) }
            })))
        },
        /** @param {string} mailId @param {string} serviceId @param {any} updated */
        editService(mailId, serviceId, updated) {
            update(mails => save(mails.map(/** @type {function(any): any} */ m => {
                if (m.id !== mailId) return m
                return {
                    ...m,
                    services: m.services.map(/** @type {function(any): any} */ s =>
                        s.id === serviceId ? { ...s, ...updated } : s
                    )
                }
            })))
        },
    }
}

export const mailStore = createMailStore()