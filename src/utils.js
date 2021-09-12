const parseAge = (age) =>{
    let length = age.length;
    let eraIndex = length - 3;
    let number = age.substr(0, eraIndex);
    let era = age.substr(eraIndex);

    return {
        number: parseFloat(number),
        era
    }
}


const compareAge = (a, b) => {
    const parsedA = parseAge(a);
    const parsedB = parseAge(b)
    const isTheSameEra = parsedB.era===parsedA.era

    switch (true){
        case !isTheSameEra :
            return parsedA.era === "BBY" ? 1 : -1;
        case isTheSameEra && parsedA.era === "ABY":
            return parsedB.number - parsedA.number;
        default:
            return parsedA.number - parsedB.number;
    }
}

const compareCharactersAge = (characterA, characterB) => {
    return compareAge(characterA.birth_year, characterB.birth_year);
}

const getExtremeAge = (characters) => {
    let knownAgeCharacters = characters.filter(ch => ch.birth_year !== "unknown");
    knownAgeCharacters.sort(compareCharactersAge);
    const minAge = knownAgeCharacters[0];
    const maxAge = knownAgeCharacters[knownAgeCharacters.length-1]

    const min = parseAge(minAge.birth_year);
    const max = parseAge(maxAge.birth_year)

    return { min, max }
}

const fetchAllItems = async (page) => {
    let response = await fetch(page);
    if(response.status!==200)
        return [];

    let result = await response.json();
    let nextPage = result.next;
    let receivedItems = result.results;

    let allItems ;
    if(nextPage) {
        let nextItems = await fetchAllItems(nextPage);
        allItems = [...receivedItems, ...nextItems];
    } else
        allItems = receivedItems

    return allItems;
}

const filterCharacters = (characters, filteredUrl, isOrMode) => {
    if(isOrMode){
        if(!filteredUrl.age && !filteredUrl.films && !filteredUrl.specie)
            return characters

        let result = [];
        for (const value of Object.values(filteredUrl)) {
            if(value) {

                let temp = [...result]
                characters.map(el => {
                    let url = el.url;
                    if (value.includes(url) && !temp.some(ch => ch.url === url))
                        temp.push(el);
                })

                result = [...temp];
            }
        }
        return result;
    } else {
        let result = [...characters];
        for (const value of Object.values(filteredUrl)) {
            if(value) {
                let temp = result.filter(el => value.includes(el.url));
                result = [...temp];
            }
        }
        return result;
    }

}

const filterByAge = (characters, {min, max}) =>{
    if(!min && !max)
        return;

    let filteredUsers =  characters.filter(ch => {
        switch (true) {
            case (ch.birth_year === "unknown" && (min || max)):
                return false;
            case Boolean(min && max) :
                return compareAge(ch.birth_year, min) >= 0 && compareAge(ch.birth_year, max) <= 0
            case Boolean(min):
                return compareAge(ch.birth_year, min) >= 0
            case Boolean(max):
                return compareAge(ch.birth_year, max) <= 0
            default:
                return true
        }
    })

    return filteredUsers.map(el => el.url);
}

const getNamesFromUrls = (items = [], urls = []) => {
    return urls.map(u => {
        let item = items.find(sp=>sp.url === u);
        if(item)
            return item.name || item.title
    })
}

export {fetchAllItems, compareCharactersAge, getExtremeAge, filterCharacters, filterByAge, getNamesFromUrls}