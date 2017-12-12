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
    
    // Changes arrays into a simple list
    arrayToList(array) {
        let valuesArray = array.map(keyValPair => `${keyValPair.make} ${keyValPair.model} ${keyValPair.type}`);
        return valuesArray.join(', ');
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
    }

    doneButton() {
        document.querySelector(`button[name="done-btn"]`).addEventListener('click', () => {
            this.userInputMakes = document.querySelector(`input[name="make"]`).value;
            this.userInputModels = document.querySelector(`input[name="model"]`).value;

            this.projectModel.modelSelection(this.userInputMakes, this.userInputModels);

            this.dropDownList();
        });
    } 

    enterKey() {
        document.addEventListener('keypress', event => {
            this.userInputMakes = document.querySelector(`input[name="make"]`).value;
            this.userInputModels = document.querySelector(`input[name="model"]`).value;
    
            if(event.keyCode === 13 || event.which === 13) {
                this.projectModel.modelSelection(this.userInputMakes, this.userInputModels);
                this.dropDownList();
            } 
        });
    }  

    dropDownList() {
        console.log(this.projectView.arrayToList(this.projectModel.listInputModels()));
        
        // console.log(model.arrayToList(this.projectModel.listInputModels()));
        // 1) make list of cars (call model function)
        // 2) select dropdown (from controller)
        // 3) make list in html form (call view function)
        
        // const dropDown = document.querySelector(`select[name="models"]`);

    }

}

function startup() {
    const projectController = new Controller();
}

window.onload = startup;

// GAMEPLAN
    // 1) Remove case sensitivity of car arrays
    // 2) Console.log car info as a one-line-lists rather than array of objects
    // 3) Place one-line-list in dropdown menu of page
    // 4) specs from local car list should be entered in output fields
    // 5) use arrow functions to add eventlisteners to each section





// Previous working code before classes introduced
const startup2 = function(){
    
        // Local car "encyclopedia"
        const car = [
            {make: 'FORD', model: 'Fiesta', type: 'Coupe', engine: 'V8'},    
            {make: 'FORD', model: 'Mustang', type: 'Convertible', engine: 'V6'},
            {make: 'FORD', model: 'Mustang', type: 'Convertible', engine: 'V8'},
            {make: 'FORD', model: 'Mustang', type: 'Coupe', engine: 'V6'},
            {make: 'CHEVROLET', model: 'Corvette', type: 'Convertible', engine: 'V8'},
            {make: 'CHEVROLET', model: 'Corvette', type: 'ZR1', engine: 'V8'},
            {make: 'CHEVROLET', model: 'Corvette', type: 'Coupe ', engine: 'V6'},
            {make: 'CHEVROLET', model: 'Malibu', type: 'Z06 ', engine: 'V8'},
        ]
    
        // Capitalizes words
        // String.prototype.capitalize = function(){
        //     return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
        // }
    
        function capitalize(string){
            return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
        }
    
        // console.logs filtered array matching input makes and models
        const modelSelection = function (){
            console.log('done-btn clicked or enter button pressed');
            
            let userInputMakes, userInputModels, listInputMakes, listInputModels
    
            userInputMakes = document.querySelector(`input[name="make"]`).value;
            userInputModels = document.querySelector(`input[name="model"]`).value;
            listInputMakes = car.filter(obj => obj.make.includes(userInputMakes));
            listInputModels = listInputMakes.filter(obj => obj.model.includes(userInputModels));
    
            // Pulls user make input, changes to uppercase, and console.logs result.
            userInputMakes = userInputMakes.toUpperCase();        
            console.log(userInputMakes);
    
            // Pulls user model input, capitalizes, and console.logs result.
            userInputModels = capitalize(userInputModels);
            console.log(userInputModels);
    
            listInputMakes = car.filter(obj => obj.make.includes(userInputMakes));
            // console.log(listInputMakes);
    
            listInputModels = listInputMakes.filter(obj => obj.model.includes(userInputModels));
            console.log(listInputModels); 
        }
    
        document.querySelector(`button[name="done-btn"]`).addEventListener('click', modelSelection)
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                modelSelection();
            } 
        });
    
    }
    // window.onload = startup2;