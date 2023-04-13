const PDFDocument = require('pdfkit');
const fs = require('fs');
const axios = require('axios');
const fileToIpfs = require('@kleros/file-to-ipfs');

const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

const matchImage = ["image/png", "image/jpg", "image/jpeg"];


// Add doc messages
async function addMessagesDoc(messages, doc) {
    return new Promise(async (resolve, reject) => {
        try {
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];

                if (message.user_eth_address && message.text) {
                    doc.moveDown(0.2);
                    doc.font('Helvetica').fontSize(10).text('Author: ' + message.user_eth_address);
                    doc.moveDown(0.3);
                    doc.font('Helvetica').fontSize(8).text('Message: ' + message.text);
                    doc.moveDown(0.3);
                    doc.font('Helvetica-Oblique').fontSize(8).text(`Date: ${message.date}`, { continued: true });
                    doc.moveDown(0.1);
                    doc.font('Helvetica').fontSize(10).text(' ');
                    doc.moveDown(0.2);
                    doc.font('Helvetica').fontSize(10).text('*****************');
                }

                if (message.user_eth_address && message.file && message.file.filename) {
                    const filename = message.file.filename;
                    const fileUrl = process.env.STORAGE_FLEEK_LINK + "evidences/" + filename;

                    try {
                        doc.moveDown(0.2);
                        doc.font('Helvetica').fontSize(10).text('Author: ' + message.user_eth_address);
                        doc.moveDown(0.2);
                        doc.font('Helvetica').fontSize(10).text('Attachment sent by message / Archivo adjunto enviado por mensaje: ');
                        if (matchImage.indexOf(message.file.mimetype) === -1) {
                            doc.font('Helvetica').fontSize(10).text('* It is a non-image file, you need to download it from the urls. / Es un archivo no imagen, se necesita descargar por las urls');
                        } else {
                            const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                            const image = Buffer.from(response.data, 'binary');
                            doc.moveDown(0.5).image(image, { fit: [250, 250], keepAspectRatio: true });
                        }
                        doc.moveDown(0.2);
                        doc.font('Helvetica').fontSize(8).text(`URL 1: ${process.env.STORAGE_FLEEK_LINK + "evidences/" + filename}`, { link: process.env.STORAGE_FLEEK_LINK + "evidences/" + filename });
                        doc.font('Helvetica').fontSize(8).text(`URL 2: ${process.env.STORAGE_GC_LINK + "evidences/" + filename} `, { link: process.env.STORAGE_GC_LINK + "evidences/" + filename });
                        doc.moveDown(0.3);
                        doc.font('Helvetica-Oblique').fontSize(8).text(`Date: ${message.date}`, { continued: true });
                        doc.moveDown(0.1);
                        doc.font('Helvetica').fontSize(10).text(' ');
                        doc.moveDown(0.2);
                        doc.font('Helvetica').fontSize(10).text('*****************');
                        doc.moveDown(0.5);

                    } catch (error) {
                        console.error(error);
                        continue
                    }

                }
                continue
            }
            resolve()
        } catch (err) {
            console.error(err);
            reject()
        }
    }
    )
}

/**
 * PDF Generator
 */
async function pdfGenerator(dataToGenerateThePDF) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument();

            doc.info['Author'] = 'Yubiai Marketplace';
            doc.info['Title'] = `Evidence TransactionHash: ${dataToGenerateThePDF.evidence.title}`;
            doc.info['Keywords'] = 'Yubiai Marketplace, evidence'

            // Header
            let imageWidth = 90 // what you wants
            doc.image('./src/public/static/logocartyubiai.png',
                doc.page.width / 2 - imageWidth / 2, doc.y, {
                width: imageWidth,
                height: 90
            });

            doc.moveDown(0.5);

            // Title Header
            doc.font('Helvetica-Bold').fontSize(16).text('Evidence / Evidencia', {
                align: "center",
                margintop: "100px"
            });

            // Date
            doc.moveDown(0.2);
            doc.font('Helvetica-Bold').fontSize(10).text(new Date());
            doc.moveDown(0.4);

            // Item
            doc.font('Helvetica-Bold').fontSize(12).text('Item');
            doc.moveDown(0.2);
            doc.font('Helvetica').fontSize(8).text('Title / Titulo: ' + dataToGenerateThePDF.item.title);
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(8).text('Url: ' + dataToGenerateThePDF.item.url, { link: dataToGenerateThePDF.item.url });
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(10).text('Description / Descripción: ');
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(8).text(dataToGenerateThePDF.item.description);
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(10).text('Price / Precio: ' + dataToGenerateThePDF.item.price + " " + dataToGenerateThePDF.item.currencySymbolPrice);
            doc.moveDown(0.6);

            doc.font('Helvetica').fontSize(10).text('--------------------------------------------------------------------------');
            doc.moveDown(0.6);

            // Order
            doc.font('Helvetica-Bold').fontSize(12).text('Order / Orden');
            doc.moveDown(0.2);
            doc.font('Helvetica').fontSize(8).text('Date / Fecha: ' + dataToGenerateThePDF.order.date);
            doc.moveDown(0.1);
            doc.font('Helvetica').fontSize(8).text('Red: ' + dataToGenerateThePDF.order.red);
            doc.moveDown(0.1);
            doc.font('Helvetica').fontSize(8).text('Transaction Hash / Transacción Hash: ');
            doc.moveDown(0.1);
            doc.font('Helvetica').fontSize(8).text(dataToGenerateThePDF.order.transactionHashURL, { link: dataToGenerateThePDF.order.transactionHashURL });

            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(8).text('Seller / Vendedor Address: ' + dataToGenerateThePDF.order.seller);
            doc.moveDown(0.2);
            doc.font('Helvetica').fontSize(8).text('Buyer / Comprador Address: ' + dataToGenerateThePDF.order.buyer);
            doc.moveDown(0.6);

            doc.font('Helvetica').fontSize(10).text('--------------------------------------------------------------------------');
            doc.moveDown(0.6);

            // Evidence
            doc.font('Helvetica-Bold').fontSize(12).text('Evidence');
            doc.moveDown(0.4);
            doc.font('Helvetica').fontSize(10).text('Author / Autor: ' + dataToGenerateThePDF.evidence.author_address);
            doc.moveDown(0.2);
            doc.font('Helvetica').fontSize(10).text('Title / Titulo: ');
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(8).text(dataToGenerateThePDF.evidence.title);
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(10).text('Description / Descripción: ');
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(8).text(dataToGenerateThePDF.evidence.description);
            doc.moveDown(0.6);

            // Value to Claim
            doc.font('Helvetica-Bold').fontSize(10).text('Value to Claim / Valor a reclamar: ' + dataToGenerateThePDF.evidence.value_to_claim);
            doc.moveDown(0.6);

            doc.font('Helvetica').fontSize(10).text('--------------------------------------------------------------------------');
            doc.moveDown(0.6);

            // Selected messages
            doc.font('Helvetica-Bold').fontSize(12).text('Selected messages / Mensajes seleccionados');

            await addMessagesDoc(dataToGenerateThePDF.evidence.messages_selected, doc);

            doc.moveDown(0.6);
            doc.font('Helvetica').fontSize(10).text('--------------------------------------------------------------------------');
            doc.moveDown(0.6);

            // Evidence Attached files
            const files = dataToGenerateThePDF.evidence.files;
            doc.font('Helvetica-Bold').fontSize(12).text(' ');
            doc.font('Helvetica-Bold').fontSize(12).text('Attached files / Archivos Adjuntos');
            doc.moveDown(0.2);

            for (let i = 0; i < files.length; i++) {
                doc.moveDown(0.4);
                doc.font('Helvetica').fontSize(10).text('*****************');
                if (matchImage.indexOf(files[i].mimetype) === -1) {
                    doc.font('Helvetica').fontSize(10).text('* It is a non-image file, you need to download it from the urls. / Es un archivo no imagen, se necesita descargar por las urls');
                } else {
                    doc.image(`./upload/${files[i].filename}`, { fit: [250, 250], keepAspectRatio: true });
                }
                doc.moveDown(0.2);
                doc.font('Helvetica').fontSize(8).text(`URL 1: ${process.env.STORAGE_FLEEK_LINK + "evidences/" + files[i].filename}`, { link: process.env.STORAGE_FLEEK_LINK + "evidences/" + files[i].filename });
                doc.font('Helvetica').fontSize(8).text(`URL 2: ${process.env.STORAGE_GC_LINK + "evidences/" + files[i].filename} `, { link: process.env.STORAGE_GC_LINK + "evidences/" + files[i].filename });
                fs.unlinkSync(`./upload/${files[i].filename}`);
                continue
            }

            doc.moveDown(0.6);
            doc.font('Helvetica').fontSize(10).text('--------------------------------------------------------------------------');
            doc.moveDown(0.4);
            doc.font('Helvetica-Bold').fontSize(12).text(' ');
            doc.font('Helvetica-Bold').fontSize(12).text('Full Chat / Chat Completo');
            doc.moveDown(0.2);
            await addMessagesDoc(dataToGenerateThePDF.evidence.messages_all, doc);

            doc.font('Helvetica').fontSize(10).text('--------------------------------------------------------------------------');
            doc.moveDown(0.4);
            doc.font('Helvetica-Bold').fontSize(12).text(' ');
            doc.font('Helvetica-Bold').fontSize(12).text('PDF generated from Yubiai Marketplace - PDF generado desde Yubiai Marketplace');

            // Guarda el archivo PDF en el disco;
            const filePath = `./upload/evidence-${dataToGenerateThePDF.order.transactionHash}-${dataToGenerateThePDF.order.claim_count}.pdf`;
            const writeStream = fs.createWriteStream(filePath);

            doc.pipe(writeStream);

            // Escucha el evento "finish" del stream de escritura
            writeStream.on('finish', () => {
                return resolve(writeStream.path);
            });

            doc.end();
        } catch (err) {
            console.error(err);
            return reject(false)
        }
    })
}

/**
* Created Signature
*/
async function createdSignature(pathFilePDF) {
    return new Promise(async (resolve, reject) => {
        try {

            function fileToHash(filename) {
                const content = fs.readFileSync(filename);
                return ethUtil.bufferToHex(ethUtil.keccak256(content));
            }

            const pdfHash = fileToHash(pathFilePDF);

            const privateKey = Buffer.from(process.env.PRIVATE_WALLET_KEY, 'hex');

            const domain = {
                name: 'Yubiai Marketplace',
                version: '1',
                chainId: 100,
                verifyingContract: process.env.CONTRACT_ADDRESS,
                salt: '0x' + ethUtil.keccak256(Buffer.from('Yubiai Marketplace')).toString('hex'),
            };

            const message = {
                pdfHash: pdfHash,
            };

            function signMessage(domain, message, privateKey) {
                const data = {
                    types: {
                        EIP712Domain: [
                            { name: 'name', type: 'string' },
                            { name: 'version', type: 'string' },
                            { name: 'chainId', type: 'uint256' },
                            { name: 'verifyingContract', type: 'address' },
                            { name: 'salt', type: 'bytes32' },
                        ],
                        Document: [
                            { name: 'pdfHash', type: 'bytes32' },
                        ],
                    },
                    domain,
                    primaryType: 'Document',
                    message,
                };

                const signature = sigUtil.signTypedData_v4(privateKey, { data });

                return signature;
            }

            const signature = signMessage(domain, message, privateKey);

            return resolve(signature);
        } catch (err) {
            console.error(err);
            reject(err);
            return
        }
    })
}

/**
* Validate Signature
*/
async function validateSignature(signature, pathFilePDF) {
    return new Promise((resolve, reject) => {
        try {
            const address = process.env.PUBLIC_WALLET;

            function fileToHash(filename) {
                const content = fs.readFileSync(filename);
                return ethUtil.bufferToHex(ethUtil.keccak256(content));
            }
            // Hash PDF
            const pdfHash = fileToHash(pathFilePDF);

            const recoveredAddress = sigUtil.recoverTypedSignature_v4({
                data: {
                    types: {
                        EIP712Domain: [
                            { name: 'name', type: 'string' },
                            { name: 'version', type: 'string' },
                            { name: 'chainId', type: 'uint256' },
                            { name: 'verifyingContract', type: 'address' },
                            { name: 'salt', type: 'bytes32' },
                        ],
                        Document: [
                            { name: 'pdfHash', type: 'bytes32' },
                        ],
                    },
                    domain: {
                        name: 'Yubiai Marketplace',
                        version: '1',
                        chainId: 100,
                        verifyingContract: process.env.CONTRACT_ADDRESS,
                        salt: '0x' + ethUtil.keccak256(Buffer.from('Yubiai Marketplace')).toString('hex'),
                    },
                    primaryType: 'Document',
                    message: {
                        pdfHash: pdfHash,
                    },
                },
                sig: signature,
            });

            console.log('La dirección recuperada es:', recoveredAddress);

            if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
                console.log('La firma es válida!');
                return resolve(true);
            } else {
                console.log('La firma no es válida');
                return resolve(false);
            }
        } catch (err) {
            console.error(err);
            return reject(err);
        }
    })
}

/**
* Upload Evidence in IPFS Kleros
*/
async function uploadEvidenceInIPFSKleros(pathFilePDF, dataToGenerateThePDF, signature) {
    return new Promise(async (resolve, reject) => {
        try {
            const pathPDFIpfs = await fileToIpfs(pathFilePDF);
            const pathJSON = `./upload/evidence-${dataToGenerateThePDF.order.transactionHash}-${dataToGenerateThePDF.order.claim_count}.json`;

            const jsonEvidence = {
                "name": dataToGenerateThePDF.evidence.title,
                "description": dataToGenerateThePDF.evidence.description,
                "fileURI": pathPDFIpfs,
                "fileTypeExtension": "pdf",
                "fileSignature": signature
            }

            fs.writeFile(pathJSON, JSON.stringify(jsonEvidence), async (res, err) => {

                if (err) {
                    console.error(err, "error Write File")
                    fs.unlinkSync(pathFilePDF)
                    fs.unlinkSync(pathJSON)
                    return reject()
                };

                const pathJSONIpfs = await fileToIpfs(pathJSON);

                const resultUploadIPFS = {
                    pathPDFIpfs,
                    pathJSONIpfs
                }

                // Eliminar archivos
                fs.unlinkSync(pathFilePDF)
                fs.unlinkSync(pathJSON)

                return resolve(resultUploadIPFS);
            });
        } catch (err) {
            console.error(err);
            fs.unlinkSync(pathFilePDF)
            fs.unlinkSync(pathJSON)
            return reject();
        }
    })
}


module.exports = {
    pdfGenerator,
    uploadEvidenceInIPFSKleros,
    createdSignature,
    validateSignature
};