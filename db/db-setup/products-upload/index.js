//LIBS
const csv = require("csv-parser");
const fs = require("fs");
const getStream = require("get-stream");

//DATABASE
const { insertQuery, sequelize, useQuery } = require("../../../db");

//DATASETS
const productsDs = "../datasets/productos/products.csv";

const productsData = async () => {
	const parseStream = csv({ delimiter: "," });
	const data = await getStream.array(fs.createReadStream(productsDs).pipe(parseStream));
	return data;
};

const productsUpload = async () => {
	const dataToUpload = await productsData();
	await sequelize.query(useQuery(), { raw: true });
	for (let i = 0; i < dataToUpload.length; i++) {
		try {
			const { product_name, product_price, product_photo } = dataToUpload[i];
			const query = insertQuery("products", "product_name, product_price, product_photo", [
				product_name,
				product_price,
				product_photo,
			]);
			await sequelize.query(query, { raw: true });
		} catch (err) {
			throw new Error(err);
		}
	}
};

module.exports = { productsUpload };
