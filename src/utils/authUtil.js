const { request } = require('graphql-request');

// Verify Token Lens
const verifyTokenLens = (tokenLens) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `query {verify(request: {accessToken: "${tokenLens}"})}`
            const apiLens = 'https://api.lens.dev/';

            await request(apiLens, query).then(data => {
                if(data && data.verify){
                    return resolve(data.verify);
                }
                return resolve(false)
            });

        } catch (error) {
            console.error(error);
            return reject(false);
        }
    })
}

module.exports = {
    verifyTokenLens
};