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
        this.getYears;
    }

    // Might not need this later, may be able to
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

    // For Car API ---------------------->
    getYears () {
        let yearsArray = [];
        let link = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears';
        // let selectedYear = user input and place this variable in line below as value for 'year'
        $.getJSON(this.base_url = `${link}?callback=?`, {cmd:"getYears"},
        (data) => {
            const years = data.Years;
            // let yearsArray = [];
            for (var i = Number(years.min_year); i <= years.max_year; i++) {
                console.log(i);
                yearsArray.push(i);
            }
            console.log(yearsArray);
        }); 
        return yearsArray;
    } 

}

class View {
    constructor() {

    }
    // For local car array------------------->
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

    // For Car API-------------------------->
    // Changes arrays into simple list of html options for API
    arrayToListApi(array) {
        console.log(array);
        console.log("Array length: " + array.length);
        let valuesArray = array.map(year => `<option>${year}</option>`);
        console.log(valuesArray);         
        return `<option selected="selected" disabled="disabled">Select year</option>${valuesArray.join('')}`;
    }
    // Updates UI with years options
    dropDownListApi(element, optionList) {
        // console.log(optionList);
        // FIND WAY TO REUSE THIS FOR ALL DATA
        // element = `select[name="years"]`;
        document.querySelector(element).innerHTML = optionList;
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
        this.updateDropdowns;
        this.pullApiData();
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
    // Pull only US makes
    // carMakes () {
    //     let link = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes&year=2000&sold_in_us=1';
    //     // let selectedYear = user input and place this variable in line below as value for 'year'
    //     $.getJSON(this.base_url = `${link}?callback=?`, {cmd:"getMakes", year:"2009"},
    //     function(data) {
    //         const makes = data.Makes;
    //         for (var i = 0; i < makes.length; i++) {
    //             console.log(makes[i].make_display);
                
                
    //         }
            
    //     });
    // }
    // Calls two functions from the View to wrap array components in <option> tags, then 
    // places those new elements into the index.html file. Takes two parameters: the <select> element 
    // where the info will be placed and the data to be placed.
    updateDropdowns(element, dropdownData) {
        this.projectView.dropDownListApi(element, this.projectView.arrayToListApi(dropdownData));
    }

    pullApiData () {
        // Links to access car API data
        let link = {years: 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears',
                    makes: 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes&year=2000&sold_in_us=1',
                    models: 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModels&make=ford&year=2005&sold_in_us=1&body=SUV',
                    trims: 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&[params'};
        // Pull data of years available            
        // let selectedYear = user input and place this variable in line below as value for 'year'
        $.getJSON(this.base_url = `${link.years}?callback=?`, {cmd:"getYears"},
        (data) => {
            const years = data.Years;
            const yearsArray = [];
            // API only has min and max year, this counts out all years in between
            for (var i = Number(years.min_year); i <= years.max_year; i++) {
            yearsArray.push(i);
                            
            }
            console.log('completed first request');
            this.updateDropdowns(`select[name="years"]`, yearsArray);
            console.log("moved past first request");
        });
        // console.log("moved past first request");
        // document.querySelector(`select[name="years"]`).addEventListener('onchange', () => {
        //     console.log("I'm in");
        //     let userYearInput = document.querySelector(`select[name="years"]`).value;
        //     console.log(userYearInput);
        //     // let selectedYear = user input and place this variable in line below as value for 'year'
        //     $.getJSON(this.base_url = `${link.makes}?callback=?`, {cmd:"getMakes", year: userYearInput},
        //     (data) => {
        //         const makes = data.Makes;
        //         const makesArray = []
        //         for (var i = 0; i < makes.length; i++) {
        //             // console.log(makes[i].make_display);
        //             makesArray.push(makes[i].make_display);
        //         }
        //         console.log(makesArray);
                
        //         this.updateDropdowns(`select[name="makes"]`, makesArray);
                
        //     });
        // });
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