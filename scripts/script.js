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
    // WARNING: if the array is reversed for years to be listed recent first, then
    // .selectedIndex value of trim options will be wrong. The index value is used 
    // to select corresponding object within Trim array from car API. 
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
                // console.log(section[i]);
                
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
        // this.doneButton(); Delete, from old first section setup, or use code for search button
        this.enterKey();
        this.ajaxRequest = new XMLHttpRequest();
        this.updateDropdowns;
        this.userYearInput;
        this.userMakeInput;
        this.userModelInput;
        this.userTrimInput;
        // this.dataArrays();
        // this.dataArraysFunction();
        this.finalDraftDataPull();
        
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

    dataArraysFunction() {
        let data = {
            Years: [1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953,
                    1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 
                    1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 
                    1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 
                    1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 
                    2014, 2015, 2016, 2017, 2018],

            Makes: ["Acura", "Audi", "Bentley", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
                "Dodge", "Fiat", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", 
                "Lamborghini", "Lexus", "Lincoln", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", 
                "Mitsubishi", "Nissan", "Porsche", "Rolls-Royce", "Scion", "Smart", "Subaru", "Toyota", 
                "Volkswagen", "Volvo"],

            Models: ["C-Max Energi", "C-Max Hybrid", "Edge", "Escape", "Expedition", "Explorer", 
                "F-150", "F-250 Super Duty", "F-350 Super Duty", "F-450 Super Duty", "Fiesta", "Flex", 
                "Focus", "Focus ST", "Fusion", "Fusion Energi", "Fusion Hybrid", "Mustang", "Taurus", 
                "Transit Connect", "Transit Van", "Transit Wagon"],

            Trims: ["EcoBoost 2dr Coupe (2.3L 4cyl Turbo 6M)", 
                "EcoBoost Premium 2dr Convertible (2.3L 4cyl Turbo 6M)", 
                "EcoBoost Premium 2dr Coupe (2.3L 4cyl Turbo 6M)", "GT 2dr Coupe (5.0L 8cyl 6M)", 
                "GT 50 Years Limited Edition 2dr Coupe (5.0L 8cyl 6M)", 
                "GT Premium 2dr Convertible (5.0L 8cyl 6M)", "GT Premium 2dr Coupe (5.0L 8cyl 6M)", 
                "V6 2dr Convertible (3.7L 6cyl 6M)", "V6 2dr Coupe (3.7L 6cyl 6M)"]
        };
        
        // Pull data of years available            
        // $.getJSON(this.base_url = `${link}?callback=?`, {cmd:"getYears"},(data) => {
        // YEARS START------------------------>           
        const years = data.Years;
        const yearsArray = [];
        for (var i = 0; i < years.length; i++) {
            yearsArray.push(years[i]); 
        }
        // Create list of elements from array and places in years dropdown
        this.updateDropdowns("years", yearsArray); 
        // YEARS END ------------------------->    
        // Event listener that starts the chain of other listeners. Once a dropdown 
        // is changed to a value it populates the next dropdown.
        let self = this;
        function dropdownListeners(e) {
            // Find value of "value" attribute on the target element. This allows dropdown population
            // to stay within respective car comparison section.
            let targetValue = e.target.getAttribute("value");
            this.userYearInput = document.querySelectorAll(`select[name="years"]`)[targetValue].value;
            // MAKES START ----------------------->
            // Populates makes dropdown based on year found from target element
            // $.getJSON(this.base_url = `${link}?callback=?`, 
            const makes = data.Makes;
            const makesArray = [];
            for (var i = 0; i < makes.length; i++) {
                makesArray.push(makes[i]);
            }
            self.updateDropdowns(`select[name="makes${targetValue}"]`, makesArray);
            console.log(makesArray); 
            // MAKES END -----------------------> 
            // MODEL START --------------------->                   
            // Event listener for makes dropdown. Function populateModels used instead of arrow function
            // in order to call it at end of listener. This removes extra listeners that were placed on element 
            // each time parent function dropdownListeners was called. 
            document.querySelector(`select[name="makes${targetValue}"]`).addEventListener('change', function populateModels() {
                self.userMakeInput = document.querySelector(`select[name="makes${targetValue}"]`).value;
                // $.getJSON(this.base_url = `${link}?callback=?`, 
                const models = data.Models;
                const modelsArray = [];
                for (var i = 0; i < models.length; i++) {
                    modelsArray.push(models[i]);
                }
                // Populates model dropdown
                self.updateDropdowns(`select[name="models${targetValue}"]`, modelsArray);
                console.log(modelsArray);
                document.querySelector(`select[name="makes${targetValue}"]`).removeEventListener('change', populateModels);
            });
            // MODEL END --------------------->
            // TRIM START -------------------->
            // Listener for a model to be selected. Function populateTrims used instead of arrow function
            // in order to call it at end of listener. This removes extra listeners that were placed on element 
            // each time parent function dropdownListeners was called. 
            document.querySelector(`select[name="models${targetValue}"]`).addEventListener('change', function populateTrims() {
                self.userModelInput = document.querySelector(`select[name="models${targetValue}"]`).value;
    
                // $.getJSON(this.base_url = `${link}?callback=?`, 
                const trims = data.Trims;
                const trimsArray = [];
                for (var i = 0; i < trims.length; i++) {
                    trimsArray.push(trims[i]);
                }
                // Populates trims dropdown
                self.updateDropdowns(`select[name="trims${targetValue}"]`, trimsArray);
                console.log(trimsArray);
                // console.log(document.querySelector(`select[name="models${targetValue}"]`).selectedIndex); Used just to test .selectedIndex
                document.querySelector(`select[name="models${targetValue}"]`).removeEventListener('change', populateTrims);
                
            });// TRIM END -------------------->     
        }; //)});
        // Listeners for each of the years dropdown elements. Calls the initial listener to begin the
        // event listener chain.
        document.querySelector(`select[value="0"]`).addEventListener('change', dropdownListeners.bind(event));
        document.querySelector(`select[value="1"]`).addEventListener('change', dropdownListeners.bind(event));
        document.querySelector(`select[value="2"]`).addEventListener('change', dropdownListeners.bind(event));
        document.querySelector(`select[value="3"]`).addEventListener('change', dropdownListeners.bind(event));
    }

    finalDraftDataPull() {
        // Links to access car API data
        let link = 'https://www.carqueryapi.com/api/0.3/';
        // Pull data of years available 
        // YEARS START------------------------>           
        $.getJSON(this.base_url = `${link}?callback=?`, {cmd:"getYears"},(data) => {
            const years = data.Years;
            const yearsArray = [];
            // API only has min and max year, this counts out all years in between
            for (var i = Number(years.min_year); i <= years.max_year; i++) {
                yearsArray.push(i);            
            }
            this.updateDropdowns("years", yearsArray); 
            console.log(yearsArray);
        });        
        // YEARS END ------------------------->
        // Event listener that starts the chain of other listeners. Once a dropdown 
        // is changed to a value it populates the next dropdown.
        var self = this;
        function dropdownListeners(e) {
            // Find value of "value" attribute on the target element. This allows dropdown population
            // to stay within respective car comparison section.
            let trims; // list this and next variable at top of constructor
            let targetValue = e.target.getAttribute("value");
            self.userYearInput = document.querySelectorAll(`select[name="years"]`)[targetValue].value;
            console.log(self.userYearInput);
            // MAKES START ----------------------->
            // Populates makes dropdown based on year found from target element
            $.getJSON(this.base_url = `${link}?callback=?`, 
                {cmd:"getMakes", year: this.userYearInput, sold_in_us: "1"},(data) => {
                    const makes = data.Makes;
                    const makesArray = []
                    for (var i = 0; i < makes.length; i++) {
                        makesArray.push(makes[i].make_display);
                    }
                    self.updateDropdowns(`select[name="makes${targetValue}"]`, makesArray)
                    console.log(makesArray);          
            });           
            // MAKES END ----------------------->
            // MODEL START --------------------->
            // Event listener for makes dropdown. Function populateModels used instead of arrow function
            // in order to call it at end of listener. This removes extra listeners that were placed on element 
            // each time parent function dropdownListeners was called. 
            document.querySelector(`select[name="makes${targetValue}"]`).addEventListener('change', function populateModels() {
                self.userMakeInput = document.querySelector(`select[name="makes${targetValue}"]`).value;
                console.log(self.userMakeInput);
                console.log(self.userYearInput);
                

                $.getJSON(self.base_url = `${link}?callback=?`, 
                    {cmd:"getModels", make: self.userMakeInput, year: self.userYearInput, sold_in_us: "1"},
                        (data) => {
                            const models = data.Models;
                            const modelsArray = []
                            for (var i = 0; i < models.length; i++) {
                                modelsArray.push(models[i].model_name);
                            }
                            // Populates model dropdown
                            self.updateDropdowns(`select[name="models${targetValue}"]`, modelsArray);
                            console.log(modelsArray); 
                });
                document.querySelector(`select[name="makes${targetValue}"]`).removeEventListener('change', populateModels);
            });
            // MODEL END --------------------->
            // TRIM START -------------------->
            // Listener for a model to be selected. Function populateTrims used instead of arrow function
            // in order to call it at end of listener. This removes extra listeners that were placed on element 
            // each time parent function dropdownListeners was called. 
            document.querySelector(`select[name="models${targetValue}"]`).addEventListener('change', function populateTrims() {
                self.userModelInput = document.querySelector(`select[name="models${targetValue}"]`).value;
    
                $.getJSON(self.base_url = `${link}?callback=?`, 
                    {cmd:"getTrims", model: self.userModelInput, make: self.userMakeInput,
                        year: self.userYearInput, sold_in_us: "1"},(data) => {
                            trims = data.Trims;
                            const trimsArray = []
                            for (var i = 0; i < trims.length; i++) {
                                trimsArray.push(trims[i].model_trim);
                            }
                            // Populates trims dropdown
                            self.updateDropdowns(`select[name="trims${targetValue}"]`, trimsArray);
                            console.log(trimsArray);
                });
                document.querySelector(`select[name="models${targetValue}"]`).removeEventListener('change', populateTrims);
            }); // TRIM END -------------------->
            // Listener for trim dropdown to change, then finds index of listed option elements in dropdown. 1 is subtracted
            // into the index value to compensate for false first option of "please select". The resulting value is used to 
            // select the correct specific model object within the Trim array. 
            document.querySelector(`select[name="trims${targetValue}"]`).addEventListener('change', function populateSpecs() {
                // trims = data.Trims (from previous event listener)
                let optionIndex = trims[document.querySelector(`select[name="trims${targetValue}"]`).selectedIndex - 1];
                // Fills out list of car specs
                document.querySelector(`span[name="drive${targetValue}"]`).textContent = `${optionIndex.model_drive}`; 
                document.querySelector(`span[name="engine_type${targetValue}"]`).textContent = `${optionIndex.model_engine_type}`; 
                document.querySelector(`span[name="fuel_type${targetValue}"]`).textContent = `${optionIndex.model_engine_fuel}`; 

                document.querySelector(`select[name="trims${targetValue}"]`).removeEventListener('change', populateSpecs);               
            }); 
        };
        // Listeners for each of the years dropdown elements. Calls the initial listener to begin the
        // event listener chain.
        document.querySelector(`select[value="0"]`).addEventListener('change', dropdownListeners.bind(event));
        document.querySelector(`select[value="1"]`).addEventListener('change', dropdownListeners.bind(event));
        document.querySelector(`select[value="2"]`).addEventListener('change', dropdownListeners.bind(event));
        document.querySelector(`select[value="3"]`).addEventListener('change', dropdownListeners.bind(event));
    }
}

function startup() {
    const projectController = new Controller();
}

window.onload = startup;

// GAMEPLAN
    // 1) Finish spec output and make alphabetical
    // 2) Clean up useless code
    // 3) Change car name at section top to user selection
    // 4) Display all and hide buttons for sections