var generalRecipe = localStorage.getItem("general-selected"); // stores all info
var veganID = localStorage.getItem("vegan-selected"); // stores ID
var storedID = JSON.parse(localStorage.getItem("userRecipes")); // All stored IDs 
var curSelect = localStorage.getItem("currently-selected");

var veganTitle;
var veganImage;
var veganIngredient;
var veganInstruction;

var previousInfo = {};

function displayPrevious() {
    if (localStorage.getItem("previousSaved") !== null) {
        var previous = localStorage.getItem("previousSaved");
        previous = JSON.parse(previous);
        var keyID = Object.keys(previous);

        for (i = 0; i < keyID.length; i++) {
            var index = keyID[i];
            var r = previous[index];

            if (localStorage.getItem("vegan-ID") !== null && JSON.parse(localStorage.getItem("vegan-ID").includes(index.toString()))) {
                var previousCard = $("<li></li>");
                previousCard.addClass("history-card");
                previousCard.text(r[1]);

                var image = r[2];
                console.log(image);
                var previousImage = $("<img>");
                previousCard.append(previousImage);
                previousImage.attr("src", image);
    
                $(".history").append(previousCard);
            } else {
                var previousCard = $("<li></li>");
                previousCard.addClass("history-card");
                previousCard.text(r[1]);
    
                var image = r[2].substring(r[2].indexOf('(') + 1, r[2].lastIndexOf(')'));
    
                var previousImage = $("<img>");
                previousCard.append(previousImage);
                previousImage.attr("src", image);
    
                $(".history").append(previousCard);
            }
        }
    }
}

if (generalRecipe !== null && curSelect === JSON.parse(generalRecipe)[0]) {


    // Display general recipe details

    generalRecipe = JSON.parse(generalRecipe);

    $(`#food-name`).text(generalRecipe[1]);

    var image = generalRecipe[2];
    var imageLink = image.substring(image.indexOf('(') + 1, image.lastIndexOf(')'));

    $(`#food-picture`).attr("src", imageLink);

    for (var i = 0; i < generalRecipe[3].length; i++) {
        var ingEl = $("<li></li>");
        var ing = generalRecipe[3][i].substring(generalRecipe[3][i].indexOf(':"') + 2, generalRecipe[3][i].lastIndexOf('"'));
        ingEl.text(ing);
        $(`#ing-list`).append(ingEl);
    };

    for (var n=0; n < generalRecipe[4].length; n++) {
        var insEl = $("<li></li>");
        var ins = generalRecipe[4][n];
        insEl.text(ins);
        $(`#steps`).append(insEl);
    };

    // Locally storing general recipe information

    var previousGeneral = [...generalRecipe];
    previousInfo[`${generalRecipe[0]}`] = previousGeneral;
    localStorage.setItem("last-selected-info", JSON.stringify(previousInfo));

    if (localStorage.getItem("previousSaved") === null){
        var previousSavedInfo = {};
        previousSavedInfo[`${generalRecipe[0]}`] = previousGeneral;
        localStorage.setItem("previousSaved", JSON.stringify(previousSavedInfo));
    } else {
        var previousSavedInfo = JSON.parse(localStorage.getItem("previousSaved"));
        previousSavedInfo[`${generalRecipe[0]}`] = previousGeneral;
        localStorage.setItem("previousSaved", JSON.stringify(previousSavedInfo));
    }

} else if (veganID !== null && veganID === curSelect) {
    async function fetchVeganInfo(veganID) {
        const url = `https://the-vegan-recipes-db.p.rapidapi.com/${veganID}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '506f3bfb28mshd6b6cc887b6b7a4p1b6358jsn7e3e532ba270',
                'X-RapidAPI-Host': 'the-vegan-recipes-db.p.rapidapi.com'
            }
        };
        
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            var previousVegan = [];

            // Displaying vegan recipe data
        
            veganTitle = result.title;
            console.log(veganTitle)
            $(`#food-name`).text(veganTitle);

            veganImage = result.image;
            $(`#food-picture`).attr("src", veganImage);

            veganIngredient = result.ingredients;
            for (var i = 0; i < veganIngredient.length; i++) {
                var ingEl = $("<li></li>");
                var ing = veganIngredient[i];
                ingEl.text(ing);
                $(`#ing-list`).append(ingEl);
            };

            var fullInstructions = [];
            var veganFull = result.method;

            for (var i = 0; i < veganFull.length; i++) {
                var section = JSON.stringify(result.method[i]);
                section = section.substring(section.indexOf(':"') + 2, section.lastIndexOf('"'))
                section = section.split(". ");
                for (n = 0; n < section.length; n++) {
                    fullInstructions.push(section[n]);
                }
            }
            for (var n=0; n < fullInstructions.length; n++) {
                var insEl = $("<li></li>");
                var ins = fullInstructions[n];
                insEl.text(ins);
                $(`#steps`).append(insEl);
            };

            // Locally storing vegan recipe information

            previousVegan.push(result.id);
            previousVegan.push(veganTitle);
            previousVegan.push(veganImage);
            previousVegan.push(veganIngredient);
            previousVegan.push(veganFull);

            previousInfo[`${result.id}`] = previousVegan;
            localStorage.setItem("last-selected-info", JSON.stringify(previousInfo));
        
            if (localStorage.getItem("previousSaved") === null){
                var previousSavedInfo = {};
                previousSavedInfo[`${result.id}`] = previousVegan;
                localStorage.setItem("previousSaved", JSON.stringify(previousSavedInfo));
            } else {
                var previousSavedInfo = JSON.parse(localStorage.getItem("previousSaved"));
                previousSavedInfo[`${result.id}`] = previousVegan;
                console.log(previousSavedInfo);
                localStorage.setItem("previousSaved", JSON.stringify(previousSavedInfo));
            }

        } catch (error) {
            console.error(error);
        }
    };
    fetchVeganInfo(veganID)
}

displayPrevious();
