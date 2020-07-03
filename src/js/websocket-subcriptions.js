let socket_client = new SOSWebSocketClient();

// Update counter
let [_, set_update_count] = buildHTMLSetter('update-state', '');
socket_client.subscribe('game', 'update_state', (data) => {
    set_update_count(JSON.stringify(data, null, 4));
});

socket_client.init('ws://localhost:49122');