const { ref, get, update } = require("firebase/database");
const express = require("express");
const cors = require("cors");
const database = require("./database").database;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, resp) => {
  resp.json({msg:"Welcome to Stabilizer"});
});
  
app.get("/customers", async (req, resp) => {
  const statusRef = ref(database, "customers"); // Rename ref to statusRef to avoid conflict
  try {
      const snapshot = await get(statusRef);
      if (snapshot.exists()) {
        resp.json(snapshot.val()); // Send the retrieved data
      } else {
        resp.status(404).json({ message: "No data available" });
      }
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
      resp.status(500).json({ error: "Error fetching data" });
    }
});

app.get("/customers/index", async (req, resp) => {
    const statusRef = ref(database, "customers"); // Rename ref to statusRef to avoid conflict
    try {
      const snapshot = await get(statusRef);
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());
        resp.json(keys); // Send the retrieved data
      } else {
        resp.status(404).json({ message: "No data available" });
      }
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
      resp.status(500).json({ error: "Error fetching data" });
    }
});

app.post("/customers/register", async (req, resp) => {
  console.log(req.body);
  const id = req.body.id;
  const accessor = req.body.accessor;
  const age = req.body.age;
  const birth = req.body.birth;
  const gender = req.body.gender;
  const height = req.body.height;
  const weight = req.body.weight;
  const bmi = req.body.bmi;
  const updatedData = {
    [id]: {
      accessor: accessor,
      age: age,
      birth: birth,
      gender: gender,
      height: height,
      weight: weight,
      bmi: bmi
    }
  };

  const statusRef = ref(database, "customers"); // Rename ref to statusRef to avoid conflict
    try {
      await update(statusRef, updatedData);
      resp.status(200).json({ message: "Register successfully" }); // Send success response
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
      resp.status(500).json({ error: "Error fetching data" });
    }
});

app.get("/customers/login", async (req, resp) => {
  console.log(req.query);
  const id = req.query.id;
  const topic = "customers/" + String(id);
  const statusRef = ref(database, topic);
  try {
    const snapshot = await get(statusRef);
    if (snapshot.exists()) {
      resp.json({ message: "Login Successfully" }); // Send the retrieved data
    } else {
      resp.status(404).json({ message: "No data available" });
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    resp.status(500).json({ message: "Error fetching data" });
  }
});

app.get("/stabilizer/index", async (req, resp) => {
  console.log(req.query);
  const id = req.query.id;
  const topic = String(id) + "_data";

  statusRef = ref(database, topic);
  try {
    const snapshot = await get(statusRef);
    if (snapshot.exists()) {
      const keys = Object.keys(snapshot.val());
      resp.json(keys); // Send the retrieved data
    } else {
      resp.status(404).json({ message: "No data available" });
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    resp.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/stabilizer/value", async (req, resp) => {
  console.log(req.query);
  const id = req.query.id;
  const timestamp = req.query.timestamp.replace(".", "_");
  const topic = String(id) + "_data/" + String(timestamp);

  const statusRef = ref(database, topic);
  try {
    const snapshot = await get(statusRef);
    if (snapshot.exists()) {
    resp.json(snapshot.val()); // Send the retrieved data
    } else {
    resp.status(404).json({ message: "No data available" });
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    resp.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/stabilizer/all", async (req, resp) => {
  console.log(req.query);
  const id = req.query.id;
  const topic = String(id) + "_data";
  const statusRef = ref(database, topic);
  try {
    const snapshot = await get(statusRef);
    if (snapshot.exists()) {
    resp.json(snapshot.val()); // Send the retrieved data
    } else {
    resp.status(404).json({ message: "No data available" });
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    resp.status(500).json({ error: "Error fetching data" });
  }
});

app.post("/stabilizer", async (req, resp) => {
  console.log(req.body);
  const id = req.body.id;
  const timestamp = req.body.timestamp.replace(".", "_");
  const duration = req.body.duration;
  const pressure = req.body.pressure;
  const count = req.body.count;
  const feedback = req.body.feedback;
  const updatedData = {
    [timestamp]: {
      duration: duration,
      pressure: pressure,
      count: count,
      feedback: feedback
    }
  }
    
  const statusRef = ref(database, String(id) + "_data");
  try {
    await update(statusRef, updatedData);
    resp.status(200).json({ message: `Update ${id} Data Successfully` }); // Send success response
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    resp.status(500).json({ error: "Error fetching data" });
  }
});


app.listen(5000, () => {
  console.log("Web Server Listening on port 5000");
});

module.exports = app;
