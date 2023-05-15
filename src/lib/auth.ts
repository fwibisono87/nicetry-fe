
export async function test() {
	let response = await fetch('https://nicetry.franciswibisono.com/user/', {
		method: 'GET',
		mode: 'cors'
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	} else {
		let data = await response.text(); // read response as plain text
		return data;
	}
}

export async function login(email: String, password: String) {
	const body = {
		email,
		password
	};

	let response = await fetch('https://nicetry.franciswibisono.com/user/login', {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json'
		}
	});

    if (!response.ok) {
		if (response.status === 401) {
			throw new Error('Invalid password');
		} else if (response.status === 404) {
			throw new Error('User not found');
		} else {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} else {
        let data = await response.json();
		return data;
	}
}

export async function verifyJWT(userToken: string) {
	let response = await fetch('https://nicetry.franciswibisono.com/user/verify', {
		method: 'GET',
		mode: 'cors',
		headers: {
            Authorization: 'Bearer '+userToken,
            
		}
    });
	return await response.json();
}