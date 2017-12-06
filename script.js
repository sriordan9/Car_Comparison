// console.log("reference good");

// var input =  document.querySelector(`input[name="make"]`).value;
const startup = function(){
    function testing(){
        document.querySelector(`input[name="make"]`).addEventListener('click', function(){
            console.log('Make input clicked');
            // if(input==='chevy'){
            //     document.querySelector(`select[name="mustang"]`).innerHTML = "Camaro";
            // }
        });
        document.querySelector(`input[type="submit"]`).addEventListener('click', function(){
            console.log('submit clicked');
        });

    }

    // Array of car objects (mini local car encyclopedia)
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

    // const uppercase = function(){
    //     document.querySelector(`input[placeholder="MAKE (FULL NAME)"]`).style.textTransform = "uppercase";
    //     console.log('uppercase accessed');
    // }

    String.prototype.capitalize = function(){
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    }

    // Console logs filtered array of car makes & models matching user input
    const doneButton = function() {document.querySelector(`button[name="done-btn"]`).addEventListener('click', function (){
        console.log('done-btn clicked');
        const carMake = document.querySelector(`input[name="make"]`);
        const carModel = document.querySelector(`input[name="model"]`);

        // Pulls user make input, changes to uppercase, and console.logs result.
        // let userInputMakes = document.querySelector(`input[placeholder="MAKE (FULL NAME)"]`).value;
        let userInputMakes = carMake.value;
        userInputMakes = userInputMakes.toUpperCase();        
        console.log(userInputMakes);

        // Pulls user model input, capitalizes, and console.logs result.
        // let userInputModels = document.querySelector(`input[placeholder="MODEL"]`).value;
        let userInputModels = carModel.value;
        userInputModels = userInputModels.capitalize();
        console.log(userInputModels);

        const listInputMakes = car.filter(obj => obj.make.includes(userInputMakes));
        // console.log(listInputMakes);

        const listInputModels = listInputMakes.filter(obj => obj.model.includes(userInputModels));
        console.log(listInputModels);

        // GAMEPLAN
        // 1) Transform input into website pattern (all caps, first letter cap, etc)
        // 1.5) Clean up. Declare all variables in an object or in one section. Re-order everything using MVC
        // 2) When enter key is pressed it should have the same effect as using done button
        // 3) Console.log car info as a one-line-lists rather than array of objects
        // 4) Place one-line-list in dropdown menu of page
        // 5) specs from local car list should be entered in output fields
        
        // if(carMake.value = FORD){
        //     console.log(car[0].make);
        // } else {console.log(car[0].make);
        // }

        });
    }
    // console.log(car[0].make);
    // uppercase();
    doneButton();
}
window.onload = startup;
// window.onload = uppercase;
// window.onload = doneButton;