 // Make single fetch function, with fetch path as parameter
async function fetchLineageData() {
    const response = await fetch('/lineage_data');
    const lineageData = await response.json();
    return lineageData;
}

async function fetchAnimes() {
    const response = await fetch('/animes');
    const animeData = await response.json();
    return animeData;
}

async function fetchUserListAnimes() {
    const response = await fetch('/user_animes');
    const animeIds = await response.json();
    return animeIds;
}

async function fetchRefreshedAnimeInfo() {
    await fetch('/refresh_user_list_status');
    window.location.reload();
}