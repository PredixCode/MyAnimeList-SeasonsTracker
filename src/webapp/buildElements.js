async function buildRefreshButton() {
    const button = document.createElement('button');
    button.id = 'refresh-button';
    button.textContent = 'REFRESH ANIME USER INFORMATION';
    button.addEventListener('click', async () => {
        await fetchRefreshedAnimeInfo();
    });
    document.body.appendChild(button);
}

function buildExpandedBoxAnimeInfoElements(animeObj, element, colorClass) {
    //TODO: REFACTOR AS LIST ELEMENT (UNORDERED LIST!!!)
    try {
        const watchStatus = document.createElement('div');
        if (animeObj.my_list_status['status'] != undefined) {
            watchStatus.innerText = '•  USER STATUS: '+animeObj.my_list_status['status'].replace('_', ' ').toUpperCase();
        } else {
            watchStatus.innerText = '•  USER STATUS: None';
        }
        element.appendChild(watchStatus);
    } catch(TypeError) {
        ;
    }

    const animeAiringStatus = document.createElement('div');
    if (animeObj.status === 'finished_airing') {
        let season = '';
        let animeObjFinishedMonth = parseInt(animeObj.end_date.split('-')[1]);
        if (2 <= animeObjFinishedMonth && animeObjFinishedMonth <= 4) {
            season = 'SPRING';
        } else if (5 <= animeObjFinishedMonth && animeObjFinishedMonth <= 7) {
            season = 'SUMMER';
        } else if (8 <= animeObjFinishedMonth && animeObjFinishedMonth <= 10) {
            season = 'FALL';
        } else if (11 <= animeObjFinishedMonth || animeObjFinishedMonth <= 1) {
            season = 'WINTER';
        }
        
        animeAiringStatus.innerText = '•  AIRING STATUS: '+animeObj.status.replace('_', ' ').toUpperCase()+' in '+animeObj.end_date.split('-')[0] + ', '+season;
    } else if (animeObj.status === "not_yet_aired") {
        animeAiringStatus.innerText = '•  AIRING STATUS: Not yet aired'
    }
    element.appendChild(animeAiringStatus);
    return element;
}

function buildAnimeHeading(animeObj) {
    function tryGetEnglishTitles(animeObj, malLinkElement) {
        try {
            headingText = animeObj.alternative_titles['en']
            return headingText
        } catch (e) {
            return animeObj.title
        }
    }
    
    const titleHeading = document.createElement('h3');
    const malLinkElement = document.createElement('a');
    malLinkElement.innerText = tryGetEnglishTitles(animeObj)
    
    try {
        if (animeObj.my_list_status != undefined && animeObj.my_list_status != null) {
            if (parseInt(animeObj.my_list_status['score']) !== 0) {
                malLinkElement.innerText = tryGetEnglishTitles(animeObj) + " ("+animeObj.my_list_status['score']+")";
            }
        }
    } catch (e) {tryGetEnglishTitles(animeObj)}


    malLinkElement.href = animeObj.mal_url;
    titleHeading.appendChild(malLinkElement);
    return titleHeading
} 

function buildAnimeLineageElement(animeObj, colorClass) {
    var element = document.createElement('div');
    element.id = animeObj.id;
    element.className = `anime-element ${colorClass}`;

    element.appendChild(buildAnimeHeading(animeObj));
    element = buildExpandedBoxAnimeInfoElements(animeObj, element, colorClass);

    element.onclick = function() {
        var animeElement = document.getElementById(element.id);

        if (animeElement.style.width === '500px' && animeElement.style.height === '400px') {
            animeElement.style.width = '400px';
            animeElement.style.height = '80px';
        } else {
            animeElement.style.width = '500px';
            animeElement.style.height = '400px';
        }
    }
    return element;
}

function cycleThroughLineages(originAnimeId, animeLineageList, animeData, userListIds) {
    const lineageContainer = document.getElementById('lineage');
    const lineageDiv = document.createElement('div');
    lineageDiv.className = 'anime-lineage';

    const originAnimeObj = animeData[originAnimeId];

    const colors = ['anime-green', 'anime-yellow', 'anime-orange', 'anime-red'];
    animeLineageList.forEach((lineageAnimeId) => {
        var colorClass = null;
        const lineageAnimeObj = animeData[lineageAnimeId];
        
        try {
            if (lineageAnimeObj.my_list_status['status'] === 'completed') {//&& userListIds(lineageAnimeObj.id)
                colorClass = colors[0];
            } else if (lineageAnimeObj.my_list_status['status'] === 'watching') {
                colorClass = colors[1];
            } else if (lineageAnimeObj.my_list_status['status'] === 'plan_to_watch') {
                colorClass = colors[1];
            }
        } catch(e) {
            colorClass = colors[3];
        }
        
        var anime_element = buildAnimeLineageElement(lineageAnimeObj, colorClass)
        lineageDiv.appendChild(anime_element);
    });

    lineageContainer.appendChild(lineageDiv);
}