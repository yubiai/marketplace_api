const PDFDocument = require('pdfkit');
const fs = require('fs');
const axios = require('axios');
const fileToIpfs = require('@kleros/file-to-ipfs');

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
            doc.info['Title'] = 'Evidence Transaction: asd232131231';
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

            // Guarda el archivo PDF en el disco
            const res = doc.pipe(fs.createWriteStream(`./upload/evidence-${dataToGenerateThePDF.order.transactionHash}-${dataToGenerateThePDF.order.claim_count}.pdf`));

            doc.end();

            return resolve(res.path)
        } catch (err) {
            console.error(err);
            return reject(false)
        }
    })
}

/**
* Upload IPFS KLEROS PDF EVIDENCE
*/

async function uploadPDFEvidenceIPFS(pathfile) {
    return new Promise(async (resolve, reject) => {
        try {
            const ipfsPath = await fileToIpfs(pathfile);
            return resolve(ipfsPath)
        } catch (err) {
            console.error(err);
            fs.unlinkSync(pathfile)
            return reject();
        }
    })
}

/**
* Gnerator JSON AND Upload IPFS KLEROS EVIDENCE
*/
async function generatorJSONandUploadIPFS(ipfsURLPDF, dataToGenerateThePDF) {
    return new Promise(async (resolve, reject) => {

        let pathJSON = `./upload/evidence-${dataToGenerateThePDF.order.transactionHash}-${dataToGenerateThePDF.order.claim_count}.json`;

        let jsonEvidence = {
            "name": dataToGenerateThePDF.evidence.title,
            "description": dataToGenerateThePDF.evidence.description,
            "fileURI": ipfsURLPDF,
            "fileTypeExtension": "pdf"
        }

        fs.writeFile(pathJSON, JSON.stringify(jsonEvidence), async(res, err) => {

            if (err){
                return reject()
            };

            const ipfsURLJSON = await fileToIpfs(pathJSON);

            return resolve(ipfsURLJSON);
        });

    })
}

module.exports = {
    pdfGenerator,
    uploadPDFEvidenceIPFS,
    generatorJSONandUploadIPFS
};