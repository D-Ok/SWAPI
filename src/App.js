import './App.css';
import {useEffect, useRef, useState} from "react";
import {
    fetchAllItems,
    filterByAge,
    filterCharacters,
    getExtremeAge,
    getNamesFromUrls
} from "./utils";
import {ENDPOINT} from "./constants";
import Loader from "./components/Loader/Loader";
import DropdownFilter from "./components/DropdownFiter/DropdwnFilter";
import AgeSelector from "./components/AgeSelector/AgeSelector";
import UserView from "./components/UserView/UserView";
import ListItem from "./components/ListItem/ListItem";

const App = () => {

    const [urlsByFilms, setUrlsByFilms] = useState();
    const [urlsBySpecie, setUrlsBySpecie] = useState();
    const [urlsByAge, setUrlsByAge] = useState();

    const [extremeAge, setExtremeAge] = useState();
    const [ageFilter, setAgeFilter] = useState({min: {}, max:{}})
    const [filtered, setFiltered] = useState([])

    const [starShips, setStarShips] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [species, setSpecies] = useState([]);
    const [films, setFilms] = useState([]);

    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState();
    const [orMode, setOrMode] = useState(false);

    const favoriteSection = useRef(null);
    const allSection = useRef(null);
    const fetchData = async () => {
        setIsLoading(true);
        let starShips = await  fetchAllItems(ENDPOINT.STARSHIPS);
        let characters = await fetchAllItems(ENDPOINT.PEOPLE);
        let species = await fetchAllItems(ENDPOINT.SPECIES);
        let films = await fetchAllItems(ENDPOINT.FILMS);
        setIsLoading(false);

        let defaultAgeFilter = getExtremeAge(characters);
        let extreme = defaultAgeFilter.min.number > defaultAgeFilter.max.number
            ? defaultAgeFilter.min.number : defaultAgeFilter.max.number;
        setExtremeAge(extreme);

        setFilms(films);
        setSpecies(species);
        setCharacters(characters);
        setStarShips(starShips);

    }

    useEffect( () => {
       fetchData();
    }, [])

    const characterSelected = (character) => {
       setSelectedCharacter({
           ...character,
           speciesNames: getNamesFromUrls(species, character.species),
           filmsNames: getNamesFromUrls(films, character.films),
           starshipsNames: getNamesFromUrls(starShips, character.starships),
       })
    }

      useEffect(() => {
          if(urlsBySpecie || urlsByFilms || urlsByAge) {
              let updated = filterCharacters(characters,
                  {
                      films: urlsByFilms,
                      specie: urlsBySpecie,
                      age: urlsByAge
                  }, orMode);
              setFiltered(updated)
          } else
              setFiltered(characters);
      }, [characters, urlsBySpecie, urlsByFilms, urlsByAge, orMode])

    useEffect(() => {
        let urls = filterByAge(characters,
            {
                min: ageFilter.min.number && ageFilter.min.str,
                max: ageFilter.max.number && ageFilter.max.str
            });
        setUrlsByAge(urls)
    }, [characters, ageFilter])

    const moveCharacter = (character) => {
        setFavorites((favorites.some(ch=> ch.url === character.url))
            ? favorites.filter(ch => ch.url !== character.url)
            : [...favorites, character]
        )
    }

    const renderList = (items, header, emptyText, target, classes, ref, isLight) =>{
        return  <div
            ref={ref}
            className={classes}>
            <h2 className={"section-name"}>{header}</h2>
            { items && items.length
                ? items.map(
                    ch =><ListItem
                        onClick={e => characterSelected(ch)}
                        character={ch}
                        isDraggable={true}
                        target={target}
                        onMove={moveCharacter}
                        lightMode={isLight}
                        key={ch.url}
                    />)
                : <h4>{emptyText}</h4>
            }
        </div>
    }
  return (
    <div className={"container"}>
        <Loader isActive={isLoading}/>
        <UserView character={selectedCharacter} onClose={e => setSelectedCharacter(undefined)}/>
        <div className={"main-section"}>
        <div className={"section filter-section"}>
            <div className={"dropdown-section"}>
                <DropdownFilter label={"Film: "} items={films}
                                onChange={ urls => setUrlsByFilms(urls && urls.characters)}/>
                <DropdownFilter label={"Specie: "} items={species}
                                onChange={urls => setUrlsBySpecie(urls && urls.people)}/>
            </div>
            <div className={"filter-row"}>
                <span className={"filter-name "}><b>Age:</b></span>
                <div>
                    <AgeSelector label={"from: "} min={0.1} max={extremeAge}
                                 defaultValue={"BBY"} onSelected={age => setAgeFilter({...ageFilter, max: age})}/>
                    <AgeSelector label={"to: "} min={0.1} max={extremeAge}
                                 defaultValue={"ABY"} onSelected={age => setAgeFilter({...ageFilter, min: age})}/>
                </div>
            </div>
            <div className={"mode"}>
                <input type="checkbox" id="isOrMode" name="isOrMode" onChange={() => setOrMode(!orMode)}/>
                    <label htmlFor="isOrMode">Or Mode</label>
            </div>
        </div>
            {renderList(filtered, "Characters", "No characters",
                favoriteSection,  "all-section section", allSection)}
        </div>
        {renderList(favorites, "Favorites", "No favorites",
            allSection,  "favorite-section section", favoriteSection, true)}

    </div>
  );
}

export default App;
