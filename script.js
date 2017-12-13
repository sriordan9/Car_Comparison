class Model {
    constructor() {
        // Local car "encyclopedia"
        this.car = [
            {make: 'FORD', model: 'Fiesta', type: 'Coupe', engine: 'V8'},    
            {make: 'FORD', model: 'Mustang', type: 'Convertible', engine: 'V6'},
            {make: 'FORD', model: 'Mustang', type: 'Convertible', engine: 'V8'},
            {make: 'FORD', model: 'Mustang', type: 'Coupe', engine: 'V6'},
            {make: 'CHEVROLET', model: 'Corvette', type: 'Convertible', engine: 'V8'},
            {make: 'CHEVROLET', model: 'Corvette', type: 'ZR1', engine: 'V8'},
            {make: 'CHEVROLET', model: 'Corvette', type: 'Coupe ', engine: 'V6'},
            {make: 'CHEVROLET', model: 'Malibu', type: 'Z06 ', engine: 'V8'},
        ];
        this.userInputMakes;
        this.userInputModels;
    }

    capitalize(string) {
        return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
    }

    // Filters car array for car makes matching user input
    listInputMakes() {
        return this.car.filter(obj => obj.make.includes(this.userInputMakes));
    }

     // Filters car array for car makes and models matching user inputs
    listInputModels() {
        return this.listInputMakes().filter(obj => obj.model.includes(this.userInputModels));
    }
    
    modelSelection(makes, models) {
        this.userInputMakes = makes.toUpperCase();
        this.userInputModels = this.capitalize(models);

        console.log('done-btn clicked or enter button pressed');

        console.log(this.userInputMakes);

        console.log(this.userInputModels);

        console.log(this.listInputMakes());

        console.log(this.listInputModels()); 
    }

}

class View {
    constructor() {

    }
    
    // Changes arrays into a simple list of html "option" elements for dropdown menu
    arrayToList(array) {
        let valuesArray = array.map(keyValPair => 
            `<option>${keyValPair.make} ${keyValPair.model} ${keyValPair.type}</option>`);            
        return `<option selected="selected" disabled="disabled">Select model</option> ${valuesArray.join('')}`;
    }
    // Updates UI with model options in dropdown menu
    dropDownList(optionList) {
        console.log(optionList);
        document.querySelector(`select[name="models"]`).innerHTML = optionList;
    }
    
}

class Controller {
    constructor() {
        this.projectModel = new Model();
        this.projectView = new View();
        this.userInputMakes;
        this.userInputModels;
        this.doneButton();
        this.enterKey();
        this.ajaxRequest = new XMLHttpRequest();
        this.pullWebPage();
    }
    // Event handler when user clicks done button after filling out make/model fields
    doneButton() {
        document.querySelector(`button[name="done-btn"]`).addEventListener('click', () => {
            this.userInputMakes = document.querySelector(`input[name="make"]`).value;
            this.userInputModels = document.querySelector(`input[name="model"]`).value;

            this.projectModel.modelSelection(this.userInputMakes, this.userInputModels);

            this.projectView.dropDownList(this.projectView.arrayToList(this.projectModel.listInputModels()));
        });
    } 
    // Event handler when user presses enter key after filling out make/model fields
    enterKey() {
        document.addEventListener('keypress', event => {
            this.userInputMakes = document.querySelector(`input[name="make"]`).value;
            this.userInputModels = document.querySelector(`input[name="model"]`).value;
    
            if(event.keyCode === 13 || event.which === 13) {
                this.projectModel.modelSelection(this.userInputMakes, this.userInputModels);
                this.projectView.dropDownList(this.projectView.arrayToList(this.projectModel.listInputModels()));
            } 
        });
    } 
    
    // Updates dropdown menu with model options
    // dropDownList() {
    //     const dropDownField = document.querySelector(`select[name="models"]`)
    //     const options = this.projectView.arrayToList(this.projectModel.listInputModels());
    //     console.log(dropDownField);
    //     console.log(options);
    //     dropDownField.innerHTML = options;
    // }

    pullWebPage() {
        // console.log("hello");
        // const self = this;
        this.ajaxRequest.onreadystatechange = () => {
            console.log("hello");
            if(this.ajaxRequest.readyState == 1){
                console.log("Established server connection.");
            }
            else if(this.ajaxRequest.readyState == 2){
                console.log("Request received by server.");
            }
            else if(this.ajaxRequest.readyState == 3){
                console.log("Processing request.");
            }
            else if(this.ajaxRequest.readyState == 4){
                console.log("Done loading!");
            }
            else{
                console.log("Something went wrong. :(");
            }

            console.log("Ready state changed");
        };
        this.ajaxRequest.open("GET", "https://www.autoevolution.com/cars/", true);
        document.querySelector(`div[class="col2width fl bcol-white carman"]`).innerHTML = this.ajaxRequest.responseText; 
        this.ajaxRequest.onreadystatechange();
        
        // "https://www.autoevolution.com/cars/"

    }
    
}

function startup() {
    const projectController = new Controller();
}

window.onload = startup;

// GAMEPLAN
    // 1) Remove case sensitivity of car arrays
    // 2) specs from local car list should be entered in output fields
    // 3) use arrow functions to add eventlisteners to each section

    // Makes page: https://www.autoevolution.com/cars/