import express from "express";
import path from "path";

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());

interface Route {
  url: string;
  htmlName: string;
}

interface Reservation {
  customerName: string;
  customerEmail: string;
  customerID: string;
  phoneNumber: string;
}

const viewRoutes: Route[] = [
  {
    url: "/",
    htmlName: "home.html",
  },
  {
    url: "/reserve",
    htmlName: "reserve.html",
  },
  {
    url: "/tables",
    htmlName: "tables.html",
  },
];

const database = {
  tables: [
    {
      customerName: "Tables Example",
      customerEmail: "tables@example.com",
      customerID: "tExample",
      phoneNumber: "00-00-00-00-00",
    },
  ] as Reservation[],
  waitList: [
    {
      customerName: "Waitlist Example",
      customerEmail: "waitlist@example.com",
      customerID: "wlExample",
      phoneNumber: "00-00-00-00-00",
    },
  ] as Reservation[],
};

const maxTableReservations = 5;

viewRoutes.forEach((route) => {
  app.get(route.url, function (_, res) {
    res.sendFile(path.join(__dirname, "public", route.htmlName));
  });
});

Object.keys(database).forEach((key) => {
  app.get(`/api/${key}`, (_, res) => {
    res.status(200).json(database[key as keyof typeof database]);
  });
});

app.post("/api/tables", function (req, res) {
  if (database.tables.length < maxTableReservations) {
    database.tables.push(req.body);
    res.status(201).json(true);
    return;
  }

  database.waitList.push(req.body);
  res.status(200).json(false);
});

app.post("/api/clear", (_, res) => {
  database.tables = [];
  database.waitList = [];
  res.status(200).json(true);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
