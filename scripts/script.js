class Model {
    constructor() {
        this.getYears;
        this.getMakes;
        this.getModels;
        this.getTrims;
        this.getSpecs;
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
    // FOR fakeDataPull FUNCTION IN CONTROLLER *START* -------->

    populate(funct) {
        if(funct)
        console.log(funct());
    }

    // FOR fakeDataPull FUNCTION IN CONTROLLER *END* -------->

    // FOR seperateListeners IN CONTROLLER *START* ---------->

    arrayToOptions(array) {
        let valuesArray = array.map(component => `<option>${component}</option>`);  
        return `<option selected="selected" disabled="disabled">Please Select</option>
            ${valuesArray.join('')}`;                                                        
    }
    
    // FOR seperateListeners IN CONTROLLER *END* ---------->


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
        // this.dataPullOne();
        // this.confirmSpecPull();   
        // this.fakeDataPull();
        this.seperateListeners();
    }
    updateDropdowns(element, dropdownData) {          // ---> Calls 2 functions of View class, wraps array components in <option>, places
        this.projectView.dropDownListApi(element, this.projectView.arrayToListApi(dropdownData));   // elements in index.html. 2 parameters: 
    }                                                                                          // selector of destination & data to be placed.
    dataPullOne() {
        let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data          
        $.getJSON(this.base_url = `${link}?callback=?`, {cmd:"getYears"},(data) => {        // ---> Pull data of years available 
            const years = data.Years;
            const yearsArray = [];
            for (var i = Number(years.min_year); i <= years.max_year; i++) {        // ---> API has min & max year, this creates yrs between
                yearsArray.push(i);            
            }
            this.updateDropdowns("years", yearsArray);
            console.log(yearsArray); 
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
                    console.log(makesArray); 
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
                            console.log(modelsArray);
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
                            console.log(trimsArray);

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

    fakeDataPull() {

        const years = [1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 
                        1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 
                        1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 
                        1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 
                        2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];

        const makes = ["Acura", "Alpina", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Buick", "Cadillac", 
                        "Chevrolet", "Chrysler", "Dodge", "Ferrari", "Ford", "GMC", "Honda", "Hummer", "Hyundai", 
                        "Infiniti", "Jaguar", "Jeep", "Kia", "Koenigsegg", "Lamborghini", "Land Rover", "Lexus", 
                        "Lincoln", "Lotus", "Maserati", "Maybach", "Mazda", "Mercedes-Benz", "Mercury", "Mini", 
                        "Mitsubishi", "Nissan", "Pagani", "Pontiac", "Porsche", "Rolls-Royce", "Saab", "Saturn", 
                        "Scion", "Smart", "SSC", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Zenvo"];

        const models = ["Crown Victoria", "E-150", "E-250", "E-350", "Edge", "Escape", "Expedition", "Explorer", 
                        "F-150", "F-250", "F-350", "F-450", "Fiesta", "Flex", "Focus", "Fusion", "Mustang", 
                        "Ranger", "Shelby GT 500", "Taurus", "Transit Connect"];

        const trims = ["GT", "GT Premium", "V6", "V6 Premium"];

        const specs = ["V1", "weight", "mpg"];

        // const trims = [ *use when trying to avoid requesting trims twice
        //     {modelTrim: "GT", engine: 'V1', weight: 100, mpg: 10},
        //     {modelTrim: "GT Premium", engine: 'V2', weight: 200, mpg: 20}, 
        //     {modelTrim: "V6", engine: 'V3', weight: 300, mpg: 30}, 
        //     {modelTrim: "V6 Premium", engine: 'V4', weight: 400, mpg: 40}
        // ];

        // const trimsData; *use when trying to avoid requesting trims twice

        function dropdownListener() {
            document.querySelector('main').addEventListener('change', (e) => {
                console.log(e.target);

                if(e.target.getAttribute('name').includes('years')) {
                    console.log(`target changed is: ${e.target}`);
                    self.projectView.populate(getMakes);
            
                } else if(e.target.getAttribute('name').includes('makes')) {
                    console.log(`target changed is: ${e.target}`);
                    self.projectView.populate(getModels);

                } else if(e.target.getAttribute('name').includes('models')){
                    console.log(`target changed is: ${e.target}`);
                    self.projectView.populate(getTrims);
                } else {
                    console.log(`target changed is: ${e.target}`);
                    self.projectView.populate(getSpecs);
                }
    
            });
        }

        var self = this;
        function getYears() {
            // JSON portion yata yata
            const yearArray = [...years];

        }

        function getMakes() {

            const makesArray = [...makes];
            return makesArray

        }

        function getModels() {
            const modelsArray = [...models];
            return modelsArray;
        }

        function getTrims() {
            // trimsData = [...trims.modelTrim]; *use when trying to avoid requesting trims twice
            const trimsArray = [...trims];
            return trimsArray;
        }

        function getSpecs() {
            const specsArray = [...specs];
            return specsArray;
        }


        getYears();
        // getMakes();
        // getModels();
        // getTrims();
        dropdownListener();
    }

    seperateListeners() {
        // place years in all for year dropdowns
       
        // // listener on main for any change in any dropdownData
        // // if statements to output currect action for target
        var self = this; // if all these functions within seperateListeners are moved out of it, may need to change self.baseurl back to this.base
        var specsData;

        function getYears() {
            let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data. ***** Place in global scope

            $.getJSON(self.base_url = `${link}?callback=?`, {cmd:"getYears"},(data) => {        // ---> Pull data of years available 
                const years = data.Years;
                const yearsArray = [];
                for (var i = Number(years.min_year); i <= years.max_year; i++) {        // ---> API has min & max year, this creates yrs between
                    yearsArray.push(i);            
                }
                document.querySelectorAll('select[name="years"]').forEach((dropdown) => {
            
                    dropdown.innerHTML = self.projectView.arrayToOptions(yearsArray);// may need to change self.projectView back to this.projectView
                }); 
            });        
        }

        function getMakes(e) {
            let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data

            self.userYearInput = e.target.value;

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
    
        function getModels(e) {
            let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data

            self.userYearInput = e.target.previousElementSibling.value;
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
    
        function getTrims(e) {
            // trimsData = [...trims.modelTrim]; *use when trying to avoid requesting trims twice
            let link = 'https://www.carqueryapi.com/api/0.3/';      // ---> Base URL for car API data

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

                            if(specsData[1] === undefined) {            // ---> Populates specs without user trim input if car has only one trim
                                getSpecs(e);
                            } return;
            });
        }
    
       
        function getSpecs(e) {      // ***** Can populateSpecs be placed elsewhere with other functions? Also, take comments from functions previous location
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
        
        function dropdownListener() {
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
    // 5) If no trim available, then continue with spec output (Shelby Mustang problem)
    // 6) Removal of event listener prevents it from reloading for another choice if
    //  user changes any dropdowns besides year (which adds all listeners again). Place
    // removals after chain start, but before individual sub listeners
    // 5) convert to ES5 when done