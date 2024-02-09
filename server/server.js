const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "https://simple-peer-test.netlify.app",
		methods: [ "GET", "POST" ]
	}
})

server.get('/', (req, res) => {
	res.send('Hello World!')
  })

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})
const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`server is running on ${port}`))