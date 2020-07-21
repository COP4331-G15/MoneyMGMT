const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

describe('validateLoginInput', () => {
	it('validateLoginInput_empty', () => {
		const res = validateLoginInput({});
		expect(res).toEqual({errors: {
			email: 'Email field is required',
			password: 'Password field is required'
		},
		isValid: false});
	});

	it('validateLoginInput_invalid_email', () => {
		const res = validateLoginInput({email: "email", password: "pass"});
		expect(res).toEqual({errors: {
			email: 'Email is invalid'
		},
		isValid: false});
	});

	it('validateLoginInput_valid', () => {
		const res = validateLoginInput({email: "email@email.com", password: "pass"});
		expect(res).toEqual({errors:{}, isValid: true})
	});
});

describe('validateRegisterInput', () => {
	it('validateRegisterInput_empty', () => {
		const res = validateRegisterInput({});
		expect(res).toEqual({
			errors: {
				name: 'Name field is required',
				email: 'Email field is required',
				password: 'Password must be at least 6 characters',
				password2: 'Confirm password field is required'
			},
			isValid: false
		});
	});
	it('validateRegisterInput_short_password', () => {
		const res = validateRegisterInput({password: "12345"});
		expect(res).toEqual( {
			errors: {
				name: 'Name field is required',
				email: 'Email field is required',
				password2: 'Passwords must match',
				password: 'Password must be at least 6 characters'
			},
			isValid: false
		});
	});

	it('validateRegisterInput_malformed_email', () => {
		const res = validateRegisterInput({email: "email"});
		expect(res).toEqual({
			errors: {
				name: 'Name field is required',
				email: 'Email is invalid',
				password: 'Password must be at least 6 characters',
				password2: 'Confirm password field is required'
			},
			isValid: false
		})
	});
	it('validateRegisterInput_valid', () => {
		const res = validateRegisterInput({name: "Bob", email: "bob@email.com", password:"123456", password2: "123456"});
		expect(res).toEqual({
			errors: {},
			isValid: true
		})
	});
});
