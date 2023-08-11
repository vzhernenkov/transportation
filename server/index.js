let express = require('express');
let cors = require('cors');
const app = express();
let port = 3333;

app.use(cors());

app.use(express.json());

let carriers = [];
let shippers = [];
let users = [];
let orders = [
  {
      "id": "ARG0",
      "from": "Bahía Blanca",
      "to": "Lomas de Zamora",
      "truckType": "REF",
      "cargo": "products+5",
      "loadingDate": "03.09.2023",
      "arrivalDate": "06.09.2023",
      "status": "vacant",
      "shipper": {
          "company": null,
          "user": null,
          "truckType": null,
          "driver": null,
          "truck": null,
          "trail": null,
          "financeShipper": {
              "price": "4275",
              "paymentDate": null,
              "paymentType": null,
              "documentStatus": null,
              "paymentStatus": null
          }
      },
      "carrier": {
          "company": null,
          "user": null,
          "financeCarrier": {
              "price": "4275",
              "paymentDate": null,
              "paymentType": null,
              "documentStatus": null,
              "paymentStatus": null
          }
      }
  },
  {
      "id": "ARG1",
      "from": "Santa Rosa",
      "to": "Lanús",
      "truckType": "REF",
      "cargo": "products+5",
      "loadingDate": "10.09.2023",
      "arrivalDate": "13.09.2023",
      "status": "vacant",
      "shipper": {
          "company": null,
          "user": null,
          "truckType": null,
          "driver": null,
          "truck": null,
          "trail": null,
          "financeShipper": {
              "price": "4965",
              "paymentDate": null,
              "paymentType": null,
              "documentStatus": null,
              "paymentStatus": null
          }
      },
      "carrier": {
          "company": null,
          "user": null,
          "financeCarrier": {
              "price": "4965",
              "paymentDate": null,
              "paymentType": null,
              "documentStatus": null,
              "paymentStatus": null
          }
      }
  },
  {
      "id": "ARG2",
      "from": "Gualeguaychú",
      "to": "Gualeguaychú",
      "truckType": "REF",
      "cargo": "products+5",
      "loadingDate": "16.09.2023",
      "arrivalDate": "19.09.2023",
      "status": "vacant",
      "shipper": {
          "company": null,
          "user": null,
          "truckType": null,
          "driver": null,
          "truck": null,
          "trail": null,
          "financeShipper": {
              "price": "1813",
              "paymentDate": null,
              "paymentType": null,
              "documentStatus": null,
              "paymentStatus": null
          }
      },
      "carrier": {
          "company": null,
          "user": null,
          "financeCarrier": {
              "price": "1813",
              "paymentDate": null,
              "paymentType": null,
              "documentStatus": null,
              "paymentStatus": null
          }
      }
  },
  {
      "id": "ARG3",
      "from": "Río Negro",
      "to": "Buenos Aires",
      "truckType": "REF",
      "cargo": "products+5",
      "loadingDate": "24.08.2023",
      "arrivalDate": "27.08.2023",
      "status": "vacant",
      "shipper": {
          "company": null,
          "user": null,
          "truckType": null,
          "driver": null,
          "truck": null,
          "trail": null,
          "financeShipper": {
              "price": "67",
              "paymentDate": null,
              "paymentType": null,
              "documentStatus": null,
              "paymentStatus": null
          }
      },
      "carrier": {
          "company": null,
          "user": null,
          "financeCarrier": {
              "price": "67",
              "paymentDate": null,
              "paymentType": null,
              "documentStatus": null,
              "paymentStatus": null
          }
      }
  }
];

app.post("/shipper", (req, res) => {
  let shipper = req.body;
  let id = shippers.push(shipper) - 1;
  res.status(200).json({id});
});

app.post("/carrier", (req, res) => {
  let carrier = req.body;
  let id = carriers.push(carrier) - 1;
  res.status(200).json({id});
});

app.post("/user", (req, res) => {
  let user = req.body;
  let id = users.push(user) - 1;
  res.status(200).json({id});
});

app.post("/orders", (req, res) => {
  let order = req.body;
  let id = orders.push(order) - 1;
  res.status(200).json({id});
});

app.get("/carrier", (req, res) => {
  res.json(carriers);
});

app.get("/shipper", (req, res) => {
  res.json(shippers);
});

app.get("/user", (req, res) => {
  res.json(users);
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.patch("/carrier", (req, res) => {
  let carrier = req.body;
  let carrierId = carrier.registerNumber;
  let index = carriers.find(el => el.registerNumber == carrierId);
  carriers[index] = {
    ...carriers[index], ...carrier
  };
  res.send();
})

app.listen(port, () => {
  console.log('server is running');
})