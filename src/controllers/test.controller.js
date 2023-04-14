const fileToIpfs = require('@kleros/file-to-ipfs');

async function uploadMetaevidence(req, res){
    try {

        const pathMetaevidence = "./metaEvidence.json";

        console.log(pathMetaevidence)
        
        const pathJSONIpfs = await fileToIpfs(pathMetaevidence);
        console.log(pathJSONIpfs)

        return res.status(200).json({
            path: pathJSONIpfs
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: "Ups Hubo un error!",
            error: error,
          });
    }
}

module.exports = {
    uploadMetaevidence
};
