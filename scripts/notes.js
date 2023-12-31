const url = 'https://note-capture.onrender.com/notes/';

const cards = document.querySelector("#cards");

getNoteData();

async function getNoteData() {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    // console.table(data.prophets);
    displayNotes(data);
  }
  
  getNoteData();

const displayNotes = (notes) => {
    notes.forEach(note => {
        let id = note._id;
        let title = note.title;
        let noteTxt = note.note;
        let noteTags = note.noteTags;
        let pinStatus = note.pinStatus;
        let attatchments = note.attatchments;
        let noteTitle = document.createElement("h2");
        let noteP = document.createElement("p");
        let card = document.createElement("section");
        // let portrait = document.createElement("img");
        let firstAndLastName = `${firstName} ${lastName}`

        //Populate elements
        noteTitle.textContent = title;
        noteP.textContent = noteTxt;




        // portrait.setAttribute('src', prophet.imageurl);
        // portrait.setAttribute('alt', `Portrait of ${firstAndLastName}`);
        // portrait.setAttribute('loading', 'lazy');
        // portrait.setAttribute('width', '340');
        // portrait.setAttribute('height', '440');
        

        card.appendChild(noteTitle);
        card.appendChild(noteP);
       
        // card.appendChild(portrait);
        // card.setAttribute('style', 'background-color:brown');

        cards.appendChild(card);

    });
}