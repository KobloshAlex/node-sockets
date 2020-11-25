const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $locationButton = document.querySelector("#send-location");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMEssageTemplate = document.querySelector(
	"#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const autoScroll = () => {
	//New message element
	const $newMessage = $messages.lastElementChild;

	// Height of the new message
	const newMessageStyles = getComputedStyle($newMessage);
	const newMessageMargin = parseInt(newMessageStyles.marginBottom);
	const newMessageHeigh = $newMessage.offsetHeight + newMessageMargin;

	// Visible Height
	const visibleHeight = $messages.offsetHeight;
	// Height of messages container
	const containerHeigh = $messages.scrollHeight;
	// How far sroll ho down
	const scrollOffset = $messages.scrollTop + visibleHeight;

	if (containerHeigh - newMessageHeigh <= scrollOffset) {
		$messages.scrollTop = $messages.scrollHeight;
	}
};

socket.on("message", (message) => {
	console.log(message);
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format("HH:mm:ss"),
	});
	$messages.insertAdjacentHTML("beforeend", html);
	autoScroll();
});

socket.on("locationMessage", (message) => {
	console.log(message);
	const html = Mustache.render(locationMEssageTemplate, {
		username: message.username,
		url: message.url,
		createdAt: moment(message.createdAt).format("HH:mm:ss"),
	});
	$messages.insertAdjacentHTML("beforeend", html);
	autoScroll();
});

socket.on("roomData", ({ room, users }) => {
	const html = Mustache.render(sidebarTemplate, {
		room: room,
		users: users,
	});
	document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
	e.preventDefault();

	$messageFormButton.setAttribute("disabled", "disabled");

	const message = e.target.elements.message.value;
	socket.emit("sendMessage", message, (error) => {
		$messageFormButton.removeAttribute("disabled");
		$messageFormInput.value = "";
		$messageFormInput.focus();

		if (error) {
			return console.log(error);
		}

		console.log("Message delivered");
	});
});

document.querySelector("#send-location").addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert("geolocation is not supported by the browser you using");
	}

	$locationButton.setAttribute("disabled", "disabled");

	navigator.geolocation.getCurrentPosition((possition) => {
		socket.emit(
			"sendLocation",
			{
				latitude: possition.coords.latitude,
				longitude: possition.coords.longitude,
			},
			() => {
				console.log("location was shared");

				$locationButton.removeAttribute("disabled");
			}
		);
	});
});

socket.emit("join", { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = "/";
	}
});
