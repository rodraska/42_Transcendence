function getPlayerById(playerId)
{
    const playerList = document.getElementById('playerList');
    const playerElement = playerList.querySelector(`[data-player-id="${playerId}"]`)
    if (playerElement)
    {
        const username = playerElement.dataset.username;
        return {
            id: playerId,
            username: username
        };
    }
    else
    {
        return null;
    }
}