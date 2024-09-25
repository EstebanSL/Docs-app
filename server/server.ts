const { connectDB } = require('./config/configDB')

const express = require("express");
const cors = require("cors");
const { documents } = require("./features/documents");
const {
  get,
  update,
  create,
} = require("./features/documents/document.service");

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/documents", documents);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const io = require("socket.io")(process.env.SOCKET_PORT || 3001, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  socket.on("get-document", async (documentId: any) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);

    socket.emit("load-document", document);

    socket.on("editor-change", (delta: any) => {
      socket.broadcast.to(documentId).emit("receive-editor-change", delta);
    });
    socket.on("save-document", async (data: any) => {    
      console.log(data);
       
      await update(documentId, data);
    });
  });
});


async function findOrCreateDocument(documentId: any) {
  if (!documentId) return;
  const document = await get(documentId);
  if (document) {
    return document;
  }
  return await create({ _id: documentId, data: "" });
}
