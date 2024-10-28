import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"


const appSettings = ({
    databaseURL: "https://grocery-items-9b165-default-rtdb.asia-southeast1.firebasedatabase.app/"
})

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

onValue(shoppingListInDB, function (snapshot) {
    const data = snapshot.val()
    const ul = document.querySelector('ul');
    ul.innerHTML = ""; // Clear the current list to avoid duplicates
    // there also a method exists called snapshot.exists() to check if snapshot is empty or not!


    if(data){
        let listItemsValues = Object.values(snapshot.val());
        let listItemsId = Object.keys(snapshot.val())

        for (let i = 0; i < listItemsValues.length; i++) {
            const li = document.createElement('li');
            li.innerText = listItemsValues[i];
            ul.appendChild(li);
            li.addEventListener("click",()=>{
                let deletedItem = ref(database, `shoppingList/${listItemsId[i]}`)
                remove(deletedItem).then(() => {
                    console.log(`${listItemsValues[i]} deleted`);
                    // alert(`${listItemsValues[i]} has been removed from your shopping list.`);
                });
        })
    }
    }else{
        const emptyMessage = document.createElement('li');
        emptyMessage.innerText = "No items in the shopping list.";
        ul.appendChild(emptyMessage);
    }
    
});



const input = document.getElementById('input-field')
const button = document.getElementById('add-button')

button.addEventListener("click", (e) => {
    const value = input.value;
    const trimmedValue = value.trim();

    if (trimmedValue !== "") {
        push(shoppingListInDB, trimmedValue)
            .then(() => {
                console.log(`${trimmedValue} pushed`);
                input.value = ""; // Clear the input field
            })
            .catch((error) => {
                console.error("Error pushing to database:", error);
            });
    } else {
        console.log("Can't push something that isn't there!");
    }
});

