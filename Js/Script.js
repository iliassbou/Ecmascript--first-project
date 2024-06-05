import Etudiant from "./etudiant.js";

let filterBySetting = {
    'column': "name",
    'desc': false,
}

let isFirstLoad = true

const displayEtudiants = async function () {
    return Etudiant.allEtudiants().then(function (res) {
        console.log('is',filterBySetting.column )
        // Filter settings for all column
        res.sort((a, b) => {
            const isNumber = typeof a[filterBySetting.column] === 'number'

            // sort is Number
            if (isNumber) {
                if (filterBySetting.desc) {
                    return b[filterBySetting.column] - a[filterBySetting.column]
                } else {
                    return a[filterBySetting.column] - b[filterBySetting.column]
                }
            } else {
                // sort isn't Number    
                if (filterBySetting.desc) {
                    return b[filterBySetting.column].localeCompare(a[filterBySetting.column])
                } else {
                    console.log(filterBySetting.column)
                    return a[filterBySetting.column].localeCompare(b[filterBySetting.column])
                }
            }
        })

        return res.map((data) => {
            const {
                id,
                name,
                date,
                note
            } = data
            const etudiant = new Etudiant(name, date, note)
            return `<tr>
                        <th scope="row">${id}</th>
                        <td>${etudiant.name}</td>
                        <td>${etudiant.getAge()}</td>
                        <td><span class="badge rounded-pill ${etudiant.siAdmitted()? 'text-bg-success':'text-bg-danger'}">${etudiant.note} / ${Etudiant.MAX_NOTE}</span></td>
                        <td><button type="button" class="btn btn-danger delete" data-id="${id}">Supprime</button></td>
                    </tr>`
        })
    })
}

const renderEtudiants = function () {
    const body = document.querySelector('.list-etudiants')
    displayEtudiants().then(data => {
        body.innerHTML = data.join(" ")
        if (isFirstLoad) {
            init()
        }
        isFirstLoad = false
        updateFilterButtonIcons()
    })
}

const AddEtudiant = (event) => {
    event.preventDefault()
    const [name, date, note] = document.querySelectorAll('#name,#date,#note')
    const etudiant = new Etudiant(name.value, date.value, note.value)
    etudiant.AddEtudiant().then(() => {
        renderEtudiants();
    });
}

window.deleteEtudiant = (id) => {
    console.log("Deleting Etudiant with ID:", id)
    Etudiant.deleteEtudiant(id).then(() => {
        renderEtudiants();
    });
}

const filter = (dataName) => {
    if (filterBySetting.column === dataName) {
        filterBySetting.desc = !filterBySetting.desc;
    } else {
        filterBySetting.column = dataName;
        filterBySetting.desc = false;
    }
    renderEtudiants()
}

const updateFilterButtonIcons = () => {
    const filterButtons = document.querySelectorAll('.th-attribute');
    filterButtons.forEach((button) => {
        const column = button.dataset.name;
        if (filterBySetting.column === column) {
            button.innerHTML = `${column} ${filterBySetting.desc ? '▴':'▾'}`;
        } else {
            button.innerHTML = column;
        }
    });
};

window.toggleDirection = () => {
    filterBySetting.desc = !filterBySetting.desc
    renderEtudiants()
}



// window.renderSort = (column) => {
//     if(filterBySetting.column === column){
//         return `<span>${(filterBySetting.desc)?'▾':'▴'}</span>`
//     }
// }

const init = function () {
    const refreshBody = document.querySelector('#refresh')
    const AddBtn = document.querySelector('#btn-add')
    const deleteButtons = document.querySelectorAll('.delete')
    const filterButtons = document.querySelectorAll('.th-attribute')

    refreshBody.addEventListener("click", () => {
        renderEtudiants()
    })

    AddBtn.addEventListener("click", (event) => {
        AddEtudiant(event)
    })

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filter(button.dataset.name)
        })
    })

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            window.deleteEtudiant(button.dataset.id)
        })
    })
    updateFilterButtonIcons()
}

renderEtudiants()