const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $locationButton = document.querySelector("#send-location");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;

socket.on("message", (message) => {
	console.log(message);
	const html = Mustache.render(messageTemplate, {
		message: message,
	});
	$messages.insertAdjacentHTML("beforeend", html);
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
