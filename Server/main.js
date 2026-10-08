import express from "express";

const server = express();
const PORT = 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

const users = [];
const packingItems = [];

server.get("/api/test", (request, response) => {
  response.json({ message: "Server is working" });
});

server.post("/api/register", (request, response) => {
  const newUser = request.body;

  if (!newUser.name || !newUser.email || !newUser.password) {
    response.json({ success: false, message: "Please complete all fields." });
    return;
  }

  if (newUser.name.trim().length < 2) {
    response.json({ success: false, message: "Name must contain at least 2 characters." });
    return;
  }

  if (newUser.password.length < 6) {
    response.json({ success: false, message: "Password must contain at least 6 characters." });
    return;
  }

  const existingUser = users.find((user) => user.email === newUser.email);

  if (existingUser) {
    response.json({ success: false, message: "An account already exists with this email." });
    return;
  }

  users.push(newUser);
  response.json({ success: true, message: "Account created. You can now log in." });
});

server.post("/api/login", (request, response) => {
  const loginData = request.body;

  const user = users.find(
    (savedUser) =>
      savedUser.email === loginData.email &&
      savedUser.password === loginData.password
  );

  if (user) {
    response.json({ success: true, name: user.name, message: "Login successful." });
  } else {
    response.json({ success: false, message: "Email or password is incorrect." });
  }
});

server.get("/api/items", (request, response) => {
  response.json(packingItems);
});

server.post("/api/items", (request, response) => {
  const newItem = {
    key: Date.now(),
    item: request.body.item,
    category: request.body.category
  };

  packingItems.push(newItem);
  response.json(packingItems);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
