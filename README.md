# SOS CCA Stream Test

## Developer Notes

### Websocket server
The websocket server URI is `ws://localhost:49122` and is hardcoded into the `ws_subscriber.js` file for all connection initializations. This is the URI that is opened by default by the SOS Bakkesmod plugin.

The data returned from the server can be listened to with a format of `channel:event` where channel is `game` and the event is one of the following values of game:

```
"game": [
    "goal_scored" [Object of scorer Player state],
    "initialized": [Stateless],
    "match_created": [Stateless],
    "match_ended": [Object of winnerTeamNumber],
    "player_team_data": [Object of Player and Team state arrays],
    "podium_start": [Stateless],
    "post_countdown_begin": [Stateless],
    "pre_countdown_begin": [Stateless],
    "replay_end": [Stateless],
    "replay_start": [Stateless],
    "replay_will_end": [Stateless],
    "update_tick": [Object of Player and Team state arrays],
]

```