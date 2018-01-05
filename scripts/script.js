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
    arrayToListApi(array) {                                                 // ---> Changes arrays into simple list of html options for API
        let valuesArray = array.map(component => `<option>${component}</option>`);  // ---> WARNING: if array is reversed to list recent yrs  
        return `<option selected="selected" disabled="disabled">Please Select</option>
            ${valuesArray.join('')}`;                                      // 1st then .selectedIndex value of trim options will be wrong. 
    }                                                                      // Index value used to select corresponding obj in Trim array. 
    dropDownListApi(element, optionList) {                      // ---> Updates UI with dropdown options
        if(element === "years") {                               // ---> Populate all year dropdowns
            const section = document.getElementsByName(element);
            for (var i = 0; i < section.length; i++) {
                section[i].innerHTML = optionList;                
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
        this.ajaxRequest = new XMLHttpRequest();
        this.updateDropdowns;
        this.userYearInput;
        this.userMakeInput;
        this.userModelInput;
        this.userTrimInput;
        this.finalDraftDataPull();
        // this.confirmSpecPull();   
    }
    updateDropdowns(element, dropdownData) {          // ---> Calls 2 functions of View class, wraps array components in <option>, places
        this.projectView.dropDownListApi(element, this.projectView.arrayToListApi(dropdownData));   // elements in index.html. 2 parameters: 
    }                                                                                          // selector of destination & data to be placed.
    finalDraftDataPull() {
        let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data          
        $.getJSON(this.base_url = `${link}?callback=?`, {cmd:"getYears"},(data) => {        // ---> Pull data of years available 
            const years = data.Years;
            const yearsArray = [];
            for (var i = Number(years.min_year); i <= years.max_year; i++) {        // ---> API has min & max year, this creates yrs between
                yearsArray.push(i);            
            }
            this.updateDropdowns("years", yearsArray); 
        });        
        var self = this;
        function dropdownListeners(e) {     // ---> Listener that starts chain of listeners. As dropdown changes, next dropdown populates
            
            function populateSpecs() {      // ***** Can populateSpecs be placed elsewhere with other functions? Also, take comments from functions previous location
                if(trims[1] === undefined) {
                    var optionIndex = trims[0];
                } else {                                          // ---> trims = data.Trims (from previous event listener)
                    var optionIndex = trims[document.querySelector(`select[name="trims${targetValue}"]`).selectedIndex - 1];    
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

                // ---> Removes any additional listeners that were created
                document.querySelector(`select[name="trims${targetValue}"]`).removeEventListener('change', populateSpecs);  
            }
            let trims; // ***** List this and next variable at top of constructor
            // ---> Value of "value" attribute on target. Keeps dropdown population in correct section.
            let targetValue = e.target.getAttribute("value");   

            self.userYearInput = document.querySelectorAll(`select[name="years"]`)[targetValue].value;       

            $.getJSON(this.base_url = `${link}?callback=?`,               // ---> Populates makes dropdown based on year from target element
                {cmd:"getMakes", year: self.userYearInput, sold_in_us: "1"},(data) => {
                    const makes = data.Makes;
                    const makesArray = []
                    for (var i = 0; i < makes.length; i++) {
                        makesArray.push(makes[i].make_display);
                    }
                    self.updateDropdowns(`select[name="makes${targetValue}"]`, makesArray)          
            });           
            // ---> Listener for makes dropdown, populateModels used instead of arrow function to call event remover for any extras
            document.querySelector(`select[name="makes${targetValue}"]`).addEventListener('change', function populateModels() {     
                self.userMakeInput = document.querySelector(`select[name="makes${targetValue}"]`).value;                         

                $.getJSON(self.base_url = `${link}?callback=?`, 
                    {cmd:"getModels", make: self.userMakeInput, year: self.userYearInput, sold_in_us: "1"},
                        (data) => {
                            const models = data.Models;
                            const modelsArray = []
                            for (var i = 0; i < models.length; i++) {
                                modelsArray.push(models[i].model_name);
                            }
                            self.updateDropdowns(`select[name="models${targetValue}"]`, modelsArray);       // ---> Populates model dropdown
                });
                // ---> Removes any additional listeners that were created
                document.querySelector(`select[name="makes${targetValue}"]`).removeEventListener('change', populateModels);
            });
            // ---> Listener for models dropdown, populateTrims used instead of arrow function to call event remover for any extras 
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
                            
                            self.updateDropdowns(`select[name="trims${targetValue}"]`, trimsArray);         // ---> Populates trims dropdown

                            if(trims[1] === undefined) {            // ---> Populates specs without user trim input if car has only one trim
                                populateSpecs();
                            } return;
                });
                // ---> Removes any additional listeners that were created
                document.querySelector(`select[name="models${targetValue}"]`).removeEventListener('change', populateTrims);         
            }); 
            // *****Listener for trim dropdown. Finds index of selected option. 1 is subtracted
                // into index value to compensate for false first option "please select". Resulting value used to 
                // select correct specific model object within the Trim array. 
            document.querySelector(`select[name="trims${targetValue}"]`).addEventListener('change', populateSpecs); 
        };
        // ---> Year dropdown listeners. Calls initial listener to begin listener chain.
        document.querySelector(`select[value="0"]`).addEventListener('change', dropdownListeners.bind(event));  
        document.querySelector(`select[value="1"]`).addEventListener('change', dropdownListeners.bind(event));
        document.querySelector(`select[value="2"]`).addEventListener('change', dropdownListeners.bind(event));
        document.querySelector(`select[value="3"]`).addEventListener('change', dropdownListeners.bind(event));
    }
    // // USE FOR TESTING SPEC PULLING
    confirmSpecPull() {
        document.querySelector('select[name="trims0"]').addEventListener('click', function populateSpecs() {
            // self.userModelInput = document.querySelector(`select[name="models${targetValue}"]`).value;

            $.getJSON(this.base_url = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&model=mustang&make=ford&year=2004&sold_in_us=1',
            (data) => {
                const trims = data.Trims;
                const trimsArray = [];
                for (var i = 0; i < trims.length; i++) {
                    trimsArray.push(trims[i]);
                }
                // Populates trims dropdown
                // self.updateDropdowns(`select[name="trims${targetValue}"]`, trimsArray);
                console.log(trimsArray);

                // if(trims[0].model_trim === '') {
                //     console.log('only one model');
                // }
                if(trims[1] === undefined) {
                    console.log('only one model');
                }
                console.log(trims[1]);
                // console.log(document.querySelector(`select[name="models${targetValue}"]`).selectedIndex); Used just to test .selectedIndex
                // document.querySelector(`select[name="models${targetValue}"]`).removeEventListener('change', populateTrims);
            }
        )});
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
    // 5) If no trim available, then continue with spec output (Shelby Mustang problem)
    // 6) Removal of event listener prevents it from reloading for another choice if
    //  user changes any dropdowns besides year (which adds all listeners again). Place
    // removals after chain start, but before individual sub listeners