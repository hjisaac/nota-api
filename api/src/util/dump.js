/**
 * 
 * @param {*} v [variable to dump]
 * @param {String} name [name to do some prepend]
 * @param {String} spacing [spacing to do some padding]
 * @returns 
 */


 const dump = (v, name, spacing="") => {
	let n; 
  	// if we've been given a name, append a ": "
  	name = name ? name + ": " : "";
  	// figure out the type, fixes for `null` and `array`
  	let type = typeof v;
  	if(type == 'object') {
		  if(v === null) {
			  type = 'null';
		  } else if(Object.prototype.toString.call(v) === '[object Array]') {
			  type = 'array';
		  } else if(Object.prototype.toString.call(v) === '[object Object]') {
			  ;
		  } 
		  // may be other options
  	}

  	switch(type) {
		  case 'number':
		  case 'string':
		  case 'boolean':
		  case 'null':
		  case 'undefined':
			  console.log(spacing + name + `(${type})` + " " + v);
			  break;
		  case 'object':
			  console.log(spacing + name + `(${type})` + " {");
			  for(n in v) {
				  dump(v[n], n, (spacing+"  "));
			  }
			  console.log(spacing + "}");
			  break;
		  case 'array':
			  console.log(spacing + name + `(${type})` + " [");
			  for(n in v) {
				  dump(v[n], n, (spacing+"  "));
			  }
			  console.log(spacing + "]");
			  break;
		  default:
			  console.log(`${v} can not be dumped`);
			  break;
  	}
};	

module.exports = dump;
