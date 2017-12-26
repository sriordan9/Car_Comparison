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
        return `<option selected="selected" disabled="disabled">Select model</option>
            ${valuesArray.join('')}`;
    }
    // Updates UI with model options in dropdown menu
    dropDownList(optionList) {
        console.log(optionList);
        document.querySelector(`select[name="models"]`).innerHTML = optionList;
    }

    // For Car API-------------------------->
    // Changes arrays into simple list of html options for API
    arrayToListApi(array) {
        let valuesArray = array.map(component => `<option>${component}</option>`);        
        return `<option selected="selected" disabled="disabled">Please Select</option>
            ${valuesArray.join('')}`;
    }
    // Updates UI with years options
    dropDownListApi(element, optionList) {
        // document.querySelector(element).innerHTML = optionList;
        // USE IF STATEMENT ONLY FOR TESTING selectNodeChild FUNCTION. Else portion is for current working code 
        if(element === "years") {
            const section = document.getElementsByName(element);
            
            // For statement puts years into dropdowns of all sections containing a '<select name="years">'
            // USE ONLY FOR TESTING selectNodeChild FUNCTION. Else portion is for current working code 
            for (var i = 0; i < section.length; i++) {
                section[i].innerHTML = optionList;
                console.log(section[i]);
                
            }  
        } else {
            document.querySelector(element).innerHTML = optionList;
        }      
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
        // this.pullApiData();
        this.userYearInput;
        this.userMakeInput;
        this.userModelInput;
        this.selectNodeChild ();
    }
    // Event handler when user clicks done button after filling out make/model fields
    doneButton() {
        document.querySelector(`button[name="done-btn"]`).addEventListener('click', () => {
            this.userInputMakes = document.querySelector(`input[name="make"]`).value;
            this.userInputModels = document.querySelector(`input[name="model"]`).value;

            this.projectModel.modelSelection(this.userInputMakes, this.userInputModels);

            this.projectView.dropDownList(this.projectView.arrayToList(
                this.projectModel.listInputModels()));
        });
    } 
    // Event handler when user presses enter key after filling out make/model fields
    enterKey() {
        document.addEventListener('keypress', event => {
            this.userInputMakes = document.querySelector(`input[name="make"]`).value;
            this.userInputModels = document.querySelector(`input[name="model"]`).value;
    
            if(event.keyCode === 13 || event.which === 13) {
                this.projectModel.modelSelection(this.userInputMakes, this.userInputModels);
                this.projectView.dropDownList(this.projectView.arrayToList(
                    this.projectModel.listInputModels()));
            } 
        });
    } 
    // Calls two functions from the View to wrap array components in <option> tags, then 
    // places those new elements into the index.html file. Takes two parameters: the attribute 
    //  selector of where the info will be placed and the data to be placed.
    updateDropdowns(element, dropdownData) {
        this.projectView.dropDownListApi(element, this.projectView.arrayToListApi(dropdownData));
    }

    pullApiData () {
        // Links to access car API data
        let link = 'https://www.carqueryapi.com/api/0.3/';
        // Pull data of years available            
        $.getJSON(this.base_url = `${link}?callback=?`, {cmd:"getYears"},(data) => {
            const years = data.Years;
            const yearsArray = [];
            // API only has min and max year, this counts out all years in between
            for (var i = Number(years.min_year); i <= years.max_year; i++) {
                yearsArray.push(i);            
            }
            this.updateDropdowns(`select[name="years"]`, yearsArray);            
        });
        // Listens for a year to be selected, once a change has been made for the year dropdown
        // then a request is sent for the makes data based on the year the user chose
        document.querySelector(`select[name="years"]`).addEventListener('change', () => {
            this.userYearInput = document.querySelector(`select[name="years"]`).value;

            $.getJSON(this.base_url = `${link}?callback=?`, 
                {cmd:"getMakes", year: this.userYearInput, sold_in_us: "1"},(data) => {
                    const makes = data.Makes;
                    const makesArray = []
                    for (var i = 0; i < makes.length; i++) {
                        makesArray.push(makes[i].make_display);
                    }
                    this.updateDropdowns(`select[name="makes"]`, makesArray);
            });
        });
        // Listens for a make to be selected, once a change has been made for the car make dropdown
        // then a request is sent for the models data based on the make the user chose
        document.querySelector(`select[name="makes"]`).addEventListener('change', () => {
            this.userMakeInput = document.querySelector(`select[name="makes"]`).value;

            $.getJSON(this.base_url = `${link}?callback=?`, 
                {cmd:"getModels", make: this.userMakeInput, year: this.userYearInput, sold_in_us: "1"},
                    (data) => {
                        const models = data.Models;
                        const modelsArray = []
                        for (var i = 0; i < models.length; i++) {
                            modelsArray.push(models[i].model_name);
                        }
                        this.updateDropdowns(`select[name="models"]`, modelsArray);
            });
        });
        // Listens for a model to be selected, once a change has been made for the car model dropdown
        // then a request is sent for the trims data based on the model the user chose
        document.querySelector(`select[name="models"]`).addEventListener('change', () => {
            this.userModelInput = document.querySelector(`select[name="models"]`).value;

            $.getJSON(this.base_url = `${link}?callback=?`, 
                {cmd:"getTrims", model: this.userModelInput, make: this.userMakeInput,
                    year: this.userYearInput, sold_in_us: "1"},(data) => {
                        const trims = data.Trims;
                        const trimsArray = []
                        for (var i = 0; i < trims.length; i++) {
                            trimsArray.push(trims[i].model_trim);
                        }
                        this.updateDropdowns(`select[name="trims"]`, trimsArray);
            });
        });
    }
    // place in variable list
    selectNodeChild() {

        // Rename function, comment throughout new code, targetValue is what tells program where to insert next dropdown data list
        // access being denied when trying to access data second time (for makes). That is last problem, try again another day.

        // Links to access car API data
        let link = 'https://www.carqueryapi.com/api/0.3/';
        // Pull data of years available            
        $.getJSON(this.base_url = `${link}?callback=?`, {cmd:"getYears"},(data) => {
            const years = data.Years;
            const yearsArray = [];
            // API only has min and max year, this counts out all years in between
            for (var i = Number(years.min_year); i <= years.max_year; i++) {
                yearsArray.push(i);            
            }
            this.updateDropdowns("years", yearsArray); 
            console.log("first request complete");           
        });
        console.log("Did I wait for first request?");           


        const section = document.querySelectorAll('section');
        section.forEach(() => {addEventListener('change', (e) => {
            // when console logged it logs it four times, but why?
            // there is only one target. Is the code written wrong?
            let targetValue = e.target.getAttribute("value");

            this.userYearInput = document.querySelectorAll(`select[name="years"]`)[targetValue].value;

            $.getJSON(this.base_url = `${link}?callback=?`, 
                {cmd:"getMakes", year: this.userYearInput, sold_in_us: "1"}, (data) => {
                    const makes = data.Makes;
                    const makesArray = []
                    for (var i = 0; i < makes.length; i++) {
                        makesArray.push(makes[i].make_display);
                    }
                    this.updateDropdowns(`select[name="makes${targetValue}"]`, makesArray);
                    console.log("second request complete");           
            });
            console.log("did I wait for second request?");           
            
            document.querySelector(`select[name="makes${targetValue}"]`).addEventListener('change', () => {
                this.userMakeInput = document.querySelector(`select[name="makes${targetValue}"]`).value;

                $.getJSON(this.base_url = `${link}?callback=?`, 
                    {cmd:"getModels", make: this.userMakeInput, year: this.userYearInput, sold_in_us: "1"},
                        (data) => {
                            const models = data.Models;
                            const modelsArray = []
                            for (var i = 0; i < models.length; i++) {
                                modelsArray.push(models[i].model_name);
                            }
                            this.updateDropdowns(`select[name="models${targetValue}"]`, modelsArray);
                });
            });

            document.querySelector(`select[name="models${targetValue}"]`).addEventListener('change', () => {
                this.userModelInput = document.querySelector(`select[name="models${targetValue}"]`).value;
    
                $.getJSON(this.base_url = `${link}?callback=?`, 
                    {cmd:"getTrims", model: this.userModelInput, make: this.userMakeInput,
                        year: this.userYearInput, sold_in_us: "1"},(data) => {
                            const trims = data.Trims;
                            const trimsArray = []
                            for (var i = 0; i < trims.length; i++) {
                                trimsArray.push(trims[i].model_trim);
                            }
                            this.updateDropdowns(`select[name="trims${targetValue}"]`, trimsArray);
                });
            });            
        })});
    }
}

function startup() {
    const projectController = new Controller();
}

window.onload = startup;

// GAMEPLAN
    // 1) Use event delegation in order to use functions for target section (use form.querySelector?).
    // 2) Input specs of chosen trim
    // 3) Use arrow functions to add eventlisteners to each section

    // Makes page: https://www.autoevolution.com/cars/