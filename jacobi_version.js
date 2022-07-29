class Matrix {
	constructor(arg_raw_matrix) {
		this.raw_matrix = arg_raw_matrix;
	}
	get_matrix() {
		return this.raw_matrix;
	}
}


/* get command line argument (file's name)*/
function get_cmd_arg() {
	if (process.argv.length < 3) {
		console.log('Usage: node ' + process.argv[1] + ' input.txt')
		process.exit(1);
	}
	// return the file's name input from command line.
	filename = process.argv[2];
	return filename
}

/* Read content from file*/
function read_from_file(filename) {
	try {
		// Read the file and returns contents.
		let fs = require('fs');
		let matrix_str =  fs.readFileSync(filename, 'utf8') 
		return matrix_str
	}
	catch(err) {
		console.log("File with this name does not exist")
		process.exit(0);
	}
}

function define_raw_matrix(matrix_str) 
{
	let lines_arr = matrix_str.split("\n")
	lines_arr.pop()
	let row_numb = lines_arr.length
	let i = 0
	let raw_matrix = []
	let prev_length = lines_arr[0].split(" ").length
	while(i < row_numb) {
		let tmp_row = lines_arr[i].split(" ")
		let current_length = tmp_row.length
		const zeros = tmp_row.filter((elem) => {return elem == "0"})
		zeros_numb = zeros.length
		if(zeros_numb == row_numb) {
			continue
		} else if(current_length != prev_length || zeros_numb == current_length - 1) {
			console.log("Invalid matrix or other content is in input file\n")
			process.exit(0)
		}
		var num_array = tmp_row.map(Number);
		raw_matrix.push(num_array)
		prev_length = current_length
		i += 1
	}
	return raw_matrix
}

function is_Jacobi_method_appliable(A)
{
	if(A[0].length != A.length + 1) {
		return true
	}
	for(let i = 0; i < A.length; i++) {
		let cur_row = A[i]
		let abs_arr = (cur_row) => {return cur_row.map(Math.abs);}
		let abs_num = (accumulator, curr) => accumulator + curr
		abs_num = abs_num - abs_arr[i] - abs_arr[abs_arr.length - 1]
		if(abs_num > abs_arr[i]){
			return true
		}
	}
	return false
}

function get_Jacobi_matrix(A)
{
	let B = A
	for(let i = 0; i < B.length; i++)
	{
		let x_i = B[i][i]
		B[i].splice(i, 1)
		for(let j = 0; j < B[i].length; j++) {
			B[i][j] /= -x_i
		}
		B[i][B[i].length - 1] /= x_i
	}
	return B
}

function get_X_N_t_next(B, X_N_t)
{
	let new_X_N_t = []
	let tmp_arr = X_N_t
	for(let i = 0; i < B.length; i++) {
		tmp_arr = X_N_t
		new_X_N_t.push(0)
		tmp_arr.splice(i, 1)
		for(let j = 0; j < tmp_arr.length; j++){
			new_X_N_t[i] += tmp_arr[j]*B[i][j]
		}
		new_X_N_t[i] += B[i][B.length - 1]
	}
	return new_X_N_t
}

function should_iteration_go_on(X_N_t, X_N_t_NEXT, aprox = 0.0001)
{
	for(let i = 0; i < X_N_t.length; i++) {
		if(Math.abs(Math.abs(X_N_t_NEXT[i]) - Math.abs(X_N_t[i])) > aprox) {
			return true
		}
	}
	return false
}

function iterate_Jacobi(B, X_N_t)
{
	let X_N_t_NEXT = get_X_N_t_next(B, X_N_t)
	while(should_iteration_go_on(X_N_t, X_N_t_NEXT)) {
		let tmp_arr = X_N_t_NEXT.slice()
		X_N_t_NEXT = get_X_N_t_next(B, X_N_t_NEXT)
		X_N_t = tmp_arr
	}
	return X_N_t_NEXT
}

function JACOBI_solve(matrix_obj)
{
	A = matrix_obj.get_matrix()
	if(is_Jacobi_method_appliable(A)){
		console.log("not possible to apply Jacobi method to given matrix\n")
		process.exit(0)
	}
	if(1 == A.length){
		let X_N_t = []
		A[0][0] = A[0][1]/A[0][0]
		X_N_t.push(A[0][0])
		return X_N_t
	}
	const X_N_t = Array(A.length).fill(0);
	let B = get_Jacobi_matrix(A)
	let result_X_n = iterate_Jacobi(B, X_N_t)
	var results_str = result_X_n.join(' ');
	results_str += "\n"
	return results_str
}

function generate_file(content_str, filename)
{
	const fs = require('fs')
	fs.writeFile(filename, content_str, (err) => {
		if (err) throw err;
	})
}

function main() {
	let input_filename = get_cmd_arg()
	let matrix_str = read_from_file(input_filename)
	let raw_matrix = define_raw_matrix(matrix_str)
	let matrix_obj = new Matrix(raw_matrix)
	let result = JACOBI_solve(matrix_obj)
	generate_file(result, "output.txt")
}

main()
