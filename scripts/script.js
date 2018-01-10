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
    updateSectionHeader(e) {
        let chosenModel = e.target.value;
        e.target.parentNode.parentNode.previousElementSibling.textContent = chosenModel;
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
        this.link = 'https://www.carqueryapi.com/api/0.3/'; // Base URL for API data  
        this.getYears();
        this.getMakes;
        this.getModels;
        this.getTrims;
        this.specsData;
        this.getSpecs;
        this.dropdownListener();
    }    
    getYears() {                                   // ---> Place years in all for year dropdowns.

        $.getJSON(this.base_url = `${this.link}?callback=?`, {cmd:"getYears"},(data) => {        // ---> Pull data of years available 
            const years = data.Years;
            const yearsArray = [];
            for (var i = Number(years.min_year); i <= years.max_year; i++) {      // ---> API has min & max year, this creates yrs between
                yearsArray.push(i);            
            }
            document.querySelectorAll('select[name="years"]').forEach((dropdown) => {
        
                dropdown.innerHTML = this.projectView.arrayToOptions(yearsArray);
            }); 
        });        
    }
    getMakes(e) {                                  // ---> Pull and load make data

        this.userYearInput = e.target.value;        // ---> Previous dropdowns relative to event target

        $.getJSON(this.base_url = `${this.link}?callback=?`,               // ---> Populates makes dropdown based on year from target element
            {cmd:"getMakes", year: this.userYearInput, sold_in_us: "1"},(data) => {
                const makes = data.Makes;
                const makesArray = []
                for (var i = 0; i < makes.length; i++) {
                    makesArray.push(makes[i].make_display);
                }
                e.target.nextElementSibling.innerHTML = this.projectView.arrayToOptions(makesArray);
        }); 
    }
    getModels(e) {                                 // ---> Pull and load model data
        
        this.userYearInput = e.target.previousElementSibling.value; // ---> Previous dropdowns relative to event target
        this.userMakeInput = e.target.value;

        $.getJSON(this.base_url = `${this.link}?callback=?`, 
                {cmd:"getModels", make: this.userMakeInput, year: this.userYearInput, sold_in_us: "1"},
                    (data) => {
                        var models = data.Models;
                        const modelsArray = []
                        for (var i = 0; i < models.length; i++) {
                            modelsArray.push(models[i].model_name);
                        }
                        e.target.parentNode.nextElementSibling.firstElementChild.innerHTML = this.projectView.arrayToOptions(modelsArray);
        });
    }
    getTrims(e) {                                  // ---> Pull & load spec data (trim array contains both specs & trim names)
        // ---> Previous dropdowns relative to event target
        this.userYearInput = e.target.parentNode.previousElementSibling.firstElementChild.value;
        this.userMakeInput = e.target.parentNode.previousElementSibling.lastElementChild.value;
        this.userModelInput = e.target.value;

        $.getJSON(this.base_url = `${this.link}?callback=?`, 
                {cmd:"getTrims", model: this.userModelInput, make: this.userMakeInput,
                    year: this.userYearInput, sold_in_us: "1"},(data) => {
                        this.specsData = data.Trims;
                        const trimsArray = []
                        for (var i = 0; i < this.specsData.length; i++) {
                            trimsArray.push(this.specsData[i].model_trim);
                        }
                        e.target.nextElementSibling.innerHTML = this.projectView.arrayToOptions(trimsArray);

                        if(this.specsData[1] === undefined) {         // ---> Populates specs without user trim input if car has only one trim
                            this.getSpecs(e);
                        } return;
        });
    }
    getSpecs(e) {      
        var targetValue = e.target.getAttribute('value');

        if(this.specsData[1] === undefined) {
            var optionIndex = this.specsData[0];
        } else {                                          // ---> trims = data.Trims (from previous event listener)
            var optionIndex = this.specsData[e.target.selectedIndex - 1];    
        }
        // ---> Fills out list of car specs. Checks if value to pull exists, then if value is string or number & acts accordingly
                // (functions 'valueExist' and conversion functions do this). To find spec, look at last 3 words of template literal. 
        document.querySelector(`span[name="engine_type${targetValue}"]`).textContent = 
        `${this.projectModel.valueExist(optionIndex.model_engine_type)}`;

        document.querySelector(`span[name="cylinders${targetValue}"]`).textContent = 
        `${this.projectModel.valueExist(optionIndex.model_engine_cyl)}`;
        
        document.querySelector(`span[name="engine_size${targetValue}"]`).textContent = 
        `${this.projectModel.ccToLiters(optionIndex.model_engine_cc)} (L)`; 
        
        document.querySelector(`span[name="power${targetValue}"]`).textContent = 
        `${this.projectModel.psToHp(optionIndex.model_engine_power_ps)} (hp)`; 
        
        document.querySelector(`span[name="torque${targetValue}"]`).textContent = 
        `${this.projectModel.nmToLbFt(optionIndex.model_engine_torque_nm)} (lb-ft)`; 
        
        document.querySelector(`span[name="drive${targetValue}"]`).textContent = 
        `${this.projectModel.valueExist(optionIndex.model_drive)}`;
        
        document.querySelector(`span[name="top_speed${targetValue}"]`).textContent = 
        `${this.projectModel.kphToMph(optionIndex.model_top_speed_kph)} (mph)`; 
        
        document.querySelector(`span[name="weight${targetValue}"]`).textContent = 
        `${this.projectModel.kgToLb(optionIndex.model_weight_kg)} (lbs)`; 
        
        document.querySelector(`span[name="mpg_hwy${targetValue}"]`).textContent = 
        `${this.projectModel.lkmToMpg(optionIndex.model_lkm_hwy)}`; 
        
        document.querySelector(`span[name="mpg_city${targetValue}"]`).textContent = 
        `${this.projectModel.lkmToMpg(optionIndex.model_lkm_city)}`; 
        
        document.querySelector(`span[name="mpg_combined${targetValue}"]`).textContent = 
        `${this.projectModel.lkmToMpg(optionIndex.model_lkm_mixed)}`;
    }
    dropdownListener() {       // ---> Event listener on <main> of index.html dropdown changes & sorts changes accordingly.
        document.querySelector('main').addEventListener('change', (e) => {

            if(e.target.getAttribute('name').includes('years')) {
                this.getMakes(e);
        
            } else if(e.target.getAttribute('name').includes('makes')) {
                this.getModels(e);

            } else if(e.target.getAttribute('name').includes('models')){
                this.projectView.updateSectionHeader(e);
                this.getTrims(e);

            } else {
                this.getSpecs(e);
            }
        });
    }     
}

function startup() {
    const projectController = new Controller();
}

window.onload = startup;

// GAMEPLAN
    // 1) Display all and hide buttons for sections
    // 2) if first trim is just "" then display "none" for it
    // 3) If no trim available, then continue with spec output (Shelby Mustang problem),
    //   same prob for model (land rover) if no model then skip to specs
    // 4) convert to ES5 when done
    // 5) make let, const, and var uniform throughout
    // 6) may not need all the value attributes on index.html besides for trims
    // 7) if user changes all dropdowns then changes year, only makes clears to "please select"
    //   need to clear others too 
