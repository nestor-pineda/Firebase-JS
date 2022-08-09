const list = document.querySelector("ul");
const form = document.querySelector("form");

const outputData = (recipe, id) => {
  let html = `
    <li data-id="${id}">
      <div>${recipe.title}</div>
      <div><small>${recipe.created_at.toDate()}</small></div>
      <button class="btn btn-danger btn-sm my-2">Delete</button>
    </li>
  `;

  list.innerHTML += html;
};

//get document

// db.collection("recepies")
//   .get()
//   .then((snapshot) => {
//     console.log(snapshot);
//     snapshot.docs.forEach((doc) => {
//       // console.log(doc.data());
//       outputData(doc.data(), doc.id);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//get document with Real Time Listener
db.collection("recepies").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((item) => {
    const doc = item.doc;
    if (item.type === "added") {
      outputData(doc.data(), doc.id);
    } else if (item.type === "removed") {
      deleteRecepieFromUI(doc.id);
    }
  });
});

const deleteRecepieFromUI = (id) => {
  const recepies = document.querySelectorAll("li");
  recepies.forEach((item) => {
    if (item.getAttribute("data-id") === id) {
      item.remove();
    }
  });
};

// Add to Database

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const now = new Date(); // we store the timestamp using Date(). the exact moment when we create the new information and store it in the DB.

  // We create an object with the structure of our DB documents:
  const recipe = {
    title: form.recipe.value,
    created_at: firebase.firestore.Timestamp.fromDate(now), // for timestamps
  };

  db.collection("recepies")
    .add(recipe)
    .then(() => {
      console.log("recepie added to DB");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Delete data

list.addEventListener("click", (e) => {
  if (e.target.nodeName === "BUTTON") {
    const id = e.target.parentElement.getAttribute("data-id");
    db.collection("recepies")
      .doc(id)
      .delete()
      .then(() => {
        console.log("recepie deleted");
      });
  }
});
