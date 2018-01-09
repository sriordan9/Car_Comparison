class Model {
    constructor() {
       
    }
    valueExist(spec) {                    // ---> Checks if specification data exists & if string or number
        if(spec === undefined || spec === null || spec === 'undefined' || spec === 'null') {    // ---> 1st null/undefined were strings then 
            return 'Unavailable';                                                              //  not as strings, so all versions covered
        } if(Number(spec) != spec) {      // ---> If text, leave as string
            return spec;
        } else {                          // ---> If number, change to number type
            return Number(spec);
        }
    } 
    ccToLiters (spec) {                                 // ---> Converts engine size from cc to liters
        if (Number(spec) === this.valueExist(spec)) {   // ---> If valueExists returns a number then convert
            let convertedSpec = spec / 1000;
            return convertedSpec.toFixed(1);
        } else {                                        // ---> If funct used data besides number, valueExists returns correct info 
            return this.valueExist(spec);
        }
    }
    psToHp (spec) {                                     // ---> Converts metric horsepower to imperial horsepower
        if (Number(spec) === this.valueExist(spec)) {   // ---> If valueExists returns a number then convert
            return Math.round(spec / 1.01387);
        } else {                                        // ---> If funct used data besides number, valueExists returns correct info 
            return this.valueExist(spec);
        }
    }
    nmToLbFt (spec) {                                   // ---> Converts Newton-meters to lb-ft (torque)
        if (Number(spec) === this.valueExist(spec)) {   // ---> If valueExists returns a number then convert
            return Math.round(spec / 1.3558179483314);
        } else {                                        // ---> If funct used data besides number, valueExists returns correct info 
            return this.valueExist(spec);
        }
    }
    kphToMph (spec) {                                   // ---> Converts from kilometers/hour to miles/hour
        if (Number(spec) === this.valueExist(spec)) {   // ---> If valueExists returns a number then convert
            return Math.round(spec / 1.60934);
        } else {                                        // ---> If funct used data besides number, valueExists returns correct info 
            return this.valueExist(spec);
        }
    }
    kgToLb (spec) {                                     // ---> Converts kilograms to pounds
        if (Number(spec) === this.valueExist(spec)) {   // ---> If valueExists returns a number then convert
            let convertedSpec = spec / 0.453592;
            return convertedSpec.toFixed(1);
        } else {                                        // ---> If funct used data besides number, valueExists returns correct info 
            return this.valueExist(spec);
        }
    }
    lkmToMpg (spec) {                                   // ---> Converts liters/100kilometers to miles/gal
        if (Number(spec) === this.valueExist(spec)) {   // ---> If valueExists returns a number then convert
            let convertedSpec = 235.2145833 / spec;
            return convertedSpec.toFixed(1);
        } else {                                        // ---> If funct used data besides number, valueExists returns correct info 
            return this.valueExist(spec);
        }
    }    
}

class View {
    constructor() {
        
    }
    arrayToOptions(array) {
        let valuesArray = array.map(component => `<option>${component}</option>`);  
        return `<option selected="selected" disabled="disabled">Please Select</option>
            ${valuesArray.join('')}`;                                                        
    }
}

class Controller {
    constructor() {
        this.projectModel = new Model();
        this.projectView = new View();
        this.ajaxRequest = new XMLHttpRequest();
        this.userYearInput;
        this.userMakeInput;
        this.userModelInput;   
        this.seperateListeners();
    }    
    seperateListeners() {     
        // // listener on main for any change in any dropdownData
        // // if statements to output correct action for target
        var self = this; // ***** if all these functions within seperateListeners are moved out of it, may need to change self.baseurl back to this.base
        var specsData;

        function getYears() {                                   // ---> Place years in all for year dropdowns
            let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data. ***** Place in global scope

            $.getJSON(self.base_url = `${link}?callback=?`, {cmd:"getYears"},(data) => {        // ---> Pull data of years available 
                const years = data.Years;
                const yearsArray = [];
                for (var i = Number(years.min_year); i <= years.max_year; i++) {      // ---> API has min & max year, this creates yrs between
                    yearsArray.push(i);            
                }
                document.querySelectorAll('select[name="years"]').forEach((dropdown) => {
            
                    dropdown.innerHTML = self.projectView.arrayToOptions(yearsArray);// ***** may need to change self.projectView back to this.projectView
                }); 
            });        
        }
        function getMakes(e) {                                  // ---> Pull and load make data
            let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data

            self.userYearInput = e.target.value;        // ---> Previous dropdowns relative to event target

            $.getJSON(self.base_url = `${link}?callback=?`,               // ---> Populates makes dropdown based on year from target element
                {cmd:"getMakes", year: self.userYearInput, sold_in_us: "1"},(data) => {
                    const makes = data.Makes;
                    const makesArray = []
                    for (var i = 0; i < makes.length; i++) {
                        makesArray.push(makes[i].make_display);
                    }
                    e.target.nextElementSibling.innerHTML = self.projectView.arrayToOptions(makesArray);
            }); 
    
        }
        function getModels(e) {                                 // ---> Pull and load model data
            let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data

            self.userYearInput = e.target.previousElementSibling.value; // ---> Previous dropdowns relative to event target
            self.userMakeInput = e.target.value;

            $.getJSON(self.base_url = `${link}?callback=?`, 
                    {cmd:"getModels", make: self.userMakeInput, year: self.userYearInput, sold_in_us: "1"},
                        (data) => {
                            var models = data.Models;
                            const modelsArray = []
                            for (var i = 0; i < models.length; i++) {
                                modelsArray.push(models[i].model_name);
                            }
                            e.target.parentNode.nextElementSibling.firstElementChild.innerHTML = self.projectView.arrayToOptions(modelsArray);
            });
        }
        function getTrims(e) {                                  // ---> Pull & load spec data (trim array contains both specs & trim names)
            let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data

            // ---> Previous dropdowns relative to event target
            self.userYearInput = e.target.parentNode.previousElementSibling.firstElementChild.value;
            self.userMakeInput = e.target.parentNode.previousElementSibling.lastElementChild.value;
            self.userModelInput = e.target.value;

            $.getJSON(self.base_url = `${link}?callback=?`, 
                    {cmd:"getTrims", model: self.userModelInput, make: self.userMakeInput,
                        year: self.userYearInput, sold_in_us: "1"},(data) => {
                            specsData = data.Trims;
                            const trimsArray = []
                            for (var i = 0; i < specsData.length; i++) {
                                trimsArray.push(specsData[i].model_trim);
                            }
                            e.target.nextElementSibling.innerHTML = self.projectView.arrayToOptions(trimsArray);

                            if(specsData[1] === undefined) {         // ---> Populates specs without user trim input if car has only one trim
                                getSpecs(e);
                            } return;
            });
        }
        function getSpecs(e) {      
            var targetValue = e.target.getAttribute('value');

            if(specsData[1] === undefined) {
                var optionIndex = specsData[0];
            } else {                                          // ---> trims = data.Trims (from previous event listener)
                var optionIndex = specsData[e.target.selectedIndex - 1];    
            }
            // ---> Fills out list of car specs. Checks if value to pull exists, then if value is string or number & acts accordingly
                    // (functions 'valueExist' and conversion functions do this). To find spec, look at last 3 words of template literal. 
            document.querySelector(`span[name="engine_type${targetValue}"]`).textContent = 
            `${self.projectModel.valueExist(optionIndex.model_engine_type)}`;

            document.querySelector(`span[name="cylinders${targetValue}"]`).textContent = 
            `${self.projectModel.valueExist(optionIndex.model_engine_cyl)}`;
            
            document.querySelector(`span[name="engine_size${targetValue}"]`).textContent = 
            `${self.projectModel.ccToLiters(optionIndex.model_engine_cc)} (L)`; 
            
            document.querySelector(`span[name="power${targetValue}"]`).textContent = 
            `${self.projectModel.psToHp(optionIndex.model_engine_power_ps)} (hp)`; 
            
            document.querySelector(`span[name="torque${targetValue}"]`).textContent = 
            `${self.projectModel.nmToLbFt(optionIndex.model_engine_torque_nm)} (lb-ft)`; 
            
            document.querySelector(`span[name="drive${targetValue}"]`).textContent = 
            `${self.projectModel.valueExist(optionIndex.model_drive)}`;
            
            document.querySelector(`span[name="top_speed${targetValue}"]`).textContent = 
            `${self.projectModel.kphToMph(optionIndex.model_top_speed_kph)} (mph)`; 
            
            document.querySelector(`span[name="weight${targetValue}"]`).textContent = 
            `${self.projectModel.kgToLb(optionIndex.model_weight_kg)} (lbs)`; 
            
            document.querySelector(`span[name="mpg_hwy${targetValue}"]`).textContent = 
            `${self.projectModel.lkmToMpg(optionIndex.model_lkm_hwy)}`; 
            
            document.querySelector(`span[name="mpg_city${targetValue}"]`).textContent = 
            `${self.projectModel.lkmToMpg(optionIndex.model_lkm_city)}`; 
            
            document.querySelector(`span[name="mpg_combined${targetValue}"]`).textContent = 
            `${self.projectModel.lkmToMpg(optionIndex.model_lkm_mixed)}`;

        }
        function dropdownListener() {       // ---> Event listener on <main> of index.html dropdown changes & sorts changes accordingly.
            document.querySelector('main').addEventListener('change', (e) => {

                if(e.target.getAttribute('name').includes('years')) {
                    getMakes(e);
            
                } else if(e.target.getAttribute('name').includes('makes')) {
                    getModels(e);

                } else if(e.target.getAttribute('name').includes('models')){
                    getTrims(e);

                } else {
                    getSpecs(e);
                }
    
            });
        }
        getYears();
        dropdownListener();
    } 
}

function startup() {
    const projectController = new Controller();
}

window.onload = startup;

// GAMEPLAN
    // 2) Clean up useless code
    // 3) Change car name at section top to user selection
    // 4) Display all and hide buttons for sections
    // 4.5) if first trim is just "" then display "none" for it
    // 5) If no trim available, then continue with spec output (Shelby Mustang problem),
    //   same prob for model (land rover) if no model then skip to specs
    // 6) Removal of event listener prevents it from reloading for another choice if
    //  user changes any dropdowns besides year (which adds all listeners again). Place
    // removals after chain start, but before individual sub listeners
    // 5) convert to ES5 when done
    // 6) make let, const, and var uniform throughout
    // 7) may not need all the value attributes on index.html besides for trims