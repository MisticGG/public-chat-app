let Chat = "";
let Message = "";
let User = "";  // Declare User here to use it in multiple functions
let Name = "";

function handleForm(event) {
  event.preventDefault();
  User = document.getElementById('username').value;  // Use the outer scope User variable
  Name = FBI(User);
  if (!Name) {
    Name = "User";
  }
  Chat = document.getElementById('chatroom').value;
  Chat = Chat.charAt(0).toUpperCase() + Chat.slice(1);
  while (Chat.endsWith(" ")) {
    Chat = Chat.slice(0, -1);  // Corrected slice to remove trailing spaces
  }
  if (!Chat.endsWith("Room") && !Chat.endsWith("room")) {
    Chat = Chat + " Room";
  } else if (Chat.endsWith("room")) {
    Chat = Chat.slice(0, -4) + " Room";  // Corrected slice to remove 'room'
  }

  sessionStorage.setItem("User", User);
  sessionStorage.setItem("Chat", Chat);
  sessionStorage.setItem("Name", Name);
  window.location.href = '/chat';
}

async function handleForm2(event) {
  event.preventDefault();
  Message = document.getElementById('message').value;
  document.getElementById('message').value = "";
  
  User = sessionStorage.getItem("User");
  Name = sessionStorage.getItem("Name");
  Chat = sessionStorage.getItem("Chat");

  if (Chat && User && Name) {
    const bigDiv = document.getElementById("bigDiv");
    const data = { User, Name, Chat, Message };

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log('Data successfully sent to the server: ', data);
      } else {
        console.error('Error posting data:', response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }

    const DIV = document.createElement("div");
    DIV.id = "Client";
    DIV.classList.add(Name, "Message");  // Use Name instead of doc.Name
    bigDiv.appendChild(DIV);

    const userElement = document.createElement("h5");  // Renamed to avoid shadowing
    userElement.id = "Client" + "-User";
    userElement.classList.add(Name + "-User", "Message");
    userElement.innerHTML = User;  // Use User instead of doc.User
    DIV.appendChild(userElement);

    const messageElement = document.createElement("p");  // Renamed to avoid shadowing
    messageElement.id = "Client" + "-Text";
    messageElement.classList.add(Name + "-Text", "Message");
    messageElement.innerHTML = Message;  // Use Message instead of doc.Message
    DIV.appendChild(messageElement);

    const child = bigDiv.lastElementChild;
    child.scrollIntoView();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', handleForm);
  } else if (document.getElementById("sender")) {
    document.getElementById("sender").addEventListener("submit", handleForm2);
  }
});

function FBI(username) {
  const lower = [...'abcdefghijklmnopqrstuvwxyz'];
  const upper = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  const numbers = [..."0123456789"];
  const allowedChars = [...lower, ...upper, ...numbers];

  let name = "";
  for (let char of username) {
    if (allowedChars.includes(char)) {
      name += char;
    }
  }
  for (let num of numbers) {
    if (name.startsWith(num)) {
      name = name.slice(1);
      break;
    }
  }
  return name;
}

function Background() {
  const bgFile = document.getElementById("bgChoice");
  const accept = ["jpg", "png", "svg", "gif"];
  if (bgFile && accept.includes(bgFile.files[0]?.type.split('/')[1])) {  // Check file type
    document.body.style.backgroundImage = `url(${bgFile.value})`;  // Assuming bgFile.value is a URL
  }
}

if (document.getElementById('bgChoice')) {
  document.getElementById('bgChoice').addEventListener('change', function (event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.body.style.backgroundImage = `url(${e.target.result})`;
      };
      reader.readAsDataURL(file);
    }
  });
}
