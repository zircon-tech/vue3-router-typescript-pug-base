
export const createAccount = async ({ email, password, rut, type }) =>
    unAuthAxiosCall('/api/createAccount', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            rut,
            type
        }),
    });