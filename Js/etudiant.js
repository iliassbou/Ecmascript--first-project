import {
    ENDPOINT
} from "./constants.js"

export default class Etudiant {
    static MAX_NOTE = 20
    constructor(name, age, note) {
        this.name = name
        this.age = age
        this.note = note
    }

    static allEtudiants = async function () {
        const res = await fetch(ENDPOINT)
        const etudiants = await res.json()
        return etudiants
    }
    siAdmitted = () => this.note >= 10
    getAge = () => (new Date().getFullYear() - new Date(this.age).getFullYear())

    static deleteEtudiant = async function (id) {
        const res = await fetch(ENDPOINT + '/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res
    }
    AddEtudiant = async function () {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.name,
                date: this.age,
                note: parseFloat(this.note)
            })
        })
        return res
    }
}