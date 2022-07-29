/* Read content from file*/
function read_from_file(filename) {
	try {
		// Read the file and returns contents.
		let fs = require('fs');
		let content_str =  fs.readFileSync(filename, 'utf8') 
		return content_str
	}
	catch(err) {
		console.log("File with this name does not exist")
		process.exit(0);
	}
}

function test()
{
	let gl_str = read_from_file("golden.txt")
	let gold_str = gl_str.replace("\n", "");
	let opt_str = read_from_file("output.txt")
	let output_str = opt_str.replace("\n", "");
	let gold_arr = gold_str.split(" ")
	let output_arr = output_str.split(" ")
	output_arr.slice(gold_arr.length - 1, 1)
	if(output_arr.length != gold_arr.length) {
		console.log("number of tesing targets' not matching\n")
		process.exit(0)
	}
	let result_str = "golden         output\n\n"
	for(let i = 0; i < gold_arr.length; i++) {
		tmp_str = gold_arr[i] + "    " + output_arr[i]
		if(gold_arr[i] == output_arr[i]) {
			tmp_str += "    passed\n"
		} else {
			tmp_str += "    failed\n"
		}
		result_str += tmp_str
	}
	return result_str
}

function generate_file(content_str, filename)
{
	const fs = require('fs')
	fs.writeFile(filename, content_str, (err) => {
		if (err) throw err;
	})
}

function main()
{
	let result_str = test()
	generate_file(result_str, "result.txt")
}

main()
