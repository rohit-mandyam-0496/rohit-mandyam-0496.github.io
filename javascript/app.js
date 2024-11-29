class Animal {
  constructor(name, image, size, location) {
    this.name = name;
    this.image = image;
    this.size = size;
    this.location = location;
  }
  renderRow() {
    return `
            <tr>
                <td><img src="${this.image}" alt="${this.name}" class="animal-img" /></td>
                <td>${this.name}</td>
                <td>${this.size}</td>
                <td>${this.location}</td>
                <td>
                    <button class="btn btn-warning" onclick="editAnimal('${this.name}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteAnimal('${this.name}')">Delete</button>
                </td>
            </tr>
        `;
  }
}

class BigCats extends Animal {
  constructor(name, image, size, location) {
    super(name, image, size, location);
  }
  static sortBy(field, animals) {
    return animals.sort((a, b) => {
      if (field === "name") {
        return a.name.localeCompare(b.name);
      } else if (field === "location") {
        return a.location.localeCompare(b.location);
      } else if (field === "size") {
        let c = parseInt(a.size);
        let d = parseInt(b.size);
        console.log(c, d);
        return c - d;
      }
    });
  }
}

class Dogs extends Animal {
  constructor(name, image, size, location) {
    super(name, image, size, location);
  }
  static sortBy(field, animals) {
    return animals.sort((a, b) => {
      if (field === "name") {
        return a.name.localeCompare(b.name);
      } else if (field === "location") {
        return a.location.localeCompare(b.location);
      }
    });
  }
}

class BigFish extends Animal {
  constructor(name, image, size, location) {
    super(name, image, size, location);
  }
  static sortBy(field, animals) {
    return animals.sort((a, b) => {
      let c = parseInt(a.size);
      let d = parseInt(b.size);
      console.log(c, d);
      return c - d;
    });
  }
}

// Animal Data Arrays
let bigCats = [];
let dogs = [];
let bigFish = [];

// Add Animal Function
function addAnimal(type) {
  const name = prompt("Enter animal name:");
  const image = prompt("Enter image URL:");
  const size_input = prompt("Enter size:");
  const location = prompt("Enter location:");
  if (!name || !image || !location || !size_input) {
    alert("Please fill in all fields.");
    return;
  }
  let a = size_input.split(" ");
  let size = parseInt(a[0]);
  if (isNaN(size) || size <= 0) {
    alert("Please enter a valid size.");
    return;
  }
  if (checkDuplicate(name)) {
    alert("Animal already exists.");
    return;
  }
  //const newAnimal = new Animal(name, image, size, location);
  if (type === "cats") {
    bigCats.push(new BigCats(name, image, size_input, location));
    renderTable("cats");
  } else if (type === "dogs") {
    dogs.push(new Dogs(name, image, size_input, location));
    renderTable("dogs");
  } else if (type === "fish") {
    bigFish.push(new BigFish(name, image, size_input, location));
    renderTable("fish");
  }
}

// Check Duplicate Animal by Name
function checkDuplicate(name) {
  return [...bigCats, ...dogs, ...bigFish].some(
    (animal) => animal.name === name
  );
}

// Sort Table
function sortTable(type, field) {
  let sortedAnimals;
  if (type === "cats") {
    sortedAnimals = BigCats.sortBy(field, bigCats);
    renderTable("cats", sortedAnimals);
  } else if (type === "dogs") {
    sortedAnimals = Dogs.sortBy(field, dogs);
    renderTable("dogs", sortedAnimals);
  } else if (type === "fish") {
    sortedAnimals = BigFish.sortBy(field, bigFish);
    renderTable("fish", sortedAnimals);
  }
}

// Render Table
function renderTable(type) {
  let tableBody = "";
  if (type === "cats") {
    tableBody = bigCats.map((cat) => cat.renderRow()).join("");
    document.getElementById("bigCatsBody").innerHTML = tableBody;
  } else if (type === "dogs") {
    tableBody = dogs.map((dog) => dog.renderRow()).join("");
    document.getElementById("dogsBody").innerHTML = tableBody;
  } else if (type === "fish") {
    tableBody = bigFish.map((fish) => fish.renderRow()).join("");
    document.getElementById("fishBody").innerHTML = tableBody;
  }
}

// Edit Animal
function editAnimal(name) {
  let animal = [...bigCats, ...dogs, ...bigFish].find(
    (animal) => animal.name === name
  );
  if (animal) {
    animal.name = prompt("Enter new name:", animal.name);
    animal.size = prompt("Enter new size:", animal.size);
    animal.location = prompt("Enter new location:", animal.location);
    animal.image = prompt("Enter new image URL:", animal.image);
    if (!animal.name || !animal.image || !animal.location || !animal.size) {
      alert("Please fill in all fields.");
      return;
    }
    let a = animal.size.split(" ");
    let size = parseInt(a[0]);
    if (isNaN(size) || size <= 0) {
      alert("Please enter a valid size.");
      return;
    }
    renderTable("cats");
    renderTable("dogs");
    renderTable("fish");
  }
}

// Delete Animal
function deleteAnimal(name) {
  bigCats = bigCats.filter((animal) => animal.name !== name);
  dogs = dogs.filter((animal) => animal.name !== name);
  bigFish = bigFish.filter((animal) => animal.name !== name);
  renderTable("cats");
  renderTable("dogs");
  renderTable("fish");
}

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../service-worker.js")
    .then(() => console.log("Service Worker registered successfully."))
    .catch((error) =>
      console.error("Service Worker registration failed:", error)
    );
}

function exportToJson() {
  const tables = document.querySelectorAll("table");
  const data = {};
  tables.forEach((table) => {
    const category = table.previousElementSibling.textContent.trim();
    const rows = table.querySelectorAll("tbody tr");
    const tableData = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      tableData.push({
        image: cells[0].querySelector("img")?.src || "N/A",
        name: cells[1].textContent.trim(),
        size: parseInt(cells[2].textContent.trim(), 10),
        location: cells[3].textContent.trim(),
      });
    });
    data[category] = tableData;
  });
  const jsonData = JSON.stringify(data, null, 4);
  const blob = new Blob([jsonData], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "animal_data.json";
  link.click();
}
// Add the Export to JSON button click listener
document.querySelector("#exportButton").addEventListener("click", exportToJson);
