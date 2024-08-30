function sortForStartDate(animeData) {
    const sortedEntries = Object.entries(animeData).sort((a, b) => {
        const dateA = new Date(a[1].start_date);
        const dateB = new Date(b[1].start_date);
        return dateA - dateB;
    });
    return Object.fromEntries(sortedEntries);
}

async function parseAnimeData(lineageData) {
    var animeData = await fetchAnimes();
    animeData = sortForStartDate(animeData);

    var userListIds = await fetchUserListAnimes();
    for (const originAnimeId in lineageData) {
        const animeLineageList = lineageData[originAnimeId];
        cycleThroughLineages(originAnimeId, animeLineageList, animeData, userListIds);
    }
}

window.onload = async function() {
    const lineageData = await fetchLineageData();
    await parseAnimeData(lineageData);
    buildRefreshButton();
}