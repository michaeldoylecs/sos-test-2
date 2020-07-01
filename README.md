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
    "statfeed_event": [Object of player and feed type]
    "update_state": [Object of Player and Team state arrays],
]

```

### Understanding Websocket messages

Each subsection in this section will be a `channel:event` message pair.

#### game:goal_scored [*stateless*]
```
{
    "data": "game_goal_scored",
    "event": "game:initialized"
}
```

#### game:initialized [*stateless*]
The moment the first player joins a team.
```
{
    "data": "initialized",
    "event": "game:initialized"
}
```

#### game:match_created [*stateless*]
```
{
    "data": "game_match_created",
    "event": "game:match_created"
}
```

#### game:match_ended
```
{
    "data": {
        "winner_team_num": int (0 or 1)
    },
    "event": "game:match_ended"
}
```

#### game:podium_start [*stateless*]
The beginning of the screen where cars can dance after the match ended.

```
{
    "data": "game_podium_start",
    "Event": "game:podium_start"
}
```

#### game:post_countdown_begin [*stateless*]
```
{
    "data": "post_game_countdown_begin",
    "event": "game:post_countdown_begin"
}
```

#### game:pre_countdown_begin [*stateless*]
```
{
    "data": "pre_game_countdown_begin",
    "event": "game:pre_countdown_begin"
}
```

#### game:replay_start [*stateless*]
```
{
    "data": "game_replay_start",
    "event": "game:replay_start"
}
```

#### game:replay_end [*stateless*]
```
{
    "data": "game_replay_end",
    "event": "game:replay_end"
}
```

#### game:replay_will_end [*stateless*]
```
{
    "data": "game_replay_will_end",
    "event": "game:replay_will_end"
}
```


#### game:statfeed_event
Note: This event can be sent in duplicates. Listening to this event should take note and implement a form of cooldown. It seems there are always duplicated events back to back. This may be related to message send rate (tested on 100ms)

```
{
    "data": {
        "main_target: string
        "secondary_target: string
        "type: string ("Goal" | "Assist" | "Save" | "Hat Trick" | "Long Goal" | "Bicycle Hit" | "Shot on Goal")
    },
    "event": "game:statfeed_event"
}
```

#### game:update_state
```
{
    "data": {
        "event": "gamestate",
        "game": {
            "ballSpeed": int
            "ballTeam": int
            "hasTarget": boolean
            "hasWinner": boolean
            "isOT": boolean
            "isReplay": boolean
            "target": string (Name of field in data.players)
            "teams": [
                ...,
                {
                    "name": string,
                    "score": int
                }
            ]
            "time": float (?)
            "winner": string
        },
        "players": {
            ...,
            "playername_#" (string): {
                "assists": int
                "attacker": string (unknown values)
                "boost": int
                "cartouches": int
                "goals": int
                "hasCar": boolean ( what is this?)
                "id": string (player name)
                "isDead": boolean
                "isSonic": boolean
                "name": string
                "primaryID": int
                "saves": int
                "score": int
                "shots": int
                "speed": int
                "team": int (0 or 1)
                "touches": int
            }
        }
    },
    "event": "game:update_state"
}
```