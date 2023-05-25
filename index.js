import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-83b9f-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsementsList")

const formEl = document.getElementById("new-endorsement-form")
const textareaFiedEl = document.getElementById( "textarea-field" );
const fromInputFieldEl = document.getElementById( "input-id-from" );
const toInputFieldEl = document.getElementById( "input-id-to" );
const endorsementListEl = document.getElementById( "endorsement-list" );

formEl.addEventListener("submit", function(e) {
    e.preventDefault();
    const textareaValue = textareaFiedEl.value;
    const fromInputValue = fromInputFieldEl.value;
    const toInputValue = toInputFieldEl.value;
    
    const endorsementObject = {
        user: "@scrimba",
        text: textareaValue,
        comeFrom: fromInputValue,
        to: toInputValue,
        likes: [],
        isLiked: false
    };
    
    push(endorsementsInDB, endorsementObject);
    
    clearField(textareaFiedEl);
    clearField(fromInputFieldEl);
    clearField(toInputFieldEl);
})

onValue(endorsementsInDB, function(snapshot) {
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
    
        clearEndorsementListEl();
        
        for (let i = 0; i < itemsArray.length; i++) {
            const currentItem = itemsArray[i];
            
            appendItemToEndorsementListEl(currentItem);
        }    
    } else {
        endorsementListEl.innerHTML = ""
    }
})

function clearField(el) {
    el.value = ""
}

function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function appendItemToEndorsementListEl(item) {
    const itemID = item[0]
    const { user, text, comeFrom, to, likes, isLiked } = item[1]
    
    const divEl = document.createElement("div")
    
    divEl.setAttribute("class", "endorsement-info")
    divEl.innerHTML =  `<h6>To ${to}</h6>
                        <p>${text}<p>`
    const childEl = document.createElement("h6")
    childEl.textContent = `From ${comeFrom}`
    const spanEl = document.createElement("span")
    spanEl.innerHTML = `<i class="${!likes ? 'not-liked-yet': ''} fa fa-heart${isLiked ? '': '-o'}"></i> ${likes ? likes.length: ""}`    
    spanEl.addEventListener("click", function(e) {
        e.preventDefault()
        let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemID}`)
        let newLikesArr = []
        if(isLiked) {
            newLikesArr = likes.filter(userId => userId != user)
        }else{
            newLikesArr = likes ? [...likes, user]: [user]
        }
        update(exactLocationOfItemInDB, { likes: newLikesArr, isLiked: !isLiked })
    })
    
    childEl.append(spanEl)
    divEl.append(childEl)
    
    endorsementListEl.prepend(divEl)
}
