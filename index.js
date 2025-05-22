import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.unsplash.com";

const accessKey = "oIW-XBu763K58HpthKJsL-N-uGaBkV9DSd-G-gixD84";
const config = {
  headers: {
    Authorization: `Client-ID ${accessKey}`
  }
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.query;
    let imageUrl, photoDescription, photographerName, photographerProfileLink;
    if (!searchQuery) {
      const result = await axios.get(API_URL + "/photos/random", config);
      imageUrl = result.data.urls.small;
      photoDescription = result.data.alt_description || 'Unsplash Photo';
      photographerName = result.data.user.name;
      photographerProfileLink = result.data.user.links.html;
    } else {
      // Get a search result
      const perPage = 10;
      const randomPage = Math.floor(Math.random() * 5) + 1;

      const result = await axios.get(API_URL + "/search/photos", {
        ...config,
        params: { 
          query: searchQuery,
          page: randomPage,
          per_page: perPage,
         }
      });

      if (result.data.results.length > 0) {
        const photo = result.data.results[0]; // or choose a random one
        imageUrl = photo.urls.small;
        photoDescription = photo.alt_description || 'Unsplash Photo';
        photographerName = photo.user.name;
        photographerProfileLink = photo.user.links.html;
      } else {
        // Handle no results
        imageUrl = null;
        photoDescription = "No image found";
        photographerName = "";
        photographerProfileLink = "";
      }
    }

    res.render("index.ejs", {
      imageUrl,
      photoDescription,
      photographerName,
      photographerProfileLink
    });
  } catch (error) {
    console.log(error?.response?.data || error.message);
    res.status(500).send("Error loading image");
  }
});

app.listen(3000, () => {
  console.log(`Listening on port ${port}`);
});