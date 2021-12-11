const axios = require("axios");

const covid = async (country) => {
  try {
    const response = await axios.get(
      `https://disease.sh/v3/covid-19/countries/${country}`
    );
    const data = response.data;
    // console.log(data)
    return data;
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

// async function display() {
//     const data = await covid('india');
//     console.log(data);
// }
// display();

module.exports = { covid };
