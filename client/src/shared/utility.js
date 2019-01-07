import _ from 'lodash';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const checkValidity = ( value, rules ) => {
    let isValid = true;
    if ( !rules ) {
        return true;
    }

    if ( rules.required ) {
        isValid = value.trim() !== '' && isValid;
    }

    if ( rules.minLength ) {
        isValid = value.length >= rules.minLength && isValid
    }

    if ( rules.maxLength ) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if ( rules.isEmail ) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test( value ) && isValid
    }

    if ( rules.isNumeric ) {
        const pattern = /^\d+$/;
        isValid = pattern.test( value ) && isValid
    }

    return isValid;
}

export const removeZerosFromEndOfNumber = (number) => {
    if(number.includes('.')){
        while (number.charAt(number.length -1) === "0")
        {
            number = number.substring(0,number.length -1);
        }
        
        if (number.charAt(number.length -1)== ".")
        number = number.substring(0,number.length -1);
    }
    return number;
}
 
export const checkUrl = suspect => isURL ? null : "Not a valid URL";

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

export const customFixed = (num, fixed) => {
    num = noExponents(num);
    if((num % 1) === 0) return num;
    num = String(num);
    fixed = fixed+1;
    if(num.length < 3) return num
    let fixed_num = "";
    let counter = 0;
    for (let i = 0; i < num.length; i++) {
      fixed_num = fixed_num + num[i];
      if(num[i] === "."  || counter > 0){
          counter++
          if(counter === fixed){
            return fixed_num
          }
        }
      }
      return fixed_num
   }
  
   
  
  export function noExponents(num){
      var data= String(num).split(/[eE]/);
      if(data.length== 1) return data[0]; 
  
      var  z= '', sign= num<0? '-':'',
      str= data[0].replace('.', ''),
      mag= Number(data[1])+ 1;
  
      if(mag<0){
          z= sign + '0.';
          while(mag++) z += '0';
          return z + str.replace(/^\-/,'');
      }
      mag -= str.length;  
      while(mag--) z += '0';
      return str + z;
  }

export const getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    //console.log('Query variable %s not found', variable);
}

export const orderBy = (array, keys, sortBy) => {
    return _.orderBy(array, keys, sortBy);
}

