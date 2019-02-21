import resource from './resource';

var helper = (function() {
    function load(){
        return resource
    }
    function save(data){
        console.log(data)
    }
    
return {
        load: load,
        save: save
    };
}());